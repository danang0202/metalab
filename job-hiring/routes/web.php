<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\JobController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/
// Route::get('/', function () {
//     return view('beranda');
// });


Route::get('/test', function(){
    return view('emails.notifLink');
});

// // Route untuk client start
// Route::post('/api/client',[ClientController::class, 'store'])->name('client.save');
// Route::get('/api/client',[ClientController::class, 'index'])->name('client.showAll');
// Route::get('/search', [ClientController::class,'liveSearch'])->name('client-live-search');
// Route::get('/client-edit/{id}',[ClientController::class,'showEditForm'])->name('client.edit');
// Route::post('/edit-action',[ClientController::class,'edit'])->name('edit.action');
// Route::get('/client-delete/{id}',[ClientController::class,'delete'])->name('client.delete');


// // Route untuk job
// Route::get('/jobs-show',[JobController::class,'index'])->name('job.showAll');
// Route::get('/jobs-input',[JobController::class,'create'])->name('job.form');
// Route::post('/job-input/action',[JobController::class,'store'])->name('job.save');
