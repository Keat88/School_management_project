<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ScoresResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'name'          => $this->grade.'-'.$this->section,
            'createdDate'   => $this->created_at?->format('Y-m-d H:i:s'),
            'totalStudents' => $this->whenLoaded('students', fn() => $this->students->count()),
            'termTime'      => $this->term_time, // e.g., "Sat & Sun (11:00 am - 01:30 pm)"
            'students'      => ClassStudentScoresResource::collection($this->whenLoaded('students')),
        ];
    }
}
