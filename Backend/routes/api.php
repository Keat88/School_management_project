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
    // 🔒 1. ADMIN ONLY ROUTES (ការិយាល័យរដ្ឋបាល/នាយកសាលា)
    // ==========================================
    Route::middleware('role:admin')->group(function () {

        Route::get('/form-schedult', [DashboardController::class, 'getDataForSchedult']);
        // គ្រប់គ្រងបុគ្គលិកសិក្សា / គ្រូបង្រៀន (Teacher Management)
        Route::prefix('teacher')->controller(TeacherController::class)->group(function () {
            Route::post('/store', 'store')->name('teacher.store');
            Route::get('/index', 'index')->name('teacher.index');
            Route::get('/show/{id}', 'show')->name('teacher.show');
            Route::put('/update/{id}', 'update')->name('teacher.update');
            Route::delete('/destroy/{id}', 'destroy')->name('teacher.destroy');
        });

        // គ្រប់គ្រងមុខវិជ្ជាសិក្សា (Subject Management)
        Route::prefix('academic-years')->controller(AcademicYearController::class)->group(function () {
            Route::get('/index', 'index')->name('academic-years.index');
            Route::post('/store', 'store')->name('academic-years.store');
            Route::put('/update/{id}', 'update')->name('academic-years.update');
            Route::get('/show/{id}', 'show')->name('academic-years.show');
            Route::delete('/destroy/{id}', 'destroy')->name('academic-years.destroy');
        });
        Route::prefix('subject')->controller(SubjectController::class)->group(function () {
            Route::post('/store', 'store')->name('subject.store');
            Route::get('/index', 'index')->name('subject.index');
            Route::get('/show/{id}', 'show')->name('subject.show');
            Route::put('/update/{id}', 'update')->name('subject.update');
            Route::delete('/destroy/{id}', 'destroy')->name('subject.destroy');
        });

        // គ្រប់គ្រងសេចក្តីជូនដំណឹងសាលា (School Notices & Dashboard)
        Route::prefix('notice')->controller(NoticeController::class)->group(function () {
            Route::post('/store', 'store')->name('notice.store');
            Route::get('/index', 'index')->name('notice.index');
            Route::get('/show/{id}', 'show')->name('notice.show');
            Route::match(['post', 'put'], '/notice/update/{id}')->name('notice.update');
            Route::delete('/destroy/{id}', 'destroy')->name('notice.destroy');
            Route::get('/dashboard', 'dashboard')->name('notice.dashboard');
        });


        // កាលវិភាគសិក្សា (Timetable)
        Route::prefix('timetable')->controller(Time_Table::class)->group(function () {
            Route::get('/index', 'index')->name('timetable.index');
            Route::post('/store', 'store')->name('timetable.store');
            Route::get('/show/{id}', 'show')->name('timetable.show');
            Route::put('/update/{id}', 'update')->name('timetable.update');
            Route::delete('/destroy/{id}', 'destroy')->name('timetable.destroy');
        });
        // ដោះសោរវត្តមានសិស្សដែលត្រូវបានបិទ (Unlock Attendance)
        Route::post('/unlockattendance/{id}', [UnBlockAttendance::class, 'unlockAttendance'])->name('unlockattendance');


        // Admin លុប ឬ Teacher កែសម្រួល
        Route::prefix('student')->controller(StudentController::class)->group(function () {
            Route::put('/update/{id}', 'update')->name('student.update');
            Route::delete('/destroy/{id}', 'destroy')->name('student.destroy');
        });

        // គ្រប់គ្រងអន្តេវាសិកដ្ឋាន/ហូស្តែលសាលា (Hostels, Rooms & Assignments)
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


    // ==========================================================
    // 👥 2. SHARED ROUTES (ADMIN & TEACHER អាចប្រើប្រាស់រួមគ្នាបាន)
    // ==========================================================
    Route::middleware('role:admin,teacher')->group(function () {

        Route::get('/dashboard', [TeacherController::class, 'dashboardSummary']);
        Route::get('/classes/{classId}/students', [TeacherController::class, 'getStudentsByClass']);

        // for accempt message from admin or employee
        Route::get('/{teacherId}/notice', [TeacherController::class, 'getTeacherNotices'])->name('teacher.notice');
        // ការគ្រប់គ្រងវត្តមានសិស្ស (Attendance)
        Route::prefix('attendance')->controller(AttendanceController::class)->group(function () {
            Route::get('/index', 'index')->name('attendance.index');
            Route::post('/store', 'store')->name('attendance.store');
            Route::get('/show/{id}', 'show')->name('attendance.show');
        });
        // ថ្នាក់រៀន (Classroom/Classes)
        Route::prefix('classroom')->controller(ClassController::class)->group(function () {
            Route::get('/index', 'index')->name('classroom.index');
            Route::post('/store', 'store')->name('classroom.store');
            Route::get('/show/{id}', 'show')->name('classroom.show');
        });

        // ព័ត៌មាន និងការគ្រប់គ្រងសិស្ស (Student Info)
        Route::prefix('student')->controller(StudentController::class)->group(function () {
            Route::get('/index', 'index')->name('student.index');
            Route::get('/show/{id}', 'show')->name('student.show');
            Route::post('/store', 'store')->name('student.store');
        });


        // ការគ្រប់គ្រងការប្រឡង (Exams Setup)
        Route::prefix('exams')->controller(ExamController::class)->group(function () {
            Route::get('/index', 'index')->name('exams.index');
            Route::post('/store', 'store')->name('exams.store');
            Route::get('/show/{id}', 'show')->name('exams.show');
            Route::put('/update/{id}', 'update')->name('exams.update');
            Route::delete('/destroy/{id}', 'destroy')->name('exams.destroy');
        });

        // លទ្ធផលពិន្ទុប្រឡងសិស្ស (Exam Results / Grading)
        Route::prefix('exam-resulte')->controller(ExamResulte::class)->group(function () {
            Route::get('/index', 'index')->name('exam-resulte.index');
            Route::post('/store', 'store')->name('exam-resulte.store');
            Route::put('/update/{id}', 'update')->name('exam-resulte.update');
            Route::get('/show/{id}', 'show')->name('exam-resulte.show');
            Route::delete('/destroy/{id}', 'destroy')->name('exam-resulte.destroy');
        });

        // ប្រព័ន្ធបណ្ណាល័យសាលា (Library, Book Categories, Books & Issuing)
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
            });
        });
    });
});
