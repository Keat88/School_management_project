<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Book_issues extends Model
{
    use HasFactory;
    protected $fillable = ['book_id','student_id','issue_date','due_date','return_date','status'];

    public function book()
    {
        return $this->belongsTo(Books::class);
    }

    public function student()
    {
        return $this->belongsTo(Students::class);
    }
}
