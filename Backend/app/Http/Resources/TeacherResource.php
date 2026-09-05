<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TeacherResource extends JsonResource
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
            'name'       => $this->name,
            'email'      => $this->email,
            'role'       => $this->role,
            'teacher'    => $this->whenLoaded('teacher', function () {
                return [
                    'id'                => $this->teacher->id ?? null,
                    'teacher_code'      => $this->teacher->teacher_code ?? null,
                    'qualification'     => $this->teacher->qualification ?? null,
                    'phone'             => $this->teacher->phone ?? null,
                    'profile_image' => $this->teacher && $this->teacher->profile_image
                        ? url('storage/' . $this->teacher->profile_image)
                        : null,
                ];
            }),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
