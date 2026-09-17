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
            'subject_name' => fake()->unique()->randomElement([
                'Mathematics',
                'Physics',
                'Chemistry',
                'Biology',
                'Khmer Literature',
                'History',
                'Geography',
                'Moral and Civics',
                'Earth and Environmental Science',
                'English',
                'Computer Science',
                'Physical Education'
            ]),
            'code' => fake()->unique()->bothify("SUB-####"),
            'image' => null,
        ];
    }
}
