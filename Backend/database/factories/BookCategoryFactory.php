<?php

namespace Database\Factories;

use App\Models\BookCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\BookCategory>
 */
class BookCategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    // public function definition(): array
    // {

    //     return [
    //         'book_category' => $this->faker->unique()->randomElement([
    //             'Mathematics',
    //             'Science',
    //             'Literature',
    //             'Computer Science',
    //             'History',
    //             'Arts',
    //             'English'
    //         ]),
    //     ];

    // }

    protected $model = BookCategory::class;

    public function definition(): array
    {
        return [
            'book_category' => ucfirst($this->faker->unique()->word()) . ' Studies',
        ];
    }
}
