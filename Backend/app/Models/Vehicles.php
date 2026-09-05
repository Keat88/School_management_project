<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehicles extends Model
{
    use HasFactory;
    protected $fillable = ['vehicle_number', 'driver_name', 'driver_phone', 'capacity'];

    public function studentTransports()
    {
        return $this->hasMany(Student_Transports::class);
    }
}
