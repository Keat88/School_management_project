<?php

namespace App\Http\Controllers;

use App\Models\Enrollment;
use App\Models\Inrollments;
use Illuminate\Http\Request;

class EnrollmentsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Enrollment::with(['user', 'course', 'order']);

        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->has('course_id')) {
            $query->where('course_id', $request->course_id);
        }

        $inrollments = $query->paginate(10);

        return response()->json([
            'status' => 'success',
            'data' => $inrollments,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'course_id' => 'required|exists:courses,id',
            'order_id' => 'nullable|exists:orders,id',
            'progress_percentage' => 'sometimes|integer|min:0|max:100',
            'completed_at' => 'nullable|date',
        ]);

        $inrollment = Enrollment::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Enrollment created successfully',
            'data' => $inrollment->load(['user', 'course', 'order']),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Enrollment $inrollments)
    {
        $inrollments->load(['user', 'course', 'order']);

        return response()->json([
            'status' => 'success',
            'data' => $inrollments,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Enrollment $inrollments)
    {
        $validated = $request->validate([
            'user_id' => 'sometimes|exists:users,id',
            'course_id' => 'sometimes|exists:courses,id',
            'order_id' => 'nullable|exists:orders,id',
            'progress_percentage' => 'sometimes|integer|min:0|max:100',
            'completed_at' => 'nullable|date',
        ]);

        $inrollments->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Enrollment updated successfully',
            'data' => $inrollments->load(['user', 'course', 'order']),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Enrollment $inrollments)
    {
        $inrollments->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Enrollment deleted successfully',
        ]);
    }
}
