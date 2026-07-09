<?php

namespace App\Http\Controllers;

use App\Enums\CampaignDifficulty;
use App\Enums\CampaignPlatform;
use App\Enums\CampaignStatus;
use App\Enums\SubmissionStatus;
use App\Enums\TransactionStatus;
use App\Enums\TransactionType;
use App\Models\Campaign;
use App\Models\TaskSubmission;
use App\Models\TaskType;
use App\Models\Transaction;
use App\Services\CloudinaryService;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class CampaignController extends Controller
{
    /* ──────────────────────────────────────────────────────
     | TASK TYPES — public catalogue
     | GET /task-types
     | Cache: 10 min in production, no cache in local/testing
     ────────────────────────────────────────────────────── */
    public function taskTypes(): JsonResponse
    {
        // Skip cache in local/testing so price changes are instant during dev
        if (app()->environment(['local', 'testing'])) {
            $types = TaskType::active()->get(['id', 'value', 'label', 'platform', 'reward', 'instructions']);
            return response()->json($types);
        }

        $types = \Illuminate\Support\Facades\Cache::remember('task_types', 600, function () {
            return TaskType::active()->get(['id', 'value', 'label', 'platform', 'reward', 'instructions']);
        });

        return response()->json($types);
    }

    /* ──────────────────────────────────────────────────────
     | LIST ACTIVE CAMPAIGNS (public / user)
     ────────────────────────────────────────────────────── */
    public function index(Request $request): JsonResponse
    {
        $query = Campaign::active()
            ->with('creator:id,name,avatar,username')
            ->latest();

        if ($request->platform) {
            $query->where('platform', CampaignPlatform::from($request->platform));
        }
        if ($request->difficulty) {
            $query->where('difficulty', CampaignDifficulty::from($request->difficulty));
        }
        if ($request->search) {
            $query->where('title', 'like', "%{$request->search}%");
        }
        if ($request->mine) {
            $query->where('created_by', $request->user()->id);
        }

        return response()->json($query->paginate((int) ($request->per_page ?? 20)));
    }

    /* ──────────────────────────────────────────────────────
     | USER STORE — creates campaign, deducts budget
     ────────────────────────────────────────────────────── */
    public function userStore(Request $request): JsonResponse
    {
        $data = $request->validate([
            'task_type_value' => ['required', 'string', 'exists:task_types,value'],
            'task_link'       => ['required', 'url', 'max:500'],
            'total_slots'     => ['required', 'integer', 'min:1', 'max:10000'],
            'instructions'    => ['nullable', 'string', 'max:2000'],
        ]);

        // Load canonical task type — price comes from the DB, never the client
        $taskType = TaskType::where('value', $data['task_type_value'])
            ->where('is_active', true)
            ->firstOrFail();

        $user        = $request->user();
        $rewardPerTask = $taskType->reward;
        $totalBudget = $rewardPerTask * (int) $data['total_slots'];

        if ((float) $user->wallet_balance < $totalBudget) {
            return response()->json([
                'message' => "Insufficient wallet balance. You need ₦" . number_format($totalBudget, 2)
                           . " but only have ₦" . number_format($user->wallet_balance, 2) . ".",
            ], 422);
        }

        $campaign = DB::transaction(function () use ($user, $data, $taskType, $rewardPerTask, $totalBudget) {
            $user->decrement('wallet_balance', $totalBudget);

            // Merge default instructions with task link so earners always see where to go
            $instructions = trim($data['instructions'] ?? $taskType->instructions);
            if (!empty($data['task_link'])) {
                $instructions .= "\n\nTask link: " . $data['task_link'];
            }

            $campaign = Campaign::create([
                'title'           => $taskType->label,
                'platform'        => $taskType->platform,
                'description'     => $taskType->label . ' task',
                'reward_per_task' => $rewardPerTask,
                'total_slots'     => (int) $data['total_slots'],
                'difficulty'      => CampaignDifficulty::Easy,
                'instructions'    => $instructions,
                'task_link'       => $data['task_link'],
                'status'          => CampaignStatus::Active,
                'created_by'      => $user->id,
            ]);

            Transaction::create([
                'user_id'       => $user->id,
                'type'          => TransactionType::Withdrawal,
                'amount'        => $totalBudget,
                'status'        => TransactionStatus::Completed,
                'description'   => "Task budget: {$campaign->title}",
                'reference'     => 'TASK-' . $campaign->id,
                'balance_after' => $user->fresh()->wallet_balance,
            ]);

            return $campaign;
        });

        return response()->json([
            'message'  => 'Task created successfully and is now live.',
            'campaign' => $campaign,
        ], 201);
    }

    /* ──────────────────────────────────────────────────────
     | ADMIN — all campaigns
     ────────────────────────────────────────────────────── */
    public function adminIndex(Request $request): JsonResponse
    {
        $query = Campaign::with('creator:id,name')->latest();

        if ($request->status) {
            $query->where('status', CampaignStatus::from($request->status));
        }
        if ($request->search) {
            $query->where('title', 'like', "%{$request->search}%");
        }

        return response()->json($query->paginate(20));
    }

    /* ──────────────────────────────────────────────────────
     | SHOW single campaign
     ────────────────────────────────────────────────────── */
    public function show(Campaign $campaign): JsonResponse
    {
        $campaign->load('creator:id,name');
        return response()->json($campaign);
    }

    /* ──────────────────────────────────────────────────────
     | STORE — admin creates a campaign
     ────────────────────────────────────────────────────── */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title'           => ['required', 'string', 'max:255'],
            'description'     => ['nullable', 'string'],
            'platform'        => ['required', Rule::enum(CampaignPlatform::class)],
            'platform_icon'   => ['nullable', 'string'],
            'reward_per_task' => ['required', 'numeric', 'min:0.01'],
            'total_slots'     => ['required', 'integer', 'min:1'],
            'status'          => ['sometimes', Rule::enum(CampaignStatus::class)],
            'category'        => ['nullable', 'string'],
            'difficulty'      => ['sometimes', Rule::enum(CampaignDifficulty::class)],
            'instructions'    => ['nullable', 'string'],
            'starts_at'       => ['nullable', 'date'],
            'ends_at'         => ['nullable', 'date', 'after_or_equal:starts_at'],
        ]);

        $campaign = Campaign::create([...$data, 'created_by' => $request->user()->id]);
        return response()->json($campaign, 201);
    }

    /* ──────────────────────────────────────────────────────
     | UPDATE — admin
     ────────────────────────────────────────────────────── */
    public function update(Request $request, Campaign $campaign): JsonResponse
    {
        $data = $request->validate([
            'title'           => ['sometimes', 'string', 'max:255'],
            'description'     => ['nullable', 'string'],
            'platform'        => ['sometimes', Rule::enum(CampaignPlatform::class)],
            'reward_per_task' => ['sometimes', 'numeric', 'min:0.01'],
            'total_slots'     => ['sometimes', 'integer', 'min:1'],
            'status'          => ['sometimes', Rule::enum(CampaignStatus::class)],
            'difficulty'      => ['sometimes', Rule::enum(CampaignDifficulty::class)],
            'instructions'    => ['nullable', 'string'],
            'starts_at'       => ['nullable', 'date'],
            'ends_at'         => ['nullable', 'date'],
        ]);

        $campaign->update($data);
        return response()->json($campaign);
    }

    /* ──────────────────────────────────────────────────────
     | DESTROY — admin (archive rather than hard-delete)
     ────────────────────────────────────────────────────── */
    public function destroy(Campaign $campaign): JsonResponse
    {
        $campaign->update(['status' => CampaignStatus::Draft]);
        return response()->json(['message' => 'Campaign archived.']);
    }

    /* ──────────────────────────────────────────────────────
     | SUBMIT — user submits proof for a campaign task
     ────────────────────────────────────────────────────── */
    public function submit(Request $request, Campaign $campaign): JsonResponse
    {
        $user = $request->user();

        $data = $request->validate([
            'proof'       => ['nullable', 'string', 'max:2000'],
            'proof_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp,gif', 'max:5120'],
        ]);

        $proofImageUrl = null;
        if ($request->hasFile('proof_image')) {
            try {
                $proofImageUrl = (new CloudinaryService())->uploadImage($request->file('proof_image'), 'proofs');
            } catch (\Exception $e) {
                // Never fall back to local storage — we are hosted on a stateless server.
                // Surface the error so the user sees a proper message.
                \Illuminate\Support\Facades\Log::error('Cloudinary upload failed', [
                    'user_id' => $user->id,
                    'error'   => $e->getMessage(),
                ]);
                return response()->json([
                    'message' => 'Failed to upload your screenshot. Please try again or use a smaller image.',
                ], 422);
            }
        }

        $submission = null;

        DB::transaction(function () use ($user, $campaign, $data, $proofImageUrl, &$submission) {
            $lockedCampaign = Campaign::lockForUpdate()->find($campaign->id);

            if ($lockedCampaign->status !== CampaignStatus::Active) {
                throw \Illuminate\Validation\ValidationException::withMessages([
                    'campaign' => ['This campaign is not active.'],
                ]);
            }
            if ($lockedCampaign->slots_remaining <= 0) {
                throw \Illuminate\Validation\ValidationException::withMessages([
                    'campaign' => ['No slots remaining for this campaign.'],
                ]);
            }
            if (TaskSubmission::where('user_id', $user->id)->where('campaign_id', $lockedCampaign->id)->exists()) {
                throw \Illuminate\Validation\ValidationException::withMessages([
                    'campaign' => ['You have already submitted this task.'],
                ]);
            }

            $user->increment('pending_balance', $lockedCampaign->reward_per_task);
            $lockedCampaign->increment('filled_slots');

            $submission = TaskSubmission::create([
                'user_id'      => $user->id,
                'campaign_id'  => $lockedCampaign->id,
                'proof'        => $data['proof'] ?? null,
                'proof_image'  => $proofImageUrl,
                'status'       => SubmissionStatus::Pending,
                'completed_at' => now(),
            ]);
        });

        return response()->json($submission, 201);
    }

    /* ──────────────────────────────────────────────────────
     | MY SUBMISSIONS — user's own history
     ────────────────────────────────────────────────────── */
    public function mySubmissions(Request $request): JsonResponse
    {
        $submissions = $request->user()
            ->taskSubmissions()
            ->with('campaign:id,title,platform,reward_per_task,platform_icon,slug')
            ->latest()
            ->paginate(20);

        return response()->json($submissions);
    }

    /* ──────────────────────────────────────────────────────
     | REVIEW SUBMISSION — admin approves or rejects
     ────────────────────────────────────────────────────── */
    public function reviewSubmission(Request $request, TaskSubmission $submission): JsonResponse
    {
        $data = $request->validate([
            'status'           => ['required', Rule::enum(SubmissionStatus::class)],
            'rejection_reason' => ['nullable', 'string', 'max:500'],
        ]);

        if ($submission->status !== SubmissionStatus::Pending) {
            return response()->json(['message' => 'This submission has already been reviewed.'], 422);
        }

        DB::transaction(function () use ($submission, $data, $request) {
            $newStatus = SubmissionStatus::from($data['status']);

            $submission->update([
                'status'           => $newStatus,
                'rejection_reason' => $data['rejection_reason'] ?? null,
                'reviewed_by'      => $request->user()->id,
                'reviewed_at'      => now(),
            ]);

            $reward = $submission->campaign->reward_per_task;
            $user   = $submission->user;

            $user->decrement('pending_balance', $reward);

            if ($newStatus === SubmissionStatus::Approved) {
                $submission->update(['earned' => $reward]);
                $user->increment('wallet_balance', $reward);
                $user->increment('total_earnings', $reward);

                Transaction::create([
                    'user_id'              => $user->id,
                    'type'                 => TransactionType::Earning,
                    'amount'               => $reward,
                    'status'               => TransactionStatus::Completed,
                    'description'          => "Earned from: {$submission->campaign->title}",
                    'balance_after'        => $user->fresh()->wallet_balance,
                    'transactionable_type' => TaskSubmission::class,
                    'transactionable_id'   => $submission->id,
                ]);

                NotificationService::earning($user->id, $submission->campaign->title, (float) $reward);
            } else {
                // Give the slot back so another user can fill it
                $submission->campaign->decrement('filled_slots');
            }
        });

        return response()->json($submission->fresh());
    }
}
