<?php

namespace App\Http\Controllers;

use App\Models\Lessons;
use Illuminate\Http\Request;

class LessonsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Lessons::with(['module', 'course']);

        if ($request->has('module_id')) {
            $query->where('module_id', $request->module_id);
        }

        if ($request->has('course_id')) {
            $query->where('course_id', $request->course_id);
        }

        $lessons = $query->orderBy('sort_order')->get();

        return response()->json([
            'status' => 'success',
            'data' => $lessons,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'module_id' => 'required|exists:course_modules,id',
            'course_id' => 'required|exists:courses,id',
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'video_url' => 'nullable|string|max:500',
            'duration' => 'nullable|integer|min:0',
            'is_free_preview' => 'sometimes|boolean',
            'sort_order' => 'sometimes|integer|min:0',
        ]);

        $lesson = Lessons::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Lesson created successfully',
            'data' => $lesson->load(['module', 'course']),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Lessons $lessons)
    {
        $lessons->load(['module', 'course']);

        return response()->json([
            'status' => 'success',
            'data' => $lessons,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Lessons $lessons)
    {
        $validated = $request->validate([
            'module_id' => 'sometimes|exists:course_modules,id',
            'course_id' => 'sometimes|exists:courses,id',
            'title' => 'sometimes|string|max:255',
            'content' => 'nullable|string',
            'video_url' => 'nullable|string|max:500',
            'duration' => 'nullable|integer|min:0',
            'is_free_preview' => 'sometimes|boolean',
            'sort_order' => 'sometimes|integer|min:0',
        ]);

        $lessons->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Lesson updated successfully',
            'data' => $lessons->load(['module', 'course']),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Lessons $lessons)
    {
        $lessons->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Lesson deleted successfully',
        ]);
    }
}