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
            'student_name'  => $this->faker->name(),
            'class_id'      => 2,
            'parent_id'     => Parents::factory(),
            'roll_number'   => 'RN-' . $this->faker->unique()->numerify('#####'),
            'student_phone' => $this->faker->phoneNumber(),
            'email'         => $this->faker->unique()->safeEmail(),
            'date_of_birth' => $this->faker->date('Y-m-d', '-12 years'),
            'gender'        => $this->faker->randomElement(['male', 'female', 'other']),
            'address'       => $this->faker->address(),
            'student_image' => null,
        ];
    }
}
