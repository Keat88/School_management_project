<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Academic_years extends Model
{
    use HasFactory;
    protected $fillable = ['name','start_date','end_date','is_current'];

    public function classRooms()
    {
        return $this->hasMany(ClassRoom::class);
    }

    public function fees()
    {
        return $this->hasMany(Fee::class);
    }
}
