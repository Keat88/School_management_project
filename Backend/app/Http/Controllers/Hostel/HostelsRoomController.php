<?php

namespace App\Http\Controllers\Hostel;

use App\Http\Controllers\Controller;
use App\Http\Resources\Hotel\HostelRoomResource;
use App\Models\Hostel_rooms;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class HostelsRoomController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $query = Hostel_rooms::with('hostel');

            if ($request->has('status') && !empty($request->status)) {
                $query->where('status', 'like', "%{$request->status}%");
            }

            if ($request->has('gender') && !empty($request->gender)) {
                $query->where('gender', 'like', "%{$request->gender}%");
            }

            if ($request->has('type') && !empty($request->type)) {
                $query->where('type', 'like', "%{$request->type}%");
            }

            if ($request->has('name') && !empty($request->name)) {
                $query->whereHas('hostel', function ($q) use ($request) {
                    $q->where('name', 'like', "%{$request->name}%");
                });
            }

            $rooms = $query->orderBy('id', 'desc')->get();

            if ($rooms->isEmpty()) {
                return $this->error('Rooms don\'t have data', null, 404);
            }

            return $this->success('Rooms retrieved successfully', HostelRoomResource::collection($rooms));
        } catch (\Exception $e) {
            return $this->error('Something went wrong while retrieving rooms', $e->getMessage(), 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'hostel_id'      => 'required|exists:hostels,id',
            'room_number'    => 'required|string|max:255',
            'block_name'     => 'nullable|string|max:255',
            'image'          => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'type'           => 'required|in:standard,deluxe,vip,ac,non-ac',
            'gender'         => 'required|in:male,female,others',
            'number_of_beds' => 'required|integer|min:1',
            'cost_per_bed'   => 'required|numeric|min:0',
            'status'         => 'required|in:available,full,maintenance',
        ]);

        if ($validator->fails()) {
            return $this->error('Invalid data', $validator->errors(), 422);
        }

        try {
            $file = null;
            if ($request->hasFile('image')) {
                $file = $request->file('image')->store('hostel', 'public');
            }

            $hostelroom = Hostel_rooms::create([
                'hostel_id'      => $request->hostel_id,
                'room_number'    => $request->room_number,
                'block_name'     => $request->block_name ?? null,
                'image'          => $file ?? null,
                'type'           => $request->type,
                'gender'         => $request->gender,
                'number_of_beds' => $request->number_of_beds,
                'cost_per_bed'   => $request->cost_per_bed,
                'status'         => $request->status,
            ]);

            $hostelroom->load('hostel');

            return $this->success('Room created successfully', new HostelRoomResource($hostelroom), 201);
        } catch (\Exception $e) {
            return $this->error('Something went wrong while creating the room', $e->getMessage(), 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $room = Hostel_rooms::with('hostel')->find($id);

            if (!$room) {
                return $this->error('Room not found', null, 404);
            }

            return $this->success('Room has been found', new HostelRoomResource($room));
        } catch (\Exception $e) {
            return $this->error('Something went wrong while fetching the room', $e->getMessage(), 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'hostel_id'      => 'required|exists:hostels,id',
            'room_number'    => 'required|string|max:255',
            'block_name'     => 'nullable|string|max:255',
            'image'          => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'type'           => 'required|in:standard,deluxe,vip,ac,non-ac',
            'gender'         => 'required|in:male,female,others',
            'number_of_beds' => 'required|integer|min:1',
            'cost_per_bed'   => 'required|numeric|min:0',
            'status'         => 'required|in:available,full,maintenance',
        ]);

        if ($validator->fails()) {
            return $this->error('Invalid data', $validator->errors(), 422);
        }

        try {
            $room = Hostel_rooms::find($id);

            if (!$room) {
                return $this->error('Room not found', null, 404);
            }

            $file = $room->image;
            if ($request->hasFile('image')) {
                if (!empty($room->image)) {
                    Storage::disk('public')->delete($room->image);
                }
                $file = $request->file('image')->store('hostel', 'public');
            }

            $room->update([
                'hostel_id'      => $request->hostel_id,
                'room_number'    => $request->room_number,
                'block_name'     => $request->block_name ?? null,
                'image'          => $file,
                'type'           => $request->type,
                'gender'         => $request->gender,
                'number_of_beds' => $request->number_of_beds,
                'cost_per_bed'   => $request->cost_per_bed,
                'status'         => $request->status,
            ]);

            $room->load('hostel');

            return $this->success('Room updated successfully', new HostelRoomResource($room), 200);
        } catch (\Exception $e) {
            return $this->error('Something went wrong while updating the room', $e->getMessage(), 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $room = Hostel_rooms::find($id);

            if (!$room) {
                return $this->error('Room not found', null, 404);
            }

            if (!empty($room->image)) {
                Storage::disk('public')->delete($room->image);
            }

            $room->delete();

            return $this->success('Room deleted successfully', null, 200);
        } catch (\Exception $e) {
            return $this->error('Something went wrong while deleting the room', $e->getMessage(), 500);
        }
    }
}
