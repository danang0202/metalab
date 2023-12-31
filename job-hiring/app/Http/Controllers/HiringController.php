<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Hiring;
use App\Models\Client;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class HiringController extends Controller
{

    public function getProgressRecrutmenByUser()
    {
        try {
            $user = Auth::user();
            $hiring = Hiring::where('talentId', $user->id)->whereIn('status', ['Hired'])->orderBy('id', 'desc')->get(['id', 'jobId']);
            if ($hiring == null || $hiring->count() == 0) {
                return response()->json(['data' => 'No Content'], 204);
            }
            foreach ($hiring as $item) {
                if ($item->jobId != null) {
                    $item->load('job:id,name,type,kontrakStart,kontrakEnd,thumbnail,clientId');
                    $client = Client::where('id', $item->job->clientId)->first();
                    $item->clientCompanyName = $client->companyName;
                }
            }

            return response()->json(['hiring' => $hiring], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function getHiringUserByUser()
    {
        try {
            $user = Auth::user();
            $hiring = Hiring::where('talentId', $user->id)->orderBy('id', 'desc')->get(['id', 'jobId', 'status', 'lastStage']);
            if ($hiring == null || $hiring->count() == 0) {
                return response()->json(['data' => 'No Content'], 204);
            }
            foreach ($hiring as $item) {
                if ($item->jobId != null) {
                    $hiring->load('job:id,name,type,kontrakStart,kontrakEnd,thumbnail,clientId');
                }
                $client = Client::where('id', $item->job->clientId)->first();
                $item->clientCompanyName = $client->companyName;
            }
            return response()->json(['hiring' => $hiring], 200);
        } catch (\Exception $e) {
            return response()->json(['data' => $e->getMessage()], 400);
        }
    }

    public function getHiringUserByAdmin(Request $request)
    {
        try {
            $user = User::where('email', $request->input('email'))->first();
            $hiring = Hiring::where('talentId', $user->id)->orderBy('id', 'desc')->get();
            if ($hiring == null || $hiring->count() == 0) {
                return response()->json(['data' => 'No Content'], 204);
            }
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
                $item->talent = $user;
            }
            return response()->json(['data' => $hiring], 200);
        } catch (\Exception $e) {
            return response()->json(['data' => $e->getMessage()], 400);
        }
    }

    public function getHiringDetail($id)
    {
        try {
            $hiring = Hiring::with([
                'job:id,name,type,clientId,kontrakStart,kontrakEnd,status,thumbnail',
                'job.client:id,companyName,companyLogo'
            ])->where('id', $id)->get();
            return response()->json(['hiring' => $hiring], 200);
        } catch (\Exception $e) {
            return response()->json(['data' => $e->getMessage()], 400);
        }
    }

    public function getHiringDataTabelAdmin(Request $request)
    {
        try {
            $user = Auth::user();
            $filter = $request->input('filter');
            $keyword = $request->input('keyword');
            $page = $request->input('page');
            $perPage = $request->input('perPage');
            // kalau bukan admin tidak boleh
            $hirings = [];
            $query = Hiring::whereIn('status', $filter)
                ->where(function ($query) use ($keyword) {
                    $query->whereHas('job', function ($jobQuery) use ($keyword) {
                        $jobQuery->where('name', 'like', '%' . $keyword . '%');
                    })
                        ->orWhereHas('talent', function ($talentQuery) use ($keyword) {
                            $talentQuery->where('firstname', 'like', '%' . $keyword . '%')
                                ->orWhere('lastname', 'like', '%' . $keyword . '%');
                        });
                })
                ->orderBy('id', 'desc')
                ->select('id', 'talentId', 'jobId', 'status', 'lastStage');

            $count = $query->count();
            $hirings = $query->skip(($page - 1) * $perPage)
                ->take($perPage)
                ->get();
            if ($hirings->count() > 0) {
                foreach ($hirings as $hiring) {
                    $hiring->load('job:id,name,type');
                    $hiring->load('talent:id,firstName,lastName,avatar');
                }
            }
            $lower = ($page - 1) * $perPage + 1;
            $upper =  (($page - 1) * $perPage) + $perPage;
            if ($upper > $count) {
                $upper = $count;
            }
            if ($lower > $count) {
                $lower = $count;
            }
            $add = [
                'hiringCount' => $count,
                'lower' => $lower,
                'upper' => $upper,

            ];
            return response()->json(['hirings' => $hirings, 'page' => $add], 200);
        } catch (\Exception $e) {
            return response()->json(['data' => $e->getMessage()], 400);
        }
    }

    public function getHiringByJob($idJob)
    {
        try {
            $user = Auth::user();
            $hiringData = Hiring::with([
                'talent:id,firstName,lastName,email,phoneNumber,gender,ttl',
            ])
                ->where('jobId', $idJob)
                ->whereIn('status', ['Hired', 'Completed'])
                ->select('id', 'talentId')
                ->get();
            return response()->json(['hiring' => $hiringData], 200);
        } catch (\Exception $e) {
            return response()->json(['data' => $e->getMessage()], 400);
        }
    }

    public function updateHiringStatusByDate()
    {
        try {
            $hirings = Hiring::where('status', 'Hired')->with('job:id,kontrakEnd')->select('id', 'jobId', 'status')->get();
            foreach ($hirings as $hiring) {
                $kontrakEnd = Carbon::parse($hiring->job->kontrakEnd);
                if ($kontrakEnd->isPast()) {
                    $hiring->status = 'Completed';
                    $hiring->save();
                }
            }
            return response()->json(200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function checkHiringByUserAndJob(Request $request)
    {
        try {
            $idTalent = $request->input('idTalent');
            $idJob = $request->input('idJob');
            $hiring = Hiring::where('talentId', $idTalent)->where('jobId', $idJob)->select('id')->first();
            if ($hiring) {
                return response()->json(['hiring' => $hiring], 200);
            } else {
                return response()->json([], 204);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function checkHiringFullTime(Request $request)
    {
        try {
            $idTalent = $request->input('idTalent');
            $hiring = Hiring::where('talentId', $idTalent)
                ->whereIn('status', ['Hired', 'On Progress'])
                ->select('id', 'jobId', 'status')
                ->whereHas('job', function ($query) {
                    $query->where(function ($subquery) {
                        $subquery->where('type', 'Full Time')->orWhere('type', 'Part Time');
                    });
                })
                ->with(['job:id,name,kontrakStart,kontrakEnd,type'])
                ->first();

            if ($hiring) {
                return response()->json(['hiring' => $hiring], 200);
            } else {
                return response()->json([], 204);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function getCalenderData()
    {
        try {
            $user = Auth::user();
            $hiringData_1 = Hiring::where('lastStage', '2')->where('status', 'On Progress')
                ->whereHas('secondStage', function ($query) {
                    $query->where(function ($subquery) {
                        $subquery->whereNotNull('dateUser');
                    });
                })->with('secondStage:id,dateUser')->with('job:id,name')->with('talent:id,firstName')->get();

            $hiringData_2 = Hiring::where('lastStage', '3')->where('status', 'On Progress')
                ->whereHas('thirdStage', function ($query) {
                    $query->where(function ($subquery) {
                        $subquery->whereNotNull('dateUser');
                    });
                })->with('thirdStage:id,dateUser')->with('job:id,name')->with('talent:id,firstName')->get();
            $combinedHiringData = $hiringData_1->concat($hiringData_2);

            return response()->json(['hiring' => $combinedHiringData], 200);
        } catch (\Exception $e) {
            return response()->json(['data' => $e->getMessage()], 400);
        }
    }

    public function checkHiringDataForDisableJob($idJob)
    {
        if (auth()->user()) {
            $relatedHirings = Hiring::where('jobId', $idJob)->where('status', ['On Progress', 'Hired'])->with('talent:id,firstName,lastName,avatar,email')->get();

            if ($relatedHirings->count() > 0) {
                return response(['hiring' => $relatedHirings], 200);
            } else {
                return response()->json([], 204);
            }
        } else {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }
    }

    public function deleteHiring($idHiring)
    {
        try {
            $user = Auth::user();
            if ($user->role != 'admin') {
                return response()->json(['error' => 'Unauthenticated'], 401);
            }

            $hiring = Hiring::where('id', $idHiring)->with('firstStage', 'secondStage', 'thirdStage', 'fourthStage')->first();
            $tahapSatu  = $hiring->firstStage;
            $tahapDua  = $hiring->secondStage;
            $tahapTiga = $hiring->thirdStage;
            $tahapEmpat = $hiring->fourthStage;
            $hiring->delete();
            if ($tahapSatu) {
                if (Storage::fileExists($tahapSatu->fileKTP)) { // Hapus file dengan nama fileNameTemp ini
                    Storage::delete($tahapSatu->fileKTP);
                }
                if (Storage::fileExists($tahapSatu->fileKK)) { // Hapus file dengan nama fileNameTemp ini
                    Storage::delete($tahapSatu->fileKK);
                }
                if (Storage::fileExists($tahapSatu->fileCV)) { // Hapus file dengan nama fileNameTemp ini
                    Storage::delete($tahapSatu->fileCV);
                }
                if (Storage::fileExists($tahapSatu->fileIjazah)) { // Hapus file dengan nama fileNameTemp ini
                    Storage::delete($tahapSatu->fileIjazah);
                }
                if (Storage::fileExists($tahapSatu->fileSertifikat)) { // Hapus file dengan nama fileNameTemp ini
                    Storage::delete($tahapSatu->fileSertifikat);
                }
                $tahapSatu->delete();
            }
            if ($tahapDua) {
                $tahapDua->delete();
            }
            if ($tahapTiga) {
                $tahapTiga->delete();
            }
            if ($tahapEmpat) {
                $tahapEmpat->delete();
            }
            return response()->json(['status' => "success", 'err' => ''], 200);
        } catch (\Exception $e) {
            return response()->json(['data' => $e->getMessage()], 400);
        }
    }
}
