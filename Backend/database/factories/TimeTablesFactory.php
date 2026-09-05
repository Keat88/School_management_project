<?php

namespace Database\Factories;

use App\Models\ClassRoom;
use App\Models\Subjects;
use App\Models\Teachers;
use App\Models\TimeTables;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TimeTables>
 */
class TimeTablesFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = TimeTables::class;

    public function definition(): array
    {
        // Define standard non-overlapping time slots for a school day
        $timeSlots = [
            ['start_time' => '08:00:00', 'end_time' => '09:30:00'],
            ['start_time' => '09:45:00', 'end_time' => '11:15:00'],
            ['start_time' => '13:00:00', 'end_time' => '14:30:00'],
            ['start_time' => '14:45:00', 'end_time' => '16:15:00'],
        ];

        $slot = $this->faker->randomElement($timeSlots);

        return [
            'class_id'   => ClassRoom::factory(),
            'subject_id' => Subjects::factory(),
            'teacher_id' => Teachers::factory(),
            'day'        => $this->faker->randomElement(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']),
            'start_time' => $slot['start_time'],
            'end_time'   => $slot['end_time'],
        ];
    }
}
