<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            // Tracks which user triggered a referral_bonus so we can query
            // "how much did I earn from referring user X" without string matching.
            $table->unsignedBigInteger('related_user_id')->nullable()->after('user_id');
        });
    }

    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropColumn('related_user_id');
        });
    }
};
