<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Attendance;
use App\Models\BookCategory;
use App\Models\Books;
use App\Models\ClassRoom;
use App\Models\Course;
use App\Models\Hostel_assignments;
use App\Models\Hostel_rooms;
use App\Models\Notice;
use App\Models\Students;
use App\Models\Subjects;
use App\Models\Teachers;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class DashboardController extends Controller
{
    public function getRatePublic()
    {
        $stats = Cache::remember('public_rate_stats', 300, function () {
            return [
                'total_student' => Students::count(),
                'total_course' => Course::count(),
                'total_User' => User::count(),
                'total_teacher' => Teachers::count(),
            ];
        });

        return $this->success('received successfully', $stats, 200);
    }

    public function Adminsdashboard()
    {
        $startOfDay = now()->startOfDay();
        $endOfDay = now()->endOfDay();

   
        $totalRecordsToday = Attendance::whereBetween('date', [$startOfDay, $endOfDay])->count();
        $presentRecordsToday = Attendance::whereBetween('date', [$startOfDay, $endOfDay])->where('status', 'P')->count();

        $overallRate = $totalRecordsToday > 0
            ? round(($presentRecordsToday / $totalRecordsToday) * 100)
            : 0;

     
        $classes = ClassRoom::with(['attendances' => function ($query) use ($startOfDay, $endOfDay) {
            $query->whereBetween('date', [$startOfDay, $endOfDay]);
        }])->get();

        $byClass = $classes->map(function ($classRoom) {
            $totalClassAttendance = $classRoom->attendances->count();
            $presentClassAttendance = $classRoom->attendances->where('status', 'P')->count();

            $rate = $totalClassAttendance > 0
                ? round(($presentClassAttendance / $totalClassAttendance) * 100)
                : 0;

            return [
                'className' => $classRoom->grade ?? 'Unnamed Class',
                'rate' => $rate,
            ];
        });

        $notice = Notice::whereBetween('publish_date', [$startOfDay, $endOfDay])->get();

        $activityLog = ActivityLog::with(['user:id,name,email'])
            ->whereBetween('created_at', [$startOfDay, $endOfDay])
            ->latest()
            ->take(20)
            ->get();

        $stats = Cache::remember('admin_dashboard_stats', 300, function () {
            return [
                'total_students' => Students::count(),
                'total_teachers' => Teachers::count(),
                'total_class' => ClassRoom::count(),
                'total_hotelroom' => Hostel_rooms::count(),
                'total_attendance' => Attendance::count(),
                'total_books' => Books::count(),
                'total_book_category' => BookCategory::count(),
                'total_studentassignments' => Hostel_assignments::count(),
            ];
        });
        return response()->json([
            'message' => 'Dashboard statistics retrieved successfully',
            'data'    => array_merge($stats, [
                'overall_rate'  => $overallRate,
                'by_class'      => $byClass,
                'notices'       => $notice,
                'activity_logs' => $activityLog
            ])
        ], 200);
    }

    public function getDataForSchedult()
    {
        $teachers = Teachers::with('user:id,name')->select('id', 'user_id')->get();
        $classes = ClassRoom::select('id', 'grade', 'section')->get();
        $subjects = Subjects::select('id', 'subject_name')->get();

        return response()->json([
            'message' => 'Success',
            'data' => [
                'teacher' => $teachers->map(function ($teacher) {
                    return [
                        'id_teacher'   => $teacher->id,
                        'name_teacher' => optional($teacher->user)->name,
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

    public function getRecently()
    {
        $startOfDay = now()->startOfDay();
        $endOfDay = now()->endOfDay();
        $notice = Notice::whereBetween('publish_date', [$startOfDay, $endOfDay])->get();
        $activityLog = ActivityLog::with(['user:id,name,email'])
            ->whereBetween('created_at', [$startOfDay, $endOfDay])
            ->latest()
            ->take(20)
            ->get();

        return $this->success('recently have been received !', [
            'notices' => $notice,
            'activity_logs' => $activityLog
        ], 200);
    }
}
