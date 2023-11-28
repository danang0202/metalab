<?php

namespace App\Http\Controllers;

use App\Models\Hiring;
use App\Models\TahapEmpat;
use App\Http\Requests\StoreTahapEmpatRequest;
use App\Http\Requests\UpdateTahapEmpatRequest;
use App\Models\Job;
use App\Notifications\Announcement;
use Illuminate\Http\Request;

class TahapEmpatController extends Controller
{
    public function getFourthStageById($id)
    {
        $user = auth()->user();
        if ($user) {
            try {
                $tahapEmpat = TahapEmpat::findOrFail($id);
                return response()->json(['tahapEmpat' => $tahapEmpat], 200);
            } catch (\Exception $e) {
                return response()->json(['error' => $e->getMessage()], 500);
            }
        } else {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }
    }

    public function inputDecision(Request $request)
    {
        $user = auth()->user();
        if ($user) {
            try {
                $validateData = $request->validate([
                    'status' => 'required',
                    'idHiring' => 'required',
                    'idJob' => 'required',
                ]);
                $tahapEmpat = new TahapEmpat();
                $tahapEmpat->status =  $request->input('status');
                $tahapEmpat->save();
                $hiring = Hiring::where('id', $request->input('idHiring'))->with('talent:id,email,firstName')->with('job:id,name')->first();
                $hiring->fourthStageId = $tahapEmpat->id;
                $job = Job::where('id', $request->input('idJob'))->first();
                if ($request->input('status') == 'Rejected') {
                    $hiring->status = "Rejected";
                    $message = 'Sorry, your hiring process for the ' . $hiring->job->name . '  job has been rejected';
                } else {
                    $hiring->status = "Hired";
                    $job->hired = $job->hired + 1;
                    if ($job->hired == $job->kuota) {
                        $job->status = 'Full Hired';
                    }
                    $job->save();
                    $message = 'Congratulations, you have been accepted for the ' . $hiring->job->name . ' job!';
                }
                $hiring->save();
                // Pengiriman notifikasi email
                $link = env('FRONTEND_URL');
                $notif = [
                    'subject' => 'Matching Test Result',
                    'talentName' => $hiring->talent->firstName,
                    'jobName' => $hiring->job->name,
                    'message' => $message,
                    'link' => $link . '/hiring/detail/' . $request->input('idHiring'),
                    'status' => $request->input('status'),
                    'type' => 'announcement',
                ];
                $hiring->talent->notify(new Announcement($notif));
                return response()->json(['tahapEmpat' => $tahapEmpat], 200);
            } catch (\Exception $e) {
                return response()->json(['error' => $e->getMessage()], 500);
            }
        } else {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }
    }
}
