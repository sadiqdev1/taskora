<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('task_types', function (Blueprint $table) {
            $table->id();
            $table->string('value')->unique();          // e.g. 'tiktok_follow'
            $table->string('label');                    // e.g. 'Follow a TikTok Page'
            $table->string('platform');                 // matches CampaignPlatform enum values
            $table->unsignedInteger('reward');          // canonical reward in NGN (integer kobo-free)
            $table->text('instructions');               // default step-by-step instructions shown to earners
            $table->boolean('is_active')->default(true);
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index(['platform', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('task_types');
    }
};
