<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\PasswordOtp;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class OtpPasswordResetController extends Controller
{
    public function sendOtp(Request $request)
    {
        $request->validate(['email' => 'required|email|exists:users,email']);
        $otp = rand(100000, 999999);
        PasswordOtp::updateOrCreate(
            ['email' => $request->email],
            ['otp' => $otp, 'created_at' => Carbon::now()]
        );
        Mail::raw("Your password reset OTP is: {$otp}", function ($message) use ($request) {
            $message->to($request->email);
            $message->subject('Your Password Reset OTP');
        });
        return response()->json(['message' => 'OTP sent successfully to your email.'],201);
    }

    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'otp' => 'required|numeric',
        ]);
        $otpRecord = PasswordOtp::where('email', $request->email)
            ->where('otp', $request->otp)
            ->first();

        if (!$otpRecord || $otpRecord->created_at->addMinutes(10)->isPast()) {
            return response()->json(['message' => 'Invalid or expired OTP.'], 422);
        }

        return response()->json(['message' => 'OTP verified successfully.'],200);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'otp' => 'required|numeric',
            'password' => 'required|min:8|confirmed',
        ]);
        $otpRecord = PasswordOtp::where('email', $request->email)
            ->where('otp', $request->otp)
            ->first();
        if (!$otpRecord || $otpRecord->created_at->addMinutes(10)->isPast()) {
            return response()->json(['message' => 'Invalid or expired OTP.'], 422);
        }

        $user = User::where('email', $request->email)->first();
        $user->password = Hash::make($request->password);
        $user->save();
        $otpRecord->delete();
        return response()->json(['message' => 'Password successfully reset!']);
    }
}
