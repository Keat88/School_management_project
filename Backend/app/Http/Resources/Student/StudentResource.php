<?php

namespace App\Http\Resources\Student;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'            => $this->id,
            'student_name'  => $this->student_name,
            'email'         => $this->email,
            'gender'        => $this->gender,
            'address'       => $this->address,
            'date_of_birth' => $this->date_of_birth,
            'roll_number'   => $this->roll_number,
            'student_phone' => $this->student_phone,
            'student_image' => $this->student_image ? $this->student_image : null,
            'parent'        => new ParentResource($this->whenLoaded('parent')),
            'class_room'    => $this->whenLoaded('classRoom'),
            'latest_attendance' => $this->whenLoaded('attendances', function () {
                $latest = $this->attendanceRecords->first();
                return $latest ? [
                    'id'          => $latest->id,
                    'status'      => $latest->status,
                    'date'        => $latest->date,
                    'is_blocked'  => $latest->is_blocked,
                    'is_unlocked' => $latest->is_unlocked,
                ] : null;
            }),
        ];
    }
}
