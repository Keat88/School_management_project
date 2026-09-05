<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Hostels extends Model
{
    use HasFactory;
    protected $fillable = ['name','type','address'];
    public function rooms(){
        return $this->hasMany(Hostel_rooms::class);
    }
}
