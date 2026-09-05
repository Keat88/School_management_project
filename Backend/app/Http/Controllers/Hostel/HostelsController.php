<?php

namespace App\Http\Controllers\Hostel;

use App\Http\Controllers\Controller;
use App\Http\Resources\Hotel\HostelResource;
use App\Models\Hostels;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class HostelsController extends Controller
{
    public function index()
    {
        try {
            $hostels = Hostels::orderBy('id', 'desc')->get();

            if ($hostels->isEmpty()) {
                return $this->error('Hostels don\'t have data', null, 404);
            }

            return $this->success('Hostels retrieved successfully', HostelResource::collection($hostels));
        } catch (\Exception $e) {
            return $this->error('Something went wrong when retrieving hostels', $e->getMessage(), 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'    => 'required|string|max:255',
            'type'    => 'required|in:male,female,others',
            'address' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return $this->error('Invalid data', $validator->errors(), 422);
        }

        try {
            $hostel = Hostels::create([
                'name'    => $request->name,
                'type'    => $request->type,
                'address' => $request->address ?? null
            ]);

            return $this->success('Hostel created successfully', new HostelResource($hostel), 201);
        } catch (\Exception $e) {
            return $this->error('Something went wrong while creating hostel', $e->getMessage(), 500);
        }
    }

    public function show(string $id)
    {
        try {
            $hostel = Hostels::find($id);

            if (!$hostel) {
                return $this->error('Hostel not found', null, 404);
            }

            return $this->success('Hostel has been found', new HostelResource($hostel), 200);
        } catch (\Exception $e) {
            return $this->error('Something went wrong while fetching the hostel', $e->getMessage(), 500);
        }
    }

    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'name'    => 'sometimes|required|string|max:255',
            'type'    => 'sometimes|required|in:male,female,others',
            'address' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return $this->error('Invalid data', $validator->errors(), 422);
        }

        try {
            $hostel = Hostels::find($id);

            if (!$hostel) {
                return $this->error('Hostel not found', null, 404);
            }

            $hostel->update([
                'name'    => $request->name ?? $hostel->name,
                'type'    => $request->type ?? $hostel->type,
                'address' => $request->address ?? $hostel->address
            ]);

            return $this->success('Hostel updated successfully', new HostelResource($hostel), 200);
        } catch (\Exception $e) {
            return $this->error('Something went wrong while updating the hostel', $e->getMessage(), 500);
        }
    }

    public function destroy(string $id)
    {
        try {
            $hostel = Hostels::find($id);

            if (!$hostel) {
                return $this->error('Hostel not found', null, 404);
            }

            $hostel->delete();

            return $this->success('Hostel deleted successfully', null, 200);
        } catch (\Exception $e) {
            return $this->error('Something went wrong while deleting the hostel', $e->getMessage(), 500);
        }
    }
}