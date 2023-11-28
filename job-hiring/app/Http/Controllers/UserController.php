<?php

namespace App\Http\Controllers;

use App\Models\Chat;
use App\Models\Client;
use App\Models\Hiring;
use App\Models\User;
use App\Notifications\EmailNotification;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();

        return response()->json(['user' => $user], 200);
    }

    public function getTalentNewMsg()
    {
        $user = Auth::user();
        $talent = User::where('role', 'talent')
            ->whereNotIn('id', Chat::pluck('talentId'))->select('id','firstName','lastName','status','avatar')
            ->get();
        return response()->json(['talents' => $talent], 200);
    }


    public function update(Request $request, string $id)
    {
        try {
            $user = User::find($id);

            $validateData = $request->validate([
                'firstName' => 'required|string',
                'lastName' => 'required|string',
                'email' => 'required|string|email',
                'gender' => 'required|string',
                'phoneNumber' => 'required',
                'address' => 'required',
                'dateOfBirth' => 'required'
            ]);
            // Update user information
            if ($user->email != $request->email) {
                $userTemp = User::where('email', $request->email)->first();
                if ($userTemp) {
                    return response()->json(['message' => 'The email has already been taken !'], 207);
                }
                $link = env('FRONTEND_URL');
                $notif = [
                    'subject' => 'Email Verification',
                    'message' => 'Please press the following button to verify your email...',
                    'link' => $link . '/email-verification/' . $user->id,
                ];
                $user->notify(new EmailNotification($notif));
            }

            $user->firstName = $request->firstName;
            $user->lastName = $request->lastName;
            $user->email = $request->email;
            $user->gender = $request->gender;
            $user->phoneNumber = $request->phoneNumber;
            $user->ttl = $request->dateOfBirth;
            $user->address = $request->address;

            if ($request->file('avatar')) {
                $avatar = $request->file('avatar');
                $avatarName = time() . '.' . $avatar->getClientOriginalExtension();
                $avatar->storeAs('public/avatars', $avatarName);
                $user->avatar = $avatarName;
            }

            $user->save();

            return response()->json(['message' => $user], 200);
        } catch (\Exception $e) {
            if (strpos($e->getMessage(), 'The email has already been taken.') !== false) {
                return response()->json(['message' => 'The email has already been taken.'], 207);
            }
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function updatePassword(Request $request, string $id)
    {
        try {
            $user = User::find($id);

            $validateData = $request->validate([
                'password' => 'required|string|min:6',
            ]);

            // Update user information
            $user->password = bcrypt($validateData['password']);
            $user->save();
            return response()->json(['message' => $user], 200);
        } catch (\Exception $e) {
            if (strpos($e->getMessage(), 'The email has already been taken.') !== false) {
                return response()->json(['message' => 'The email has already been taken.'], 207);
            }
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function getAvatar($fileName)
    {
        $path = storage_path('app/public/avatars/' . $fileName);

        if (!file_exists($path)) {
            abort(404);
        }

        $file = File::get($path);
        $type = File::mimeType($path);

        $response = response($file, 200);
        $response->header("Content-Type", $type);
        return $response;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function getAllTalent(Request $request)
    {
        try {
            $user = Auth::user(); // tambahkan kalau user bukan role tidak punya akses
            $keyword = $request->input('keyword');
            $page = $request->input('page');
            $perPage = $request->input('perPage');
            $talents = [];
            $data = User::where('role', 'talent')->where(function ($query) use ($keyword) {
                $query->where('firstName', 'like', '%' . $keyword . '%')
                    ->orWhere('lastName', 'like', '%' . $keyword . '%')
                    ->orWhere('email', 'like', '%' . $keyword . '%');
            });
            $count = $data->count();
            $talents = $data->skip(($page - 1) * $perPage)
                ->take($perPage)
                ->get();
            $lower = ($page - 1) * $perPage + 1;
            $upper =  (($page - 1) * $perPage) + $perPage;
            if ($upper > $count) {
                $upper = $count;
            }
            if ($lower > $count) {
                $lower = $count;
            }
            $add = [
                'talentsCount' => $count,
                'lower' => $lower,
                'upper' => $upper,

            ];
            return response()->json(['talents' => $talents, 'page' => $add], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function getTalentById($idTalent)
    {
        try {
            $user = Auth::user(); // Tambhakan kalauuser bukan role admin tidak punya akses
            $talent = User::where('id', $idTalent)->get();
            if ($talent != null) {
                $hiring = Hiring::where('talentId', $idTalent)->get();
                foreach ($hiring as $item) {
                    if ($item->jobId != null) {
                        $hiring->load('job');
                    }
                    if ($item->firstStageId != null) {
                        $hiring->load('firstStage');
                    }
                    if ($item->secondStageId != null) {
                        $hiring->load('secondStage');
                    }
                    if ($item->thirdStageId != null) {
                        $hiring->load('thirdStage');
                    }
                    if ($item->fourthStageId != null) {
                        $hiring->load('fourthStage');
                    }

                    $client = Client::where('id', $item->jobId)->first();
                    $item->client = $client;
                }
                return response()->json(['talent' => $talent, 'hiring' => $hiring], 200);
            } else {
                return response()->json(['message' => 'empty'], 204);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function profilFormulirJob()
    {
        try {
            $user = Auth::user();
            return response()->json(['user' => [
                'firstName' => $user->firstName,
                'lastName' => $user->lastName,
                'ttl' => $user->ttl,
                'alamat' => $user->alamat,
                'status' => $user->status
            ]], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function getInfoTalentById($id)
    {
        try {
            $user = Auth::user();
            $quesry = User::where('id', $id)->first();

            return response()->json(['talent' => $quesry], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function makeUserDisable($id)
    {

        try {
            $admin = Auth::user();
            if ($admin->role != 'admin') {
                return response(['error' => 'Only admin'], 401);
            }

            $user = User::where('id', $id)->first();
            $user->status = 'Disable';
            $user->save();
            return response()->json(['user' => $user], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function makeUserEnable($id)
    {

        try {
            $admin = Auth::user();
            if ($admin->role != 'admin') {
                return response(['error' => 'Only admin'], 401);
            }

            $user = User::where('id', $id)->first();
            $user->status = 'Enable';
            $user->save();
            return response()->json(['user' => $user], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
