<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Http\Requests\StoreClientRequest;
use App\Http\Requests\UpdateClientRequest;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        if (auth()->user()) {
            $keyword = $request->input('keyword');
            $page = $request->input('page');
            $perPage = $request->input('perPage');
            $clients = [];
            $data = Client::where(function ($query) use ($keyword) {
                $query->where('companyName', 'like', '%' . $keyword . '%')
                    ->orWhere('companyEmail', 'like', '%' . $keyword . '%')
                    ->orWhere('picName', 'like', '%' . $keyword . '%')
                    ->orWhere('picEmail', 'like', '%' . $keyword . '%');
            });
            $count = $data->count();
            $clients = $data->skip(($page - 1) * $perPage)
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
                'clientsCount' => $count,
                'lower' => $lower,
                'upper' => $upper,

            ];
            return response()->json(['clients' => $clients, 'page' => $add]);
        } else {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }
    }

    public function getById($id)
    {
        if (auth()->user()) {
            $client = Client::findOrFail($id);
            return response()->json(['clients' => $client]);
        } else {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }
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
    public function store(StoreClientRequest $request)
    {
        try {
            if (auth()->user()) {
                $validateData = $request->validate([
                    'companyName' => 'required',
                    'companyEmail' => 'required|email',
                    'picName' => 'required',
                    'picEmail' => 'required',
                    'picPhoneNumber' => 'required',
                    'companyLogo' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
                ]);

                $client = new Client($validateData);
                $file = $request->file('companyLogo');
                $filename =  time() . '-' .  str_replace(' ', '_', $file->getClientOriginalName());
                $file->storeAs('public/client', $filename);
                $client->companyLogo = $filename;
                $client->save();
                return Response(['client' => $client], 201);
            } else {
                return response()->json(['error' => 'Unauthenticate'], 401);
            }
        } catch (Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function showEditForm($id)
    {
        $client = Client::find($id);
        return view('client/client_edit_form', compact('client'));
    }

    /**
     * Display the specified resource.
     */
    public function show(Client $client)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id, UpdateClientRequest $request)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update($id, UpdateClientRequest $request)
    {
        if (auth()->user()) {
            try {
                $request->validate([
                    'companyName' => 'required',
                    'companyEmail' => 'required|email',
                    'picName' => 'required',
                    'picEmail' => 'required',
                    'picPhoneNumber' => 'required',
                ]);
                $client = Client::find($id);
                $client->companyName = $request->input('companyName');
                $client->companyEmail = $request->input('companyEmail');
                $client->picName = $request->input('picName');
                $client->picEmail = $request->input('picEmail');
                $client->picPhoneNumber = $request->input('picPhoneNumber');

                if ($request->file('companyLogo')) {
                    $fileNameTemp = $client->companyLogo;
                    if (Storage::fileExists($fileNameTemp)) {
                        Storage::delete($fileNameTemp);
                    }
                    $file = $request->file('companyLogo');
                    $fileName = time() . '-' .  str_replace(' ', '_', $file->getClientOriginalName());
                    $file->storeAs('public/client', $fileName);
                    $client->companyLogo = $fileName;
                }
                $client->save();
                return Response(['clients' => $client], 200);
            } catch (Exception $e) {
                return $e->getMessage();
            }
        } else {
            return response()->json(['error' => 'Unauthenticate'], 401);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Client $client)
    {
        //
    }

    public function delete($id)
    {
        if (auth()->user()) {
            try {
                $client = Client::find($id);
                $client->delete();
            } catch (Exception $e) {
                return response()->json(['error' => $e->getMessage()], 500);
            }
            return response()->json(['succes' => 'success delete client'], 200);;
        } else {
            return response()->json(['error' => 'Unauthenticate'], 401);
        }
    }

    public function clientIdAndName()
    {
        try {
            $user = auth()->user();
            // user bukan admdin tidak bisa akses
            $clients = Client::select('id', 'companyName', 'picName')->orderBy('companyName', 'asc')->get();
            return response()->json(['clients' => $clients], 200);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function getLogo($fileName)
    {
        $path = storage_path('app/public/client/' . $fileName);

        if (!file_exists($path)) {
            abort(404);
        }

        $file = File::get($path);
        $type = File::mimeType($path);

        $response = response($file, 200);
        $response->header("Content-Type", $type);
        return $response;
    }

    public function getClientWithJobs($id)
    {
        try {
            $user = auth()->user();
            // user bukan admdin tidak bisa akses
            $clientWithJobs = Client::with(['jobs:id,name,type,clientId,kontrakStart,kontrakEnd,status,thumbnail'])
                ->where('id', $id)
                ->first();
            return response()->json(['client' => $clientWithJobs], 200);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
