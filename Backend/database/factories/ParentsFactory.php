<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Parents>
 */
class ParentsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
       
           return [
            'mother_name'  => $this->faker->name('female'),
            'father_name'  => $this->faker->name('male'),
            'occupation'   => $this->faker->jobTitle(),
            'parent_phone' => $this->faker->phoneNumber(),
            'parent_image' => null,
            'email'        => $this->faker->unique()->safeEmail(),
        ];
      
    }
}
