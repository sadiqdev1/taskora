<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CampaignController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\OnboardingController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WalletController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes — Taskora
|--------------------------------------------------------------------------
|
| Auth:     POST /register  POST /login  POST /logout  GET /me
|           POST /forgot-password  POST /reset-password
|           GET  /auth/google/redirect  GET /auth/google/callback
|           POST /auth/google/token   (SPA one-tap)
|
| User:     GET/POST /profile
|           GET /campaigns  GET /campaigns/{id}
|           POST /tasks/{id}/submit
|           GET /my-submissions
|           GET /wallet  GET /transactions
|           POST /withdraw  POST /bank-account
|           GET /bank/resolve?account_number=&bank_code=
|
| Admin:    GET /admin/stats  GET|PATCH /admin/users
|           GET|POST /admin/campaigns  PUT|DELETE /admin/campaigns/{id}
|           GET /admin/submissions  PATCH /admin/submissions/{id}/review
|           GET /admin/withdrawals  PATCH /admin/withdrawals/{id}/process
*/

// ── Health check ──────────────────────────────────────────────────────
Route::get('/health', fn () => response()->json([
    'status'  => 'ok',
    'app'     => config('app.name'),
    'version' => '1.0.0',
]));

// ── Public platform stats (for landing page) ──────────────────────────
Route::get('/public/stats', [AdminController::class, 'publicStats'])
    ->middleware('throttle:60,1');

// ── Task types catalogue (public, cached) ─────────────────────────────
Route::get('/task-types', [CampaignController::class, 'taskTypes'])
    ->middleware('throttle:60,1');

// ── Public auth (rate-limited) ────────────────────────────────────────
Route::middleware('throttle:auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login',    [AuthController::class, 'login']);
});

Route::middleware('throttle:password-reset')->group(function () {
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password',  [AuthController::class, 'resetPassword']);
});

// Google OAuth — web redirect flow
Route::get('/auth/google/redirect', [AuthController::class, 'googleRedirect'])
    ->name('google.redirect');
Route::get('/auth/google/callback', [AuthController::class, 'googleCallback'])
    ->name('google.callback');

// Google OAuth — SPA token exchange (Next.js uses this)
Route::post('/auth/google/token', [AuthController::class, 'googleTokenExchange']);

// Google OAuth — code exchange after redirect flow (replaces token-in-URL)
Route::post('/auth/google/exchange', [AuthController::class, 'exchangeOAuthCode']);

// ── Email verification (public, token in URL) ─────────────────────────
Route::get('/email/verify/{token}', [AuthController::class, 'verifyEmail']);
Route::get('/users/{username}', [ProfileController::class, 'show']);
Route::get('/leaderboard',      [ProfileController::class, 'leaderboard']);
Route::middleware(['auth:sanctum'])->group(function () {

    // ── Auth / Profile ──────────────────────────────────────────────
    Route::post('/logout',         [AuthController::class,  'logout']);
    Route::get('/me',              [AuthController::class,  'me']);
    Route::post('/profile',        [AuthController::class,  'updateProfile']);
    Route::post('/change-password',[AuthController::class,  'changePassword']);
    Route::delete('/account',      [AuthController::class,  'deleteAccount']);

    // ── Social Profile ───────────────────────────────────────────────
    Route::get('/profile/me',      [ProfileController::class, 'me']);
    Route::post('/profile/update', [ProfileController::class, 'update']);

    // ── Email verification (authenticated resend) ────────────────────
    Route::post('/email/resend',   [AuthController::class, 'resendVerification']);

    // ── Notifications ────────────────────────────────────────────────
    Route::get('/notifications',              [NotificationController::class, 'index']);
    Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount']);
    Route::patch('/notifications/read-all',   [NotificationController::class, 'markAllRead']);
    Route::patch('/notifications/{appNotif}/read', [NotificationController::class, 'markRead']);

    // ── Onboarding ───────────────────────────────────────────────────
    Route::get('/onboarding',          [OnboardingController::class, 'show']);
    Route::post('/onboarding/complete',[OnboardingController::class, 'complete']);

    // ── Campaigns / Tasks (read same data, two URL prefixes) ────────
    foreach (['/campaigns', '/tasks'] as $prefix) {
        Route::get($prefix,                      [CampaignController::class, 'index']);
        Route::get("{$prefix}/{campaign}",       [CampaignController::class, 'show']);
        Route::post("{$prefix}/{campaign}/submit",[CampaignController::class, 'submit'])
            ->middleware('throttle:task-submit');
    }
    Route::post('/campaigns',         [CampaignController::class, 'userStore']);
    Route::get('/my-submissions', [CampaignController::class, 'mySubmissions']);

    // ── Wallet ───────────────────────────────────────────────────────
    Route::get('/wallet',         [WalletController::class, 'summary']);
    Route::get('/transactions',   [WalletController::class, 'transactions']);
    Route::post('/withdraw',      [WalletController::class, 'withdraw']);
    Route::post('/bank-account',  [WalletController::class, 'saveBankAccount']);
    Route::post('/deposit/initialize',[WalletController::class, 'initializeDeposit']);
    Route::post('/deposit/verify',[WalletController::class, 'verifyDeposit']);
    Route::get('/bank/resolve',   [WalletController::class, 'resolveBank'])
        ->middleware('throttle:bank-resolve');
    Route::get('/referrals',      [WalletController::class, 'referrals']);

    // ── Admin ────────────────────────────────────────────────────────
    Route::middleware('admin')->prefix('admin')->group(function () {

        Route::get('/stats', [AdminController::class, 'stats']);

        Route::get('/users',           [AdminController::class, 'users']);
        Route::patch('/users/{user}',  [AdminController::class, 'updateUser']);

        Route::get('/campaigns',              [CampaignController::class, 'adminIndex']);
        Route::post('/campaigns',             [CampaignController::class, 'store']);
        Route::put('/campaigns/{campaign}',   [CampaignController::class, 'update']);
        Route::delete('/campaigns/{campaign}',[CampaignController::class, 'destroy']);

        Route::get('/submissions',                           [AdminController::class, 'pendingSubmissions']);
        Route::patch('/submissions/{submission}/review',     [CampaignController::class, 'reviewSubmission']);

        Route::get('/withdrawals',                           [WalletController::class, 'adminWithdrawals']);
        Route::patch('/withdrawals/{withdrawal}/process',    [WalletController::class, 'processWithdrawal']);

        Route::get('/task-types',                    [AdminController::class, 'taskTypeIndex']);
        Route::patch('/task-types/{taskType}',       [AdminController::class, 'taskTypeUpdate']);
    });
});
