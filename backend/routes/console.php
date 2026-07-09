<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

/*
|--------------------------------------------------------------------------
| Scheduled Tasks
|--------------------------------------------------------------------------
| Run `php artisan schedule:run` via a server cron every minute:
|   * * * * * php /path/to/artisan schedule:run >> /dev/null 2>&1
*/

// Expire campaigns whose end date has passed — runs every 15 minutes
Schedule::command('campaigns:expire')->everyFifteenMinutes();
