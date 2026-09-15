<?php

namespace Database\Factories;

use App\Models\CourseCategory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class CourseFactory extends Factory
{
    public function definition(): array
    {
        $title = fake()->unique()->sentence(4);
        return [
            'title' => $title,
            'slug' => Str::slug($title),
            'description' => fake()->paragraph(),
            'price' => fake()->randomFloat(2, 20, 200),
            'discount_price' => fake()->randomFloat(2, 10, 50),
            'thumbnail' => 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
            'category_id' => CourseCategory::inRandomOrder()->first()?->id ?? 1,
            'instructor_id' => 1,
            'level' => fake()->randomElement(['beginner', 'intermediate', 'advanced', 'all']),
            'status' => 'published',
            'duration' => fake()->numberBetween(5, 50) . ' hours',
            'lessons_count' => fake()->numberBetween(10, 80),
            'requirements' => ['Basic programming knowledge'],
            'what_you_will_learn' => ['Advanced concepts', 'Real-world project building'],
            'language' => 'English',
            'has_certificate' => true,
            'is_featured' => fake()->boolean(20),
        ];
    }
}
