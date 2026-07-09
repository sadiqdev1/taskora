<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Add missing performance indexes to transactions, task_submissions,
 * and campaigns. Notifications already has (user_id, read_at) from
 * the original migration.
 */
return new class extends Migration
{
    public function up(): void
    {
        // ── transactions ──────────────────────────────────────────
        Schema::table('transactions', function (Blueprint $table) {
            // Wallet summary & transaction history filter by user + type
            $table->index(['user_id', 'type'], 'transactions_user_type_idx');
            // Deposit replay-check and reference lookups
            $table->index('reference', 'transactions_reference_idx');
            // Referral bonus queries by related_user_id
            $table->index('related_user_id', 'transactions_related_user_idx');
        });

        // ── task_submissions ──────────────────────────────────────
        Schema::table('task_submissions', function (Blueprint $table) {
            // Admin pending-submissions list + campaign slot queries
            $table->index(['status', 'campaign_id'], 'submissions_status_campaign_idx');
        });
    }

    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropIndex('transactions_user_type_idx');
            $table->dropIndex('transactions_reference_idx');
            $table->dropIndex('transactions_related_user_idx');
        });

        Schema::table('task_submissions', function (Blueprint $table) {
            $table->dropIndex('submissions_status_campaign_idx');
        });
    }
};
