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
use Illuminate\Support\Facades\Cache; // កុំភ្លេចហدود Cache facade

class DashboardController extends Controller
{
    public function getRatePublic()
    {
        // ប្រើ Cache រយៈពេល ៥ នាទី (300 វិនាទី) ព្រោះទិន្នន័យទាំងនេះមិនបាច់ដូររាល់វិនាទីទេ
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
        // Cache ស្ថិតិ Dashboard រយៈពេល ៥ នាទី ដើម្បីកាត់បន្ថយការ Query ញឹកញាប់
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
            'data'    => $stats
        ], 200);
    }

    public function getDataForSchedult()
    {
        // ទាញយកតែ Column ណាដែលត្រូវការប្រើប្រាស់ (Select specific columns) ដើម្បីកាត់បន្ថយទំហំ Memory
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
        // ប្រើប្រាស់ Date Range (`whereBetween`) ជំនួញឱ្យ `whereDate` ដើម្បីឱ្យ Database អាចប្រើ Index បានលឿន
        $startOfDay = now()->startOfDay();
        $endOfDay = now()->endOfDay();

        $notice = Notice::whereBetween('publish_date', [$startOfDay, $endOfDay])->get();

        // កំណត់យកត្រឹម ២០ ចុងក្រោយ (take(20)) ដើម្បីការពារកុំឱ្យទាញយកទិន្នន័យច្រើនពេកបើ Activity Log ច្រើន
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