<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Session extends Model {
    protected $table = 'tutoring_sessions';
    protected $guarded = [];
    public function tutor() { return $this->belongsTo(User::class, 'tutor_id'); }
    public function subject() { return $this->belongsTo(Subject::class); }
    public function schedule() { return $this->belongsTo(Schedule::class); }
}
