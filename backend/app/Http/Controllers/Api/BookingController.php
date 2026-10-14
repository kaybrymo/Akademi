<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Session;
use Illuminate\Http\Request;

class BookingController extends Controller {
    public function index(Request $request) {
        return response()->json($request->user()->bookings()->with('session')->get());
    }
    public function store(Request $request) {
        $data = $request->validate([
            'session_id' => 'required|exists:sessions,id'
        ]);
        $session = Session::findOrFail($data['session_id']);
        if ($session->enrolled_count >= $session->capacity) {
            return response()->json(['message' => 'Session is full'], 400);
        }
        $booking = $request->user()->bookings()->create($data);
        $session->increment('enrolled_count');
        return response()->json($booking, 201);
    }
    public function cancel(Request $request, $id) {
        $booking = $request->user()->bookings()->findOrFail($id);
        $booking->update(['status' => 'cancelled']);
        return response()->json(['message' => 'Cancelled']);
    }
    public function reschedule(Request $request, $id) {
        $booking = $request->user()->bookings()->findOrFail($id);
        $booking->update(['status' => 'rescheduled']);
        return response()->json(['message' => 'Reschedule requested']);
    }
}
