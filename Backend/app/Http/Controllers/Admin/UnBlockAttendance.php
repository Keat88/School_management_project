<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use Illuminate\Http\Request;

class UnBlockAttendance extends Controller
{
    public function unlockAttendance(Request $request, $id)
    {
        // if ($request->user()->role !== 'admin') {
        //     return response()->json([
        //         'message' => 'Unauthorized! Only Admin can unlock attendance.'
        //     ], 403);
        // }
        $ids = is_array($id) ? $id : [$id];

        // Check if records exist first
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
