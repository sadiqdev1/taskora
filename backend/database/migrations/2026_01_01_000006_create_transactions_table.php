<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Transactions table — all columns in one place.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->enum('type', ['earning', 'withdrawal', 'deposit', 'referral_bonus', 'bonus'])->default('earning');
            $table->decimal('amount', 10, 2);
            $table->enum('status', ['pending', 'completed', 'failed', 'cancelled'])->default('completed');
            $table->string('description')->nullable();
            $table->string('reference')->nullable();        // external payment reference
            $table->decimal('balance_after', 10, 2)->default(0);
            $table->nullableMorphs('transactionable');     // polymorphic: task_submission or withdrawal
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
