<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Security Toggle Switches
    |--------------------------------------------------------------------------
    | នៅទីនេះអ្នកអាចកំណត់ បើក (true) ឬ បិទ (false) មុខងារការពារនីមួយៗ
    */
    'enable_rate_limiting' => env('SECURITY_RATE_LIMITING', true),
    'enable_encryption'    => env('SECURITY_ENCRYPTION', false),
    'enable_advanced_logs' => env('SECURITY_ADVANCED_LOGS', true),
];
