<?php

namespace App\Http\Controllers;

use App\Enums\CampaignStatus;
use App\Enums\SubmissionStatus;
use App\Enums\TransactionStatus;
use App\Enums\TransactionType;
use App\Enums\UserRole;
use App\Enums\WithdrawalStatus;
use App\Models\Campaign;
use App\Models\TaskSubmission;
use App\Models\TaskType;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Withdrawal;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Validation\Rule;

class AdminController extends Controller
{
    /* ──────────────────────────────────────────────────────
     | PUBLIC STATS — safe subset for the landing page
     |  Cached for 5 minutes to avoid hammering the DB
     ────────────────────────────────────────────────────── */
    public function publicStats(): JsonResponse
    {
        $data = \Illuminate\Support\Facades\Cache::remember('public_stats', 300, function () {
            return [
                'total_users'           => User::where('role', UserRole::User)->count(),
                'active_campaigns'      => Campaign::where('status', CampaignStatus::Active)->count(),
                'total_paid_out'        => (float) Transaction::where('type', TransactionType::Withdrawal)
                                                ->where('status', TransactionStatus::Completed)->sum('amount'),
                'total_earned_by_users' => (float) Transaction::where('type', TransactionType::Earning)->sum('amount'),
            ];
        });

        return response()->json($data);
    }

    /* ──────────────────────────────────────────────────────
     | PLATFORM STATS
     ────────────────────────────────────────────────────── */
    public function stats(): JsonResponse
    {
        return response()->json([
            'total_users'           => User::where('role', UserRole::User)->count(),
            'total_campaigns'       => Campaign::count(),
            'active_campaigns'      => Campaign::where('status', CampaignStatus::Active)->count(),
            'pending_submissions'   => TaskSubmission::where('status', SubmissionStatus::Pending)->count(),
            'pending_withdrawals'   => Withdrawal::where('status', WithdrawalStatus::Pending)->count(),
            'total_paid_out'        => (float) Transaction::where('type', TransactionType::Withdrawal)
                                            ->where('status', TransactionStatus::Completed)->sum('amount'),
            'total_earned_by_users' => (float) Transaction::where('type', TransactionType::Earning)->sum('amount'),
            'new_users_this_month'  => User::whereMonth('created_at', now()->month)
                                            ->whereYear('created_at', now()->year)
                                            ->where('role', UserRole::User)->count(),
            'new_users_today'       => User::whereDate('created_at', today())
                                            ->where('role', UserRole::User)->count(),
            'chart'                 => $this->chartData(),
        ]);
    }

    private function chartData(): array
    {
        $days = collect(range(29, 0))->map(function ($daysAgo) {
            $date = now()->subDays($daysAgo)->toDateString();
            return [
                'date'        => now()->subDays($daysAgo)->format('M d'),
                'earnings'    => (float) Transaction::where('type', TransactionType::Earning)
                                    ->whereDate('created_at', $date)->sum('amount'),
                'new_users'   => User::where('role', UserRole::User)
                                    ->whereDate('created_at', $date)->count(),
                'submissions' => TaskSubmission::whereDate('created_at', $date)->count(),
            ];
        });
        return $days->values()->all();
    }

    /* ──────────────────────────────────────────────────────
     | LIST USERS — filterable, searchable, paginated
     ────────────────────────────────────────────────────── */
    public function users(Request $request): JsonResponse
    {
        $query = User::where('role', UserRole::User)->withCount('taskSubmissions');

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('email', 'like', "%{$request->search}%");
            });
        }
        if ($request->banned === 'true') {
            $query->whereNotNull('banned_at');
        }

        return response()->json($query->latest()->paginate(20));
    }

    /* ──────────────────────────────────────────────────────
     | UPDATE USER — ban, verify, role change
     ────────────────────────────────────────────────────── */
    public function updateUser(Request $request, User $user): JsonResponse
    {
        $data = $request->validate([
            'name'           => ['sometimes', 'string', 'max:255'],
            'email'          => ['sometimes', 'email', 'unique:users,email,' . $user->id],
            'role'           => ['sometimes', Rule::enum(UserRole::class)],
            'is_verified'    => ['sometimes', 'boolean'],
            'wallet_balance' => ['sometimes', 'numeric', 'min:0', 'max:99999999.99'],
            'banned'         => ['sometimes', 'boolean'],
            'ban_reason'     => ['nullable', 'string', 'max:255'],
        ]);

        if (array_key_exists('banned', $data)) {
            if ($data['banned']) {
                $user->banned_at  = now();
                $user->ban_reason = $data['ban_reason'] ?? 'Policy violation';
                $user->tokens()->delete();
            } else {
                $user->banned_at  = null;
                $user->ban_reason = null;
            }
        }

        if (isset($data['name']))           $user->name           = $data['name'];
        if (isset($data['email']))          $user->email          = $data['email'];
        if (isset($data['is_verified']))    $user->is_verified    = $data['is_verified'];
        if (isset($data['role']))           $user->role           = $data['role'];

            if (isset($data['wallet_balance'])) {
            $oldBalance           = (float) $user->wallet_balance;
            $newBalance           = (float) $data['wallet_balance'];
            $user->wallet_balance = $newBalance;

            if ($oldBalance !== $newBalance) {
                $diff = round($newBalance - $oldBalance, 2);
                \App\Models\Transaction::create([
                    'user_id'       => $user->id,
                    'type'          => $diff >= 0 ? TransactionType::Deposit : TransactionType::Withdrawal,
                    'amount'        => abs($diff),
                    'status'        => TransactionStatus::Completed,
                    'description'   => 'Admin balance adjustment by ' . request()->user()->name,
                    'balance_after' => $newBalance,
                ]);
            }
        }

        $user->save();

        return response()->json($user);
    }

    /* ──────────────────────────────────────────────────────
     | TASK TYPES — admin list
     ────────────────────────────────────────────────────── */
    public function taskTypeIndex(): JsonResponse
    {
        return response()->json(
            TaskType::orderBy('sort_order')->orderBy('label')->get()
        );
    }

    /* ──────────────────────────────────────────────────────
     | TASK TYPES — admin update (price, label, active)
     | Busts the task_types cache immediately on every save.
     ────────────────────────────────────────────────────── */
    public function taskTypeUpdate(Request $request, TaskType $taskType): JsonResponse
    {
        $data = $request->validate([
            'label'       => ['sometimes', 'string', 'max:255'],
            'reward'      => ['sometimes', 'integer', 'min:1', 'max:999999'],
            'instructions'=> ['sometimes', 'string', 'max:3000'],
            'is_active'   => ['sometimes', 'boolean'],
            'sort_order'  => ['sometimes', 'integer', 'min:0'],
        ]);

        $taskType->update($data);

        // Bust cache so next /task-types request returns fresh prices immediately
        Cache::forget('task_types');

        return response()->json($taskType->fresh());
    }

    /* ──────────────────────────────────────────────────────
     | PENDING SUBMISSIONS
     ────────────────────────────────────────────────────── */
    public function pendingSubmissions(Request $request): JsonResponse
    {
        $query = TaskSubmission::with([
            'user:id,name,email,avatar',
            'campaign:id,title,platform,reward_per_task',
        ]);

        $status = $request->status;
        if ($status && $status !== 'all') {
            $query->where('status', SubmissionStatus::from($status));
        } elseif (!$status) {
            $query->where('status', SubmissionStatus::Pending);
        }

        return response()->json($query->latest()->paginate(50));
    }
}
