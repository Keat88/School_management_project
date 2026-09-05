<?php

namespace App\Http\Resources\Hotel;

use App\Http\Resources\Student\StudentResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HostelAssignmentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'bed_number'     => $this->bed_number,
            'start_date'     => $this->start_date,
            'end_date'       => $this->end_date,
            'status'         => $this->status,
            'student'        => new StudentResource($this->whenLoaded('student')),
            // 'room'        => new HostelRoomResource($this->whenLoaded('room')), // បើកប្រើប្រាស់ប្រសិនបើមាន Room Resource
        ];
    }
}
