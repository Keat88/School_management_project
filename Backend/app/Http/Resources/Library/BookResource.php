<?php

namespace App\Http\Resources\Library;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'               => $this->id,
            'book_category_id' => $this->book_category_id,
            'title'            => $this->title,
            'author'           => $this->author,
            'isbn'             => $this->isbn,
            'book_image'       => $this->book_image ? $this->book_image : null,
            'total_copies'     => $this->total_copies,
            'available_copies' => $this->available_copies,
            'category'         => new BookCategoryResource($this->whenLoaded('category')),

            'created_at'       => $this->created_at?->toIso8601String(),
            'updated_at'       => $this->updated_at?->toIso8601String(),
        ];
    }
}
