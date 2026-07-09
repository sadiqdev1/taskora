<?php

namespace App\Console\Commands;

use App\Enums\CampaignStatus;
use App\Models\Campaign;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class ExpireOldCampaigns extends Command
{
    protected $signature   = 'campaigns:expire';
    protected $description = 'Mark campaigns as completed when their end date has passed';

    public function handle(): int
    {
        $count = Campaign::where('status', CampaignStatus::Active)
            ->whereNotNull('ends_at')
            ->where('ends_at', '<', now())
            ->update(['status' => CampaignStatus::Completed]);

        $this->info("Expired {$count} campaign(s).");
        Log::info("campaigns:expire — closed {$count} expired campaign(s).");

        return self::SUCCESS;
    }
}
