<?php

namespace App\Http\Controllers;

use App\Models\Academic_years;
use Illuminate\Http\Request;

class AcademicYearController extends Controller
{
    /**
     * Display a listing of academic years.
     */
    public function index()
    {
        $academicYears = Academic_years::orderBy('start_date', 'desc')->get();
        
        return response()->json([
            'message' => 'Academic years retrieved successfully!',
            'data'    => $academicYears
        ], 200);
    }

    /**
     * Store a newly created academic year.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'       => 'required|string|max:255', 
            'start_date' => 'required|date',
            'end_date'   => 'required|date|after:start_date',
            'is_current' => 'nullable|boolean',
        ]);

        if (!empty($validated['is_current'])) {
            Academic_years::where('is_current', true)->update(['is_current' => false]);
        }

        $academicYear = Academic_years::create([
            'name'       => $validated['name'],
            'start_date' => $validated['start_date'],
            'end_date'   => $validated['end_date'],
            'is_current' => $validated['is_current'] ?? false,
        ]);

        return response()->json([
            'message' => 'Academic year created successfully!',
            'data'    => $academicYear
        ], 201);
    }

    /**
     * Display the specified academic year.
     */
    public function show(string $id)
    {
        $academicYear = Academic_years::find($id);

        if (!$academicYear) {
            return response()->json(['message' => 'Academic year not found!'], 404);
        }

        return response()->json([
            'message' => 'Academic year retrieved successfully!',
            'data'    => $academicYear
        ], 200);
    }

    /**
     * Update the specified academic year.
     */
    public function update(Request $request, string $id)
    {
        $academicYear = Academic_years::find($id);

        if (!$academicYear) {
            return response()->json(['message' => 'Academic year not found!'], 404);
        }

        $validated = $request->validate([
            'name'       => 'sometimes|required|string|max:255',
            'start_date' => 'sometimes|required|date',
            'end_date'   => 'sometimes|required|date|after:start_date',
            'is_current' => 'nullable|boolean',
        ]);

        if (!empty($validated['is_current'])) {
            Academic_years::where('is_current', true)->update(['is_current' => false]);
        }

        $academicYear->update([
            'name'       => $validated['name'] ?? $academicYear->name,
            'start_date' => $validated['start_date'] ?? $academicYear->start_date,
            'end_date'   => $validated['end_date'] ?? $academicYear->end_date,
            'is_current' => array_key_exists('is_current', $validated) ? $validated['is_current'] : $academicYear->is_current,
        ]);

        return response()->json([
            'message' => 'Academic year updated successfully!',
            'data'    => $academicYear
        ], 200);
    }

    /**
     * Remove the specified academic year.
     */
    public function destroy(string $id)
    {
        $academicYear = Academic_years::find($id);

        if (!$academicYear) {
            return response()->json(['message' => 'Academic year not found!'], 404);
        }

        $academicYear->delete();

        return response()->json([
            'message' => 'Academic year deleted successfully!'
        ], 200);
    }
}