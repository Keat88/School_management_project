<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Scores extends Model
{
    use HasFactory;
    protected $fillable = ['class_id', 'student_id', 'attendance_score', 'activity_score', 'exam_score'];
    public function student()
    {
        return $this->belongsTo(Students::class, 'student_id');
    }
    public function classes()
    {
        return $this->belongsTo(ClassRoom::class, 'class_id');
    }
}
