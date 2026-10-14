<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SessionRecording;
use App\Models\Session;
use App\Models\Booking;
use App\Models\Wallet;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Carbon\Carbon;

class RecordingController extends Controller
{
    /**
     * Get recordings accessible to the current user.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'tutor') {
            $recordings = SessionRecording::with(['session', 'tutor'])
                ->where('tutor_id', $user->id)
                ->where('status', '!=', 'deleted')
                ->latest()
                ->get();
        } else {
            // Student: Only fetch recordings of sessions the student booked & attended
            $sessionIds = Booking::where('student_id', $user->id)
                ->whereIn('status', ['confirmed', 'completed'])
                ->pluck('session_id');

            $recordings = SessionRecording::with(['session', 'tutor'])
                ->whereIn('session_id', $sessionIds)
                ->where('status', '!=', 'deleted')
                ->latest()
                ->get();
        }

        $formatted = $recordings->map(function ($rec) {
            return [
                'id' => $rec->id,
                'session_id' => $rec->session_id,
                'title' => $rec->title,
                'video_url' => $rec->video_url,
                'duration_seconds' => $rec->duration_seconds,
                'size_mb' => $rec->size_mb,
                'recorded_at' => $rec->recorded_at->toIso8601String(),
                'expires_at' => $rec->expires_at ? $rec->expires_at->toIso8601String() : null,
                'days_remaining' => $rec->daysRemaining(),
                'is_kept' => $rec->is_kept,
                'monthly_storage_fee' => $rec->monthly_storage_fee,
                'status' => $rec->status,
                'tutor' => [
                    'id' => $rec->tutor->id,
                    'name' => $rec->tutor->name,
                    'email' => $rec->tutor->email,
                ],
            ];
        });

        return response()->json($formatted);
    }

    /**
     * View recording replay with attendee access guard.
     */
    public function show(Request $request, $id)
    {
        $user = $request->user();
        $recording = SessionRecording::with(['session', 'tutor'])->findOrFail($id);

        if (!$recording->isAccessibleBy($user)) {
            return response()->json([
                'message' => 'Access denied. Recording is strictly restricted to participants who attended this session.'
            ], 403);
        }

        // Check if recording has expired
        if (!$recording->is_kept && $recording->expires_at && Carbon::now()->greaterThan($recording->expires_at)) {
            return response()->json([
                'message' => 'This session recording has expired (10-day retention limit reached).'
            ], 410);
        }

        return response()->json([
            'recording' => $recording,
            'days_remaining' => $recording->daysRemaining(),
        ]);
    }

    /**
     * Save new session recording.
     */
    public function store(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'session_id' => 'required|exists:tutoring_sessions,id',
            'title' => 'required|string|max:255',
            'video_url' => 'required|string',
            'duration_seconds' => 'nullable|integer',
            'size_mb' => 'nullable|numeric',
        ]);

        $recording = SessionRecording::create([
            'session_id' => $data['session_id'],
            'tutor_id' => $user->id,
            'title' => $data['title'],
            'video_url' => $data['video_url'],
            'duration_seconds' => $data['duration_seconds'] ?? 3600,
            'size_mb' => $data['size_mb'] ?? 150.00,
            'recorded_at' => Carbon::now(),
            'expires_at' => Carbon::now()->addDays(10), // Strict 10-day retention
            'is_kept' => false,
            'monthly_storage_fee' => 1500.00,
            'status' => 'active',
        ]);

        return response()->json([
            'message' => 'Session recorded successfully. Retained for 10 days.',
            'recording' => $recording,
        ], 201);
    }

    /**
     * Tutor extends retention beyond 10 days (Monthly Storage Billing).
     */
    public function keep(Request $request, $id)
    {
        $user = $request->user();
        $recording = SessionRecording::where('tutor_id', $user->id)->findOrFail($id);

        if ($recording->is_kept) {
            return response()->json(['message' => 'Recording is already marked as extended storage.']);
        }

        // Deduct monthly storage fee from tutor wallet
        $wallet = Wallet::firstOrCreate(['user_id' => $user->id]);
        $fee = $recording->monthly_storage_fee;

        if ($wallet->balance < $fee) {
            return response()->json([
                'message' => "Insufficient wallet balance. Please top up at least ₦" . number_format($fee, 2) . " to retain this recording beyond 10 days."
            ], 402);
        }

        $wallet->decrement('balance', $fee);

        Transaction::create([
            'wallet_id' => $wallet->id,
            'type' => 'payment',
            'amount' => $fee,
            'description' => "Extended Recording Retention Fee (1 Month) for {$recording->title}",
            'reference' => 'REC-EXT-' . strtoupper(uniqid()),
            'status' => 'completed',
            'metadata' => ['recording_id' => $recording->id],
        ]);

        $recording->update([
            'is_kept' => true,
            'status' => 'extended',
            'last_billed_at' => Carbon::now(),
        ]);

        return response()->json([
            'message' => 'Recording extended successfully! Your monthly storage plan is now active.',
            'recording' => $recording,
            'new_wallet_balance' => $wallet->balance,
        ]);
    }

    /**
     * Tutor deletes recording.
     */
    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        $recording = SessionRecording::where('tutor_id', $user->id)->findOrFail($id);

        $recording->update(['status' => 'deleted']);

        return response()->json(['message' => 'Recording deleted successfully and storage fee cancelled.']);
    }

    /**
     * Admin: List all platform recordings & storage analytics.
     */
    public function adminList()
    {
        $recordings = SessionRecording::with(['session', 'tutor'])->latest()->get();

        $totalStorageMb = $recordings->where('status', '!=', 'deleted')->sum('size_mb');
        $extendedCount = $recordings->where('is_kept', true)->count();
        $monthlyRevenue = $extendedCount * 1500;

        return response()->json([
            'recordings' => $recordings,
            'stats' => [
                'total_recordings' => $recordings->count(),
                'active_recordings' => $recordings->where('status', '!=', 'deleted')->count(),
                'extended_recordings' => $extendedCount,
                'total_storage_gb' => round($totalStorageMb / 1024, 2),
                'monthly_storage_revenue' => $monthlyRevenue,
                'default_monthly_fee' => 1500,
            ]
        ]);
    }
}
