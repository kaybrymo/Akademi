<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Booking extends Model {
    protected $guarded = [];
    protected $casts = ['booked_at' => 'datetime'];
    public function student() { return $this->belongsTo(User::class, 'student_id'); }
    public function session() { return $this->belongsTo(Session::class); }
}
