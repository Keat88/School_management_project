<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Lessons extends Model
{
    use HasFactory;

    protected $table = 'lessons';

    protected $fillable = [
        'module_id',
        'course_id',
        'title',
        'content',
        'video_url',
        'duration',
        'is_free_preview',
        'sort_order',
    ];

    public function module(): BelongsTo
    {
        return $this->belongsTo(CoursesModules::class, 'module_id');
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Courses::class, 'course_id');
    }
}