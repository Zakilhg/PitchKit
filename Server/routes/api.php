<?php

use App\Http\Controllers\JerseyController;
use App\Http\Controllers\LeagueController;
use App\Http\Controllers\ClubController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
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

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
//
Route::get('/jersey', [JerseyController::class, 'apiJersey'])->name('apiJersey');
Route::get('/jersey/{id}', [JerseyController::class, 'show']);
Route::get('/league', [LeagueController::class, 'apiLeague'])->name('apiLeague');
Route::get('/club', [ClubController::class, 'apiClub'])->name('apiClub');
Route::get('/brand', [BrandController::class, 'apiBrand'])->name('apiBrand');


// Login route
Route::post('/auth/login', [AuthController::class,'login']);

// Registration route
Route::post('/auth/register', [AuthController::class,'register']);

// Logout route
Route::post('/logout/{id}', [AuthController::class, 'logout']);


Route::get('/user/{id}', [UserController::class, 'getUser']);
Route::put('/user/{id}', [UserController::class, 'updateUser']);


