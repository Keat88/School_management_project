<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notice extends Model
{
    use HasFactory;
    protected $fillable = ['user_id', 'title', 'content', 'target_audience', 'attachment', 'target_id', 'publish_date'];
    // protected $appends = ['attachment_url'];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    // public function getAttachmentUrlAttribute($value)
    // {
    //     if ($this->attributes['attachment']) {
    //         return url('storage/' . $this->attributes['attachment']);
    //     }
    //     return null;
    // }
}
