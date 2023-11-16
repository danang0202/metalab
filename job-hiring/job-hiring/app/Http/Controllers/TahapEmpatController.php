<?php

namespace App\Http\Controllers;

use App\Models\Hiring;
use App\Models\TahapEmpat;
use App\Http\Requests\StoreTahapEmpatRequest;
use App\Http\Requests\UpdateTahapEmpatRequest;
use App\Models\Job;
use Illuminate\Http\Request;

class TahapEmpatController extends Controller
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
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTahapEmpatRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(TahapEmpat $tahapEmpat)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(TahapEmpat $tahapEmpat)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTahapEmpatRequest $request, TahapEmpat $tahapEmpat)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TahapEmpat $tahapEmpat)
    {
        //
    }

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
                $hiring = Hiring::where('id', $request->input('idHiring'))->first();
                $hiring->fourthStageId = $tahapEmpat->id;
                $job = Job::where('id', $request->input('idJob'))->first();
                if ($request->input('status') == 'Rejected') {
                    $hiring->status = "Rejected";
                } else {
                    $hiring->status = "Hired";
                    $job->hired = $job->hired + 1;
                    if ($job->hired == $job->kuota) {
                        $job->status = 'Full Hired';
                    }
                    $job->save();
                }
                $hiring->save();
                return response()->json(['tahapEmpat' => $tahapEmpat], 200);
            } catch (\Exception $e) {
                return response()->json(['error' => $e->getMessage()], 500);
            }
        } else {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }
    }
}
