<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Notifications\EmailNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Mail\Message;

class ResetPasswordController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function sendResetLink(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $status = Password::sendResetLink(
            $request->only('email'),
            function (User $user, $token) {
                $resetData = [
                    'subject' => 'Reset Password',
                    'message' => 'You have requested to reset your password. Click the following link to reset it...',
                    'link' => env('FRONTEND_URL') . '/reset-password/' . $user->email . '/' . $token,
                ];
                $user->notify(new EmailNotification($resetData));
            }
        );

        return $status === Password::RESET_LINK_SENT
            ? response(['message' => 'Reset link sent to your email'], 200)
            : response(['error' => 'Unable to send reset link'], 400);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'token' => 'required|string',
            'password' => 'required|confirmed|min:6',
        ]);

        $response = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => bcrypt($password),
                ])->save();
            }
        );

        return $response == Password::PASSWORD_RESET
            ? response(['message' => 'Password reset successfully'], 200)
            : response(['error' => 'Unable to reset password'], 400);
    }
}
