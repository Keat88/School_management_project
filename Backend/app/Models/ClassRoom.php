<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClassRoom extends Model
{
    use HasFactory;

    protected $fillable = ['academic_year_id', 'grade', 'section', 'teacher_id'];
    // Direct relationship to Teachers model
    public function teacher()
    {
        return $this->belongsTo(Teachers::class, 'teacher_id');
    }
    public function academicYear()
    {
        return $this->belongsTo(Academic_years::class);
    }
    public function students()
    {
        return $this->hasMany(Students::class, 'class_id');
    }

    public function timeTables()
    {
        return $this->hasMany(TimeTables::class, 'class_id');
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class, 'class_id');
    }

    public function exams()
    {
        return $this->hasMany(Exams::class, 'class_id');
    }
    public function scores()
    {
        return $this->hasMany(Scores::class, 'class_id');
    }
}
