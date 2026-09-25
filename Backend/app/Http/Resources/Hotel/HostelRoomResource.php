<?php

namespace App\Http\Resources\Hotel;

use App\Http\Resources\Hotel\HostelResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class HostelRoomResource extends JsonResource
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
            'hostel_id'      => $this->hostel_id,
            'room_number'    => $this->room_number,
            'block_name'     => $this->block_name,
            'image'          => $this->image ? $this->image : null,
            'type'           => $this->type,
            'gender'         => $this->gender,
            'number_of_beds' => $this->number_of_beds,
            'cost_per_bed'   => $this->cost_per_bed,
            'status'         => $this->status,
            

            // for relation ship 
            'hostel'         => new HostelResource($this->whenLoaded('hostel')), 
            
            'created_at'     => $this->created_at?->toIso8601String(),
            'updated_at'     => $this->updated_at?->toIso8601String(),
        ];
    }
}