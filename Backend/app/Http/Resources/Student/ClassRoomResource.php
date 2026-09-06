<?php

namespace App\Http\Resources\Student;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClassRoomResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'name'           => $this->name ?? "Grade {$this->grade} - {$this->section}",
            'grade'          => $this->grade,
            'section'        => $this->section,
            'academic_year'  => $this->whenLoaded('academicYear', function () {
                return $this->academicYear?->name ?? 'N/A';
            }, $this->academic_year ?? 'N/A'),
            'teacher'        => $this->whenLoaded('teacher', function () {
                return $this->teacher?->user?->name ?? $this->teacher?->name ?? 'Unassigned';
            }, $this->teacher_name ?? 'Unassigned'),
            'students_count' => $this->students_count ?? ($this->relationLoaded('students') ? $this->students->count() : 0),
            'subjects_count' => $this->subjects_count ?? ($this->relationLoaded('timeTables') ? $this->timeTables->pluck('subject_id')->filter()->unique()->count() : 0),
            'timetables'     => $this->whenLoaded('timeTables', function () {
                return $this->timeTables->map(function ($timetable) {
                    return [
                        'id'         => $timetable->id,
                        'subject'    => $timetable->subject?->subject_name,
                        'teacher'    => $timetable->teacher?->user?->name,
                        'day'        => $timetable->day,
                        'start_time' => $timetable->start_time,
                        'end_time'   => $timetable->end_time,
                    ];
                });
            }),
            'students'       => $this->whenLoaded('students'),
        ];
    }
}
