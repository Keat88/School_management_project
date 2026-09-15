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
    protected $model = ClassRoom::class;

    public function definition(): array
    {
        // Finds the existing "2026-2027" academic year or creates it if missing
        $academicYear = Academic_years::firstOrCreate([
            'name' => '2026-2027' // Replace 'year' with 'name' or 'title' if your database column uses that name
        ]);

        return [
            'academic_year_id' => $academicYear->id,
            'grade'            => $this->faker->randomElement(['10', '11', '12']),
            'section'          => $this->faker->randomElement(['A', 'B', 'C']),
        ];
    }
}