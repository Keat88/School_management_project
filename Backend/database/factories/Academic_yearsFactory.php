<?php

namespace Database\Factories;

use App\Models\Academic_years;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Academic_years>
 */
class Academic_yearsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = Academic_years::class;

    public function definition(): array
    {
        return [
            'name'       => '2026-2027',
            'start_date' => '2026-09-01',
            'end_date'   => '2027-06-30',
        ];
    }
}
