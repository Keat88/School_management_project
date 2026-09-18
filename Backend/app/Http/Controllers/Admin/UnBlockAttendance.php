<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use Illuminate\Http\Request;

class UnBlockAttendance extends Controller
{
    public function getBlockAttendance(Request $request)
    {
        $query = Attendance::with(['student', 'classRoom']);
        if ($request->has('date')) {
            $query->where('date', $request->input('date'));
        }
        if ($request->has('student_name')) {
            $student_name = $request->input('student_name');
            $query->whereHas('student', function ($q) use ($student_name) {
                $q->where('student_name', $student_name);
            });
        }
        if ($request->has('grade')) {
            $grade = $request->input('grade');
            $query->whereHas('classRoom', function ($q) use ($grade) {
                $q->where('grade', $grade);
            });
        }
        if ($request->has('section')) {
            $section = $request->input('section');
            $query->whereHas('classRoom', function ($q) use ($section) {
                // Bug fix: changed 'grade' to 'section'
                $q->where('section', $section);
            });
        }
        if ($request->has('is_blocked')) {
            $is_block = $request->input('is_blocked');
            $query->where('is_blocked', $is_block);
        }
        if ($request->boolean('all') || $request->input('per_page') === 'all') {
            $attendance = $query->get();
        } else {
            $perPage = (int) $request->input('per_page', 10);
            $attendance = $query->paginate($perPage);
        }
        return response()->json([
            'status' => 'success',
            'data' => $attendance
        ], 200);
    }
    public function unlockAttendance(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json([
                'message' => 'Unauthorized! Only Admin can unlock attendance.'
            ], 403);
        }
        $ids = is_array($id) ? $id : [$id];
        $count = Attendance::whereIn('student_id', $ids)->count();

        if ($count === 0) {
            return response()->json([
                'message' => 'Attendance records not found!',
            ], 404);
        }
        if (!$count) {
            return response()->json([
                'message' => 'Attendance record  not found !',
            ], 404);
        }

        $updated = Attendance::whereIn('student_id', $ids)->update([
            'is_unlocked' => true
        ]);
        return response()->json([
            'message' => 'Studen have been unlock attendance succesfull,Please try study more !',
            'is_unlocked' => $updated
        ], 200);
    }
}
