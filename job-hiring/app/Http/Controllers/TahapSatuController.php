<?php

namespace App\Http\Controllers;

use App\Models\Hiring;
use App\Models\TahapSatu;
use App\Http\Requests\StoreTahapSatuRequest;
use App\Http\Requests\UpdateTahapSatuRequest;
use App\Models\User;
use App\Notifications\Announcement;
use App\Notifications\EmailNotification;
use App\Notifications\HiringStageAnnouncement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class TahapSatuController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function test($idJob, Request $request)
    {
        $user = auth()->user();
        if ($user) {
            try {
                $filename = '';
                $validateData = $request->validate([
                    'nik' => 'required',
                    'placeOfBirth' => 'required',
                    'dateOfBirth' => 'required',
                    'address' => 'required',
                    'fileKTP' => 'required|mimes:pdf',
                    'fileKK' => 'required|mimes:pdf',
                    'fileCV' => 'required|mimes:pdf',
                    'fileSertifikat' => 'required|mimes:pdf',
                    'fileIjazah' => 'required|mimes:pdf',
                ]);


                $tahapSatu  = new TahapSatu($validateData);
                // menyimpan file KTP
                $file = $request->file('fileKTP');
                $filename =  time() . '-' .  str_replace(' ', '_', $file->getClientOriginalName());
                $file->storeAs('public/hiring', $filename);
                $tahapSatu->fileKTP = $filename;

                // Menyimpan file KK
                $file = $request->file('fileKK');
                $filename =  time() . '-' .  str_replace(' ', '_', $file->getClientOriginalName());
                $file->storeAs('public/hiring', $filename);
                $tahapSatu->fileKK = $filename;

                // menyimpan file CV
                $file = $request->file('fileCV');
                $filename =  time() . '-' .  str_replace(' ', '_', $file->getClientOriginalName());
                $file->storeAs('public/hiring', $filename);
                $tahapSatu->fileCV = $filename;

                // Menyimpan file sertifikat
                $file = $request->file('fileSertifikat');
                $filename = time() . '-' .  str_replace(' ', '_', $file->getClientOriginalName());
                $file->storeAs('public/hiring', $filename);
                $tahapSatu->fileSertifikat = $filename;

                // Menyimpan file ijazah
                $file = $request->file('fileIjazah');
                $filename =  time() . '-' .  str_replace(' ', '_', $file->getClientOriginalName());
                $file->storeAs('public/hiring', $filename);
                $tahapSatu->fileIjazah = $filename;
                $tahapSatu->status = "Pending";

                $tahapSatu->save();

                $hiring = new Hiring();
                $hiring->talentId = $user->id;
                $hiring->jobId =  $idJob;
                $hiring->firstStageId = $tahapSatu->id;
                $hiring->status = 'On Progress';
                $hiring->lastStage = '1';
                $hiring->save();

                return response()->json(['hiring' => $hiring], 201);
            } catch (\Exception $e) {
                return response()->json(['error' => $e->getMessage()], 500);
            }
        } else {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store($idJob, StoreTahapSatuRequest $request)
    {
    }


    /**
     * Display the specified resource.
     */
    public function show(TahapSatu $tahapSatu)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(TahapSatu $tahapSatu)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTahapSatuRequest $request, TahapSatu $tahapSatu)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TahapSatu $tahapSatu)
    {
        //
    }

    public function getFileTahapSatu($filename)
    {
        try {
            $path = storage_path('app/public/hiring/' . $filename);

            if (!file_exists($path)) {
                abort(404);
            }

            $file = File::get($path);
            $type = File::mimeType($path);

            $response = response($file, 200);
            $response->header("Content-Type", $type);
            return $response;
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }


    public function getDetailById($id)
    {
        $user = auth()->user();
        if ($user) {
            try {
                $tahapSatu = TahapSatu::findOrFail($id);
                return response()->json(['tahapSatu' => $tahapSatu], 200);
            } catch (\Exception $e) {
                return response()->json(['error' => $e->getMessage()], 500);
            }
        } else {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }
    }

    public function inputDecision($id, Request $request)
    {
        $user = auth()->user();
        if ($user && $user->role = 'admin') {
            try {
                $validateData = $request->validate([
                    'idHiring' => 'required',
                    'status' => 'required',
                ]);
                $hiring = Hiring::where('id', $request->input('idHiring'))->with('talent:id,email,firstName')->with('job:id,name')->first();
                $tahapSatu = TahapSatu::where('id', $id)->first();
                $tahapSatu->status =  $request->input('status');

                if ($request->input('status') == 'Rejected') {
                    $hiring->status = "Rejected";
                    $message = 'Sorry, your hiring process for the ' . $hiring->job->name . '  job has been rejected';
                } else {
                    $hiring->lastStage = 2;
                    $message = 'Congratulations, you have successfully passed the first stage!';
                }
                $tahapSatu->save();
                $hiring->save();

                // Mengirimkan notifikasi email
                $link = env('FRONTEND_URL');
                $notif = [
                    'subject' => 'Administrative Test Results',
                    'talentName' => $hiring->talent->firstName,
                    'jobName' => $hiring->job->name,
                    'message' => $message,
                    'link' => $link . '/hiring/detail/' . $request->input('idHiring'),
                    'status' => $request->input('status'),
                    'type' => 'announcement',
                ];
                $hiring->talent->notify(new Announcement($notif));
                // pengirimnan notifikasi email selesai
                return response()->json(['tahapSatu' => $tahapSatu], 200);
            } catch (\Exception $e) {
                return response()->json(['error' => $e->getMessage()], 500);
            }
        } else {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }
    }
}
