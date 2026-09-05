<?php

namespace Database\Factories;

use App\Models\ClassRoom;
use App\Models\Parents;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Students>
 */
class StudentsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'parent_id'     => Parents::factory(),
            'class_id'      => ClassRoom::factory(),
            'student_name'  => $this->faker->name(),
            'email'         => $this->faker->unique()->safeEmail(),
            'gender'        => $this->faker->randomElement(['male', 'female']),
            'address'       => $this->faker->address(),
            'date_of_birth' => $this->faker->date('Y-m-d', '-15 years'),
            'roll_number'   => $this->faker->unique()->numerify('STU-#####'),
            'student_phone' => $this->faker->phoneNumber(),
            'student_image' => null,
        ];
    }
}
