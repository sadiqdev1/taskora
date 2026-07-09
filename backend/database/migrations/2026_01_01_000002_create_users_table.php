<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Users table — all columns in one place. No update migrations.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('username')->nullable()->unique();
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('email_verification_token')->nullable();
            $table->string('password')->nullable();          // nullable for OAuth-only accounts
            $table->rememberToken();

            // Role & status
            $table->enum('role', ['user', 'admin'])->default('user');
            $table->boolean('is_verified')->default(false);
            $table->timestamp('banned_at')->nullable();
            $table->string('ban_reason')->nullable();

            // Profile
            $table->string('avatar')->nullable();            // single avatar field (Cloudinary URL or null)

            // Google OAuth
            $table->string('google_id')->nullable()->unique();

            // Wallet
            $table->decimal('wallet_balance',  10, 2)->default(0);
            $table->decimal('pending_balance', 10, 2)->default(0);
            $table->decimal('total_earnings',  10, 2)->default(0);

            // Referrals
            $table->string('referral_code', 12)->nullable()->unique();
            $table->unsignedBigInteger('referred_by')->nullable();

            // Bank account stored as JSON: { bank_code, bank_name, account_number, account_name }
            $table->json('bank_account')->nullable();

            $table->timestamps();

            $table->foreign('referred_by')->references('id')->on('users')->onDelete('set null');
        });

        // Sanctum personal access tokens
        Schema::create('personal_access_tokens', function (Blueprint $table) {
            $table->id();
            $table->morphs('tokenable');
            $table->text('name');
            $table->string('token', 64)->unique();
            $table->text('abilities')->nullable();
            $table->timestamp('last_used_at')->nullable();
            $table->timestamp('expires_at')->nullable()->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('personal_access_tokens');
        Schema::dropIfExists('users');
    }
};
