<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Hostel_assignments extends Model
{
    use HasFactory;
    protected $fillable = ['student_id', 'hostel_room_id', 'bed_number', 'start_date', 'end_date', 'status'];
    public function student()
    {
        return $this->belongsTo(Students::class);
    }
    public function room()
    {
        return $this->belongsTo(Hostel_rooms::class,'hostel_room_id');
    }
}
