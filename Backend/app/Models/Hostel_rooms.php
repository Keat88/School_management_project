<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Hostel_rooms extends Model
{
    use HasFactory;
    protected $fillable = ['hostel_id', 'room_number', 'gender', 'block_name', 'type', 'image', 'number_of_beds', 'cost_per_bed', 'status'];
    // protected $appends = ['image_url'];
    public function hostel()
    {
        return $this->belongsTo(Hostels::class);
    }
    public function rooms()
    {
        return $this->hasMany(Hostel_assignments::class);
    }
    // public function getImageUrlAttribute()
    // {
    //     if (!empty($this->attributes['image'])) {
    //         return url('storage/' . $this->attributes['image']);
    //     }
    //     return null;
    // }
}
