<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{

    public function index(Request $request)
    {
        $query = User::where('role','user');

        // Search by name or email
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Filter by role (admin, teacher, user)
        if ($request->filled('role') && $request->input('role') !== 'All') {
            $query->where('role', $request->input('role'));
        }

        // Paginate results (default 10 items per page)
        $users = $query->orderBy('created_at', 'desc')->paginate(10);

        return response()->json($users);
    }
    // Get a single user's details for editing
    public function show($id)
    {
        $user = User::findOrFail($id);
        return response()->json($user);
    }

    // Create a new user account
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|in:admin,teacher,user',
        ]);

        $validated['password'] = bcrypt($validated['password']);
        $user = User::create($validated);

        return response()->json([
            'message' => 'User created successfully.',
            'user' => $user
        ], 201);
    }

    // Update an existing user
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $id,
            'role' => 'required|in:admin,teacher,user',
            'password' => 'nullable|string|min:8',
        ]);

        if (!empty($validated['password'])) {
            $validated['password'] = bcrypt($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        return response()->json([
            'message' => 'User updated successfully.',
            'user' => $user
        ]);
    }

    // Delete a user account
    public function destroy($id)
    {
        $user = User::findOrFail($id);

        // Prevent deleting your own account
        if (auth()->id() === $user->id) {
            return response()->json(['message' => 'You cannot delete your own account.'], 403);
        }

        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully.'
        ]);
    }
}
