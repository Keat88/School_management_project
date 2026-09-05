<?php

namespace Database\Factories;

use App\Models\Teachers;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Teachers>
 */
class TeachersFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */

    protected $model = Teachers::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory()->state([
                'role' => 'teacher',
                'password' => Hash::make('password123'),
            ]),
            'teacher_code' => $this->faker->unique()->bothify('#AT#####'),
            'qualification' => $this->faker->randomElement(['BSc in IT', 'MSc Computer Science', 'PhD Mathematics', 'IBM Certification','Khmer laterature']),
            'phone' => $this->faker->phoneNumber(),
            'profile_image' => null,
        ];
    }
}
