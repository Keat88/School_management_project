<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\BookCategory;
use App\Models\Books;
use App\Models\ClassRoom;
use App\Models\Hostel_assignments;
use App\Models\Hostel_rooms;
use App\Models\Students;
use App\Models\Subjects;
use App\Models\Teachers;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function dashboard()
    {
        $totalStudents = Students::count();
        $totalTeachers = Teachers::count();
        $totalClass = ClassRoom::count();
        $totalAttendance = Attendance::count();
        $totalBooks = Books::count();
        $totalBookCategories = BookCategory::count();
        $totalHostelRooms = Hostel_rooms::count();
        $totalStudentAssignment = Hostel_assignments::count();

        return response()->json([
            'message' => 'Dashboard statistics retrieved successfully',
            'data'    => [
                'total_students' => $totalStudents,
                'total_teachers' => $totalTeachers,
                'total_class' => $totalClass,
                'total_hotelroom' => $totalHostelRooms,
                'total_attendance' => $totalAttendance,
                'total_books' => $totalBooks,
                'total_category' => $totalBookCategories,
                'total_studentassignments' => $totalStudentAssignment,
            ]
        ], 200);
    }
    public function getDataForSchedult()
    {
        $teachers = Teachers::with('user')->get();
        $classes = ClassRoom::all();
        $subjects = Subjects::all();

        return response()->json([
            'message' => 'Success',
            'data' => [
                'teacher' => $teachers->map(function ($teacher) {
                    return [
                        'id_teacher'   => $teacher->id,
                        'name_teacher' => $teacher->user ? $teacher->user->name : null,
                    ];
                }),
                'class' => $classes->map(function ($cls) {
                    return [
                        'id_class'   => $cls->id,
                        'name_class' => 'Grade ' . $cls->grade . ' ' . $cls->section,
                    ];
                }),
                'subject' => $subjects->map(function ($sub) {
                    return [
                        'id_subject'   => $sub->id,
                        'name_subject' => $sub->subject_name,
                    ];
                }),
            ]
        ], 200);
    }
}
