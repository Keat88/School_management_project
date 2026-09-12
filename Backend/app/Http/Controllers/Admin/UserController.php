<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $users = User::with(['orders', 'enrollments'])->where('role','user')->latest()->paginate(10);

        return response()->json([
            'status' => 'success',
            'data' => $users,
        ]);
    }

    /**
     * Display a specific user's complete information.
     */
    public function show(User $user)
    {
        $user->load(['orders', 'enrollments.course']);

        return response()->json([
            'status' => 'success',
            'data' => $user,
        ]);
    }
}
