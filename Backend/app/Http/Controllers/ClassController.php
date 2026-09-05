<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Resources\Student\ClassRoomResource;
use App\Models\ClassRoom;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ClassController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $perPage = $request->get('per_page', 10);
            $search = $request->get('search');
            $query = ClassRoom::with('academicYear');
            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('grade', 'like', "%{$search}%")
                        ->orWhere('section', 'like', "%{$search}%");
                });
            }
            $classes = $query->latest()->paginate($perPage);
            $data = ClassRoomResource::collection($classes)->response()->getData(true);
            return $this->success('Classes have been retrieved successfully!', $data);
        } catch (\Exception $e) {
            return $this->error('Something went wrong while retrieving classes', $e->getMessage(), 500);
        }
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
            'section'          => 'required|string',
        ]);

        if ($validator->fails()) {
            return $this->error('Invalid data', $validator->errors(), 422);
        }

        try {
            $classroom = ClassRoom::create([
                'academic_year_id' => $request->academic_year_id,
                'name'             => $request->name,
                'grade'            => $request->grade,
                'section'          => $request->section,
            ]);

            $classroom->load('academicYear');

            return $this->success('Class created successfully!', new ClassRoomResource($classroom), 201);
        } catch (\Exception $e) {
            return $this->error('Something went wrong while creating the class', $e->getMessage(), 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $class = ClassRoom::with(['academicYear', 'students.parent', 'students.classRoom'])->find($id);

            if (!$class) {
                return $this->error('Class not found!', null, 404);
            }

            return $this->success('Class has been found!', new ClassRoomResource($class));
        } catch (\Exception $e) {
            return $this->error('Something went wrong while fetching the class', $e->getMessage(), 500);
        }
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
                'section'          => 'sometimes|required|string',
            ]);

            if ($validator->fails()) {
                return $this->error('Invalid data', $validator->errors(), 422);
            }

            $class->update([
                'academic_year_id' => $request->input('academic_year_id', $class->academic_year_id),
                'name'             => $request->input('name', $class->name),
                'grade'            => $request->input('grade', $class->grade),
                'section'          => $request->input('section', $class->section),
            ]);

            $class->load('academicYear');

            return $this->success('Class updated successfully!', new ClassRoomResource($class), 200);
        } catch (\Exception $e) {
            return $this->error('Something went wrong while updating the class', $e->getMessage(), 500);
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

            $class->delete();

            return $this->success('Class deleted successfully!', null, 200);
        } catch (\Exception $e) {
            return $this->error('Something went wrong while deleting the class', $e->getMessage(), 500);
        }
    }
}
