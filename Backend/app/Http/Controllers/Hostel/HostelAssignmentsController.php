<?php

namespace App\Http\Controllers\Hostel;

use App\Http\Controllers\Controller;
use App\Http\Resources\Hotel\HostelAssignmentResource;
use App\Models\Hostel_assignments;
use App\Models\Students;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class HostelAssignmentsController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Hostel_assignments::with(['student.parent', 'student.classRoom', 'room']);
            if ($request->filled('status')) {
                $query->where('status', $request->status);
            }
            if ($request->filled('search')) {
                $search = $request->search;
                $query->whereHas('student', function ($q) use ($search) {
                    $q->where('student_name', 'like', "%{$search}%")
                        ->orWhere('roll_number', 'like', "%{$search}%")
                        ->orWhere('student_phone', 'like', "%{$search}%");
                });
            }
            if ($request->filled('room')) {
                $room = $request->room;
                $query->whereHas('room', function ($q) use ($room) {
                    $q->where('room_number', 'like', "%{$room}%");
                });
            }
            $perPage = $request->input('per_page', 10);

            $assignments = $query->orderBy('id', 'desc')->paginate($perPage);
            if ($assignments->isEmpty()) {
                return $this->success(
                    'Hostel assignments don\'t have data',
                    HostelAssignmentResource::collection($assignments)->response()->getData(true),
                    200
                );
            }

            return $this->success(
                'Hostel assignments retrieved successfully',
                HostelAssignmentResource::collection($assignments)->response()->getData(true)
            );
        } catch (\Exception $e) {
            return $this->error(
                'Something went wrong while retrieving hostel assignments',
                $e->getMessage(),
                500
            );
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'roll_number'    => 'required|string|exists:students,roll_number',
            'hostel_room_id' => 'required|exists:hostel_rooms,id',
            'bed_number'     => 'nullable|string|max:255',
            'start_date'     => 'required|date',
            'end_date'       => 'nullable|date|after_or_equal:start_date',
            'status'         => 'required|in:active,checked_out',
        ]);

        if ($validator->fails()) {
            return $this->error('Invalid data', $validator->errors(), 422);
        }

        try {
            $student = Students::where('roll_number', $request->roll_number)->first();

            if (!$student) {
                return $this->error('Student not found in school records', null, 422);
            }

            $studentAssign = Hostel_assignments::create([
                'student_id'     => $student->id,
                'hostel_room_id' => $request->hostel_room_id,
                'bed_number'     => $request->bed_number,
                'start_date'     => $request->start_date,
                'end_date'       => $request->end_date,
                'status'         => $request->status,
            ]);

            $studentAssign->load(['student.parent', 'student.classRoom', 'room']);

            return $this->success('Student assigned to hostel successfully', new HostelAssignmentResource($studentAssign), 201);
        } catch (\Exception $e) {
            return $this->error('Something went wrong while adding student to hostel', $e->getMessage(), 500);
        }
    }

    public function show(string $id)
    {
        try {
            $assignment = Hostel_assignments::with(['student.parent', 'student.classRoom', 'room'])->find($id);

            if (!$assignment) {
                return $this->error('Assignment not found', null, 404);
            }

            return $this->success('Assignment found successfully', new HostelAssignmentResource($assignment));
        } catch (\Exception $e) {
            return $this->error('Something went wrong when trying to access student assignment', $e->getMessage(), 500);
        }
    }

    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'roll_number'    => 'nullable|string|exists:students,roll_number',
            'hostel_room_id' => 'required|exists:hostel_rooms,id',
            'bed_number'     => 'nullable|string|max:255',
            'start_date'     => 'required|date',
            'end_date'       => 'nullable|date|after_or_equal:start_date',
            'status'         => 'required|in:active,checked_out',
        ]);

        if ($validator->fails()) {
            return $this->error('Invalid data', $validator->errors(), 422);
        }

        try {
            $assignment = Hostel_assignments::find($id);

            if (!$assignment) {
                return $this->error('Assignment not found in this hostel', null, 404);
            }

            $student_id = $assignment->student_id;
            if ($request->filled('roll_number')) {
                $student = Students::where('roll_number', $request->roll_number)->first();

                if (!$student) {
                    return $this->error('Student not assigned in school', null, 422);
                }

                $student_id = $student->id;
            }

            $assignment->update([
                'student_id'     => $student_id,
                'hostel_room_id' => $request->hostel_room_id,
                'bed_number'     => $request->bed_number,
                'start_date'     => $request->start_date,
                'end_date'       => $request->end_date,
                'status'         => $request->status,
            ]);

            $assignment->load(['student.parent', 'student.classRoom', 'room']);

            return $this->success('Student updated successfully', new HostelAssignmentResource($assignment));
        } catch (\Exception $e) {
            return $this->error('Something went wrong while updating student hostel assignment', $e->getMessage(), 500);
        }
    }

    public function destroy(string $id)
    {
        try {
            $assignment = Hostel_assignments::find($id);

            if (!$assignment) {
                return $this->error('Assignment not found', null, 404);
            }

            $assignment->delete();

            return $this->success('Hostel assignment deleted successfully', null, 200);
        } catch (\Exception $e) {
            return $this->error('Something went wrong when trying to destroy student assignment', $e->getMessage(), 500);
        }
    }
}
