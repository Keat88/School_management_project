<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
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
            'student_id' => $this->student_id,
            'student'    => $this->whenLoaded('student'),
            'category'   => $this->category,
            'amount'     => $this->amount,
            'due_date'   => $this->due_date,
            'method'     => $this->method,
            'status'     => $this->status,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
