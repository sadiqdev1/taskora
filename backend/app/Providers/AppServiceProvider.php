<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void {}

    public function boot(): void
    {
        // ── Rate Limiters ────────────────────────────────────────────
        // Strict limit for authentication attempts (login / register)
        RateLimiter::for('auth', function (Request $request) {
            return Limit::perMinute(10)->by($request->ip());
        });

        // Strict limit for password reset requests
        RateLimiter::for('password-reset', function (Request $request) {
            return Limit::perMinute(3)->by(
                $request->ip() . '|' . $request->input('email', '')
            );
        });

        // General API limit per authenticated user / IP
        RateLimiter::for('api', function (Request $request) {
            return $request->user()
                ? Limit::perMinute(120)->by($request->user()->id)
                : Limit::perMinute(30)->by($request->ip());
        });

        // Bank-resolve proxy (external call — tighter limit)
        RateLimiter::for('bank-resolve', function (Request $request) {
            return Limit::perMinute(15)->by($request->user()?->id ?? $request->ip());
        });

        // Task submission — per user per minute to prevent spam
        RateLimiter::for('task-submit', function (Request $request) {
            return Limit::perMinute(20)->by($request->user()?->id ?? $request->ip());
        });
    }
}
