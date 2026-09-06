<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;

class SocialController extends Controller
{
    // 1. Send user data to Google or GitHub Login Page
    public function redirect($provider)
    {
        $redirectUrl = "http://localhost:8000/api/auth/{$provider}/callback";

        $driver = Socialite::driver($provider)
            ->stateless()
            ->redirectUrl($redirectUrl);
        if ($provider === 'google') {
            $driver->with(['prompt' => 'select_account']);
        } elseif ($provider === 'github') {
            $driver->with(['prompt' => 'login']);
        }

        return $driver->redirect();
    }
    // 2. Accept data from Google or GitHub after Login
    public function handleCallback($provider)
    {
        try {
            $redirectUrl = "http://localhost:8000/api/auth/{$provider}/callback";

            $socialUser = Socialite::driver($provider)
                ->stateless()
                ->redirectUrl($redirectUrl)
                ->user();
            $email = $socialUser->getEmail();
            // Fallback for GitHub users who keep their email private
            if (!$email && $provider === 'github') {
                $email = $socialUser->getId() . '@github.local';
            }
            $providerIdField = $provider . '_id';
            $user = User::where('email', $email)->first();
            if (!$user) {
                $user = User::create([
                    'name' => $socialUser->getName() ?? $socialUser->getNickname() ?? 'User',
                    'email' => $email,
                    $providerIdField => $socialUser->getId(),
                    'avatar' => $socialUser->getAvatar(),
                    'password' => null,
                ]);
            } else {
                $user->update([
                    $providerIdField => $socialUser->getId(),
                    'avatar' => $socialUser->getAvatar() ?? $user->avatar,
                ]);
            }
            $token = $user->createToken('authToken')->plainTextToken;
            $avatarUrl = urlencode($socialUser->getAvatar() ?? '');

            return redirect("http://localhost:5173/login-success?token={$token}&avatar={$avatarUrl}");
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ], 500);
        }
    }
}
