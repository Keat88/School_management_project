<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AttendanceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
       return [
            'id' => $this->id,
            'studentName' => $this->student->student_name ?? 'Unknown',
            // គណនាករណីអវត្តមានជាប់គ្នា (absenceCount) បើសិនជាមាន Logic ស្រាប់ ឬកំណត់ជា 0 សិន
            'absenceCount' => $this->student ? 
                $this->student->attendances()->where('status', 'A')->count() : 0, 
            'class' => 'Grade ' . ($this->classRoom->grade ?? '') . ' - Sec ' . ($this->classRoom->section ?? ''),
            'date' => $this->date, // ឈ្មោះ column ក្នុង DB របស់បង
            'checkInTime' => $this->created_at ? $this->created_at->format('H:i') : null,
            'status' => $this->status, // 'P', 'A', 'PM'
            'isLocked' => (bool) $this->is_blocked, // Map ពី is_blocked មក isLocked
            'hasUnreadMessage' => !empty($this->message), // បើមាន message/reason ຖືថាមាន unread message
        ];
    }
}
