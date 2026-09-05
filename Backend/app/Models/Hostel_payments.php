<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Hostel_payments extends Model
{
    protected $fillable = ['student_id', 'hostel_room_id', 'amount', 'month', 'year', 'status', 'payment_date'];
    use HasFactory;
    public function studentPayment()
    {
        return $this->belongsTo(Students::class);
    }
}
