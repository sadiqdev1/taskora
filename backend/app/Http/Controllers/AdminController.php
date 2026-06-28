<?php

namespace App\Http\Controllers;

use App\Models\Campaign;
use App\Models\TaskSubmission;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Withdrawal;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    /**
     * Platform overview stats.
     */
    public function stats()
    {
        return response()->json([
            'total_users'            => User::where('role', 'user')->count(),
            'total_campaigns'        => Campaign::count(),
            'active_campaigns'       => Campaign::where('status', 'active')->count(),
            'pending_submissions'    => TaskSubmission::where('status', 'pending')->count(),
            'pending_withdrawals'    => Withdrawal::where('status', 'pending')->count(),
            'total_paid_out'         => Transaction::where('type', 'withdrawal')
                                            ->where('status', 'completed')
                                            ->sum('amount'),
            'total_earned_by_users'  => Transaction::where('type', 'earning')->sum('amount'),
            'new_users_this_month'   => User::whereMonth('created_at', now()->month)
                                            ->whereYear('created_at', now()->year)
                                            ->where('role', 'user')
                                            ->count(),
        ]);
    }

    /**
     * List all users.
     */
    public function users(Request $request)
    {
        $users = User::where('role', 'user')
            ->withCount('taskSubmissions')
            ->latest()
            ->paginate(20);

        return response()->json($users);
    }

    /**
     * Update a user (ban, verify, etc.).
     */
    public function updateUser(Request $request, User $user)
    {
        $data = $request->validate([
            'is_verified' => ['sometimes', 'boolean'],
            'role'        => ['sometimes', 'in:user,admin'],
        ]);

        $user->update($data);
        return response()->json($user);
    }

    /**
     * All pending submissions for review.
     */
    public function pendingSubmissions(Request $request)
    {
        $submissions = TaskSubmission::with(['user:id,name,email', 'campaign:id,title,platform,reward_per_task'])
            ->where('status', 'pending')
            ->latest()
            ->paginate(20);

        return response()->json($submissions);
    }
}
