<?php

namespace App\Http\Resources\Student;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClassRoomResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'            => $this->id,
            'grade'         => $this->grade,
            'section'       => $this->section,
            'academic_year' => $this->whenLoaded('academicYear', function () {
                return $this->academicYear->name;
            }),
            'timetables'=> $this->whenLoaded('timeTables'),
            // 'timetables'    => $this->whenLoaded('timeTables', function () {
            //     return $this->timeTables->map(function ($timetable) {
            //         return [
            //             'id'         => $timetable->id,
            //             'subject'    => $timetable->subject?->subject_name,
            //             'teacher'    => $timetable->teacher?->user?->name,
            //             'day'        => $timetable->day,
            //             'start_time' => $timetable->start_time,
            //             'end_time'   => $timetable->end_time,
            //         ];
            //     });
            // }),
            'students'      => $this->whenLoaded('students'),
        ];
    }
}
