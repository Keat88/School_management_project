<?php

namespace App\Http\Controllers;

use App\Models\Courses;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CoursesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Courses::with(['category', 'instructor']);

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $courses = $query->paginate(10);

        return response()->json([
            'status' => 'success',
            'data' => $courses,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0|lt:price',
            'thumbnail' => 'nullable|string|max:500',
            'category_id' => 'required|exists:course_categories,id',
            'instructor_id' => 'required|exists:users,id',
            'level' => 'sometimes|in:beginner,intermediate,advanced,all',
            'status' => 'sometimes|in:draft,published,archived',
        ]);

        $validated['slug'] = Str::slug($validated['title']);

        $course = Courses::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Course created successfully',
            'data' => $course->load(['category', 'instructor']),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Courses $courses)
    {
        $courses->load(['category', 'instructor', 'modules.lessons', 'reviews.user']);

        return response()->json([
            'status' => 'success',
            'data' => $courses,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Courses $courses)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0',
            'thumbnail' => 'nullable|string|max:500',
            'category_id' => 'required|exists:course_categories,id',
            'instructor_id' => 'required|exists:users,id',
            'level' => 'sometimes|in:beginner,intermediate,advanced,all',
            'status' => 'sometimes|in:draft,published,archived',
        ]);

        if ($request->has('title') && $request->title !== $courses->title) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        $courses->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Course updated successfully',
            'data' => $courses->load(['category', 'instructor']),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Courses $courses)
    {
        $courses->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Course deleted successfully',
        ]);
    }
}
