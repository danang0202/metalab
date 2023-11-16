<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Hiring;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use PhpParser\Node\Stmt\TryCatch;

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

    /**
     * Store a newly created resource in storage.\
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
            return response()->json(['talents' => $talents,'page'=>$add], 200);
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
}
