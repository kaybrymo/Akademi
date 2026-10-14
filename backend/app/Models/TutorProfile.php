<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class TutorProfile extends Model {
    protected $guarded = [];
    protected $casts = ['languages' => 'array', 'verification_badge' => 'boolean'];
    public function user() { return $this->belongsTo(User::class); }
}
