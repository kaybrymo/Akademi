<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class SessionRecording extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'recorded_at' => 'datetime',
        'expires_at'  => 'datetime',
        'last_billed_at' => 'datetime',
        'is_kept'     => 'boolean',
        'size_mb'     => 'float',
        'monthly_storage_fee' => 'float',
    ];

    public function session()
    {
        return $this->belongsTo(Session::class, 'session_id');
    }

    public function tutor()
    {
        return $this->belongsTo(User::class, 'tutor_id');
    }

    public function isAccessibleBy(User $user): bool
    {
        if ($user->role === 'admin') {
            return true;
        }

        if ($user->id === $this->tutor_id) {
            return true;
        }

        // Check if student booked this session
        return Booking::where('session_id', $this->session_id)
            ->where('student_id', $user->id)
            ->whereIn('status', ['confirmed', 'completed'])
            ->exists();
    }

    public function daysRemaining(): int
    {
        if ($this->is_kept) {
            return 9999;
        }

        if (!$this->expires_at) {
            return 10;
        }

        $diff = Carbon::now()->diffInDays($this->expires_at, false);
        return max(0, (int) $diff);
    }
}
