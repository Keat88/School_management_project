<?php

namespace App\Http\Controllers\TrancsacTion;

use App\Http\Controllers\Controller;
use App\Http\Resources\TimeTableResource;
use App\Models\TimeTables;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class Time_Table extends Controller
{
    public function dashboard(Request $request)
    {
        try {
            $total_tables = TimeTables::count();
            $query = TimeTables::query();
            if ($request->has('day') && !empty($request->day)) {
                $query->where('day', $request->day);
            }
            $total_by_day = $query->count();

            return $this->success('Dashboard data retrieved successfully', [
                'total_tables' => $total_tables,
                'total_by_day' => $total_by_day,
            ]);
        } catch (\Exception $e) {
            return $this->error('Something went wrong while retrieving dashboard data', $e->getMessage(), 500);
        }
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $cacheKey = 'timetables_' . md5(json_encode($request->all()));

            $time = Cache::remember($cacheKey, 60, function () use ($request) {
                $query = TimeTables::with('classRoom', 'subject','teacher');

                if ($request->has('class') && !empty($request->class)) {
                    $class = $request->class;
                    $query->whereHas('classRoom', function ($q) use ($class) {
                        $q->where('grade', 'like', "%{$class}%")
                            ->orWhere('section', 'like', "%{$class}%");
                    });
                }
                if ($request->has('day') && !empty($request->day)) {
                    $day = $request->day;
                    $query->where('day', 'like', "%{$day}%");
                }

                return $query->orderBy('created_at', 'desc')->get();
            });

            if ($time->isEmpty()) {
                return $this->success('Table not found', [], 404);
            }
            return $this->success('Timetable retrieved successfully', TimeTableResource::collection($time));
        } catch (\Exception $e) {
            return $this->error('Something went wrong while retrieving timetables', $e->getMessage(), 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'class_id'   => 'required|exists:class_rooms,id',
            'subject_id' => 'required|exists:subjects,id',
            'teacher_id' => 'required|exists:teachers,id',
            'day'        => 'required|string|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
            'start_time' => 'required|date_format:H:i',
            'end_time'   => 'required|date_format:H:i|after:start_time',
        ]);

        if ($validator->fails()) {
            return $this->error('Invalid data', $validator->errors(), 422);
        }

        try {
            $conflict = TimeTables::where('teacher_id', $request->teacher_id)
                ->where('day', $request->day)
                ->where(function ($query) use ($request) {
                    $query->whereBetween('start_time', [$request->start_time, $request->end_time])
                        ->orWhereBetween('end_time', [$request->start_time, $request->end_time])
                        ->orWhere(function ($q) use ($request) {
                            $q->where('start_time', '<=', $request->start_time)
                                ->where('end_time', '>=', $request->end_time);
                        });
                })->exists();

            if ($conflict) {
                return $this->error('This teacher already has a class scheduled at this time!', null, 422);
            }
            $response = DB::transaction(function () use ($request) {
                $timetable = TimeTables::create([
                    'class_id'   => $request->class_id,
                    'subject_id' => $request->subject_id,
                    'teacher_id' => $request->teacher_id,
                    'day'        => $request->day,
                    'start_time' => $request->start_time,
                    'end_time'   => $request->end_time,
                ]);

                Cache::flush();

                $timetable->load('classRoom', 'subject');

                return $this->success('Table create succesfully!', new TimeTableResource($timetable), 201);
            });

            return $response;
        } catch (\Exception $e) {
            return $this->error('Something went wrong while creating the timetable', $e->getMessage(), 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $timetable = TimeTables::with('classRoom', 'subject')->find($id);
            if (!$timetable) {
                return $this->error('Table not found', null, 404);
            }
            return $this->success('Table found', new TimeTableResource($timetable), 200);
        } catch (\Exception $e) {
            return $this->error('Something went wrong while fetching the timetable', $e->getMessage(), 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $timetable = TimeTables::find($id);
            if (!$timetable) {
                return $this->error('Table not found', null, 404);
            }

            $validator = Validator::make($request->all(), [
                'class_id'   => 'sometimes|required|exists:class_rooms,id',
                'subject_id' => 'sometimes|required|exists:subjects,id',
                'teacher_id' => 'sometimes|required|exists:teachers,id',
                'day'        => 'sometimes|required|string|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
                'start_time' => 'sometimes|required|date_format:H:i',
                'end_time'   => 'sometimes|required|date_format:H:i|after:start_time',
            ]);

            if ($validator->fails()) {
                return $this->error('Invalid data', $validator->errors(), 422);
            }

            $teacherId = $request->input('teacher_id', $timetable->teacher_id);
            $day       = $request->input('day', $timetable->day);
            $startTime = $request->input('start_time', $timetable->start_time);
            $endTime   = $request->input('end_time', $timetable->end_time);

            $conflict = TimeTables::where('id', '!=', $id)
                ->where('teacher_id', $teacherId)
                ->where('day', $day)
                ->where(function ($query) use ($startTime, $endTime) {
                    $query->whereBetween('start_time', [$startTime, $endTime])
                        ->orWhereBetween('end_time', [$startTime, $endTime])
                        ->orWhere(function ($q) use ($startTime, $endTime) {
                            $q->where('start_time', '<=', $startTime)
                                ->where('end_time', '>=', $endTime);
                        });
                })->exists();

            if ($conflict) {
                return $this->error('This teacher already has a class scheduled at this time!', null, 422);
            }

            $response = DB::transaction(function () use ($request, $timetable) {
                $timetable->update([
                    'class_id'   => $request->input('class_id', $timetable->class_id),
                    'subject_id' => $request->input('subject_id', $timetable->subject_id),
                    'teacher_id' => $request->input('teacher_id', $timetable->teacher_id),
                    'day'        => $request->input('day', $timetable->day),
                    'start_time' => $request->input('start_time', $timetable->start_time),
                    'end_time'   => $request->input('end_time', $timetable->end_time),
                ]);

                Cache::flush();

                $timetable->load('classRoom', 'subject');

                return $this->success('Table update successfully', new TimeTableResource($timetable));
            });

            return $response;
        } catch (\Exception $e) {
            return $this->error('Something went wrong while updating the timetable', $e->getMessage(), 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $timetable = TimeTables::find($id);

            if (!$timetable) {
                return $this->error('Table not found', null, 404);
            }

            $timetable->delete();

            Cache::flush();

            return $this->success('Table delete succesfully', null, 200);
        } catch (\Exception $e) {
            return $this->error('Something went wrong while deleting the timetable', $e->getMessage(), 500);
        }
    }
}
