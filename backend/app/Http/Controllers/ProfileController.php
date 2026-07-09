<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Models\User;
use App\Models\UserProfile;
use App\Services\CloudinaryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class ProfileController extends Controller
{
    /* ──────────────────────────────────────────────────────
     | PUBLIC PROFILE — GET /users/{username}
     ────────────────────────────────────────────────────── */
    public function show(string $username): JsonResponse
    {
        // Safely distinguish between a real username and our "user-{id}" synthetic slug.
        // Using orWhere on the same column allows guessing any user by numeric ID —
        // so we separate the two lookup paths explicitly.
        if (preg_match('/^user-(\d+)$/', $username, $m)) {
            $user = User::with('profile')->findOrFail((int) $m[1]);
        } else {
            $user = User::with('profile')->where('username', $username)->firstOrFail();
        }

        $profile   = $user->profile;
        $campaigns = \App\Models\Campaign::where('created_by', $user->id)
            ->orderBy('created_at', 'desc')
            ->get(['id', 'slug', 'title', 'platform', 'reward_per_task', 'total_slots', 'filled_slots', 'status']);

        return response()->json([
            'id'             => $user->id,
            'name'           => $user->name,
            'username'       => $user->username ?? 'user-' . $user->id,
            'avatar'         => $user->avatar,
            'role'           => $user->role,
            'is_verified'    => $user->is_verified,
            'member_since'   => $user->created_at?->format('M Y'),
            'bio'            => $profile?->bio,
            'display_name'   => $profile?->display_name ?? $user->name,
            'social'         => [
                'twitter'   => $profile?->twitter,
                'instagram' => $profile?->instagram,
                'tiktok'    => $profile?->tiktok,
                'youtube'   => $profile?->youtube,
                'facebook'  => $profile?->facebook,
                'website'   => $profile?->website,
            ],
            'stats' => [
                'tasks_completed'  => $user->tasks_completed,
                'total_earnings'   => (float) $user->total_earnings,
                'success_rate'     => $user->success_rate,
                'referrals_count'  => $user->referredUsers()->count(),
            ],
            'campaigns' => $campaigns,
        ]);
    }

    /* ──────────────────────────────────────────────────────
     | OWN PROFILE — GET /profile/me
     ────────────────────────────────────────────────────── */
    public function me(Request $request): JsonResponse
    {
        $user    = $request->user()->load('profile');
        $profile = $user->profile;

        return response()->json([
            'id'           => $user->id,
            'name'         => $user->name,
            'username'     => $user->username ?? 'user-' . $user->id,
            'email'        => $user->email,
            'avatar'       => $user->avatar,
            'role'         => $user->role,
            'is_verified'  => $user->is_verified,
            'member_since' => $user->created_at?->format('M Y'),
            'bio'          => $profile?->bio,
            'display_name' => $profile?->display_name ?? $user->name,
            'phone'        => $profile?->phone,
            'country'      => $profile?->country ?? 'NG',
            'social'       => [
                'twitter'   => $profile?->twitter,
                'instagram' => $profile?->instagram,
                'tiktok'    => $profile?->tiktok,
                'youtube'   => $profile?->youtube,
                'facebook'  => $profile?->facebook,
                'website'   => $profile?->website,
            ],
            'stats' => [
                'tasks_completed' => $user->tasks_completed,
                'total_earnings'  => (float) $user->total_earnings,
                'success_rate'    => $user->success_rate,
                'referrals_count' => $user->referredUsers()->count(),
            ],
        ]);
    }

    /* ──────────────────────────────────────────────────────
     | UPDATE OWN PROFILE — POST /profile/update
     ────────────────────────────────────────────────────── */
    public function update(Request $request): JsonResponse
    {
        $user = $request->user();

        $data = $request->validate([
            'name'         => ['sometimes', 'string', 'max:255'],
            'username'     => ['sometimes', 'string', 'max:30', 'alpha_dash',
                               Rule::unique('users', 'username')->ignore($user->id)],
            'avatar'       => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'display_name' => ['nullable', 'string', 'max:255'],
            'bio'          => ['nullable', 'string', 'max:500'],
            'phone'        => ['nullable', 'string', 'max:20'],
            'country'      => ['nullable', 'string', 'max:2'],
            'twitter'      => ['nullable', 'string', 'max:100'],
            'instagram'    => ['nullable', 'string', 'max:100'],
            'tiktok'       => ['nullable', 'string', 'max:100'],
            'youtube'      => ['nullable', 'string', 'max:100'],
            'facebook'     => ['nullable', 'string', 'max:100'],
            'website'      => ['nullable', 'url', 'max:255'],
        ]);

        // Update user core fields
        if (isset($data['name']))     $user->name     = $data['name'];
        if (isset($data['username'])) $user->username = $data['username'];

        if ($request->hasFile('avatar')) {
            try {
                $url = (new CloudinaryService())->uploadAvatar($request->file('avatar'));
                $user->avatar = $url;
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error('Cloudinary avatar upload failed', ['error' => $e->getMessage()]);
                return response()->json(['message' => 'Failed to upload avatar. Please try again.'], 422);
            }
        }
        $user->save();

        // Upsert profile — use isset not array_filter so empty strings can clear fields
        $profileFields = [];
        if (array_key_exists('display_name', $data) || array_key_exists('name', $data)) {
            $profileFields['display_name'] = $data['display_name'] ?? $data['name'] ?? null;
        }
        foreach (['bio', 'phone', 'country', 'twitter', 'instagram', 'tiktok', 'youtube', 'facebook', 'website'] as $field) {
            if (array_key_exists($field, $data)) {
                $profileFields[$field] = $data[$field];
            }
        }

        if (!empty($profileFields)) {
            UserProfile::updateOrCreate(
                ['user_id' => $user->id],
                $profileFields
            );
        }

        return $this->me($request);
    }

    /* ──────────────────────────────────────────────────────
     | LEADERBOARD — GET /leaderboard
     | Top 50 earners, publicly viewable
     ────────────────────────────────────────────────────── */
    public function leaderboard(Request $request): JsonResponse
    {
        $period = $request->query('period', 'all'); // all | month | week

        if ($period === 'all') {
            $users = User::where('role', UserRole::User)
                ->whereNull('banned_at')
                ->with('profile:user_id,display_name,twitter,instagram,tiktok')
                ->orderBy('total_earnings', 'desc')
                ->limit(50)
                ->get()
                ->map(fn ($user, $index) => $this->formatLeaderboardUser($user, $index, (float) $user->total_earnings));
        } else {
            $from = match ($period) {
                'week'  => now()->startOfWeek(),
                'month' => now()->startOfMonth(),
                default => now()->startOfMonth(),
            };

            $users = User::where('role', UserRole::User)
                ->whereNull('banned_at')
                ->with('profile:user_id,display_name,twitter,instagram,tiktok')
                ->withSum(['transactions as period_earnings' => function ($q) use ($from) {
                    $q->where('type', 'earning')
                      ->where('status', 'completed')
                      ->where('created_at', '>=', $from);
                }], 'amount')
                ->orderByDesc('period_earnings')
                ->limit(50)
                ->get()
                ->filter(fn ($u) => $u->period_earnings > 0)
                ->values()
                ->map(fn ($user, $index) => $this->formatLeaderboardUser($user, $index, (float) ($user->period_earnings ?? 0)));
        }

        return response()->json(['data' => $users, 'period' => $period]);
    }

    private function formatLeaderboardUser(User $user, int $index, float $earnings): array
    {
        return [
            'rank'            => $index + 1,
            'id'              => $user->id,
            'name'            => $user->profile?->display_name ?? $user->name,
            'username'        => $user->username ?? 'user-' . $user->id,
            'avatar'          => $user->avatar,
            'total_earnings'  => $earnings,
            'tasks_completed' => $user->tasks_completed,
            'is_verified'     => $user->is_verified,
            'social'          => [
                'twitter'   => $user->profile?->twitter,
                'instagram' => $user->profile?->instagram,
                'tiktok'    => $user->profile?->tiktok,
            ],
        ];
    }
}
