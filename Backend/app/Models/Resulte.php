<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Resulte extends Model
{
    use HasFactory;
    protected $fillable = ['exam_id','student_id','marks_obtained','total_marks','grade'];

    public function exam()
    {
        return $this->belongsTo(Exams::class);
    }

    public function student()
    {
        return $this->belongsTo(Students::class);
    }
}
