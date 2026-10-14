<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Schedule extends Model {
    protected $guarded = [];
    protected $casts = ['is_available' => 'boolean'];
    public function tutor() { return $this->belongsTo(User::class, 'tutor_id'); }
}
