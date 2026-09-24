<?php

namespace App\Http\Controllers;

use App\Http\Resources\NoticeResource;
use App\Http\Resources\ScoresResource;
use App\Http\Resources\TeacherClassRoomResource;
use App\Http\Resources\TeacherResource;
use App\Models\Attendance;
use App\Models\ClassRoom;
use App\Models\Notice;
use App\Models\Scores;
use App\Models\Teachers;
use App\Models\TimeTables;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class TeacherController extends Controller
{
    public function teacherClassScore(Request $request, $id)
    {
        try {
            $user = $request->user();
            $teacher = $user->teacher;

            if (!$teacher) {
                return response()->json([
                    'status' => false,
                    'message' => 'Teacher profile not found for this user.'
                ], 404);
            }

            // 1. Find classroom and eager load students, scores, attendances, and timetables for this teacher
            $classroom = ClassRoom::with([
                'students.scores' => fn($q) => $q->where('class_id', $id),
                'students.attendances' => fn($q) => $q->where('date', now()->toDateString()),
                'timeTables' => fn($q) => $q->where('teacher_id', $teacher->id)
            ])
                ->where('id', $id)
                ->first();

            // 2. Check if classroom exists
            if (!$classroom) {
                return response()->json([
                    'status' => false,
                    'message' => 'Classroom ID does not exist in database.'
                ], 404);
            }

            // 3. Security check: Ensure this teacher is assigned to this class via timetables
            if ($classroom->timeTables->isEmpty()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Permission mismatch! You are not assigned to teach this class.',
                    'logged_in_teacher_id' => $teacher->id
                ], 403);
            }
            return response()->json([
                'status' => 'success',
                'data' => new ScoresResource($classroom)
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Something went wrong while retrieving class data',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function teacherSetting(Request $request)
    {
        try {
            $user = $request->user();
            $teacherProfile = $user->teacher;

            if (!$teacherProfile) {
                return $this->error('Teacher profile not found for this user', null, 404);
            }

            return $this->success('Teacher settings retrieved successfully', [
                'user' => $user,
            ]);
        } catch (\Exception $e) {
            return $this->error('Something went wrong while retrieving teacher settings', $e->getMessage(), 500);
        }
    }
    public function dashboardSummary(Request $request)
    {
        try {
            $user = $request->user();
            $teacherProfile = $user->teacher;

            if (!$teacherProfile) {
                return $this->error('Teacher profile not found for this user', null, 404);
            }

            $classIds = $teacherProfile->timeTables()->pluck('class_id')->unique();

            $classes = ClassRoom::whereIn('id', $classIds)
                ->withCount('students')
                ->get();
            $totalAttendance = Attendance::whereIn('class_id', $classIds)->count();

            $presentCount = Attendance::whereIn('class_id', $classIds)
                ->where('status', 'P')
                ->count();

            $attendanceRate = $totalAttendance > 0
                ? round(($presentCount / $totalAttendance) * 100, 1) . '%'
                : '0%';
            $schedules = $teacherProfile->timeTables()
                ->with(['classRoom', 'subject'])
                ->get()
                ->map(function ($schedule) {
                    $subjectName = $schedule->subject ? $schedule->subject->subject_name : '';
                    $grade = $schedule->classRoom->grade ?? '';
                    $section = $schedule->classRoom->section ?? '';
                    $classNameText = "Grade {$grade} - {$section}" . ($subjectName ? " ({$subjectName})" : "");

                    return [
                        'id' => $schedule->id,
                        'time' => date('h:i A', strtotime($schedule->start_time)) . ' - ' . date('h:i A', strtotime($schedule->end_time)),
                        'className' => $classNameText,
                        'room' => $schedule->room ?? 'Lab 1',
                        'status' => 'Upcoming',
                    ];
                });

            return $this->success('Teacher dashboard summary retrieved successfully', [
                'stats' => [
                    'totalClasses' => $classes->count(),
                    'totalStudents' => $classes->sum('students_count'),
                    'attendanceRate' => $attendanceRate,
                    'pendingGrades' => 0,
                ],
                'todaySchedule' => $schedules,
                'teacher_name' => $user->name,
            ]);
        } catch (\Exception $e) {
            return $this->error('Something went wrong while retrieving dashboard summary', $e->getMessage(), 500);
        }
    }

    public function getStudentsByClass(Request $request)
    {
        try {
            $user = $request->user();
            $teacher = $user->teacher;
            if (!$teacher) {
                return response()->json([
                    'status' => false,
                    'message' => 'Teacher profile not found for this user.'
                ], 404);
            }
            $classes = TimeTables::where('teacher_id', $teacher->id)
                ->with(['classRoom', 'subject', 'teacher']) // ទំនាក់ទំនងបើមាន
                ->get();
            return response()->json([
                'success' => true,
                'data' => TeacherClassRoomResource::collection($classes)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Something went wrong while retrieving class data',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function updateOrCreateScores(Request $request, $classId)
    {
        try {
            $teacher = $request->user()->teacher;

            // Verify the class exists and belongs to this teacher via timeTables
            $class = ClassRoom::where('id', $classId)
                ->whereHas('timeTables', function ($q) use ($teacher) {
                    $q->where('teacher_id', $teacher->id);
                })
                ->firstOrFail();

            $request->validate([
                'students' => 'required|array',
                'students.*.id' => 'required|exists:students,id',
                'students.*.attendanceScore' => 'nullable|numeric',
                'students.*.activityScore' => 'nullable|numeric',
                'students.*.examScore' => 'nullable|numeric',
            ]);

            DB::transaction(function () use ($request, $classId) {
                foreach ($request->students as $studentData) {
                    Scores::updateOrCreate(
                        [
                            'class_id'   => $classId,
                            'student_id' => $studentData['id'],
                        ],
                        [
                            'attendance_score' => $studentData['attendanceScore'] ?? 0,
                            'activity_score'   => $studentData['activityScore'] ?? 0,
                            'exam_score'       => $studentData['examScore'] ?? 0,
                        ]
                    );
                }
            });

            return response()->json([
                'status' => true,
                'message' => 'Scores saved successfully!'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to save scores',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getTeacherNotices(Request $request)
    {
        try {
            $user = $request->user();
            $teacher = $user->teacher;
            if (!$teacher) {
                return $this->error('Teacher profile not found for this user', null, 404);
            }

            $teacherId = $teacher->user_id;
            $notices = Notice::with(['user.teacher'])
                ->where(function ($query) use ($teacherId) {
                    $query->where('target_audience', 'all')
                        ->orWhere('target_audience', 'all_teachers')
                        ->orWhere(function ($q) use ($teacherId) {
                            $q->where('target_audience', 'single_teacher')
                                ->where('target_id', $teacherId);
                        });
                })
                ->orderBy('publish_date', 'desc')
                ->get();

            if ($notices->isEmpty()) {
                return $this->error('No notices found for this teacher', null, 404);
            }
            $formattedNotices = $notices->map(function ($notice) {
                return [
                    'id' => $notice->id,
                    'teacherName' => $notice->user->name ?? 'Unknown Teacher',
                    'subject' => $notice->subject ?? 'General',
                    'reportTitle' => $notice->title ?? $notice->report_title,
                    'type' => $notice->type ?? $notice->target_audience,
                    'submittedDate' => optional($notice->publish_date)->format('Y-m-d') ?? $notice->created_at->format('Y-m-d'),
                    'status' => $notice->status ?? 'Pending',
                    'content' => $notice->content,
                ];
            });
            return $this->success('Teacher notices retrieved successfully', $formattedNotices);
        } catch (\Exception $e) {
            return $this->error('Something went wrong while retrieving teacher notices', $e->getMessage(), 500);
        }
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $query = User::where('role', 'teacher')->with('teacher');
            if ($request->has('search') && !empty($request->search)) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhereHas('teacher', function ($teacherQuery) use ($search) {
                            $teacherQuery->where('teacher_code', 'like', "%{$search}%");
                        })
                        ->orWhereHas('teacher', function ($teacherQuery) use ($search) {
                            $teacherQuery->where('gender', 'like', "%{$search}%");
                        });
                });
            }
            if ($request->filled('gender') && $request->input('gender') !== 'all' && $request->input('gender') !== '') {
                $gender = $request->input('gender');
                $query->whereHas('teacher', function ($q) use ($gender) {
                    $q->where('gender', $gender);
                });
            }
            $perPage = $request->get('per_page', 10);
            $teachers = $query->orderBy('created_at', 'desc')->paginate($perPage);
            $teacher = TeacherResource::collection($teachers)->response()->getData(true);
            if ($teachers->isEmpty()) {
                return $this->success('No teachers found', [], 200);
            }
            return $this->success('Teacher have been accessed succesfully!', $teacher, 200);
        } catch (\Exception $e) {
            return $this->error('Something went wrong while retrieving teachers', $e->getMessage(), 500);
        }
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'          => 'required|string|max:255',
            'email'         => 'required|string|email|unique:users,email',
            'password'      => 'required|string|min:8',
            'qualification' => 'required|string|max:255',
            'phone'         => 'required|string|max:20',
            'gender'        => 'nullable|string|max:20',
            'profile_image' => 'nullable|image|mimes:jpeg,png,jpg|max:4096'
        ]);
        if ($validator->fails()) {
            return $this->error('Invalid data', $validator->errors(), 422);
        }
        try {
            $user = DB::transaction(function () use ($request) {
                $image_name = null;
                if ($request->hasFile('profile_image')) {
                    $image_name = $request->file('profile_image')->store('teacher', 'public');
                }

                // Auto-generate unique random teacher_code
                do {
                    $teacher_code = 'TCH-' . mt_rand(100000, 999999);
                } while (Teachers::where('teacher_code', $teacher_code)->exists());

                $user = User::create([
                    'name'     => $request->name,
                    'email'    => $request->email,
                    'password' => Hash::make($request->password),
                    'role'     => 'teacher',
                ]);

                Teachers::create([
                    'user_id'       => $user->id,
                    'teacher_code'  => $teacher_code,
                    'qualification' => $request->qualification,
                    'phone'         => $request->phone,
                    'gender'        => $request->gender,
                    'profile_image' => $image_name
                ]);

                return $user;
            });
            $user->load('teacher');
            return $this->success('Teacher added successfully!', new TeacherResource($user), 201);
        } catch (\Exception $e) {
            return $this->error('Something went wrong while storing the teacher', $e->getMessage(), 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $teacher = User::where('role', 'teacher')->with('teacher')->find($id);

            if (!$teacher) {
                return $this->error('Teacher not found!', null, 404);
            }

            return $this->success('Teacher found!', new TeacherResource($teacher));
        } catch (\Exception $e) {
            return $this->error('Something went wrong while fetching the teacher', $e->getMessage(), 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $image_name = null;
            $teacherUser = User::where('role', 'teacher')->with('teacher')->find($id);

            if (!$teacherUser) {
                return $this->error('Teacher not found!', null, 404);
            }
            $validator = Validator::make($request->all(), [
                'name'          => 'nullable|string|max:255',
                'email'         => 'nullable|string|email|unique:users,email,' . $id,
                'password'      => 'nullable|string|min:8',
                'teacher_code'  => 'nullable|string|unique:teachers,teacher_code,' . optional($teacherUser->teacher)->id,
                'qualification' => 'nullable|string|max:255',
                'phone'         => 'nullable|string|max:20',
                'gender'        => 'nullable|string|max:20',
                'profile_image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048'
            ]);
            if ($validator->fails()) {
                return $this->error('Invalid data', $validator->errors(), 422);
            }

            if ($request->hasFile('profile_image')) {
                if ($teacherUser->teacher && $teacherUser->teacher->profile_image) {
                    Storage::disk('public')->delete($teacherUser->teacher->profile_image);
                }
                $image_name = $request->file('profile_image')->store('teacher', 'public');
            }

            // Update User table fields
            $teacherUser->update([
                'name'     => $request->name ? $request->name : $teacherUser->name,
                'email'    => $request->email ? $request->email : $teacherUser->email,
                'password' => $request->password ? Hash::make($request->password) : $teacherUser->password,
            ]);

            // Update or Create Teacher table fields
            $teacherData = [
                'teacher_code'  => $request->teacher_code ? $request->teacher_code : optional($teacherUser->teacher)->teacher_code,
                'qualification' => $request->qualification ? $request->qualification : optional($teacherUser->teacher)->qualification,
                'phone'         => $request->phone ? $request->phone : optional($teacherUser->teacher)->phone,
                'gender'        => $request->gender ? $request->gender : optional($teacherUser->teacher)->gender,
                'profile_image' => $request->hasFile('profile_image') ? $image_name : optional($teacherUser->teacher)->profile_image
            ];
            if ($teacherUser->teacher) {
                $teacherUser->teacher->update($teacherData);
            } else {
                $teacherData['user_id'] = $teacherUser->id;
                Teachers::create($teacherData);
            }
            $teacherUser->load('teacher');

            return $this->success('Teacher updated successfully', new TeacherResource($teacherUser), 200);
        } catch (\Exception $e) {
            return $this->error('Something went wrong while updating the teacher', $e->getMessage(), 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $teacher = User::where('role', 'teacher')->with('teacher')->find($id);

            if (!$teacher) {
                return $this->error('Teacher not found!', null, 404);
            }

            if ($teacher->teacher && $teacher->teacher->profile_image) {
                Storage::disk('public')->delete($teacher->teacher->profile_image);
            }

            $teacher->delete();

            return $this->success('Teacher deleted successfully', null, 200);
        } catch (\Exception $e) {
            return $this->error('Something went wrong while deleting the teacher', $e->getMessage(), 500);
        }
    }
}
