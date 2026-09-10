<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;
    protected $fillable = [
        'student_id',
        'category',
        'amount',
        'due_date',
        'method',
        'status',
    ];
    public function student()
    {
        return $this->belongsTo(Students::class);
    }
}
