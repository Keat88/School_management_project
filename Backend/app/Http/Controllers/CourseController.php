<?php

namespace App\Http\Controllers;

use App\Http\Resources\Course\CourseResource;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class CourseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Course::with(['category', 'instructor']);

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        if ($request->has('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }
        $courses = $query->paginate(10);
        return response()->json([
            'status' => 'success',
            'data' => CourseResource::collection($courses),
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
            'thumbnail' => 'nullable', // Accepts either a file upload or string URL
            'category_id' => 'required|exists:course_categories,id',
            'instructor_id' => 'required|exists:users,id',
            'level' => 'sometimes|in:beginner,intermediate,advanced,all',
            'status' => 'sometimes|in:draft,published,archived',
            'duration' => 'nullable|string|max:100',
            'lessons_count' => 'nullable|integer|min:0',
            'requirements' => 'nullable|array',
            'what_you_will_learn' => 'nullable|array',
            'language' => 'nullable|string|max:50',
            'has_certificate' => 'boolean',
            'is_featured' => 'boolean',
        ]);

        // Handle local file upload or fallback to text URL string
        if ($request->hasFile('thumbnail')) {
            $path = $request->file('thumbnail')->store('courses', 'public');
            $validated['thumbnail'] = '/storage/' . $path;
        } else {
            $validated['thumbnail'] = $request->input('thumbnail');
        }
        $validated['slug'] = Str::slug($validated['title']);
        $course = Course::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Course created successfully',
            'data' => $course->load(['category', 'instructor']),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Course $course)
    {
        // Fixed: Use route model binding instead of .get() so it fetches the exact course with relations
        $course->load(['category', 'instructor']);

        return response()->json([
            'status' => 'success',
            'data' => new CourseResource($course),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Course $course)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0|lt:price',
            'thumbnail' => 'nullable', // Accepts either a file upload or string URL
            'category_id' => 'required|exists:course_categories,id',
            'instructor_id' => 'required|exists:users,id',
            'level' => 'sometimes|in:beginner,intermediate,advanced,all',
            'status' => 'sometimes|in:draft,published,archived',
            'duration' => 'nullable|string|max:100',
            'lessons_count' => 'nullable|integer|min:0',
            'requirements' => 'nullable|array',
            'what_you_will_learn' => 'nullable|array',
            'language' => 'nullable|string|max:50',
            'has_certificate' => 'boolean',
            'is_featured' => 'boolean',
        ]);

        // Handle file upload or keep existing thumbnail/URL
        if ($request->hasFile('thumbnail')) {
            $path = $request->file('thumbnail')->store('courses', 'public');
            $validated['thumbnail'] = '/storage/' . $path;
        } else {
            // If no new file is uploaded, retain the existing thumbnail value if not explicitly changed
            $validated['thumbnail'] = $request->input('thumbnail', $course->thumbnail);
        }

        if ($request->has('title') && $request->title !== $course->title) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        $course->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Course updated successfully',
            'data' => $course->load(['category', 'instructor']),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Course $course)
    {
        $course->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Course deleted successfully',
        ]);
    }
}
