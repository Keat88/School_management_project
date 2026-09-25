<?php

namespace App\Http\Resources\Student;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ParentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'mother_name'  => $this->mother_name,
            'father_name'  => $this->father_name,
            'occupation'   => $this->occupation,
            'parent_phone' => $this->parent_phone,
            'email'        => $this->email,
            'parent_image' => $this->parent_image ? $this->parent_image : null,
        ];
    }
}
