<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NoticeResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'              => $this->id,
            'user'            => $this->whenLoaded('user'),
            'title'           => $this->title,
            'content'         => $this->content,
            'target_audience' => $this->target_audience,
            'target_id'       => $this->target_id,
            'publish_date'    => $this->publish_date,
            'attachment'      => $this->attachment ? asset('storage/' . $this->attachment) : null,
            'created_at'      => $this->created_at,
            'updated_at'      => $this->updated_at,
        ];
    }
}
