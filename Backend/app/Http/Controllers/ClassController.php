<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Resources\Student\ClassRoomForm;
use App\Http\Resources\Student\ClassRoomResource;
use App\Models\Attendance;
use App\Models\ClassRoom;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class ClassController extends Controller
{
    public function getActiveClasses()
    {
        $activeclass = ClassRoom::all();
        return $this->success('class recive sucessfully', ClassRoomForm::collection($activeclass), 200);
    }
    public function showClassData($classId, Request $request)
    {
        $date = $request->input('date', now()->toDateString());
        $class = ClassRoom::with([
            'students.scores' => fn($q) => $q->where('class_id', $classId),
            'students.attendances' => fn($q) => $q->where('attendance_date', $date)
        ])->findOrFail($classId);

        return response()->json([
            'success' => true,
            'class' => $class
        ]);
    }
    public function updateAttendance(Request $request, $classId)
    {
        $request->validate([
            'attendance_date' => 'required|date',
            'attendances' => 'required|array',
            'attendances.*.student_id' => 'required|exists:students,id',
            'attendances.*.status' => 'nullable|in:P,A,PM',
            'attendances.*.reason' => 'nullable|string',
        ]);
        foreach ($request->attendances as $attData) {
            $existing = Attendance::where('class_id', $classId)
                ->where('student_id', $attData['student_id'])
                ->where('attendance_date', $request->attendance_date)
                ->first();

            // Prevent modifications if locked by administrator
            if ($existing && $existing->is_locked) {
                continue;
            }
            Attendance::updateOrCreate(
                [
                    'class_id' => $classId,
                    'student_id' => $attData['student_id'],
                    'attendance_date' => $request->attendance_date,
                ],
                [
                    'status' => $attData['status'] ?? null,
                    'reason' => $attData['reason'] ?? null,
                ]
            );
        }
        return response()->json([
            'success' => true,
            'message' => 'Attendance synchronized successfully!'
        ]);
    }
    public function index(Request $request)
    {
        $query = ClassRoom::query()
            ->with(['academicYear', 'teacher.user'])
            ->withCount([
                'students',
                'timeTables as subjects_count' => function ($q) {
                    $q->select(\DB::raw('count(distinct(subject_id))'));
                }
            ]);

        // Search Filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('section', 'like', "%{$search}%")
                    ->orWhere('grade', 'like', "%{$search}%")
                    ->orWhereHas('teacher.user', function ($t) use ($search) {
                        $t->where('name', 'like', "%{$search}%");
                    });
            });
        }

        if ($request->filled('grade') && $request->grade !== 'all') {
            $query->where('grade', $request->grade);
        }

        if ($request->filled('section') && $request->section !== 'all') {
            $query->where('section', $request->section);
        }

        if ($request->filled('class_id') && $request->class_id !== 'all') {
            $query->where('id', $request->class_id);
        }
        $classrooms = $query->paginate($request->get('per_page', 8));
        $grades = ClassRoom::whereNotNull('grade')->distinct()->pluck('grade');
        $sections = ClassRoom::whereNotNull('section')->distinct()->pluck('section');
        $classes = ClassRoom::select('id', 'grade', 'section')->get()->map(function ($c) {
            return [
                'id'   => $c->id,
                'name' => "Grade {$c->grade} - {$c->section}"
            ];
        });
        return ClassRoomResource::collection($classrooms)->additional([
            'grades'   => $grades,
            'sections' => $sections,
            'classes'  => $classes,
        ]);
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'academic_year_id' => 'required|exists:academic_years,id',
            'name'             => 'required|string|max:255',
            'grade'            => 'required|numeric',
            'section'          => 'required|string|max:50',
        ]);

        if ($validator->fails()) {
            return $this->error('Invalid data', $validator->errors(), 422);
        }

        try {
            $classroom = ClassRoom::create($validator->validated());
            $classroom->load('academicYear');

            return $this->success('Class created successfully!', new ClassRoomResource($classroom), 201);
        } catch (\Exception $e) {
            Log::error("ClassController@store: " . $e->getMessage());
            return $this->error('Something went wrong while creating the class', null, 500);
        }
    }
    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $classroom = ClassRoom::with([
            'academicYear',
            'teacher.user',
            'students',
            'timeTables.subject',
        ])
            ->withCount(['students', 'timeTables as subjects_count'])
            ->findOrFail($id);

        return new ClassRoomResource($classroom);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $class = ClassRoom::find($id);

            if (!$class) {
                return $this->error('Class not found!', null, 404);
            }

            $validator = Validator::make($request->all(), [
                'academic_year_id' => 'sometimes|required|exists:academic_years,id',
                'name'             => 'sometimes|required|string|max:255',
                'grade'            => 'sometimes|required|numeric',
                'section'          => 'sometimes|required|string|max:50',
            ]);

            if ($validator->fails()) {
                return $this->error('Invalid data', $validator->errors(), 422);
            }

            $class->update($validator->validated());
            $class->load('academicYear');

            return $this->success('Class updated successfully!', new ClassRoomResource($class), 200);
        } catch (\Exception $e) {
            Log::error("ClassController@update: " . $e->getMessage());
            return $this->error('Something went wrong while updating the class', null, 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $class = ClassRoom::find($id);

            if (!$class) {
                return $this->error('Class not found!', null, 404);
            }

            // Check for related records before deleting
            if ($class->students()->exists()) {
                return $this->error('Cannot delete class because it has active students assigned.', null, 400);
            }

            $class->delete();
            return $this->success('Class deleted successfully!', null, 200);
        } catch (\Exception $e) {
            Log::error("ClassController@destroy: " . $e->getMessage());
            return $this->error('Something went wrong while deleting the class', null, 500);
        }
    }
}
