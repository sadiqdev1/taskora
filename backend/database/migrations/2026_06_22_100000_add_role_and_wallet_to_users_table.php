<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['user', 'admin'])->default('user')->after('email');
            $table->decimal('wallet_balance', 10, 2)->default(0)->after('role');
            $table->decimal('total_earnings', 10, 2)->default(0)->after('wallet_balance');
            $table->string('referral_code', 12)->unique()->nullable()->after('total_earnings');
            $table->unsignedBigInteger('referred_by')->nullable()->after('referral_code');
            $table->boolean('is_verified')->default(false)->after('referred_by');
            $table->string('avatar')->nullable()->after('is_verified');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'role', 'wallet_balance', 'total_earnings',
                'referral_code', 'referred_by', 'is_verified', 'avatar',
            ]);
        });
    }
};
