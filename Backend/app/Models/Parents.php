<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Parents extends Model
{
    use HasFactory;
    protected $fillable = ['mother_name','father_name','email','parent_phone','occupation','parent_image'];
    public function students()
    {
        return $this->belongsToMany(Students::class, 'parent__students', 'parent_id', 'student_id');
    }
}
