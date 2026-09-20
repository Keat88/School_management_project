<?php

namespace App\Http\Controllers;

use App\Http\Resources\AttendanceResource;
use App\Models\Attendance;
use App\Models\Students;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
     
        $query = Attendance::with(['student', 'classRoom']);
        if ($request->filled('date')) {
            $query->whereDate('date', $request->input('date'));
        }
        if ($request->filled('grade') && $request->input('grade') !== 'all') {
            $grade = $request->input('grade');
            $query->whereHas('classRoom', function ($q) use ($grade) {
                $q->where('grade', $grade);
            });
        }
        if ($request->filled('section') && $request->input('section') !== 'all') {
            $section = $request->input('section');
            $query->whereHas('classRoom', function ($q) use ($section) {
                $q->where('section', $section);
            });
        }
        if ($request->filled('student_name')) {
            $studentName = $request->input('student_name');
            $query->whereHas('student', function ($q) use ($studentName) {
                $q->where('name', 'like', '%' . $studentName . '%');
            });
        }
        if ($request->filled('is_blocked') && $request->input('is_blocked') !== 'all') {
            $isBlocked = $request->input('is_blocked') === 'true' || $request->input('is_blocked') == 1;
            $query->where('is_blocked', $isBlocked);
        }
        $attendances = $query->paginate(30);
        return AttendanceResource::collection($attendances)->additional([
            'message' => 'Attendance records retrieved successfully!'
        ]);
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $request->validate([
            'student_id' => 'required|exists:students,id',
            'class_id'   => 'required|exists:class_rooms,id',
            'date'       => 'required|date',
            'status'     => 'required|string',
            'message'    => 'nullable|string|max:500',
        ]);

        $absentCount = Attendance::where('student_id', $request->student_id)->where('status', 'absent')->count();
        $shouldBlock = ($absentCount >= 5 && $request->status === "absent");
        $is_unlocked = $request->is_unlocked;


        $attendance = Attendance::create([
            'student_id' => $request->student_id,
            'class_id' => $request->class_id,
            'date' => $request->date,
            'status' => $request->status,
            'message' => $shouldBlock ? 'Blocked automatically due to excessive absences (>=5 times).' : $request->message,
            'is_blocked' => $shouldBlock,
        ]);

        if ($shouldBlock) {
            return response()->json([
                'message'    => 'Student attendance has been blocked because of too many absences. Contact Admin!',
                'attendance' => $attendance
            ], 403);
        }
        return response()->json([
            'message' => 'Attandance add successfully!',
            'attendance' => $attendance

        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $student = Students::with([
            'attendances'
        ])->find($id);
        if (!$student) {
            return response()->json([
                'message' => 'Student not found!'
            ], 404);
        }
        $summary = [
            'total_absent' => $student->attendances->where('status', 'absent')->count(),
            'total_permission' => $student->attendances->where('status', 'permission')->count(),
            'total_present'    => $student->attendances->where('status', 'present')->count(),
        ];
        return response()->json([
            'message' => 'Student attendance details retrieved successfully!',
            'student' => $student,
            'attendance_summary' => $summary
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
