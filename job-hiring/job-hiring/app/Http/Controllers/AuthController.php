<?php

namespace App\Http\Controllers;

use App\Models\Hiring;
use App\Models\User;
use App\Notifications\EmailNotification;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Password;

class AuthController extends Controller
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

    public function login(Request $request)
    {
        try {
            $credentials = $request->only('email', 'password');

            if (Auth::attempt($credentials)) {
                $user = $request->user();
                // PersonalAccessToken::where('tokenable_id', $user->id)->delete();
                $token = $request->user()->createToken('API Token')->plainTextToken;
                if ($user->email_verified_at == null) {
                    return response([
                        'message' => 'fail'
                    ], 200);
                }
                return response([
                    'user' => [
                        'id' => $user->id,
                        'firstName' => $user->firstName,
                        'lastName' => $user->lastName,
                        'email' => $user->email,
                        'role' =>    $user->role,
                    ],
                    'token' => $token,
                    'message' => 'success',
                ], 200);
            }
            return response(['error' => 'Login Fail'], 401);
        } catch (\Exception $e) {
            return response(['error' => $e->getMessage()], 400);
        }
    }

    public function logout(Request $request)
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response(['error' => 'User not authenticated'], 401);
            }

            $token = $request->user()->currentAccessToken();

            if ($token) {
                $token->delete();
                return response(['message' => 'Logout success'], 200);
            } else {
                return response(['error' => 'No valid token found'], 400);
            }
        } catch (\Exception $e) {
            return response(['error' => $e->getMessage()], 400);
        }
    }

    public function register(Request $request)
    {
        try {
            $validateData = $request->validate([
                'firstName' => 'required|string',
                'lastName' => 'required|string',
                'email' => 'required|string|email|unique:users',
                'password' => 'required|string|min:6',
                'phoneNumber' => 'required',
                'gender' => 'required'
            ]);
            $user = new User($validateData);
            $user->phoneNumber = $request->phoneNumber;
            $user->save();
            $link = env('FRONTEND_URL');
            $notif = [
                'subject' => 'Email Verification',
                'message' => 'Please press the following button to verify your email...',
                'link' => $link . '/email-verification/' . $user->id,
            ];
            $user->notify(new EmailNotification($notif));

            return response()->json(['message' => $user], 201);
        } catch (\Exception $e) {
            if (strpos($e->getMessage(), 'The email has already been taken.') !== false) {
                // Pengecualian email duplikat
                return response()->json(['message' => 'The email has already been taken.'], 200);
            }
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
   

    public function cekEmailNotif()
    {
        $notif = [
            'subject' => 'Email Verification',
            'message' => 'Please press the following button to verify your email...',
            'link' =>  '/email-verification/',
        ];
        $user = User::where('id', '1')->first();
        $user->notify(new EmailNotification($notif));
    }

        public function getResetPasswordToken(Request $request ){
            


        }

    public function profilBeranda()
    {
        $user = Auth::user();
        $statusCounts = Hiring::selectRaw('
    SUM(CASE WHEN status = "On Progress" THEN 1 ELSE 0 END) as on_progress,
    SUM(CASE WHEN status = "Hired" THEN 1 ELSE 0 END) as hired,
    SUM(CASE WHEN status = "Completed" THEN 1 ELSE 0 END) as completed
')
            ->where('talentId', $user->id)
            ->first();

        $hiringOnProgress = $statusCounts->on_progress;
        $hired = $statusCounts->hired;
        $completed = $statusCounts->completed;
        return response()->json(['user' => [
            'firstName' => $user->firstName,
            'lastName' => $user->lastName,
            'avatar' => $user->avatar,
            'onProgress' => $hiringOnProgress,
            'hired' => $hired,
            'completed' => $completed,
        ]], 200);
    }

    public function profil()
    {
        $user = Auth::user();
        return response()->json(['user' => $user], 200);
    }

    public function activateEmail(Request $request)
    {
        try {
            $user = User::findOrFail($request->id);;
            $user->email_verified_at = Carbon::now();
            $user->save();
            return response()->json(['message' => 'Email activated'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
