<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Withdrawal;
use Illuminate\Http\Request;

class WalletController extends Controller
{
    /**
     * Wallet summary for the authenticated user.
     */
    public function summary(Request $request)
    {
        $user         = $request->user();
        $lastMonth    = now()->subMonth();
        $lastMonthEarnings = $user->transactions()
            ->where('type', 'earning')
            ->where('created_at', '<', now()->startOfMonth())
            ->where('created_at', '>=', $lastMonth->startOfMonth())
            ->sum('amount');

        $thisMonthEarnings = $user->transactions()
            ->where('type', 'earning')
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->sum('amount');

        return response()->json([
            'wallet_balance'        => $user->wallet_balance,
            'total_earnings'        => $user->total_earnings,
            'this_month_earnings'   => round($thisMonthEarnings, 2),
            'last_month_earnings'   => round($lastMonthEarnings, 2),
            'tasks_completed'       => $user->tasks_completed,
            'success_rate'          => $user->success_rate,
            'referral_code'         => $user->referral_code,
            'referrals_count'       => $user->referredUsers()->count(),
        ]);
    }

    /**
     * Transaction history.
     */
    public function transactions(Request $request)
    {
        $transactions = $request->user()
            ->transactions()
            ->latest()
            ->paginate(20);

        return response()->json($transactions);
    }

    /**
     * Request a withdrawal.
     */
    public function withdraw(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'amount'          => ['required', 'numeric', 'min:10'],
            'payment_method'  => ['required', 'in:paypal,bank,crypto'],
            'payment_details' => ['required', 'string', 'max:255'],
        ]);

        if ($user->wallet_balance < $data['amount']) {
            return response()->json(['message' => 'Insufficient balance.'], 422);
        }

        $withdrawal = Withdrawal::create([
            'user_id'         => $user->id,
            'amount'          => $data['amount'],
            'payment_method'  => $data['payment_method'],
            'payment_details' => $data['payment_details'],
        ]);

        // Reserve funds immediately
        $user->decrement('wallet_balance', $data['amount']);

        Transaction::create([
            'user_id'                => $user->id,
            'type'                   => 'withdrawal',
            'amount'                 => $data['amount'],
            'status'                 => 'pending',
            'description'            => "Withdrawal request via {$data['payment_method']}",
            'balance_after'          => $user->fresh()->wallet_balance,
            'transactionable_type'   => Withdrawal::class,
            'transactionable_id'     => $withdrawal->id,
        ]);

        return response()->json([
            'message'    => 'Withdrawal request submitted.',
            'withdrawal' => $withdrawal,
        ], 201);
    }

    /**
     * Admin: list all pending withdrawals.
     */
    public function adminWithdrawals(Request $request)
    {
        $withdrawals = Withdrawal::with('user:id,name,email')
            ->where('status', 'pending')
            ->latest()
            ->paginate(20);

        return response()->json($withdrawals);
    }

    /**
     * Admin: process a withdrawal.
     */
    public function processWithdrawal(Request $request, Withdrawal $withdrawal)
    {
        $data = $request->validate([
            'status'           => ['required', 'in:completed,rejected'],
            'rejection_reason' => ['nullable', 'string'],
        ]);

        if ($withdrawal->status !== 'pending') {
            return response()->json(['message' => 'Already processed.'], 422);
        }

        $withdrawal->update([
            'status'           => $data['status'],
            'rejection_reason' => $data['rejection_reason'] ?? null,
            'processed_at'     => now(),
        ]);

        // If rejected, refund
        if ($data['status'] === 'rejected') {
            $withdrawal->user->increment('wallet_balance', $withdrawal->amount);
            Transaction::create([
                'user_id'     => $withdrawal->user_id,
                'type'        => 'deposit',
                'amount'      => $withdrawal->amount,
                'description' => 'Withdrawal refunded: ' . ($data['rejection_reason'] ?? 'Rejected'),
                'balance_after' => $withdrawal->user->fresh()->wallet_balance,
            ]);
        }

        return response()->json($withdrawal);
    }
}
