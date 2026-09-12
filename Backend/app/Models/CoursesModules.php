<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CoursesModules extends Model
{
    use HasFactory;

    protected $table = 'courses_modules';

    protected $fillable = [
        'course_id',
        'title',
        'sort_order',
    ];

    public function course(): BelongsTo
    {
        return $this->belongsTo(Courses::class, 'course_id');
    }

    public function lessons(): HasMany
    {
        return $this->hasMany(Lessons::class, 'module_id');
    }
}
