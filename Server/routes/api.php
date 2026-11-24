<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CheckoutController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\StripeWebhookController;
use App\Http\Controllers\Api\JerseyController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\ClubController;
use App\Http\Controllers\LeagueController;
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

Route::get('/jerseys', [JerseyController::class, 'index'])->name('api.jerseys.index');
Route::get('/jerseys/{jersey}', [JerseyController::class, 'show'])->name('api.jerseys.show');
Route::get('/leagues', [LeagueController::class, 'apiLeague'])->name('api.leagues.index');
Route::get('/clubs', [ClubController::class, 'apiClub'])->name('api.clubs.index');
Route::get('/brands', [BrandController::class, 'apiBrand'])->name('api.brands.index');

Route::middleware('throttle:6,1')->prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
});

// Checkout works for guests; a bearer token, if sent, links the order to the account.
Route::middleware('throttle:20,1')->group(function () {
    Route::post('/checkout/quote', [CheckoutController::class, 'quote']);
    Route::post('/checkout', [CheckoutController::class, 'store']);
    Route::post('/orders/{order:public_token}/cancel', [OrderController::class, 'cancel']);
    Route::post('/orders/{order:public_token}/test-payment', [OrderController::class, 'testPayment']);
});

// The confirmation page polls this while a payment settles.
Route::get('/orders/{order:public_token}', [OrderController::class, 'show'])->middleware('throttle:90,1');

Route::post('/stripe/webhook', StripeWebhookController::class);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me/orders', [OrderController::class, 'mine']);
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
});

