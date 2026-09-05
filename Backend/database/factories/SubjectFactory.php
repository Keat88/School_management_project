<?php

namespace Database\Factories;

use App\Models\Subjects;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class SubjectFactory extends Factory
{
    protected $model = Subjects::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'subject_name' => fake()->randomElement([
                'Mathematics',
                'Physics',
                'Chemistry',
                'Computer Science',
                'Biology',
                'English',
                'Khmer',
                'AI Learning',
                'History'
            ]),
            'code' => fake()->unique()->bothify("KH-####"),
            'image' => null
        ];
    }
}
