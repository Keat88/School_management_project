<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Resources\Student\StudentResource;
use App\Models\Parents;
use App\Models\Students;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class StudentController extends Controller
{

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $query = Students::with('parent', 'classRoom');

            if ($request->has('search') && !empty($request->search)) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('student_name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('roll_number', 'like', "%{$search}%");
                });
            }

            if ($request->has('gender') && !empty($request->gender)) {
                $query->where('gender', $request->gender);
            }

            if ($request->has('grade') && !empty($request->grade)) {
                $grade = $request->grade;
                $query->whereHas('classRoom', function ($q) use ($grade) {
                    $q->where('grade', 'like', "%{$grade}%");
                });
            }

            if ($request->has('section') && !empty($request->section)) {
                $section = $request->section;
                $query->whereHas('classRoom', function ($q) use ($section) {
                    $q->where('section', 'like', "%{$section}%");
                });
            }

            $perPage = $request->get('per_page', 10);
            $students = $query->orderBy('id', 'desc')->paginate($perPage);
            $studentsData = StudentResource::collection($students)->response()->getData(true);

            if ($students->isEmpty()) {
                return $this->success('No students found.', $studentsData, 200);
            }

            return $this->success('Students have been accessed successfully!', $studentsData);
        } catch (\Exception $e) {
            return $this->error('Something went wrong while retrieving students', $e->getMessage(), 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            // parent 
            'mother_name'   => 'required|string|max:255',
            'father_name'   => 'required|string|max:255',
            'parent_image'  => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'occupation'    => 'nullable|string|max:255',
            'parent_phone'  => 'required|string|max:20',
            'email_parent'  => 'nullable|email|unique:parents,email',

            // Students
            'class_id'      => 'nullable|exists:class_rooms,id',
            'address'       => 'required|string|max:500',
            'gender'        => 'required|string|in:male,female,other',
            'email_student' => 'required|email|unique:students,email',
            'student_image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'student_name'  => 'required|string|max:255',
            'date_of_birth' => 'required|date',
            'student_phone' => 'nullable|string|max:20',
        ]);

        if ($validator->fails()) {
            return $this->error('Invalid data', $validator->errors(), 422);
        }

        try {
            $response = DB::transaction(function () use ($request) {
                $studentImageName = null;
                if ($request->hasFile('student_image')) {
                    $studentImageName = $request->file('student_image')->store('student', 'public');
                }
                $parentImageName = null;
                if ($request->hasFile('parent_image')) {
                    $parentImageName = $request->file('parent_image')->store('student', 'public');
                }
                $parent = Parents::create([
                    'mother_name'  => $request->mother_name,
                    'father_name'  => $request->father_name,
                    'occupation'   => $request->occupation ?? null,
                    'parent_phone' => $request->parent_phone,
                    'parent_image' => $parentImageName,
                    'email'        => $request->email_parent ?? null,
                ]);

                // Auto-generate random unique roll number credential
                $rollNumber = $this->generateUniqueRollNumber();

                $student = Students::create([
                    'parent_id'     => $parent->id,
                    'class_id'      => $request->class_id,
                    'student_name'  => $request->student_name,
                    'email'         => $request->email_student,
                    'gender'        => $request->gender,
                    'address'       => $request->address,
                    'date_of_birth' => $request->date_of_birth,
                    'roll_number'   => $rollNumber,
                    'student_phone' => $request->student_phone ?? null,
                    'student_image' => $studentImageName
                ]);
                $student->load('parent', 'classRoom');

                return $this->success('Student add successfully', new StudentResource($student), 201);
            });

            return $response;
        } catch (\Exception $e) {
            return $this->error('Something went wrong while creating the student', $e->getMessage(), 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $student = Students::with('parent', 'classRoom')->find($id);

            if (!$student) {
                return $this->error('Student not found', null, 404);
            }

            return $this->success('student have been found', new StudentResource($student), 200);
        } catch (\Exception $e) {
            return $this->error('Something went wrong while fetching the student', $e->getMessage(), 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $student = Students::with('parent')->find($id);

            if (!$student) {
                return $this->error('Student not found', null, 404);
            }

            $validator = Validator::make($request->all(), [
                'mother_name'   => 'nullable|string|max:255',
                'father_name'   => 'nullable|string|max:255',
                'parent_image'  => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
                'occupation'    => 'nullable|string|max:255',
                'parent_phone'  => 'nullable|string|max:20',
                'address'       => 'nullable|string|max:500',
                'gender'        => 'nullable|string|in:male,female,other',
                'email_parent'  => 'nullable|email|unique:parents,email,' . $student->parent_id,
                'email_student' => 'nullable|email|unique:students,email,' . $student->id,
                'student_image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
                'student_name'  => 'nullable|string|max:255',
                'date_of_birth' => 'nullable|date',
                'student_phone' => 'nullable|string|max:20',
                'class_id'      => 'nullable|exists:class_rooms,id',
            ]);

            if ($validator->fails()) {
                return $this->error('Invalid data', $validator->errors(), 422);
            }

            DB::transaction(function () use ($request, $student) {
                // Update Parent Image
                $parentImageName = $student->parent->parent_image;
                if ($request->hasFile('parent_image')) {
                    if (!empty($student->parent->parent_image) && Storage::disk('public')->exists($student->parent->parent_image)) {
                        Storage::disk('public')->delete($student->parent->parent_image);
                    }
                    $parentImageName = $request->file('parent_image')->store('student', 'public');
                }

                $student->parent->update([
                    'mother_name'  => $request->mother_name ?? $student->parent->mother_name,
                    'father_name'  => $request->father_name ?? $student->parent->father_name,
                    'occupation'   => $request->occupation ?? $student->parent->occupation,
                    'parent_phone' => $request->parent_phone ?? $student->parent->parent_phone,
                    'parent_image' => $parentImageName,
                    'email'        => $request->email_parent ?? $student->parent->email,
                ]);

                // Update Student Image
                $studentImageName = $student->student_image;
                if ($request->hasFile('student_image')) {
                    if (!empty($student->student_image) && Storage::disk('public')->exists($student->student_image)) {
                        Storage::disk('public')->delete($student->student_image);
                    }
                    $studentImageName = $request->file('student_image')->store('student', 'public');
                }

                $student->update([
                    'class_id'      => $request->class_id ?? $student->class_id,
                    'student_name'  => $request->student_name ?? $student->student_name,
                    'gender'        => $request->gender ?? $student->gender,
                    'address'       => $request->address ?? $student->address,
                    'date_of_birth' => $request->date_of_birth ?? $student->date_of_birth,
                    'student_phone' => $request->student_phone ?? $student->student_phone,
                    'student_image' => $studentImageName,
                ]);
            });

            $student->load('parent', 'classRoom');
            return $this->success('Student updated successfully', new StudentResource($student), 200);
        } catch (\Exception $e) {
            return $this->error('Something went wrong while updating the student', $e->getMessage(), 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $student = Students::with('parent')->find($id);

            if (!$student) {
                return $this->error('Not found student', null, 404);
            }

            if (!empty($student->student_image) && Storage::disk('public')->exists($student->student_image)) {
                Storage::disk('public')->delete($student->student_image);
            }

            if ($student->parent && !empty($student->parent->parent_image) && Storage::disk('public')->exists($student->parent->parent_image)) {
                Storage::disk('public')->delete($student->parent->parent_image);
            }

            if ($student->parent) {
                $student->parent->delete();
            }

            $student->delete();
            return $this->success('student delete succesfully', null, 200);
        } catch (\Exception $e) {
            return $this->error('Something went wrong while deleting the student', $e->getMessage(), 500);
        }
    }

    /**
     * Helper to generate a random unique roll number credential
     */
    private function generateUniqueRollNumber(): string
    {
        do {
            // Generates a string like STU-8X2K9P
            $rollNumber = 'STU-' . strtoupper(Str::random(6));
        } while (Students::where('roll_number', $rollNumber)->exists());

        return $rollNumber;
    }
}