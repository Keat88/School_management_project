<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Students extends Model
{
    use HasFactory;
    protected $fillable = ['student_phone', 'student_name', 'email', 'class_id', 'parent_id', 'roll_number', 'date_of_birth', 'gender', 'address', 'student_image'];

    public function classRoom()
    {
        return $this->belongsTo(ClassRoom::class, 'class_id');
    }
    public function parent()
    {
        return $this->belongsTo(Parents::class, 'parent_id');
    }

    public function parents()
    {
        return $this->belongsToMany(Parents::class, 'parent__students', 'student_id', 'parent_id');
    }

    public function fees()
    {
        return $this->hasMany(Fee::class);
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class, 'student_id', 'id');
    }

    public function results()
    {
        return $this->hasMany(Resulte::class);
    }

    public function bookIssues()
    {
        return $this->hasMany(Book_issues::class);
    }

    public function studentTransports()
    {
        return $this->hasMany(Student_Transports::class);
    }
    public function hostelAssignments()
    {
        return $this->hasMany(Hostel_assignments::class);
    }
    public function hostelPayments()
    {
        return $this->hasMany(Hostel_payments::class);
    }
    public function scores()
    {
        return $this->hasMany(Scores::class, 'student_id');
    }
}
