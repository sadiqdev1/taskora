<?php

namespace App\Http\Controllers;

use App\Models\Onboarding;
use App\Models\UserProfile;
use App\Services\CloudinaryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OnboardingController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $onboarding = Onboarding::firstOrCreate(
            ['user_id' => $request->user()->id]
        );

        $profile = UserProfile::where('user_id', $request->user()->id)->first();

        return response()->json([
            'onboarding' => $onboarding,
            'profile'    => $profile,
        ]);
    }

    /**
     * POST /onboarding/complete
     * Saves profile (name, username, avatar) and marks onboarding done.
     * Avatar uploaded to Cloudinary — no local storage fallback to /storage.
     */
    public function complete(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name'          => ['required', 'string', 'max:255'],
            'username'      => ['nullable', 'string', 'max:30', 'alpha_dash', 'unique:users,username,' . $request->user()->id],
            'avatar'        => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
            'referral_seen' => ['sometimes', 'boolean'],
        ]);

        $user = $request->user();

        DB::transaction(function () use ($user, $data, $request) {
            // 1. Update name
            $user->name = $data['name'];

            // 2. Update username if provided
            if (!empty($data['username'])) {
                $user->username = $data['username'];
            }

            // 3. Upload avatar to Cloudinary
            if ($request->hasFile('avatar')) {
                try {
                    $url = (new CloudinaryService())->uploadAvatar($request->file('avatar'));
                    $user->avatar = $url;
                } catch (\Exception $e) {
                    // Log but don't block — user can set avatar later
                    \Illuminate\Support\Facades\Log::warning('Avatar upload failed during onboarding: ' . $e->getMessage());
                }
            }

            $user->save();

            // 4. Upsert user_profile
            UserProfile::updateOrCreate(
                ['user_id' => $user->id],
                ['display_name' => $data['name']]
            );

            // 5. Mark onboarding complete
            Onboarding::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'profile_done'  => true,
                    'referral_seen' => (bool) ($data['referral_seen'] ?? false),
                    'completed_at'  => now(),
                ]
            );
        });

        return response()->json([
            'user'    => $user->fresh(),
            'message' => 'Onboarding complete.',
        ]);
    }
}
