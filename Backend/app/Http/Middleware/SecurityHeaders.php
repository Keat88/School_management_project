<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // 🛡️ ហាមមិនឱ្យគេយកវេបសាយយើងទៅដាក់ក្នុង iframe របស់វេបសាយផ្សេង (ការពារ Clickjacking)
        $response->headers->set('X-Frame-Options', 'DENY');

        // 🛡️ ការពារ Browser ពីការស្មានប្រភេទ File (MIME-type sniffing)
        $response->headers->set('X-Content-Type-Options', 'nosniff');

        // 🛡️ បើកកម្រិតការពារ XSS សម្រាប់ Browser ចាស់ៗ
        $response->headers->set('X-XSS-Protection', '1; mode=block');

        // 🛡️ បង្ខំឱ្យ Browser ប្រើប្រាស់តែ HTTPS យ៉ាងហោចណាស់ ១ឆ្នាំ (HSTS)
        $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

        // 🛡️ ការពារការបញ្ជូនទិន្នន័យ URL ទៅកាន់វេបសាយផ្សេង
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');

        // 🛡️ បិទការប្រើប្រាស់ Camera, Microphone, និង Geolocation តាមរយៈ Browser មិនឱ្យគេប្រើផ្តេសផ្តាស
        $response->headers->set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

        return $response;
    }
}