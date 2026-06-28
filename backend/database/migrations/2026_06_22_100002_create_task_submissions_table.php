<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('task_submissions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('campaign_id');
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->text('proof')->nullable(); // URL or screenshot description
            $table->text('rejection_reason')->nullable();
            $table->decimal('earned', 8, 2)->default(0);
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('campaign_id')->references('id')->on('campaigns')->onDelete('cascade');
            $table->unique(['user_id', 'campaign_id']); // one submission per campaign per user
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('task_submissions');
    }
};
