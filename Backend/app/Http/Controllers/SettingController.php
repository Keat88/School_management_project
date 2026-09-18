<?php

namespace App\Http\Controllers;

use App\Models\SystemSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use PragmaRX\Google2FA\Google2FA;

class SettingController extends Controller
{
    // Fetch all settings for the admin panel or app header
    public function index()
    {
        $settings = SystemSetting::pluck('setting_value', 'setting_key');

        return response()->json([
            'status' => 'success',
            'settings' => $settings
        ], 200);
    }
    public function getInderUser()
    {
        // Fetch only the specific keys you need from the database
        $settings = SystemSetting::whereIn('setting_key', ['academicYear', 'schoolName'])
            ->pluck('setting_value', 'setting_key');

        return response()->json([
            'status' => 'success',
            'settings' => $settings
        ], 200);
    }
    public function update(Request $request)
    {
        // Extract the nested settings array from the request payload
        $settingsData = $request->input('settings', $request->all());

        foreach ($settingsData as $key => $value) {
            $storedValue = is_bool($value) ? ($value ? 'true' : 'false') : $value;

            SystemSetting::updateOrCreate(
                ['setting_key' => $key],
                ['setting_value' => $storedValue]
            );
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Settings updated successfully!'
        ], 200);
    }
    // Update Personal Profile Information
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'fullName' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user->name = $request->fullName;
        $user->email = $request->email;
        $user->phone = $request->phone;
        $user->address = $request->address;
        $user->save();

        return response()->json([
            'message' => 'Profile updated successfully!',
            'user' => $user
        ]);
    }

    // Update Password
    public function updatePassword(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $request->user()->update([
            'password' => Hash::make($request->password),
        ]);

        return response()->json(['message' => 'Password updated successfully']);
    }

    // Enable / Verify 2FA
    public function enable2fa(Request $request)
    {
        $user = $request->user();
        $google2fa = new Google2FA();

        $request->validate([
            'code' => 'required|digits:6',
            'secret' => 'required|string',
        ]);

        // Verify the 6-digit code against the secret key
        $valid = $google2fa->verifyKey($request->secret, $request->code);

        if (!$valid) {
            return response()->json([
                'message' => 'Invalid verification code. Please try again.'
            ], 422);
        }

        // Save secret and mark 2FA as enabled in your users table columns
        $user->google2fa_secret = encrypt($request->secret);
        $user->two_factor_enabled = 1;
        $user->save();

        return response()->json([
            'message' => 'Two-Factor Authentication enabled successfully!'
        ]);
    }

    // Disable 2FA
    public function disable2fa(Request $request)
    {
        $user = $request->user();

        $user->google2fa_secret = null;
        $user->two_factor_enabled = 0;
        $user->save();

        return response()->json([
            'message' => 'Two-Factor Authentication has been disabled.'
        ]);
    }
}
