<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Course extends Model
{
    use HasFactory;

    protected $table = 'courses';

    protected $fillable = [
        'title',
        'slug',
        'description',
        'price',
        'discount_price',
        'thumbnail',
        'category_id',
        'instructor_id',
        'level',
        'status',
        'rating_avg',
        'reviews_count',
        'duration',
        'lessons_count',
        'requirements',
        'what_you_will_learn',
        'language',
        'has_certificate',
        'is_featured',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'discount_price' => 'decimal:2',
        'rating_avg' => 'decimal:2',
        'has_certificate' => 'boolean',
        'is_featured' => 'boolean',
        'requirements' => 'array',
        'what_you_will_learn' => 'array',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(CourseCategory::class, 'category_id');
    }

    public function instructor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }

    public function modules(): HasMany
    {
        return $this->hasMany(CoursesModules::class, 'course_id');
    }

    public function lessons(): HasMany
    {
        return $this->hasMany(Lessons::class, 'course_id');
    }

    public function enrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class, 'course_id');
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(CourseReview::class, 'course_id');
    }
}