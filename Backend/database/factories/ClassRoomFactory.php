<?php

namespace Database\Factories;

use App\Models\Academic_years;
use App\Models\ClassRoom;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ClassRoom>
 */
class ClassRoomFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = ClassRoom::class;

    public function definition(): array
    {
        $grade = $this->faker->randomElement(['10', '11', '12']);
        $section = $this->faker->randomElement(['A', 'B', 'C', 'E']);

        return [
            'academic_year_id' => Academic_years::factory(),
            'grade'            => $this->faker->randomElement(['10', '11', '12']),

            'section'          => $this->faker->randomElement(['A', 'B', 'C']),
        ];
    }
}
