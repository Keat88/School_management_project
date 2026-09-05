<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Resulte;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ExamResulte extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
       $ExamResulte=DB::table('resultes')->get();
       return response()->json([
        'message'=> 'Student resulte have been access succesfully!'
       ],200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'exam_id' => 'required|exists:exams,id',
            'student_id' => 'required|exists:students,id',
            'marks_obtained' => 'required|numeric|min:0',
            'total_marks'    => 'required|numeric|min:1|gte:marks_obtained',
            'grade'          => 'nullable|string|max:5',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Invalid data',
                'errors' => $validator->errors()
            ], 422);
        }
        // $grade=null;
        // $mark=$request->marks_obtained;
        $examResult = Resulte::create([
            'exam_id'        => $request->exam_id,
            'student_id'     => $request->student_id,
            'marks_obtained' => $request->marks_obtained,
            'total_marks'    => $request->total_marks,
            'grade'          => $request->grade,
        ]);
        return response()->json([
            'message'     => 'Exam result created successfully!',
            'exam_result' => $examResult
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $resule = Resulte::find($id)->get();
        if (!$resule) {
            return response()->json([
                'message' => 'Student resulte not found!'
            ], 422);
        }
        return response()->json([
            'message' => 'Student resulte have been found',
            'results' => $resule
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $examResult = Resulte::find($id);
        if (!$examResult) {
            return response()->json([
                'message' => 'Exam result not found!'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'exam_id'        => 'sometimes|required|exists:exams,id',
            'student_id'     => 'sometimes|required|exists:students,id',
            'marks_obtained' => 'sometimes|required|numeric|min:0',
            'total_marks'    => 'sometimes|required|numeric|min:1',
            'grade'          => 'nullable|string|max:5',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Invalid data',
                'errors'  => $validator->errors()
            ], 422);
        }

        $examResult->update([
            'exam_id'        => $request->input('exam_id', $examResult->exam_id),
            'student_id'     => $request->input('student_id', $examResult->student_id),
            'marks_obtained' => $request->input('marks_obtained', $examResult->marks_obtained),
            'total_marks'    => $request->input('total_marks', $examResult->total_marks),
            'grade'          => $request->input('grade', $examResult->grade),
        ]);

        return response()->json([
            'message'     => 'Exam result updated successfully!',
            'exam_result' => $examResult
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $examResult = Resulte::find($id);
        if (!$examResult) {
            return response()->json([
                'message' => 'Exam result not found!'
            ], 404);
        }

        $examResult->delete();

        return response()->json([
            'message' => 'Exam result deleted successfully!'
        ], 200);
    }
}
