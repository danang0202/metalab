<?php

namespace App\Http\Controllers;

use App\Models\Hiring;
use App\Models\Job;
use App\Http\Requests\StoreJobRequest;
use App\Http\Requests\UpdateJobRequest;
use App\Models\Client;
use App\Models\TahapEmpat;
use App\Models\TahapSatu;
use App\Models\TahapTengah;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class JobController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        if (auth()->user()) {
            $jobs = Job::all();
            return response(['jobs' => $jobs], 200);
        } else {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }
    }

    public function jobsTalent(Request $request)
    {

        try {
            $page = $request->input('page');
            $perPage = $request->input('perPage');
            $filterType =  $request->input('filter');
            $min = $request->input('min') * 1000;
            $max = $request->input('max') * 1000;
            $sorting = $request->input('sort');
            $query = Job::select('id', 'name', 'type', 'kontrakStart', 'kontrakEnd', 'gajiLower', 'gajiUpper', 'status', 'thumbnail', 'clientId', 'latestApplyDate')
                ->whereIn('type', $filterType)
                ->where('gajiLower', '>=', $min)
                ->where('gajiUpper', '<=', $max)
                ->orderBy('id', $sorting);

            $count = $query->count();
            $jobs = $query->skip(($page - 1) * $perPage)
                ->take($perPage)
                ->get();
            $jobs->load('client:id,companyName');
            $lower = ($page - 1) * $perPage + 1;
            $upper =  (($page - 1) * $perPage) + $perPage;
            if ($upper > $count) {
                $upper = $count;
            }
            if ($lower > $count) {
                $lower = $count;
            }
            $add = [
                'jobCount' => $count,
                'lower' => $lower,
                'upper' => $upper,
                'filter' => $filterType,

            ];
            return response([
                'jobs' => $jobs,
                'page' => $add,
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function jobsAdmin(Request $request)
    {
        try {
            $page = $request->input('page');
            $perPage = $request->input('perPage');
            $filterType =  $request->input('filter');
            $filterStatus =  $request->input('filterStatus');
            $keyword =  $request->input('keyword');
            $sorting = $request->input('sort');
            $query = Job::select('id', 'name', 'type', 'status', 'thumbnail', 'kuota', 'hired', 'clientId')
                ->whereIn('type', $filterType)
                ->whereIn('status', $filterStatus)
                ->where('name', 'like', '%' . $keyword . '%')
                ->orderBy('id', $sorting);

            $count = $query->count();
            $jobs = $query->skip(($page - 1) * $perPage)
                ->take($perPage)
                ->get();
            $jobs->load('client:id,companyName,picName,companyLogo');
            $lower = ($page - 1) * $perPage + 1;
            $upper =  (($page - 1) * $perPage) + $perPage;
            if ($upper > $count) {
                $upper = $count;
            }
            if ($lower > $count) {
                $lower = $count;
            }
            $add = [
                'jobsCount' => $count,
                'lower' => $lower,
                'upper' => $upper,
                'filter' => $filterType,

            ];
            return response([
                'jobs' => $jobs,
                'page' => $add,
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }



    /**
     * Show the form for creating a new resource.
     */

    public function create()
    {
        $clients = Client::orderBy('name')->get();
        return view("/job/job_form", compact('clients'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreJobRequest $request)
    {
        if (auth()->user()) {
            // jika user bukan admin tidak punya akses
            try {
                $validateData = $request->validate([
                    'name' => 'required',
                    'type' => 'required',
                    'kontrakStart' => 'required',
                    'kontrakEnd' => 'required',
                    'gajiLower' => 'required',
                    'gajiUpper' => 'required',
                    'kuota' => 'required',
                    'latestApplyDate' => 'required',
                    'thumbnail' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
                    'clientId' => 'required',
                    'description' => 'required',
                    'whyJoin' => 'required',
                    'willDo' => 'required',
                    'requirements' => 'required',
                    'offer' => 'required',
                ]);

                $thumbnailFile = $request->file('thumbnail');
                $fileName = time() . '-' .  str_replace(' ', '_', $thumbnailFile->getClientOriginalName());
                $thumbnailFile->storeAs('public/thumbnails', $fileName);
                $job = new Job($validateData);
                $job->thumbnail = $fileName;
                $job->save();
                return response()->json(["jobs" => $job], 201);
            } catch (\Exception $e) {
                return $e->getMessage();
            }
        } else {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }
    }

    public function update(UpdateJobRequest $request, $id)
    {
        if (auth()->user()) {
            $job = Job::find($id);
            try {
                $validateData = $request->validate([
                    'name' => 'required',
                    'type' => 'required',
                    'kontrakStart' => 'required',
                    'kontrakEnd' => 'required',
                    'gajiLower' => 'required',
                    'gajiUpper' => 'required',
                    'kuota' => 'required',
                    'latestApplyDate' => 'required',
                     'clientId' => 'required',
                    'description' => 'required',
                    'whyJoin' => 'required',
                    'willDo' => 'required',
                    'requirements' => 'required',
                    'offer' => 'required',
                ]);
                $job->name = $request->name;
                $job->type = $request->type;
                $job->kontrakStart = $request->kontrakStart;
                $job->kontrakEnd = $request->kontrakEnd;
                $job->gajiLower = $request->gajiLower;
                $job->gajiUpper = $request->gajiUpper;
                $job->kuota = $request->kuota;
                $job->latestApplyDate = $request->latestApplyDate;
                $job->clientId = $request->clientId;
                $job->description = $request->description;
                $job->whyJoin = $request->whyJoin;
                $job->willDo = $request->willDo;
                $job->requirements = $request->requirements;
                $job->offer = $request->offer;

                $latestApplyDate = Carbon::parse($job->latestApplyDate);
                if(!$latestApplyDate->isPast()){
                    $job->status = 'Vacant';
                }
                if ($request->file('thumbnail')) {
                    $fileNameTemp = $job->thumbnail;
                    if (Storage::fileExists($fileNameTemp)) { // Hapus file dengan nama fileNameTemp ini
                        Storage::delete($fileNameTemp);
                    }
                    $thumbnailFile = $request->file('thumbnail');
                    $fileName =  time() . '-' .  str_replace(' ', '_', $thumbnailFile->getClientOriginalName());
                    $thumbnailFile->storeAs('public/thumbnails', $fileName);
                    $job->thumbnail = $fileName;
                }
                $job->save();
                return response()->json(["job" => $job], 200);
            } catch (\Exception $e) {
                return $e->getMessage();
            }
        } else {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }
    }

    /**
     * Remove the specified resource from storage.  
     */
    public function destroy($id)
    {
        if (auth()->user()) {
            try {
                $job = Job::find($id);
                $job->delete();
            } catch (\Exception $e) {
                return response()->json(['error' => $e->getMessage()], 500);
            }
            return response()->json(['succes' => 'success delete job'], 200);;
        } else {
            return response()->json(['error' => 'Unauthenticate'], 401);
        }
    }

    public function getThumbnail($fileName)
    {
        $path = storage_path('app/public/thumbnails/' . $fileName);

        if (!file_exists($path)) {
            abort(404);
        }

        $file = File::get($path);
        $type = File::mimeType($path);

        $response = response($file, 200);
        $response->header("Content-Type", $type);
        return $response;
    }

    public function getById($id)
    {
        if (auth()->user()) {
            $job = Job::with('client:id,companyName,companyLogo')
                ->where('id', $id)
                ->select('id', 'name', 'type', 'clientId', 'kontrakStart', 'kontrakEnd', 'status', 'thumbnail')
                ->first();
            return response(['jobs' => $job], 200);
        } else {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }
    }

    public function  getJobDetailByTalent($id)
    {
        $job = Job::where('id', $id)->get();
        $job->load('client:id,companyName,companyLogo');
        return response(['job' => $job], 200);
    }

    public function updateJobStatusByDate()
    {
        try {
            $jobs = Job::where('status', 'Vacant')->select('id', 'latestApplyDate', 'status')->get();
            foreach ($jobs as $job) {
                $date = Carbon::parse($job->latestApplyDate);
                if ($date->isPast()) {
                    $job->status = 'Closed';
                    $job->save();
                }
            }
            return response()->json(200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function disableJob($id)
    {
        if (auth()->user()) {
            $job = Job::where('id', $id)->first();

            if ($job) {
                $job->status = 'Disable';
                $job->update();

                $relatedHirings = Hiring::where('jobId', $job->id)
                    ->whereIn('status', ['On Progress', 'Hired'])
                    ->get();
                foreach ($relatedHirings as $hiring) {
                    $hiring->status = 'Cancelled';
                    if ($hiring->lastStage == 1) {
                        $tahapSatu = TahapSatu::where('id', $hiring->firstStageId)->first();
                        $tahapSatu->status = 'Rejected';
                        $tahapSatu->update();
                    } else if ($hiring->lastStage == 2) {
                        if ($hiring->secondStageId != null) {
                            $tahapTengah = TahapTengah::where('id', $hiring->secondStageId)->first();
                            $tahapTengah->status = 'Rejected';
                            $tahapTengah->update();
                        }
                    } else if ($hiring->lastStage == 3) {
                        if ($hiring->thirdtageId != null) {
                            $tahapTengah = TahapTengah::where('id', $hiring->thirdtageId)->first();
                            $tahapTengah->status = 'Rejected';
                            $tahapTengah->update();
                        }
                    } else if ($hiring->lastStage == 4) {
                        if ($hiring->fourthStageId != null) {
                            $tahapEmpat = TahapEmpat::where('id', $hiring->fourthStageId)->first();
                            $tahapEmpat->status = 'Rejected';
                            $tahapEmpat->update();
                        }
                    }
                    $hiring->update();
                }
                $jobReturn = Job::select('id', 'name', 'type', 'status', 'thumbnail', 'kuota', 'hired', 'clientId')
                    ->with('client:id,companyName,picName,companyLogo')
                    ->where('id', $id)
                    ->first();

                return response(['job' => $jobReturn], 200);
            } else {
                return response()->json(['error' => 'Job not found'], 404);
            }
        } else {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }
    }
}
