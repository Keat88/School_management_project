<?php

namespace App\Http\Resources\Library;

use App\Http\Resources\Student\StudentResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookIssureResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'book_id'     => $this->book_id,
            'student_id'  => $this->student_id,
            'issue_date'  => $this->issue_date,
            'due_date'    => $this->due_date,
            'return_date' => $this->return_date,
            'status'      => $this->status,

            // Relationships
            'book'        => new BookResource($this->whenLoaded('book')),
            'student'     => new StudentResource($this->whenLoaded('student')), // or use a StudentResource if you have one

            'created_at'  => $this->created_at?->toIso8601String(),
            'updated_at'  => $this->updated_at?->toIso8601String(),
        ];
    }
}
