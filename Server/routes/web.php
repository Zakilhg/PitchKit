<?php

use App\Http\Controllers\Admin\DiscountCodeController;
use App\Http\Controllers\Admin\OrderController;
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


// The admin panel lives under /admin; the bare paths forward there so old
// links and bookmarks keep working.
Route::redirect('/', '/admin');
Route::redirect('/login', '/admin/login');

Route::prefix('admin')->group(function () {
    Route::middleware("authentifier")->group(function () {
        Route::get('/', DashboardController::class)->name('welcome');
        Route::get('order', [OrderController::class, 'index'])->name('order.index');
        Route::get('order/{order}', [OrderController::class, 'show'])->name('order.show');
        Route::post('order/{order}/fulfil', [OrderController::class, 'fulfil'])->name('order.fulfil');
        Route::post('order/{order}/cancel', [OrderController::class, 'cancel'])->name('order.cancel');
        Route::resource('discount-code', DiscountCodeController::class)->except('show');
        Route::resource('jersey', JerseyController::class)->except('show');
        Route::resource('brand', BrandController::class)->except('show');
        Route::resource('league', LeagueController::class)->except('show');
        Route::resource('club', ClubController::class)->except('show');
        Route::post('/logout', [AuthController::class, 'logoutB'])->name('auth.logout');
    });

    Route::middleware(Guest::class)->group(function () {
        Route::get('/login', [AuthController::class, 'loginB'])->name('auth.login');
        Route::post('/login', [AuthController::class, 'signin'])->middleware('throttle:admin-login')->name('auth.signin');
    });
});
