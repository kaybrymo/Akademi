<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $fillable = ['name', 'email', 'password', 'role', 'phone', 'avatar', 'bio', 'location'];
    protected $hidden = ['password', 'remember_token'];
    protected $casts = ['email_verified_at' => 'datetime', 'password' => 'hashed'];

    public function isTutor(): bool { return $this->role === 'tutor'; }
    public function isStudent(): bool { return $this->role === 'student'; }
    public function isAdmin(): bool { return in_array($this->role, ['admin', 'super_admin']); }
    public function isSuperAdmin(): bool { return $this->role === 'super_admin'; }

    public function tutorProfile() { return $this->hasOne(TutorProfile::class); }
    public function subjects() { return $this->hasMany(Subject::class, 'tutor_id'); }
    public function schedules() { return $this->hasMany(Schedule::class, 'tutor_id'); }
    public function tutorSessions() { return $this->hasMany(Session::class, 'tutor_id'); }
    public function bookings() { return $this->hasMany(Booking::class, 'student_id'); }
    public function wallet() { return $this->hasOne(Wallet::class); }
    public function reviews() { return $this->hasMany(Review::class, 'student_id'); }
    public function favorites() { return $this->hasMany(Favorite::class, 'student_id'); }
    public function notifications() { return $this->hasMany(PlatformNotification::class); }
}
