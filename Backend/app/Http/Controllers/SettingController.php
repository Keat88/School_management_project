<?php

namespace App\Http\Controllers;

use App\Models\SystemSetting;
use Illuminate\Http\Request;

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

    public function update(Request $request)
    {
        // Extract the nested settings array from the request payload
        $settingsData = $request->input('settings', $request->all());

        foreach ($settingsData as $key => $value) {
            // Convert boolean values to strings ('true'/'false') for uniform DB storage
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
}
