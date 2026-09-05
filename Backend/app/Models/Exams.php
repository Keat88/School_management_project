<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Exams extends Model
{
    use HasFactory;
    protected $fillable = ['subject_id', 'class_id', 'exam_name', 'exam_date'];
    public function subject()
    {
      return $this->belongsTo(Subjects::class);
    }

    public function classRoom()
    {
        return $this->belongsTo(ClassRoom::class, 'class_id');
    }

    public function results()
    {
        return $this->hasMany(Resulte::class);
    }
}
