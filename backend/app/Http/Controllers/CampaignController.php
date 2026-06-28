<?php

namespace App\Http\Controllers;

use App\Models\Campaign;
use App\Models\TaskSubmission;
use App\Models\Transaction;
use Illuminate\Http\Request;

class CampaignController extends Controller
{
    /**
     * List active campaigns (with optional platform/difficulty filter).
     */
    public function index(Request $request)
    {
        $query = Campaign::active()
            ->with('creator:id,name')
            ->latest();

        if ($request->platform) {
            $query->where('platform', $request->platform);
        }

        if ($request->difficulty) {
            $query->where('difficulty', $request->difficulty);
        }

        $campaigns = $query->paginate(20);

        return response()->json($campaigns);
    }

    /**
     * All campaigns — admin only.
     */
    public function adminIndex(Request $request)
    {
        $campaigns = Campaign::with('creator:id,name')
            ->latest()
            ->paginate(20);

        return response()->json($campaigns);
    }

    /**
     * Create a new campaign (admin only).
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'title'           => ['required', 'string', 'max:255'],
            'description'     => ['nullable', 'string'],
            'platform'        => ['required', 'string', 'in:instagram,tiktok,youtube,twitter,facebook,other'],
            'platform_icon'   => ['nullable', 'string'],
            'reward_per_task' => ['required', 'numeric', 'min:0.01'],
            'total_slots'     => ['required', 'integer', 'min:1'],
            'status'          => ['in:active,paused,draft'],
            'category'        => ['nullable', 'string'],
            'difficulty'      => ['in:easy,medium,hard'],
            'instructions'    => ['nullable', 'string'],
            'starts_at'       => ['nullable', 'date'],
            'ends_at'         => ['nullable', 'date', 'after_or_equal:starts_at'],
        ]);

        $campaign = Campaign::create([
            ...$data,
            'created_by' => $request->user()->id,
        ]);

        return response()->json($campaign, 201);
    }

    /**
     * Show a single campaign.
     */
    public function show(Campaign $campaign)
    {
        $campaign->load('creator:id,name');
        return response()->json($campaign);
    }

    /**
     * Update a campaign (admin only).
     */
    public function update(Request $request, Campaign $campaign)
    {
        $data = $request->validate([
            'title'           => ['sometimes', 'string', 'max:255'],
            'description'     => ['nullable', 'string'],
            'platform'        => ['sometimes', 'string'],
            'reward_per_task' => ['sometimes', 'numeric', 'min:0.01'],
            'total_slots'     => ['sometimes', 'integer', 'min:1'],
            'status'          => ['in:active,paused,completed,draft'],
            'difficulty'      => ['in:easy,medium,hard'],
            'instructions'    => ['nullable', 'string'],
            'starts_at'       => ['nullable', 'date'],
            'ends_at'         => ['nullable', 'date'],
        ]);

        $campaign->update($data);
        return response()->json($campaign);
    }

    /**
     * Delete a campaign (admin only).
     */
    public function destroy(Campaign $campaign)
    {
        $campaign->delete();
        return response()->json(['message' => 'Campaign deleted.']);
    }

    /**
     * Submit a task for a campaign (user).
     */
    public function submit(Request $request, Campaign $campaign)
    {
        $user = $request->user();

        if ($campaign->status !== 'active') {
            return response()->json(['message' => 'This campaign is not active.'], 422);
        }

        if ($campaign->slots_remaining <= 0) {
            return response()->json(['message' => 'No slots remaining.'], 422);
        }

        $existing = TaskSubmission::where('user_id', $user->id)
            ->where('campaign_id', $campaign->id)
            ->first();

        if ($existing) {
            return response()->json(['message' => 'You already submitted this task.'], 422);
        }

        $data = $request->validate([
            'proof' => ['nullable', 'string', 'max:1000'],
        ]);

        $submission = TaskSubmission::create([
            'user_id'      => $user->id,
            'campaign_id'  => $campaign->id,
            'proof'        => $data['proof'] ?? null,
            'status'       => 'pending',
            'completed_at' => now(),
        ]);

        return response()->json($submission, 201);
    }

    /**
     * User's own task submissions.
     */
    public function mySubmissions(Request $request)
    {
        $submissions = $request->user()
            ->taskSubmissions()
            ->with('campaign:id,title,platform,reward_per_task,platform_icon')
            ->latest()
            ->paginate(20);

        return response()->json($submissions);
    }

    /**
     * Approve or reject a submission (admin).
     */
    public function reviewSubmission(Request $request, TaskSubmission $submission)
    {
        $data = $request->validate([
            'status'           => ['required', 'in:approved,rejected'],
            'rejection_reason' => ['nullable', 'string', 'max:500'],
        ]);

        if ($submission->status !== 'pending') {
            return response()->json(['message' => 'Already reviewed.'], 422);
        }

        $submission->update([
            'status'           => $data['status'],
            'rejection_reason' => $data['rejection_reason'] ?? null,
        ]);

        if ($data['status'] === 'approved') {
            $reward = $submission->campaign->reward_per_task;
            $user   = $submission->user;

            $submission->update(['earned' => $reward]);
            $user->increment('wallet_balance', $reward);
            $user->increment('total_earnings', $reward);
            $submission->campaign->increment('filled_slots');

            Transaction::create([
                'user_id'                => $user->id,
                'type'                   => 'earning',
                'amount'                 => $reward,
                'description'            => "Earned from: {$submission->campaign->title}",
                'balance_after'          => $user->fresh()->wallet_balance,
                'transactionable_type'   => TaskSubmission::class,
                'transactionable_id'     => $submission->id,
            ]);
        }

        return response()->json($submission);
    }
}
