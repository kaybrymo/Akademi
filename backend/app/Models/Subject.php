<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Subject extends Model {
    protected $guarded = [];
    public function tutor() { return $this->belongsTo(User::class, 'tutor_id'); }
    public function group() { return $this->belongsTo(SubjectGroup::class, 'subject_group_id'); }
}
