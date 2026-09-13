<?php

namespace App\Http\Controllers;

use App\Models\CourseModule;
use Illuminate\Http\Request;

class CoursesModulesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = CourseModule::with(['course', 'lessons']);     
        if ($request->has('course_id')) {
            $query->where('course_id', $request->course_id);
        }
        $modules = $query->orderBy('sort_order')->get();

        return response()->json([
            'status' => 'success',
            'data' => $modules,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'course_id' => 'required|exists:courses,id',
            'title' => 'required|string|max:255',
            'sort_order' => 'sometimes|integer|min:0',
        ]);

        $module = CourseModule::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Course module created successfully',
            'data' => $module->load('lessons'),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(CourseModule $coursesModules)
    {
        $coursesModules->load(['course', 'lessons']);

        return response()->json([
            'status' => 'success',
            'data' => $coursesModules,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, CourseModule $coursesModules)
    {
        $validated = $request->validate([
            'course_id' => 'sometimes|exists:courses,id',
            'title' => 'sometimes|string|max:255',
            'sort_order' => 'sometimes|integer|min:0',
        ]);

        $coursesModules->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Course module updated successfully',
            'data' => $coursesModules->load('lessons'),
        ]);
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CourseModule $coursesModules)
    {
        $coursesModules->delete();
        return response()->json([
            'status' => 'success',
            'message' => 'Course module deleted successfully',
        ]);
    }
}
