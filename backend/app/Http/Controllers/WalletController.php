<?php

namespace App\Http\Controllers;

use App\Enums\TransactionStatus;
use App\Enums\TransactionType;
use App\Enums\WithdrawalStatus;
use App\Models\Transaction;
use App\Models\Withdrawal;
use App\Services\EmailService;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class WalletController extends Controller
{
    public function summary(Request $request): JsonResponse
    {
        $user = $request->user();

        $thisMonthEarnings = $user->transactions()
            ->where('type', TransactionType::Earning)
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->sum('amount');

        $lastMonthEarnings = $user->transactions()
            ->where('type', TransactionType::Earning)
            ->whereMonth('created_at', now()->subMonth()->month)
            ->whereYear('created_at', now()->subMonth()->year)
            ->sum('amount');

        return response()->json([
            'wallet_balance'      => $user->wallet_balance,
            'pending_balance'     => $user->pending_balance,
            'total_earnings'      => $user->total_earnings,
            'this_month_earnings' => round((float) $thisMonthEarnings, 2),
            'last_month_earnings' => round((float) $lastMonthEarnings, 2),
            'tasks_completed'     => $user->tasks_completed,
            'tasks_submitted'     => $user->taskSubmissions()->count(),
            'success_rate'        => $user->success_rate,
            'referral_code'       => $user->referral_code,
            'referrals_count'     => $user->referredUsers()->count(),
            'bank_set_up'         => $user->bank_set_up,
            'bank_account'        => $user->bank_account,
        ]);
    }

    public function transactions(Request $request): JsonResponse
    {
        return response()->json($request->user()->transactions()->latest()->paginate(20));
    }

    public function withdraw(Request $request): JsonResponse
    {
        $user = $request->user();
        $data = $request->validate([
            'amount'         => ['required', 'numeric', 'min:500'],
            'bank_code'      => ['required', 'string'],
            'bank_name'      => ['required', 'string'],
            'account_number' => ['required', 'string', 'size:10'],
            'account_name'   => ['required', 'string'],
        ]);

        DB::transaction(function () use ($user, $data, &$withdrawal) {
            $freshUser = \App\Models\User::lockForUpdate()->find($user->id);

            if ((float) $freshUser->wallet_balance < (float) $data['amount']) {
                throw \Illuminate\Validation\ValidationException::withMessages([
                    'amount' => ['Insufficient balance.'],
                ]);
            }
            if (Withdrawal::where('user_id', $freshUser->id)->where('status', WithdrawalStatus::Pending)->exists()) {
                throw \Illuminate\Validation\ValidationException::withMessages([
                    'amount' => ['You already have a pending withdrawal. Please wait for it to be processed.'],
                ]);
            }

            $withdrawal = Withdrawal::create([
                'user_id'         => $freshUser->id,
                'amount'          => $data['amount'],
                'status'          => WithdrawalStatus::Pending,
                'payment_method'  => 'bank',
                'payment_details' => "{$data['account_name']} — {$data['bank_name']}",
                'bank_code'       => $data['bank_code'],
                'bank_name'       => $data['bank_name'],
                'account_number'  => $data['account_number'],
                'account_name'    => $data['account_name'],
                'reference'       => 'WD-' . strtoupper(Str::random(12)),
            ]);

            $freshUser->decrement('wallet_balance', $data['amount']);

            Transaction::create([
                'user_id'              => $freshUser->id,
                'type'                 => TransactionType::Withdrawal,
                'amount'               => $data['amount'],
                'status'               => TransactionStatus::Pending,
                'description'          => "Withdrawal to {$data['bank_name']} ({$data['account_number']})",
                'reference'            => $withdrawal->reference,
                'balance_after'        => $freshUser->fresh()->wallet_balance,
                'transactionable_type' => Withdrawal::class,
                'transactionable_id'   => $withdrawal->id,
            ]);

            $freshUser->update(['bank_account' => [
                'bank_code'      => $data['bank_code'],
                'bank_name'      => $data['bank_name'],
                'account_number' => $data['account_number'],
                'account_name'   => $data['account_name'],
            ]]);
        });

        return response()->json(['message' => 'Withdrawal request submitted successfully.', 'withdrawal' => $withdrawal], 201);
    }

    public function initializeDeposit(Request $request): JsonResponse
    {
        $data       = $request->validate(['amount' => ['required', 'numeric', 'min:100']]);
        $user       = $request->user();
        $reference  = 'TKDEP-' . strtoupper(\Illuminate\Support\Str::random(12));
        $amountKobo = (int) round((float) $data['amount'] * 100);

        $response = \Illuminate\Support\Facades\Http::withHeaders([
            'Authorization' => 'Bearer ' . config('services.paystack.secret_key'),
            'Content-Type'  => 'application/json',
        ])->post('https://api.paystack.co/transaction/initialize', [
            'email'        => $user->email,
            'amount'       => $amountKobo,
            'currency'     => 'NGN',
            'reference'    => $reference,
            'callback_url' => config('app.frontend_url') . '/wallet/deposit/callback',
            'metadata'     => ['user_id' => $user->id, 'cancel_action' => config('app.frontend_url') . '/wallet/deposit'],
        ]);

        $json = $response->json();
        if (! ($json['status'] ?? false)) {
            return response()->json(['message' => $json['message'] ?? 'Could not initialize payment.'], 422);
        }

        return response()->json(['authorization_url' => $json['data']['authorization_url'], 'reference' => $reference, 'amount' => $data['amount']]);
    }

    public function verifyDeposit(Request $request): JsonResponse
    {
        $data = $request->validate(['reference' => ['required', 'string']]);

        $response = \Illuminate\Support\Facades\Http::withHeaders([
            'Authorization' => 'Bearer ' . config('services.paystack.secret_key'),
        ])->get("https://api.paystack.co/transaction/verify/{$data['reference']}");

        $txData = $response->json()['data'] ?? null;
        if (!$txData || $txData['status'] !== 'success') {
            return response()->json(['message' => 'Payment verification failed.'], 422);
        }

        $verifiedAmount   = $txData['amount'] / 100;
        $user             = $request->user();
        $alreadyProcessed = false;
        $walletBalance    = 0;

        DB::transaction(function () use ($data, $user, $verifiedAmount, &$alreadyProcessed, &$walletBalance) {
            if (Transaction::where('reference', $data['reference'])->lockForUpdate()->exists()) {
                $alreadyProcessed = true;
                return;
            }
            $freshUser = \App\Models\User::lockForUpdate()->find($user->id);
            $freshUser->increment('wallet_balance', $verifiedAmount);
            Transaction::create([
                'user_id'       => $freshUser->id,
                'type'          => TransactionType::Deposit,
                'amount'        => $verifiedAmount,
                'status'        => TransactionStatus::Completed,
                'description'   => "Paystack deposit · Ref: {$data['reference']}",
                'reference'     => $data['reference'],
                'balance_after' => $freshUser->fresh()->wallet_balance,
            ]);
            $walletBalance = $freshUser->fresh()->wallet_balance;
        });

        if ($alreadyProcessed) {
            return response()->json(['message' => 'This payment has already been processed.'], 422);
        }
        return response()->json(['message' => 'Deposit successful.', 'amount_credited' => $verifiedAmount, 'wallet_balance' => $walletBalance]);
    }

    public function saveBankAccount(Request $request): JsonResponse
    {
        $data = $request->validate([
            'bank_code'      => ['required', 'string'],
            'bank_name'      => ['required', 'string'],
            'account_number' => ['required', 'string', 'size:10'],
            'account_name'   => ['required', 'string'],
        ]);
        $request->user()->update(['bank_account' => $data]);
        return response()->json(['message' => 'Bank account saved.', 'bank_account' => $data]);
    }

    public function resolveBank(Request $request): JsonResponse
    {
        $request->validate([
            'account_number' => ['required', 'string', 'size:10'],
            'bank_code'      => ['required', 'string'],
        ]);

        try {
            $nuban  = new \Nubanstack\Nubanstack(config('services.paystack.secret_key'));
            $result = $nuban->validateAccount($request->account_number, $request->bank_code);
            return response()->json([
                'status'  => true,
                'message' => 'Account number resolved',
                'data'    => [
                    'account_number' => $result['account_number'],
                    'account_name'   => $result['account_name'],
                    'bank_id'        => $result['bank_id'] ?? null,
                ],
            ]);
        } catch (\Exception) { /* fall back to Paystack */ }

        $response = \Illuminate\Support\Facades\Http::timeout(10)
            ->withHeaders(['Authorization' => 'Bearer ' . config('services.paystack.secret_key')])
            ->get('https://api.paystack.co/bank/resolve', [
                'account_number' => $request->account_number,
                'bank_code'      => $request->bank_code,
            ]);

        $json   = $response->json();
        $status = $response->status();

        if ($status === 400 || ($json['type'] ?? '') === 'validation_error') {
            return response()->json([
                'status'          => false,
                'message'         => 'Account name lookup not supported for this bank. You can enter it manually.',
                'manual_required' => true,
            ], 200);
        }

        return response()->json($json, $status);
    }

    /* ── Admin: list withdrawals ── */
    public function adminWithdrawals(Request $request): JsonResponse
    {
        $query = Withdrawal::with('user:id,name,email,avatar')->latest();

        $status = $request->status;
        if ($status && $status !== 'all') {
            $query->where('status', WithdrawalStatus::from($status));
        } elseif (!$status) {
            $query->where('status', WithdrawalStatus::Pending);
        }

        return response()->json($query->paginate(20));
    }

    /* ── Admin: approve / reject a withdrawal ── */
    public function processWithdrawal(Request $request, Withdrawal $withdrawal): JsonResponse
    {
        $data = $request->validate([
            'status'           => ['required', \Illuminate\Validation\Rule::enum(WithdrawalStatus::class)],
            'rejection_reason' => ['nullable', 'string', 'max:500'],
        ]);

        if ($withdrawal->status !== WithdrawalStatus::Pending) {
            return response()->json(['message' => 'This withdrawal has already been processed.'], 422);
        }

        $newStatus = WithdrawalStatus::from($data['status']);

        DB::transaction(function () use ($withdrawal, $data, $newStatus) {
            $withdrawal->update([
                'status'           => $newStatus,
                'rejection_reason' => $data['rejection_reason'] ?? null,
                'processed_at'     => now(),
            ]);

            Transaction::where('transactionable_type', Withdrawal::class)
                ->where('transactionable_id', $withdrawal->id)
                ->update(['status' => $newStatus === WithdrawalStatus::Completed
                    ? \App\Enums\TransactionStatus::Completed
                    : \App\Enums\TransactionStatus::Cancelled]);

            if ($newStatus === WithdrawalStatus::Rejected) {
                $withdrawal->user->increment('wallet_balance', $withdrawal->amount);
                Transaction::create([
                    'user_id'       => $withdrawal->user_id,
                    'type'          => TransactionType::Deposit,
                    'amount'        => $withdrawal->amount,
                    'status'        => \App\Enums\TransactionStatus::Completed,
                    'description'   => 'Withdrawal refunded: ' . ($data['rejection_reason'] ?? 'Rejected by admin'),
                    'balance_after' => $withdrawal->user->fresh()->wallet_balance,
                ]);
            }

            NotificationService::withdrawal($withdrawal->user_id, (float) $withdrawal->amount, $newStatus->value);
            try {
                (new EmailService())->sendWithdrawalUpdate(
                    $withdrawal->user->email,
                    $withdrawal->user->name,
                    (float) $withdrawal->amount,
                    $newStatus->value
                );
            } catch (\Exception) {}
        });

        return response()->json($withdrawal->fresh());
    }

    /* ── Referrals ── */
    public function referrals(Request $request): JsonResponse
    {
        $user = $request->user();

        $referrals = $user->referredUsers()
            ->select(['id', 'name', 'email', 'created_at', 'total_earnings'])
            ->latest()
            ->get()
            ->map(function ($ref) use ($user) {
                $bonusEarned = Transaction::where('user_id', $user->id)
                    ->where('type', TransactionType::ReferralBonus)
                    ->where('related_user_id', $ref->id)
                    ->sum('amount');

                return [
                    'id'                 => $ref->id,
                    'name'               => $ref->name,
                    'email'              => $ref->email,
                    'joined'             => $ref->created_at?->toDateString(),
                    'earnings_generated' => round((float) $ref->total_earnings, 2),
                    'bonus_earned'       => round((float) $bonusEarned, 2),
                    'status'             => $ref->total_earnings > 0 ? 'active' : 'pending',
                ];
            });

        $totalBonus = Transaction::where('user_id', $user->id)
            ->where('type', TransactionType::ReferralBonus)
            ->sum('amount');

        return response()->json([
            'data'        => $referrals,
            'total_count' => $referrals->count(),
            'total_bonus' => round((float) $totalBonus, 2),
        ]);
    }
}
