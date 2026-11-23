<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\ClubController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LeagueController;
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
    Route::get('/', DashboardController::class)->name('welcome');
    Route::resource('jersey', JerseyController::class)->except('show');
    Route::resource('brand', BrandController::class)->except('show');
    Route::resource('league', LeagueController::class)->except('show');
    Route::resource('club', ClubController::class)->except('show');
    Route::post('/logout', [AuthController::class, 'logoutB'])->name('auth.logout');
});

Route::middleware(Guest::class)->group(function () {
    Route::get('/login', [AuthController::class, 'loginB'])->name('auth.login');
    Route::post('/login', [AuthController::class, 'signin'])->middleware('throttle:5,1')->name('auth.signin');
});



