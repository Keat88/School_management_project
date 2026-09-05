<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Parents;
use Illuminate\Http\Request;

class ParentController extends Controller
{
    public function searchParent(Request $request)
    {
        $query = Parents::with('students');
        if ($request->has('parent') && !empty($request->parent)) {
            $parentName = $request->parent;

            $query->where(function ($q) use ($parentName) {
                $q->where('mother_name', 'like', "%{$parentName}%")
                    ->orWhere('father_name', 'like', "%{$parentName}%");
            });
        }

        $parents = $query->orderBy('created_at', 'desc')->get();
        if ($parents->isEmpty()) {
            return response()->json([
                'message' => 'Parent not found!'
            ], 404);
        }

        return response()->json([
            'message' => 'Data received successfully',
            'data'    => $parents
        ], 200);
    }
}
