<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TeacherClassRoomResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // ទាញយក ClassRoom តាមរយៈ Relation
        $classRoom = $this->classRoom;

        // ម៉ោង Start / End ឱ្យចេញជាទម្រង់ 08:00 AM ស្អាត
        $startTime = $this->start_time ? Carbon::createFromFormat('H:i:s', $this->start_time)->format('h:i A') : '08:00 AM';
        if ($this->end_time);
        $endTime = $this->end_time ? Carbon::createFromFormat('H:i:s', $this->end_time)->format('h:i A') : '09:30 AM';

        return [
            // យក ID របស់ Class ឬ Timetable តាមតម្រូវការ
            'id'             => $classRoom?->id ?? $this->id,

            // បញ្ចូល Grade និង Section ពី relation class_room
            'name'           => $classRoom ? "Grade {$classRoom->grade}{$classRoom->section} - Full-Stack Web" : 'N/A',

            // យក subject_name ពី relation subject (ក្នុង JSON របស់បងប្រើ subject_name)
            'subject'        => $this->subject?->subject_name ?? 'Web Development (React & Laravel)',

            // បន្ទប់រៀន (បើក្នុង class_room គ្មាន field room អាចកំណត់ជា Default)
            'room'           => $classRoom?->room ?? 'Lab 3',
            // បង្កើត String Schedule ស្របតាម day, start_time, end_time ក្នុង JSON
            'schedule'       => "{$this->day} ({$startTime} - {$endTime})",
            // ចំនួនសិស្ស (ទាញពី relation count ប្រសិនបើមាន)
            'totalStudents'  => $classRoom?->students->count() ?? 32,
            'attendanceRate' => '95%',
            'createdDate'    => $this->created_at?->format('Y-m-d H:i:s'),
        ];
    }
}
