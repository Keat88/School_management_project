<?php

namespace App\Http\Resources\Course;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CourseResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug ?? null,
            'description' => $this->description,
            'price' => $this->price,
            'discount_price' => $this->discount_price,
            'thumbnail' => $this->thumbnail
                ? (str_starts_with($this->thumbnail, 'http')
                    ? $this->thumbnail
                    : url('storage/' . ltrim(str_replace('storage/', '', $this->thumbnail), '/')))
                : null,
            'category_id' => $this->category_id,
            'category' => $this->whenLoaded('category'),
            'instructor_id' => $this->instructor_id,
            'instructor' => $this->whenLoaded('instructor'),
            'level' => $this->level,
            'status' => $this->status,
            'duration' => $this->duration,
            'lessons_count' => $this->lessons_count,
            'language' => $this->language,
            'has_certificate' => (bool) $this->has_certificate,
            'is_featured' => (bool) $this->is_featured,
            'requirements' => is_string($this->requirements) ? json_decode($this->requirements, true) : $this->requirements,
            'what_you_will_learn' => is_string($this->what_you_will_learn) ? json_decode($this->what_you_will_learn, true) : $this->what_you_will_learn,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
