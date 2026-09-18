<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TimeTableResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'class_room' => $this->whenLoaded('classRoom', function () {
                return 'Grade ' . $this->classRoom->grade . '-' . $this->classRoom->section;
            }),
            'subject'    => $this->whenLoaded('subject', function () {
                return $this->subject->subject_name;
            }),
            'teacher'    => $this->whenLoaded('teacher',function(){
                return $this->teacher->user->name;
            }),
            'day'        => $this->day,
            'start_time' => $this->start_time,
            'end_time'   => $this->end_time,
            
        ];
    }
}
