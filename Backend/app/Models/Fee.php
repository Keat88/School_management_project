<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Fee extends Model
{
    use HasFactory;
    protected $fillable = ['student_id', 'academic_year_id', 'title', 'amount', 'due_date', 'status'];

    public function student()
    {
        return $this->belongsTo(Students::class);
    }

    public function academicYear()
    {
        return $this->belongsTo(Academic_years::class);
    }
}
