<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Teachers extends Model
{
    use HasFactory;
    protected $fillable = ['user_id', 'teacher_code', 'qualification', 'phone', 'profile_image'];
  

    // protected function profileImageUrl(): Attribute
    // {
    //     return Attribute::make(
    //         get: fn() => $this->profile_image ? url('uploads/' . $this->profile_image) : null,
    //     );
    // }
    public function user()
    {
        return $this->belongsTo(User::class);
    }



    public function timeTables()
    {
        return $this->hasMany(TimeTables::class);
    }
}
