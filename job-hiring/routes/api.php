<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChatDataController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\HiringController;
use App\Http\Controllers\JobController;
use App\Http\Controllers\ResetPasswordController;
use App\Http\Controllers\TahapEmpatController;
use App\Http\Controllers\TahapSatuController;
use App\Http\Controllers\TahapTengahController;
use App\Http\Controllers\User;
use App\Http\Controllers\UserController;
use App\Models\TahapEmpat;
use App\Models\TahapSatu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// bahan percibaan
Route::get('/test/{idHiring}', [HiringController::class, 'deleteHiring']);


Route::post('/register', [AuthController::class, 'register']);

Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
Route::post('/email-verification', [AuthController::class, 'activateEmail']);
Route::post('/send-reset-link', [ResetPasswordController::class, 'sendResetLink']);
Route::post('/reset-password', [ResetPasswordController::class, 'resetPassword']);

// Pengganti crone jobv
Route::get('/update-hiring-status-by-date', [HiringController::class, 'updateHiringStatusByDate']);
Route::get('/update-job-status-by-date', [JobController::class, 'updateJobStatusByDate']);

// Validasi
Route::post('/check-hiring-by-user-and-job', [HiringController::class, 'checkHiringByUserAndJob']);
Route::post('/check-hiring-full-time-constrain', [HiringController::class, 'checkHiringFullTime']);
Route::post('/check-date-tahap-tengah-admin', [TahapTengahController::class, 'checkDate']);
Route::get('/cek-email', [AuthController::class, 'cekEmailNotif']);

//User atau Talent Route
Route::middleware('auth:sanctum')->get('/profil', [UserController::class, 'index']);
Route::middleware('auth:sanctum')->get('/profil-beranda', [AuthController::class, 'profilBeranda']);
Route::middleware('auth:sanctum')->get('/profil-formulir-job', [UserController::class, 'profilFormulirJob']);
Route::middleware('auth:sanctum')->post('/profil/edit/{id}', [UserController::class, 'update']);
Route::middleware('auth:sanctum')->post('/profil/edit-password/{id}', [UserController::class, 'updatePassword']);
Route::get('/storage/avatars/{fileName}', [UserController::class, 'getAvatar']); 


// User by admin
Route::middleware('auth:sanctum')->get('/make-disable/{id}', [UserController::class, 'makeUserDisable']);
Route::middleware('auth:sanctum')->get('/make-enable/{id}', [UserController::class, 'makeUserEnable']);
Route::middleware('auth:sanctum')->post('/get-all-talent', [UserController::class, 'getAllTalent']);
Route::get('/talent/detail/{idTalent}', [UserController::class, 'getTalentById']);
Route::middleware('auth:sanctum')->get('/talent/{id}', [UserController::class, 'getInfoTalentById']);
// Client Route

Route::middleware('auth:sanctum')->post('/get-client', [ClientController::class, 'index']);
Route::middleware('auth:sanctum')->get('/client-id-name', [ClientController::class, 'clientIdAndName']);
Route::middleware('auth:sanctum')->post('/client', [ClientController::class, 'store']);
Route::middleware('auth:sanctum')->get('/client/{id}', [ClientController::class, 'getById']);
Route::middleware('auth:sanctum')->get('/client-with-jobs/{id}', [ClientController::class, 'getClientWithJobs']);
Route::middleware('auth:sanctum')->post('/client/{id}', [ClientController::class, 'update']);
Route::middleware('auth:sanctum')->delete('/client/{id}', [ClientController::class, 'delete']);
Route::get('/storage/client/{fileName}', [ClientController::class, 'getLogo']);

// Client Job
Route::middleware('auth:sanctum')->get('/job', [JobController::class, 'index']);
Route::post('/job-talent', [JobController::class, 'jobsTalent']);
Route::middleware('auth:sanctum')->post('/job-admin', [JobController::class, 'jobsAdmin']);
Route::middleware('auth:sanctum')->post('/job', [JobController::class, 'store']);
Route::middleware('auth:sanctum')->post('/job/{id}', [JobController::class, 'update']);
Route::middleware('auth:sanctum')->delete('/job/{id}', [JobController::class, 'destroy']);
Route::middleware('auth:sanctum')->get('/job/make-disable/{id}', [JobController::class, 'disableJob']);
Route::get('/storage/thumbnails/{fileName}', [JobController::class, 'getThumbnail']); // ini untuk mendapatkan gambar thumnail dari job
Route::middleware('auth:sanctum')->get('/job/{id}', [JobController::class, 'getById']);
Route::get('/job/detail/{id}', [JobController::class, 'getJobDetailByTalent']);

// Hiring
Route::middleware('auth:sanctum')->get('/hiring/data-user-progress', [HiringController::class, 'getProgressRecrutmenByUser']);
Route::middleware('auth:sanctum')->get('/hiring/data-user-hiring', [HiringController::class, 'getHiringUserByUser']);
Route::middleware('auth:sanctum')->get('/hiring/check-disable-job/{idJob}', [HiringController::class, 'checkHiringDataForDisableJob']);
Route::middleware('auth:sanctum')->get('/hiring/get-by-job/{idJob}', [HiringController::class, 'getHiringByJob']);
Route::middleware('auth:sanctum')->get('/hiring/detail/{id}', [HiringController::class, 'getHiringDetail']);
Route::middleware('auth:sanctum')->get('/hiring/tahap-satu-detail/{id}', [TahapSatuController::class, 'getDetailById']);
Route::middleware('auth:sanctum')->post('/job/{idJob}/hiring/apply', [TahapSatuController::class, 'test']);
Route::get('/storage/hiring/{fileName}', [TahapSatuController::class, 'getFileTahapSatu']);
Route::middleware('auth:sanctum')->delete('/hiring/{idHiring}', [HiringController::class, 'deleteHiring']);

// hiring admin
Route::middleware('auth:sanctum')->post('/hiring/data-tabel-admin', [HiringController::class, 'getHiringDataTabelAdmin']);
Route::middleware('auth:sanctum')->get('/hiring/second-stage/detail/{id}', [TahapTengahController::class, 'getTahapTengahById']);
Route::middleware('auth:sanctum')->post('/hiring/second-stage', [TahapTengahController::class, 'save']);
Route::middleware('auth:sanctum')->get('/hiring/data-calender', [HiringController::class, 'getCalenderData']);

// Tahap Satu controller
Route::middleware('auth:sanctum')->post('/first-stage/{id}/input-decision-admin', [TahapSatuController::class, 'inputDecision']);

// Tahap dua Controller
Route::middleware('auth:sanctum')->post('/second-stage/{id}/select-date-user', [TahapTengahController::class, 'selectDateUser']);
Route::middleware('auth:sanctum')->post('/second-stage/{id}/input-link-admin', [TahapTengahController::class, 'inputLink']);
Route::middleware('auth:sanctum')->post('/second-stage/{id}/input-score-admin', [TahapTengahController::class, 'inputScore']);
Route::middleware('auth:sanctum')->post('/second-stage/{id}/input-decision-admin', [TahapTengahController::class, 'inputDecision']);

// Tahap empat
Route::middleware('auth:sanctum')->post('/fourth-stage/input-decision-admin', [TahapEmpatController::class, 'inputDecision']);
Route::middleware('auth:sanctum')->get('/fourth-stage/{id}', [TahapEmpatController::class, 'getFourthStageById']);

// chat
Route::middleware('auth:sanctum')->get('/new-message/get-talent', [UserController::class, 'getTalentNewMsg']);
Route::middleware('auth:sanctum')->post('/chat-by-user', [ChatDataController::class, 'store']);
Route::middleware('auth:sanctum')->get('/chat-by-user', [ChatDataController::class, 'getChatDataUserLogin']);
Route::middleware('auth:sanctum')->get('/chat-list', [ChatDataController::class, 'getChatListAmin']);
Route::middleware('auth:sanctum')->get('/chat-data-admin/{idChat}', [ChatDataController::class, 'getChatDataAdmin']);
Route::middleware('auth:sanctum')->post('/send-chat-admin/{idTalent}', [ChatDataController::class, 'sendChatByAdmin']);
Route::middleware('auth:sanctum')->get('/is-new-chat-present', [ChatDataController::class, 'getIsNewChatPresent']);
Route::get('/storage/chatFiles/{fileName}', [ChatDataController::class, 'getChatDataFile']);