<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TeacherAddAttendanceResource extends JsonResource
{

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {;
        $todayAttendance = $this->whenLoaded('attendances', function () {
            return $this->attendances->first();
        });

        return [
            'id'     => $this->id,
            'name'   => $this->student_name,     // ឬ full_name អាស្រ័យលើ Database របស់បង
            'gender' => $this->gender,

            // បើធ្លាប់ចុះវត្តមានហើយ យក status មកបង្ហាញ បើអត់ទេដាក់ទទេ ""
            'status' => $todayAttendance?->status ?? '',

            // បើមានមូលហេតុ យកមកបង្ហាញ បើអត់ទេដាក់ទទេ ""
            'reason' => $todayAttendance?->reason ?? '',

            // អាចកំណត់ locked តាមតក្កវិជ្ជា (ឧ. true បើចង់បិទមិនឱ្យកែ ឬ false ឱ្យកែបានធម្មតា)
            'locked' => false,
        ];
    }
}
