<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TimeTables extends Model
{
    use HasFactory;
    protected $fillable = ['class_id', 'subject_id', 'teacher_id', 'day', 'start_time', 'end_time'];

    public function classRoom()
    {
        return $this->belongsTo(ClassRoom::class, 'class_id');
    }

    public function subject()
    {
        return $this->belongsTo(Subjects::class, 'subject_id');
    }

    public function teacher()
    {
        return $this->belongsTo(Teachers::class,'teacher_id');
    }
}
