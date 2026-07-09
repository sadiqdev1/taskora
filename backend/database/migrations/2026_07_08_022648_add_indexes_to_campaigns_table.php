<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Add indexes to campaigns table and task_link column for the
 * task_link field that was validated but never stored.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('campaigns', function (Blueprint $table) {
            // Campaign::active() scope and status filters
            $table->index('status', 'campaigns_status_idx');
            // "My campaigns" filter (created_by)
            $table->index('created_by', 'campaigns_created_by_idx');
            // Campaign expiry scheduler queries
            $table->index('ends_at', 'campaigns_ends_at_idx');

            // task_link was validated in userStore but never persisted —
            // add the column so it can actually be stored
            $table->string('task_link', 500)->nullable()->after('instructions');
        });
    }

    public function down(): void
    {
        Schema::table('campaigns', function (Blueprint $table) {
            $table->dropIndex('campaigns_status_idx');
            $table->dropIndex('campaigns_created_by_idx');
            $table->dropIndex('campaigns_ends_at_idx');
            $table->dropColumn('task_link');
        });
    }
};
