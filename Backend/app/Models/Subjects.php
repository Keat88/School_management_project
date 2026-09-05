<?php

namespace App\Models;

use Database\Factories\SubjectFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subjects extends Model
{
    use HasFactory;
    protected $fillable = ['subject_name', 'image', 'code'];
    protected static function newFactory()
    {
        return SubjectFactory::new();
    }
    public function timeTables()
    {
        return $this->hasMany(TimeTables::class);
    }

    public function exams()
    {
        return $this->hasMany(Exams::class);
    }
}
