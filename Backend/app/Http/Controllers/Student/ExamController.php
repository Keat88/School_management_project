<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Exams;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ExamController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $exams = Exams::orderBy('id', 'desc')->get();
        return response()->json([
            'message' => 'Exam have been acess sucessfully!',
            'exams' => $exams
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'subject_id' => 'required|exists:subjects,id',
            'class_id'   => 'required|exists:class_rooms,id',
            'exam_name'  => 'required|string|max:255',
            'exam_date'  => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Invalid data',
                'errors'  => $validator->errors()
            ], 422);
        }

        $exam = Exams::create([
            'subject_id' => $request->subject_id,
            'class_id'   => $request->class_id,
            'exam_name'  => $request->exam_name,
            'exam_date'  => $request->exam_date,
        ]);

        return response()->json([
            'message' => 'Exam created successfully!',
            'exam'    => $exam
        ], 201);
    }
    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $exam = Exams::find($id)->get();
        if (!$exam) {
            return response()->json([
                'message' => 'Exam not found!'
            ], 422);
        }
        return response()->json([
            'message' => 'Exam have been access',
            'results' => $exam
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $exam = Exams::find($id);
        if (!$exam) {
            return response()->json([
                'message' => 'Exam not found!'
            ], 404); 
        }

        $validator = Validator::make(
            $request->all(),
            [
                'subject_id' => 'sometimes|required|exists:subjects,id',
                'class_id'   => 'sometimes|required|exists:class_rooms,id',
                'exam_name'  => 'sometimes|required|string|max:255',
                'exam_date'  => 'sometimes|required|date',
            ]
        );

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Invalid data',
                'errors'  => $validator->errors()
            ], 422);
        }


        $exam->update([
            'subject_id' => $request->input('subject_id', $exam->subject_id),
            'class_id'   => $request->input('class_id', $exam->class_id),
            'exam_name'  => $request->input('exam_name', $exam->exam_name),
            'exam_date'  => $request->input('exam_date', $exam->exam_date),
        ]);

        return response()->json([
            'message' => 'Exam data update successfully!',
            'exam'    => $exam
        ], 200);
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $exam = Exams::find($id)->get();
        if (!$exam) {
            return response()->json([
                'message' => 'Exam not found!'
            ], 422);
        }
        $exam->delete();
        return response()->json([
            'message' => 'Exam have delete succesfully!',
        ], 200);
    }
}
