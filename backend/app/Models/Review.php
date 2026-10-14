<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Review extends Model {
    protected $guarded = [];
    protected $casts = ['is_flagged' => 'boolean'];
    public function student() { return $this->belongsTo(User::class, 'student_id'); }
    public function tutor() { return $this->belongsTo(User::class, 'tutor_id'); }
    public function session() { return $this->belongsTo(Session::class); }
    public function booking() { return $this->belongsTo(Booking::class); }
}
