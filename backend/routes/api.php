<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CampaignController;
use App\Http\Controllers\WalletController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Health check
Route::get('/health', fn () => response()->json([
    'status' => 'ok',
    'app'    => config('app.name'),
]));

// ── Auth — public ──────────────────────────────────────────────────────
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// ── Authenticated routes ───────────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);

    // Campaigns (public read, filtered to active)
    Route::get('/campaigns',                   [CampaignController::class, 'index']);
    Route::get('/campaigns/{campaign}',        [CampaignController::class, 'show']);
    Route::post('/campaigns/{campaign}/submit',[CampaignController::class, 'submit']);
    Route::get('/my-submissions',              [CampaignController::class, 'mySubmissions']);

    // Wallet
    Route::get('/wallet',         [WalletController::class, 'summary']);
    Route::get('/transactions',   [WalletController::class, 'transactions']);
    Route::post('/withdraw',      [WalletController::class, 'withdraw']);

    // ── Admin only ─────────────────────────────────────────────────────
    Route::middleware('admin')->prefix('admin')->group(function () {

        // Stats
        Route::get('/stats', [AdminController::class, 'stats']);

        // Users
        Route::get('/users',           [AdminController::class, 'users']);
        Route::patch('/users/{user}',  [AdminController::class, 'updateUser']);

        // Campaigns CRUD
        Route::get('/campaigns',                         [CampaignController::class, 'adminIndex']);
        Route::post('/campaigns',                        [CampaignController::class, 'store']);
        Route::put('/campaigns/{campaign}',              [CampaignController::class, 'update']);
        Route::delete('/campaigns/{campaign}',           [CampaignController::class, 'destroy']);

        // Submissions review
        Route::get('/submissions',                              [AdminController::class, 'pendingSubmissions']);
        Route::patch('/submissions/{submission}/review',        [CampaignController::class, 'reviewSubmission']);

        // Withdrawals
        Route::get('/withdrawals',                             [WalletController::class, 'adminWithdrawals']);
        Route::patch('/withdrawals/{withdrawal}/process',      [WalletController::class, 'processWithdrawal']);
    });
});
