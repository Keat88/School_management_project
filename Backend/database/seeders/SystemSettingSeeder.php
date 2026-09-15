<?php

namespace Database\Seeders;

use App\Models\SystemSetting;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SystemSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {    
        $defaults = [
            'schoolName' => 'My School Management System',
            'academicYear' => '2026-2027',
            'emailAlerts' => 'true',
            'smsGateway' => 'false',
            'twoFactorAuth' => 'false', // Default to false so existing users aren't locked out immediately
            'sessionTimeout' => '30',   // 30 minutes inactivity timeout
            'gradingScale' => 'percentage',
            'libraryMaxBooks' => '5',
        ];

        foreach ($defaults as $key => $value) {
            SystemSetting::firstOrCreate(
                ['setting_key' => $key],
                ['setting_value' => $value]
            );
        }
    }
}
