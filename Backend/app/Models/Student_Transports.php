<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student_Transports extends Model
{
    use HasFactory;
    protected $fillable = ['student_id', 'vehicle_id', 'route_name', 'monthly_fee'];

    public function student()
    {
        return $this->belongsTo(Students::class);
    }

    public function vehicle()
    {
        return $this->belongsTo(Vehicles::class);
    }
}
