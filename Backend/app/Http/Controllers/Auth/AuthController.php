<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
     * Register a new user account.
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|min:2|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed', // requires password_confirmation field in frontend
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);
        $deviceName = 'auth_token';
        $access_token = $user->createToken($deviceName)->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'Account registered successfully!',
            'token' => $access_token,
            'role' => $user->role,
            'user' => $user
        ], 201);
    }

    /**
     * Log in an existing user.
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        // Attempt authentication
        if (!Auth::attempt($credentials)) {
            ActivityLog::create([
                'action' => 'Failed login attempt with email: ' . $request->email,
                'ip_address' => $request->ip(),
            ]);
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid email or password combination.',
            ], 401);
        }

        $user = Auth::user();
        $deviceName = 'auth_token';
        $access_token = $user->createToken($deviceName)->plainTextToken;

        // Log login activity into activity_logs table
        ActivityLog::create([
            'action' => 'Logged into the system from IP: ' . $request->ip(),
            'ip_address' => $request->ip(),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Login successful!',
            'token' => $access_token,
            'user' => $user
        ], 200);
    }

    /**
     * Log out the current user and delete their active token.
     */
    public function logout(Request $request)
    {
        $user = $request->user();

        // if ($user) {
        //     // Log logout activity into activity_logs table
        //     ActivityLog::create([
        //         'action' => 'Logged out of the system',
        //         'ip_address' => $request->ip(),
        //     ]);

        // // Delete only the current token being used
        $request->user()->currentAccessToken()->delete();
        // }

        return response()->json([
            'status' => 'success',
            'message' => 'Logged out successfully!',
        ], 200);
    }
}
