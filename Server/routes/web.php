<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\ClubController;
use App\Http\Controllers\LeagueController;
use App\Http\Middleware\Authentifier;
use App\Http\Middleware\Guest;
use Illuminate\Support\Facades\Route;
use \App\Http\Controllers\JerseyController;

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


Route::middleware("authentifier")->group(function () {
    Route::get('/', function () {return view('layouts/content');})->name('welcome');
    Route::resource('jersey', JerseyController::class);
    Route::resource('brand', BrandController::class);
    Route::resource('league', LeagueController::class);
    Route::resource('club', ClubController::class);
    Route::get('/logout', [AuthController::class, 'logoutB'])->name('auth.logout');
});

Route::middleware(Guest::class)->group(function () {
    Route::get('/login', [AuthController::class, 'loginB'])->name('auth.login');
    Route::post('/login', [AuthController::class, 'signin'])->name('auth.signin');
});



