<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Campaigns table — all columns in one place.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('campaigns', function (Blueprint $table) {
            $table->id();
            $table->string('slug', 20)->nullable()->unique();
            $table->unsignedBigInteger('created_by');
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('platform');                              // instagram, tiktok, youtube, twitter, facebook, other
            $table->string('platform_icon')->nullable();
            $table->decimal('reward_per_task', 8, 2)->default(0.25);
            $table->unsignedInteger('total_slots')->default(100);
            $table->unsignedInteger('filled_slots')->default(0);
            $table->enum('status', ['active', 'paused', 'completed', 'draft'])->default('draft');
            $table->string('category')->default('social');           // social, video, survey, download
            $table->string('difficulty')->default('easy');           // easy, medium, hard
            $table->text('instructions')->nullable();
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->timestamps();

            $table->foreign('created_by')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('campaigns');
    }
};
