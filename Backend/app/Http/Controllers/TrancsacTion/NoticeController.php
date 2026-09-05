<?php

namespace App\Http\Controllers\TrancsacTion;

use App\Http\Controllers\Controller;
use App\Http\Resources\NoticeResource;
use App\Models\Notice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class NoticeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $query = Notice::with('user');

            if ($request->filled('search')) {
                $search = $request->input('search');
                $query->where('title', 'like', "%{$search}%");
            }
            if ($request->filled('publish_date')) {
                $publish_date = $request->input('publish_date');
                $query->where('publish_date', 'like', "%{$publish_date}%");
            }
            if ($request->filled('teacher_name')) {
                $teacher_name = $request->input('teacher_name');
                $query->whereHas('user', function ($teacher) use ($teacher_name) {
                    $teacher->where('name', 'like', "%{$teacher_name}%");
                });
            }
            $announcements = $query->orderBy('created_at', 'desc')->get();

            if ($announcements->isEmpty()) {
                return $this->error('No announcements found!', null, 404);
            }

            return $this->success('Announcements retrieved successfully!', NoticeResource::collection($announcements));
        } catch (\Exception $e) {
            return $this->error('Something went wrong while retrieving announcements', $e->getMessage(), 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id'         => 'required|exists:users,id',
            'title'           => 'required|string|max:255',
            'content'         => 'required|string',
            'target_audience' => 'required|in:all,all_teachers,single_teacher,single_class',
            'target_id'       => 'required_if:target_audience,single_teacher,single_class|nullable|integer',
            'publish_date'    => 'required|date',
            'attachment'      => 'nullable|mimes:pdf,jpeg,png,jpg|max:2048',
        ]);

        if ($validator->fails()) {
            return $this->error('Invalid data', $validator->errors(), 422);
        }

        try {
            $filePath = null;
            if ($request->hasFile('attachment')) {
                $filePath = $request->file('attachment')->store('announcements', 'public');
            }

            $targetAudience = $request->target_audience;
            $targetId = in_array($targetAudience, ['single_teacher', 'single_class']) ? $request->target_id : null;

            $announcement = Notice::create([
                'user_id'         => $request->user_id,
                'title'           => $request->title,
                'content'         => $request->content,
                'target_audience' => $targetAudience,
                'target_id'       => $targetId,
                'publish_date'    => $request->publish_date,
                'attachment'      => $filePath,
            ]);

            $announcement->load('user');

            return $this->success('Announcement created successfully!', new NoticeResource($announcement), 201);
        } catch (\Exception $e) {
            return $this->error('Something went wrong while creating the announcement', $e->getMessage(), 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $announcement = Notice::with('user')->find($id);

            if (!$announcement) {
                return $this->error('Notice not found!', null, 404);
            }

            return $this->success('Notice found!', new NoticeResource($announcement), 200);
        } catch (\Exception $e) {
            return $this->error('Something went wrong while fetching the notice', $e->getMessage(), 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $announcement = Notice::find($id);

            if (!$announcement) {
                return $this->error('Notice not found!', null, 404);
            }

            $validator = Validator::make($request->all(), [
                'user_id'         => 'sometimes|required|exists:users,id',
                'title'           => 'sometimes|required|string|max:255',
                'content'         => 'sometimes|required|string',
                'target_audience' => 'sometimes|required|in:all,all_teachers,single_teacher,single_class',
                'target_id'       => 'required_if:target_audience,single_teacher,single_class|nullable|integer',
                'publish_date'    => 'sometimes|required|date',
                'attachment'      => 'nullable|mimes:pdf,jpeg,png,jpg|max:2048',
            ]);

            if ($validator->fails()) {
                return $this->error('Invalid data', $validator->errors(), 422);
            }

            $filePath = $announcement->attachment;
            if ($request->hasFile('attachment')) {
                if (!empty($announcement->attachment) && Storage::disk('public')->exists($announcement->attachment)) {
                    Storage::disk('public')->delete($announcement->attachment);
                }
                $filePath = $request->file('attachment')->store('announcements', 'public');
            }

            $targetAudience = $request->input('target_audience', $announcement->target_audience);
            $targetId = in_array($targetAudience, ['single_teacher', 'single_class'])
                ? $request->input('target_id', $announcement->target_id)
                : null;

            $announcement->update([
                'user_id'         => $request->input('user_id', $announcement->user_id),
                'title'           => $request->input('title', $announcement->title),
                'content'         => $request->input('content', $announcement->content),
                'target_audience' => $targetAudience,
                'target_id'       => $targetId,
                'publish_date'    => $request->input('publish_date', $announcement->publish_date),
                'attachment'      => $filePath,
            ]);

            $announcement->load('user');

            return $this->success('Announcement updated successfully!', new NoticeResource($announcement), 200);
        } catch (\Exception $e) {
            return $this->error('Something went wrong while updating the announcement', $e->getMessage(), 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $announcement = Notice::find($id);

            if (!$announcement) {
                return $this->error('Notice not found!', null, 404);
            }

            if (!empty($announcement->attachment) && Storage::disk('public')->exists($announcement->attachment)) {
                Storage::disk('public')->delete($announcement->attachment);
            }

            $announcement->delete();

            return $this->success('Notice deleted successfully!', null, 200);
        } catch (\Exception $e) {
            return $this->error('Something went wrong while deleting the notice', $e->getMessage(), 500);
        }
    }
}
