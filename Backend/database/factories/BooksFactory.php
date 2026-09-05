<?php

namespace Database\Factories;

use App\Models\BookCategory;
use App\Models\Books;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Books>
 */
class BooksFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = Books::class;

    public function definition(): array
    {
        $totalCopies = $this->faker->numberBetween(5, 25);

        return [
            'book_category_id' => BookCategory::factory(),
            'title'            => rtrim($this->faker->sentence(3), '.'),
            'author'           => $this->faker->name(),
            'isbn'             => $this->faker->unique()->isbn13(),
            'book_image'       => null,
            'total_copies'     => $totalCopies,
            'available_copies' => $totalCopies,
        ];
    }
}
