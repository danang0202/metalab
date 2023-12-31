<?php

namespace App\Http\Controllers;

use App\Models\TahapTengah;
use App\Http\Requests\StoreTahapTengahRequest;
use App\Http\Requests\UpdateTahapTengahRequest;
use App\Models\Hiring;
use App\Models\Job;
use App\Notifications\Announcement;
use Illuminate\Http\Request;

class TahapTengahController extends Controller
{
    public function save(Request $request)
    {
        if (auth()->user()) {
            try {
                $validateData = $request->validate([
                    'dateAdminFirst' => 'required',
                    'dateAdminSecond' => 'required',
                    'dateAdminThird' => 'required',
                    'stage' => 'required',
                ]);

                $tahapTengah = new TahapTengah($validateData);
                $tahapTengah->status = 'Pending';
                $tahapTengah->save();
                $subjectEmail = '';
                $hiring = Hiring::where('id', $request->input('idHiring'))->with('talent:id,email,firstName')->with('job:id,name')->first();
                if ($request->input('stage') == 2) {
                    $hiring->secondStageId = $tahapTengah->id;
                    $subjectEmail = 'Competency Test';
                } else {
                    $hiring->thirdtageId = $tahapTengah->id;
                    $subjectEmail = 'Interview Test';
                }
                $hiring->save();
                // Kode untuk mengirimkan pemberitahuan email ke talent
                $link = env('FRONTEND_URL');
                $notif = [
                    'subject' => $subjectEmail,
                    'talentName' => $hiring->talent->firstName,
                    'jobName' => $hiring->job->name,
                    'date' => [$request->input('dateAdminFirst'), $request->input('dateAdminSecond'), $request->input('dateAdminThird')],
                    'link' => $link . '/hiring/detail/' . $request->input('idHiring'),
                    'type' => 'offer',
                ];
                $hiring->talent->notify(new Announcement($notif));

                return response()->json(['stage' => $tahapTengah], 201);
            } catch (\Exception $e) {
                return response()->json(['error' => $e->getMessage()], 500);
            }
        } else {
            return response()->json(['error' => 'Unauthenticate'], 401);
        }
    }

    public function  getTahapTengahById($id)
    {
        if (auth()->user()) {
            try {
                $tahapTengah = TahapTengah::where('id', $id)->first();
                return response()->json(['stage' => $tahapTengah], 200);
            } catch (\Exception $e) {
                return response()->json(['error' => $e->getMessage()], 500);
            }
        } else {
            return response()->json(['error' => 'Unauthenticate'], 401);
        }
    }

    public function selectDateUser($id, Request $request)
    {
        if (auth()->user()) {
            try {
                $validateData = $request->validate([
                    'dateUser' => 'required',
                ]);
                $tahapTengah = TahapTengah::where('id', $id)->first();
                $tahapTengah->dateUser =  $request->input('dateUser');
                $tahapTengah->save();
                return response()->json(['stage' => $tahapTengah], 200);
            } catch (\Exception $e) {
                return response()->json(['error' => $e->getMessage()], 500);
            }
        } else {
            return response()->json(['error' => 'Unauthenticate'], 401);
        }
    }

    public function inputLink($id, Request $request)
    {
        if (auth()->user()) {
            try {
                $validateData = $request->validate([
                    'link' => 'required',
                    'stage' => 'required',
                    'idHiring' => 'required'

                ]);
                $tahapTengah = TahapTengah::where('id', $id)->first();
                $tahapTengah->link =  $request->input('link');
                $tahapTengah->save();

                // Memberikan notifikasi ke talent

                $hiring = Hiring::where('id', $request->input('idHiring'))->with('talent:id,email,firstName')->with('job:id,name')->first();
                if ($request->input('stage') == 2) {
                    $subjectEmail = 'Competency Test';
                } else {
                    $subjectEmail = 'Interview Test';
                }

                $link = env('FRONTEND_URL');
                $notif = [
                    'subject' => $subjectEmail,
                    'talentName' => $hiring->talent->firstName,
                    'jobName' => $hiring->job->name,
                    'dateUser' => $tahapTengah->dateUser,
                    'linkMeet' => $tahapTengah->link,
                    'link' => $link . '/hiring/detail/' . $request->input('idHiring'),
                    'type' => 'link',
                ];

                $hiring->talent->notify(new Announcement($notif));

                return response()->json(['stage' => $tahapTengah], 200);
            } catch (\Exception $e) {
                return response()->json(['error' => $e->getMessage()], 500);
            }
        } else {
            return response()->json(['error' => 'Unauthenticate'], 401);
        }
    }

    public function inputScore($id, Request $request)
    {
        if (auth()->user()) {
            try {
                $validateData = $request->validate([
                    'score' => 'required',
                ]);
                $tahapTengah = TahapTengah::where('id', $id)->first();
                $tahapTengah->score =  $request->input('score');
                $tahapTengah->save();
                return response()->json(['stage' => $tahapTengah], 200);
            } catch (\Exception $e) {
                return response()->json(['error' => $e->getMessage()], 500);
            }
        } else {
            return response()->json(['error' => 'Unauthenticate'], 401);
        }
    }

    public function inputDecision($id, Request $request)
    {
        if (auth()->user()) {
            try {
                $validateData = $request->validate([
                    'status' => 'required',
                    'idHiring' => 'required',
                    'stage' => 'required',
                ]);
                $tahapTengah = TahapTengah::where('id', $id)->first();
                $tahapTengah->status =  $request->input('status');
                $tahapTengah->save();
                $message = '';
                $hiring = Hiring::where('id', $request->input('idHiring'))->with('talent:id,email,firstName')->with('job:id,name')->first();
                if ($request->input('status') == 'Rejected') {
                    $hiring->status = "Rejected";
                    $message = 'Sorry, your hiring process for the ' . $hiring->job->name . '  job has been rejected';
                } else {
                    if ($request->input('stage') == '2') {
                        $hiring->lastStage = '3';
                        $message = 'Congratulations, you have successfully passed the second stage!';
                    } else {
                        $job = Job::where('id', $hiring->jobId)->first();
                        if ($job->type == 'Freelance') {
                            $hiring->lastStage = '4';
                            $message = 'Congratulations, you have successfully passed the third stage!';
                        } else {
                            $hiring->status = 'Hired';
                            $job->hired = $job->hired + 1;
                            if ($job->hired == $job->kuota) {
                                $job->status = 'Full Hired';
                            }
                            $job->save();
                            $message = 'Congratulations, you have been accepted for the ' . $hiring->job->name . ' job!';
                        }
                    }
                }

                if ($request->input('stage') == '2') {
                    $subjectEmail = 'Competency Test';
                } else {
                    $subjectEmail = 'Interview Test';
                }
                $hiring->save();
                // Mengirimkan notifikasi email
                $link = env('FRONTEND_URL');
                $notif = [
                    'subject' => $subjectEmail . ' Results',
                    'talentName' => $hiring->talent->firstName,
                    'jobName' => $hiring->job->name,
                    'message' => $message,
                    'link' => $link . '/hiring/detail/' . $request->input('idHiring'),
                    'status' => $request->input('status'),
                    'type' => 'announcement',
                ];
                $hiring->talent->notify(new Announcement($notif));
                // Mengirimkan notifikasi email

                return response()->json(['stage' => $tahapTengah], 200);
            } catch (\Exception $e) {
                return response()->json(['error' => $e->getMessage()], 500);
            }
        } else {
            return response()->json(['error' => 'Unauthenticate'], 401);
        }
    }

    public function checkDate(Request $request)
    {
        try {
            $validateData = $request->validate([
                'date' => 'required|date',
            ]);
            $date = $validateData['date'];

            $hiringOnProgress_1 = Hiring::where('status', 'On Progress')->where('lastStage', '2')
                ->whereHas('secondStage', function ($query) use ($date) {
                    $formattedDate = date('Y-m-d 00:00:00', strtotime($date));

                    $query->where(function ($query) use ($formattedDate) {
                        $query->whereRaw('DATE_FORMAT(dateAdminFirst, "%Y-%m-%d 00:00:00") = ?', [$formattedDate])
                            ->orWhereRaw('DATE_FORMAT(dateAdminSecond, "%Y-%m-%d 00:00:00") = ?', [$formattedDate])
                            ->orWhereRaw('DATE_FORMAT(dateAdminThird, "%Y-%m-%d 00:00:00") = ?', [$formattedDate]);
                    })
                        ->whereNull('dateUser')
                        ->orWhereRaw('DATE_FORMAT(dateUser, "%Y-%m-%d 00:00:00") = ?', [$formattedDate]);
                })
                ->with('job:id,name')
                ->with('talent:id,firstName,lastName')
                ->with('secondStage')
                ->get();

            $hiringOnProgress_2 = Hiring::where('status', 'On Progress')->where('lastStage', '3')
                ->whereHas('thirdStage', function ($query) use ($date) {
                    $formattedDate = date('Y-m-d 00:00:00', strtotime($date));

                    $query->where(function ($query) use ($formattedDate) {
                        $query->whereRaw('DATE_FORMAT(dateAdminFirst, "%Y-%m-%d 00:00:00") = ?', [$formattedDate])
                            ->orWhereRaw('DATE_FORMAT(dateAdminSecond, "%Y-%m-%d 00:00:00") = ?', [$formattedDate])
                            ->orWhereRaw('DATE_FORMAT(dateAdminThird, "%Y-%m-%d 00:00:00") = ?', [$formattedDate]);
                    })
                        ->whereNull('dateUser')
                        ->orWhereRaw('DATE_FORMAT(dateUser, "%Y-%m-%d 00:00:00") = ?', [$formattedDate]);
                })
                ->with('job:id,name')
                ->with('talent:id,firstName,lastName')
                ->with('thirdStage')
                ->get();

            $hiringOnProgress = $hiringOnProgress_1->concat($hiringOnProgress_2);
            if ($hiringOnProgress->count() > 0) {
                return response()->json(['hiringOnProgress' => $hiringOnProgress], 200);
            } else {
                return response()->json([], 204);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
