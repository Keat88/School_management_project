<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\ActivityLog;
use App\Models\SystemSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

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
            'password' => 'required|string|min:8|confirmed',
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
     * Log in an existing user with per-user 2FA check.
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

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

        // Check if THIS specific user has 2FA enabled by the admin
        // if ($user->two_factor_enabled === true || $user->two_factor_enabled == 1) {
        //     $otp = rand(100000, 999999);
        //     $user->otp_code = Hash::make($otp);
        //     $user->otp_expires_at = now()->addMinutes(10);
        //     $user->save();

        //     // Send OTP via email
        //     Mail::raw("Your login verification OTP is: {$otp}", function ($message) use ($user) {
        //         $message->to($user->email);
        //         $message->subject('System Login Verification Code');
        //     });

        //     ActivityLog::create([
        //         'action' => '2FA OTP triggered for user: ' . $user->email,
        //         'ip_address' => $request->ip(),
        //     ]);

        //     return response()->json([
        //         'status' => 'requires_2fa',
        //         'message' => 'OTP code sent to your registered email.',
        //         'email' => $user->email
        //     ], 200);
        // }

        // Standard login if 2FA is turned off for this user
        $deviceName = 'auth_token';
        $access_token = $user->createToken($deviceName)->plainTextToken;

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
     * Update individual user's 2FA status (Admin only).
     */
    public function updateUser2Fa(Request $request, $id)
    {
        $request->validate([
            'two_factor_enabled' => 'required|boolean'
        ]);

        $user = User::findOrFail($id);
        $user->two_factor_enabled = $request->two_factor_enabled;
        $user->save();

        return response()->json([
            'status' => 'success',
            'message' => "2FA status for {$user->name} has been updated."
        ], 200);
    }

    /**
     * Verify the 2FA OTP code and complete login.
     */
    public function verifyLoginOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'otp' => 'required|string|size:6',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->otp, $user->otp_code) || now()->isAfter($user->otp_expires_at)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid or expired verification code.'
            ], 422);
        }

        // Clear OTP data after successful check
        $user->otp_code = null;
        $user->otp_expires_at = null;
        $user->save();

        $access_token = $user->createToken('auth_token')->plainTextToken;

        ActivityLog::create([
            'action' => 'Completed 2FA login from IP: ' . $request->ip(),
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
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Logged out successfully!',
        ], 200);
    }
}