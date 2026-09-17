<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClassStudentScoresResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    { // Grab the first score record matching this class context, or fallback to default
        $score = $this->scores->first();
        // Note: If you are using pivot tables instead, use $this->pivot instead of $score

        return [
            'id'              => $this->id,
            'studentId'       => $this->student_id, // maps to "3691", etc.
            'name'            => $this->student_name,
            'attendanceScore' => (int) ($score->attendance_score ?? $this->pivot->attendance_score ?? 0),
            'activityScore'   => (int) ($score->activity_score ?? $this->pivot->activity_score ?? 0),
            'examScore'       => (int) ($score->exam_score ?? $this->pivot->exam_score ?? 0),
        ];
    }
}
