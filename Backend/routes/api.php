<?php

use App\Http\Controllers\AcademicYearController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UnBlockAttendance;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\OtpPasswordResetController;
use App\Http\Controllers\Auth\SocialController;
use App\Http\Controllers\ClassController;
use App\Http\Controllers\Hostel\HostelAssignmentsController;
use App\Http\Controllers\Hostel\HostelsController;
use App\Http\Controllers\Hostel\HostelsRoomController;
use App\Http\Controllers\Library\BookCategoryController;
use App\Http\Controllers\Library\BookController;
use App\Http\Controllers\Library\BookIssureController;
use App\Http\Controllers\Library\LibraryController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\Student\ExamController;
use App\Http\Controllers\Student\ExamResulte;
use App\Http\Controllers\Student\StudentController;
use App\Http\Controllers\Subject\SubjectController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\TrancsacTion\NoticeController;
use App\Http\Controllers\TrancsacTion\Time_Table;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// ── Auth & Public Routes ──
Route::get('auth/google/redirect', [SocialController::class, 'redirect'])->defaults('provider', 'google');
Route::get('auth/google/callback', [SocialController::class, 'handleCallback'])->defaults('provider', 'google');
Route::get('auth/github/redirect', [SocialController::class, 'redirect'])->defaults('provider', 'github');
Route::get('auth/github/callback', [SocialController::class, 'handleCallback'])->defaults('provider', 'github');
Route::post('/forgot-password-senotp', [OtpPasswordResetController::class, 'sendOtp']);
Route::post('/forgot-password-verify', [OtpPasswordResetController::class, 'verifyOtp']);
Route::post('/reset-password-reset', [OtpPasswordResetController::class, 'resetPassword']);
Route::post('/register', [AuthController::class, 'register'])->name('register');
Route::middleware('throttle:login-limiter')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
});

// ── Protected Routes (Sanctum Authenticated) ──
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::get('/logout', [AuthController::class, 'logout'])->name('logout');

    // ==========================================
    // 🔒 1. ADMIN ONLY ROUTES
    // ==========================================
    Route::middleware('role:admin')->group(function () {
        Route::get('/admin-dashboard', [DashboardController::class, 'Adminsdashboard'])->name('admin-dashboard');
        Route::get('/get-recently', [DashboardController::class, 'getRecently'])->name('admin-get-recenytly');
        Route::get('/form-schedult', [DashboardController::class, 'getDataForSchedult'])->name('form-schedult');
        Route::get('/reports', [ReportController::class, 'index'])->name('admin-reports');
        Route::get('/reports/export-excel', [ReportController::class, 'exportExcel'])->name('admin-reports-exportexcel');
        // Teacher Management
        Route::prefix('teacher')->controller(TeacherController::class)->group(function () {
            Route::post('/store', 'store')->name('teacher.store');
            Route::get('/index', 'index')->name('teacher.index');
            Route::get('/show/{id}', 'show')->name('teacher.show');
            Route::put('/update/{id}', 'update')->name('teacher.update');
            Route::delete('/destroy/{id}', 'destroy')->name('teacher.destroy');
        });
        Route::prefix('payments')->controller(PaymentController::class)->group(function () {
            Route::get('/index', 'index')->name('payments.index');
            Route::post('/store', 'store')->name('payments.store');
            Route::put('/update/{id}', 'update')->name('payments.update');
            Route::get('/show/{id}', 'show')->name('payments.show');
            Route::delete('/destroy/{id}', 'destroy')->name('payments.destroy');
        });
        // Academic Years Management
        Route::prefix('academic-years')->controller(AcademicYearController::class)->group(function () {
            Route::get('/index', 'index')->name('academic-years.index');
            Route::post('/store', 'store')->name('academic-years.store');
            Route::put('/update/{id}', 'update')->name('academic-years.update');
            Route::get('/show/{id}', 'show')->name('academic-years.show');
            Route::delete('/destroy/{id}', 'destroy')->name('academic-years.destroy');
        });
        // Subject Management
        Route::prefix('subject')->controller(SubjectController::class)->group(function () {
            Route::post('/store', 'store')->name('subject.store');
            Route::get('/index', 'index')->name('subject.index');
            Route::get('/show/{id}', 'show')->name('subject.show');
            Route::put('/update/{id}', 'update')->name('subject.update');
            Route::delete('/destroy/{id}', 'destroy')->name('subject.destroy');
        });

        // School Notices Management
        Route::prefix('notice')->controller(NoticeController::class)->group(function () {
            Route::post('/store', 'store')->name('notice.store');
            Route::get('/index', 'index')->name('notice.index');
            Route::get('/show/{id}', 'show')->name('notice.show');
            Route::match(['post', 'put'], '/notice/update/{id}', 'update')->name('notice.update');
            Route::delete('/destroy/{id}', 'destroy')->name('notice.destroy');
            Route::get('/dashboard', 'dashboard')->name('notice.dashboard');
        });
        // System Settings
        Route::get('/settings', [SettingController::class, 'index']);
        Route::post('/settings', [SettingController::class, 'update']);
        // Timetable Management
        Route::prefix('timetable')->controller(Time_Table::class)->group(function () {
            Route::get('/index', 'index')->name('timetable.index');
            Route::post('/store', 'store')->name('timetable.store');
            Route::get('/show/{id}', 'show')->name('timetable.show');
            Route::put('/update/{id}', 'update')->name('timetable.update');
            Route::delete('/destroy/{id}', 'destroy')->name('timetable.destroy');
            Route::post('/auto-generate',  'autoGenerate')->name('timetable.autoGenerate');
        });

        // Student Admin Modifications
        Route::prefix('student')->controller(StudentController::class)->group(function () {
            Route::put('/update/{id}', 'update')->name('student.update');
            Route::delete('/destroy/{id}', 'destroy')->name('student.destroy');
        });

        // Classroom Management
        Route::prefix('classroom')->controller(ClassController::class)->group(function () {
            Route::get('/index', 'index')->name('classroom.index');
            Route::post('/store', 'store')->name('classroom.store');
            Route::put('/update/{id}', 'update')->name('classroom.update');
            Route::get('/show/{id}', 'show')->name('classroom.show');
            Route::delete('/destroy/{id}', 'destroy')->name('classroom.destroy');
        });

        // Hostels Management
        Route::prefix('hostels')->group(function () {
            Route::prefix('hostel')->controller(HostelsController::class)->group(function () {
                Route::get('/index', 'index')->name('hostel.index');
                Route::post('/store', 'store')->name('hostel.store');
                Route::get('/show/{id}', 'show')->name('hostel.show');
                Route::put('/update/{id}', 'update')->name('hostel.update');
                Route::delete('/destroy/{id}', 'destroy')->name('hostel.destroy');
            });

            Route::prefix('hostel-room')->controller(HostelsRoomController::class)->group(function () {
                Route::get('/index', 'index')->name('hostel-room.index');
                Route::post('/store', 'store')->name('hostel-room.store');
                Route::get('/show/{id}', 'show')->name('hostel-room.show');
                Route::put('/update/{id}', 'update')->name('hostel-room.update');
                Route::delete('/destroy/{id}', 'destroy')->name('hostel-room.destroy');
            });

            Route::prefix('hostel-assignment')->controller(HostelAssignmentsController::class)->group(function () {
                Route::get('/index', 'index')->name('hostel-assignment.index');
                Route::post('/store', 'store')->name('hostel-assignment.store');
                Route::put('/update/{id}', 'update')->name('hostel-assignment.update');
                Route::delete('/destroy/{id}', 'destroy')->name('hostel-assignment.destroy');
                Route::get('/show/{id}', 'show')->name('hostel-assignment.show');
            });
        });
    });

    // ==========================================
    // 🛠️ 2. ADMIN & STAFF ROUTES (Operational Control)
    // ==========================================
    Route::middleware('role:admin,staff')->group(function () {
        Route::post('/unlockattendance/{id}', [UnBlockAttendance::class, 'unlockAttendance'])->name('unlockattendance');
    });

    // ==========================================
    // 👥 3. SHARED ROUTES (ADMIN, TEACHER, & STAFF)
    // ==========================================
    Route::middleware('role:admin,teacher,staff')->group(function () {
        Route::get('/classes/{classId}', [ClassController::class, 'showClassData']);
        Route::post('/classes/{classId}/attendance', [ClassController::class, 'updateAttendance']);
        Route::post('/classes/{classId}/scores', [ClassController::class, 'updateOrCreateScores']);

        Route::get('/dashboard', [TeacherController::class, 'dashboardSummary']);
        Route::get('/classes/{classId}/students', [TeacherController::class, 'getStudentsByClass']);
        Route::get('/{teacherId}/notice', [TeacherController::class, 'getTeacherNotices'])->name('teacher.notice');

        // Attendance Tracking
        Route::prefix('attendance')->controller(AttendanceController::class)->group(function () {
            Route::get('/index', 'index')->name('attendance.index');
            Route::post('/store', 'store')->name('attendance.store');
            Route::get('/show/{id}', 'show')->name('attendance.show');
        });

        // Student Info
        Route::prefix('student')->controller(StudentController::class)->group(function () {
            Route::get('/index', 'index')->name('student.index');
            Route::get('/show/{id}', 'show')->name('student.show');
            Route::post('/store', 'store')->name('student.store');
        });

        // Exam Management
        Route::prefix('exams')->controller(ExamController::class)->group(function () {
            Route::get('/index', 'index')->name('exams.index');
            Route::post('/store', 'store')->name('exams.store');
            Route::get('/show/{id}', 'show')->name('exams.show');
            Route::put('/update/{id}', 'update')->name('exams.update');
            Route::delete('/destroy/{id}', 'destroy')->name('exams.destroy');
        });

        // Exam Results / Grading
        Route::prefix('exam-resulte')->controller(ExamResulte::class)->group(function () {
            Route::get('/index', 'index')->name('exam-resulte.index');
            Route::post('/store', 'store')->name('exam-resulte.store');
            Route::put('/update/{id}', 'update')->name('exam-resulte.update');
            Route::get('/show/{id}', 'show')->name('exam-resulte.show');
            Route::delete('/destroy/{id}', 'destroy')->name('exam-resulte.destroy');
        });

        // Library System
        Route::prefix('library')->group(function () {
            Route::get('/index', [LibraryController::class, 'index'])->name('library.index');

            Route::prefix('bookcategory')->controller(BookCategoryController::class)->group(function () {
                Route::get('/index', 'index')->name('bookcategory.index');
                Route::post('/store', 'store')->name('bookcategory.store');
                Route::get('/show/{bookCategory}', 'show')->name('bookcategory.show');
                Route::put('/update/{bookCategory}', 'update')->name('bookcategory.update');
                Route::delete('/destroy/{bookCategory}', 'destroy')->name('bookcategory.destroy');
            });

            Route::prefix('books')->controller(BookController::class)->group(function () {
                Route::get('/index', 'index')->name('books.index');
                Route::get('/show/{id}', 'show')->name('books.show');
                Route::post('/store', 'store')->name('books.store');
                Route::put('/update/{id}', 'update')->name('books.update');
                Route::delete('/destroy/{id}', 'destroy')->name('books.destroy');
            });

            Route::prefix('book-issure')->controller(BookIssureController::class)->group(function () {
                Route::get('/index', 'index')->name('book-issure.index');
                Route::post('/store', 'store')->name('book-issure.store');
                Route::get('/show/{id}', 'show')->name('book-issure.show');
                Route::put('/update/{id}', 'update')->name('book-issure.update');
                Route::delete('/destroy/{id}', 'destroy')->name('book-issure.destroy');
                Route::put('/returnBook/{id}', 'returnBook')->name('book-issure.returnBook');
                Route::get('/student-stats', [BookIssureController::class, 'getStudentStats']);
            });
        });
    });
});
