<?php

namespace App\Http\Controllers\Subject;

use App\Http\Controllers\Controller;
use App\Http\Resources\Subject\SubjectResource;
use App\Models\Subjects;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class SubjectController extends Controller
{
    public function index()
    {
        try {
            $subjects = Subjects::all();
            if ($subjects->isEmpty()) {
                return $this->success('Subject not found', [], 200);
            }
            return $this->success('Subject have been access successfully', SubjectResource::collection($subjects));
        } catch (\Exception $e) {
            return $this->error('Something went wrong while retrieving subjects', $e->getMessage(), 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'subject_name' => 'required|string|max:255',
            'code'         => 'required|unique:subjects,code',
            'image'        => 'nullable|image|mimes:jpeg,png,jpg|max:4096'
        ]);

        if ($validator->fails()) {
            return $this->error('Invalid data', $validator->errors(), 422);
        }

        try {
            $file = null;
            if ($request->hasFile('image')) {
                $file = $request->file('image')->store('subject', 'public');
            }
            $subject = Subjects::create([
                'subject_name' => $request->subject_name,
                'code'         => $request->code,
                'image'        => $file,
            ]);
            return $this->success('Subject created successfully', new SubjectResource($subject), 201);
        } catch (\Exception $e) {
            return $this->error('Something went wrong while creating the subject', $e->getMessage(), 500);
        }
    }

    public function show($id)
    {
        try {
            $subject = Subjects::find($id);
            if (!$subject) {
                return $this->error('Subject not found', null, 404);
            }
            return $this->success('Subject have been found', new SubjectResource($subject));
        } catch (\Exception $e) {
            return $this->error('Something went wrong while fetching the subject', $e->getMessage(), 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $subject = Subjects::find($id);
            if (!$subject) {
                return $this->error('Subject not found', null, 404);
            }

            $validator = Validator::make($request->all(), [
                'subject_name' => 'required|string|max:255',
                'code' => 'required|unique:subjects,code,' . $id,
                'image'        => 'nullable|image|mimes:jpeg,png,jpg|max:4096'
            ]);

            if ($validator->fails()) {
                return $this->error('Invalid data', $validator->errors(), 422);
            }

            $file = $subject->image;
            if ($request->hasFile('image')) {
                if (!empty($file) && Storage::disk('public')->exists($file)) {
                    Storage::disk('public')->delete($file);
                }
                $file = $request->file('image')->store('subject', 'public');
            }

            $subject->update([
                'subject_name' => $request->subject_name,
                'code'         => $request->code,
                'image'        => $file ?? null
            ]);

            return $this->success('Subject update successfully', new SubjectResource($subject), 200);
        } catch (\Exception $e) {
            return $this->error('Something went wrong while updating the subject', $e->getMessage(), 500);
        }
    }

    public function destroy($id)
    {
        try {
            $subject = Subjects::find($id);
            if (!$subject) {
                return $this->error('Subject not found', null, 404);
            }

            if (!empty($subject->image) && Storage::disk('public')->exists($subject->image)) {
                Storage::disk('public')->delete($subject->image);
            }

            $subject->delete();
            return $this->success('Subject delete succesfully', null, 200);
        } catch (\Exception $e) {
            return $this->error('Something went wrong while deleting the subject', $e->getMessage(), 500);
        }
    }
}
