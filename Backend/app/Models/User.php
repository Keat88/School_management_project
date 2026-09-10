<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'google_id',
        'github_id',
        'avatar',
        'otp_code',         // Added for 2FA
        'otp_expires_at',   // Added for 2FA expiration
        'last_active_at',
        'two_factor_enabled',
        // Added for session timeout tracking
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'otp_code'
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'otp_expires_at' => 'datetime',     // Cast as date object for easy comparisons
        'last_active_at' => 'datetime',
        'two_factor_enabled' => 'boolean',

    ];

    public function admin()
    {
        return $this->hasOne(Admins::class);
    }
    public function teacher()
    {
        return $this->hasOne(Teachers::class);
    }

    public function notices()
    {
        return $this->hasMany(Notice::class);
    }
    public function activityLog()
    {
        return $this->hasMany(ActivityLog::class);
    }
}
