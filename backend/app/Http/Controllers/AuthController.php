<?php

namespace App\Http\Controllers;

use App\Enums\TransactionStatus;
use App\Enums\TransactionType;
use App\Enums\UserRole;
use App\Models\User;
use App\Models\Transaction;
use App\Services\CloudinaryService;
use App\Services\EmailService;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password as PasswordRule;
use Illuminate\Validation\ValidationException;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller
{
    /* ──────────────────────────────────────────────────────
     | REGISTER
     ────────────────────────────────────────────────────── */
    public function register(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name'          => ['required', 'string', 'max:255'],
            'email'         => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password'      => ['required', 'confirmed', PasswordRule::min(8)],
            'referral_code' => ['nullable', 'string', 'exists:users,referral_code'],
        ]);

        $referrer = null;
        if (!empty($data['referral_code'])) {
            $referrer = User::where('referral_code', $data['referral_code'])->first();
        }

        $user = User::create([
            'name'        => $data['name'],
            'email'       => $data['email'],
            'password'    => $data['password'],
            'referred_by' => $referrer?->id,
            'email_verification_token' => Str::random(64),
        ]);

        // Send verification + welcome emails (non-blocking)
        try {
            $email = new EmailService();
            if ($user->email_verification_token) {
                $email->sendVerification($user->email, $user->name, $user->email_verification_token);
            }
            $email->sendWelcome($user->email, $user->name);
        } catch (\Exception $e) {
            // Log so failures are visible — don't block registration
            \Illuminate\Support\Facades\Log::error('Registration email failed', [
                'user_id' => $user->id,
                'email'   => $user->email,
                'error'   => $e->getMessage(),
            ]);
        }

        // Referral bonus — only pay out after the new user verifies their email
        // (gated in verifyEmail below, not here)

        // Notify referrer that someone joined using their code (no money yet)
        if ($referrer) {
            NotificationService::system(
                $referrer->id,
                'New Referral 🎉',
                "{$user->name} joined using your referral link. You'll earn ₦5 once they verify their email."
            );
        }

        $token = $user->createToken('api-token', ['*'], now()->addDays(30))->plainTextToken;

        return response()->json([
            'user'  => $user,
            'token' => $token,
        ], 201);
    }

    /* ──────────────────────────────────────────────────────
     | LOGIN
     ────────────────────────────────────────────────────── */
    public function login(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email'    => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (! Auth::attempt(['email' => $data['email'], 'password' => $data['password']])) {
            throw ValidationException::withMessages([
                'email' => ['These credentials do not match our records.'],
            ]);
        }

        $user = Auth::user();

        if ($user->isBanned()) {
            Auth::logout();
            return response()->json([
                'message' => 'Your account has been suspended. Reason: ' . ($user->ban_reason ?? 'Policy violation'),
            ], 403);
        }

        // Revoke old tokens to keep sessions clean (optional: keep last 5)
        $user->tokens()->where('name', 'api-token')->delete();

        $token = $user->createToken('api-token', ['*'], now()->addDays(30))->plainTextToken;

        return response()->json([
            'user'  => $user,
            'token' => $token,
        ]);
    }

    /* ──────────────────────────────────────────────────────
     | LOGOUT
     ────────────────────────────────────────────────────── */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully.']);
    }

    /* ──────────────────────────────────────────────────────
     | ME — current user
     ────────────────────────────────────────────────────── */
    public function me(Request $request): JsonResponse
    {
        return response()->json($request->user());
    }

    /* ──────────────────────────────────────────────────────
     | UPDATE PROFILE
     ────────────────────────────────────────────────────── */
    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();

        $data = $request->validate([
            'name'   => ['sometimes', 'required', 'string', 'max:255'],
            'avatar' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        if (isset($data['name'])) {
            $user->name = $data['name'];
        }

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

        return response()->json($user);
    }

    /* ──────────────────────────────────────────────────────
     | CHANGE PASSWORD — authenticated, requires current password
     | POST /change-password
     ────────────────────────────────────────────────────── */
    public function changePassword(Request $request): JsonResponse
    {
        $request->validate([
            'current_password' => ['required', 'string'],
            'password'         => ['required', 'confirmed', PasswordRule::min(8)],
        ]);

        $user = $request->user();

        // Google-only accounts have no password — block the request clearly
        if (is_null($user->password)) {
            return response()->json([
                'message' => 'Your account uses Google sign-in and has no password to change.',
            ], 422);
        }

        if (!\Illuminate\Support\Facades\Hash::check($request->current_password, $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['Current password is incorrect.'],
            ]);
        }

        $user->forceFill(['password' => \Illuminate\Support\Facades\Hash::make($request->password)])->save();

        // Revoke all other sessions so stolen sessions can't persist after a password change
        $user->tokens()->where('id', '!=', $request->user()->currentAccessToken()->id)->delete();

        return response()->json(['message' => 'Password changed successfully.']);
    }

    /* ──────────────────────────────────────────────────────
     | FORGOT PASSWORD — send reset link
     ────────────────────────────────────────────────────── */
    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate(['email' => ['required', 'email']]);

        $status = Password::sendResetLink($request->only('email'));

        if ($status === Password::RESET_LINK_SENT) {
            return response()->json(['message' => 'Password reset link sent to your email.']);
        }

        return response()->json(['message' => __($status)], 422);
    }

    /* ──────────────────────────────────────────────────────
     | RESET PASSWORD — consume token & set new password
     ────────────────────────────────────────────────────── */
    public function resetPassword(Request $request): JsonResponse
    {
        $request->validate([
            'token'                 => ['required', 'string'],
            'email'                 => ['required', 'email'],
            'password'              => ['required', 'confirmed', PasswordRule::min(8)],
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password) {
                $user->forceFill(['password' => $password])->save();
                $user->tokens()->delete(); // invalidate all existing sessions
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json(['message' => 'Password has been reset successfully.']);
        }

        return response()->json(['message' => __($status)], 422);
    }

    /* ──────────────────────────────────────────────────────
     | GOOGLE OAUTH — redirect (stateless, no session needed)
     ────────────────────────────────────────────────────── */
    public function googleRedirect(): \Illuminate\Http\RedirectResponse
    {
        return Socialite::driver('google')
            ->stateless()
            ->scopes(['openid', 'profile', 'email'])
            ->redirect();
    }

    /* ──────────────────────────────────────────────────────
     | GOOGLE OAUTH — callback (stateless, redirects to frontend)
     ────────────────────────────────────────────────────── */
    public function googleCallback(Request $request): \Illuminate\Http\RedirectResponse
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
        } catch (\Exception $e) {
            $frontendUrl = config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:3000'));
            return redirect("{$frontendUrl}/login?error=oauth_failed");
        }

        $user = $this->findOrCreateGoogleUser($googleUser);

        if ($user->isBanned()) {
            $frontendUrl = config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:3000'));
            return redirect("{$frontendUrl}/login?error=banned");
        }

        $user->tokens()->where('name', 'api-token')->delete();
        $token = $user->createToken('api-token', ['*'], now()->addDays(30))->plainTextToken;

        // Store token in a short-lived one-time code (cache for 60 seconds)
        // so it never appears in the redirect URL or browser history.
        $code = \Illuminate\Support\Str::random(32);
        \Illuminate\Support\Facades\Cache::put("oauth_code:{$code}", $token, now()->addSeconds(60));

        $frontendUrl = config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:3000'));
        return redirect("{$frontendUrl}/auth/google/callback?code={$code}");
    }

    /* ──────────────────────────────────────────────────────
     | GOOGLE OAUTH — exchange short-lived code for token
     |  POST /auth/google/exchange  { code: "..." }
     |  Used by the frontend after the redirect-flow callback.
     ────────────────────────────────────────────────────── */
    public function exchangeOAuthCode(Request $request): JsonResponse
    {
        $request->validate([
            'code' => ['required', 'string', 'size:32'],
        ]);

        $cacheKey = "oauth_code:{$request->code}";
        $token    = \Illuminate\Support\Facades\Cache::pull($cacheKey); // pull = get + delete (one-time use)

        if (!$token) {
            return response()->json(['message' => 'Invalid or expired code.'], 422);
        }

        // Retrieve the user from the token
        $tokenModel = \Laravel\Sanctum\PersonalAccessToken::findToken($token);
        if (!$tokenModel) {
            return response()->json(['message' => 'Invalid token.'], 422);
        }

        $user = $tokenModel->tokenable;

        return response()->json([
            'user'  => $user,
            'token' => $token,
        ]);
    }

    /* ──────────────────────────────────────────────────────
     | GOOGLE OAUTH — one-tap / token exchange (SPA flow)
     |  POST /auth/google/token  { id_token: "..." }
     ────────────────────────────────────────────────────── */
    public function googleTokenExchange(Request $request): JsonResponse
    {
        $request->validate([
            'id_token' => ['required', 'string'],
        ]);

        try {
            $googleUser = Socialite::driver('google')
                ->stateless()
                ->userFromToken($request->id_token);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Invalid Google token.'], 422);
        }

        $user = $this->findOrCreateGoogleUser($googleUser);

        if ($user->isBanned()) {
            return response()->json([
                'message' => 'Your account has been suspended.',
            ], 403);
        }

        $user->tokens()->where('name', 'api-token')->delete();
        $token = $user->createToken('api-token', ['*'], now()->addDays(30))->plainTextToken;

        return response()->json([
            'user'  => $user,
            'token' => $token,
        ]);
    }

    /* ──────────────────────────────────────────────────────
     | DELETE ACCOUNT
     ────────────────────────────────────────────────────── */
    public function deleteAccount(Request $request): JsonResponse
    {
        $user = $request->user();
        $user->tokens()->delete();
        $user->delete();
        return response()->json(['message' => 'Account deleted.']);
    }

    /* ──────────────────────────────────────────────────────
     | EMAIL VERIFICATION — verify via token
     ────────────────────────────────────────────────────── */
    public function verifyEmail(string $token): \Illuminate\Http\RedirectResponse
    {
        $user = User::where('email_verification_token', $token)->first();
        $frontendUrl = env('FRONTEND_URL', 'http://localhost:3000');

        if (!$user) {
            return redirect("{$frontendUrl}/login?error=invalid_token");
        }

        $user->update([
            'email_verified_at'         => now(),
            'is_verified'               => true,
            'email_verification_token'  => null,
        ]);

        NotificationService::system($user->id, 'Email Verified ✅', 'Your email has been verified. Your account is now fully active.');

        // Pay out referral bonus now that the user has verified their email
        if ($user->referred_by) {
            $referrer = User::find($user->referred_by);
            if ($referrer) {
                $referrer->increment('wallet_balance', 5.00);
                $referrer->increment('total_earnings', 5.00);
                Transaction::create([
                    'user_id'         => $referrer->id,
                    'related_user_id' => $user->id,
                    'type'            => TransactionType::ReferralBonus,
                    'amount'          => 5.00,
                    'status'          => TransactionStatus::Completed,
                    'description'     => "Referral bonus for inviting {$user->name}",
                    'balance_after'   => $referrer->fresh()->wallet_balance,
                ]);
                NotificationService::referralBonus($referrer->id, $user->name, 5.00);
            }
        }

        return redirect("{$frontendUrl}/dashboard?verified=1");
    }

    /* ──────────────────────────────────────────────────────
     | EMAIL VERIFICATION — resend
     ────────────────────────────────────────────────────── */
    public function resendVerification(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->email_verified_at) {
            return response()->json(['message' => 'Email already verified.'], 422);
        }

        $token = Str::random(64);
        $user->update(['email_verification_token' => $token]);

        try {
            (new EmailService())->sendVerification($user->email, $user->name, $token);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to send email.'], 500);
        }

        return response()->json(['message' => 'Verification email sent.']);
    }

    /* ──────────────────────────────────────────────────────
     | PRIVATE HELPERS
     ────────────────────────────────────────────────────── */
    private function findOrCreateGoogleUser(\Laravel\Socialite\Contracts\User $googleUser): User
    {
        // 1. Match by google_id
        $user = User::where('google_id', $googleUser->getId())->first();
        if ($user) {
            // Refresh avatar from Google if user has none set
            if (!$user->avatar && $googleUser->getAvatar()) {
                $user->update(['avatar' => $googleUser->getAvatar()]);
            }
            return $user;
        }

        // 2. Match by email — link accounts
        $user = User::where('email', $googleUser->getEmail())->first();
        if ($user) {
            $updates = [
                'google_id'   => $googleUser->getId(),
                'is_verified' => true,
            ];
            if (!$user->avatar && $googleUser->getAvatar()) {
                $updates['avatar'] = $googleUser->getAvatar();
            }
            $user->update($updates);
            return $user;
        }

        // 3. Create new user
        return User::create([
            'name'        => $googleUser->getName() ?? $googleUser->getNickname() ?? 'User',
            'email'       => $googleUser->getEmail(),
            'google_id'   => $googleUser->getId(),
            'avatar'      => $googleUser->getAvatar(),
            'role'        => UserRole::User,
            'is_verified' => true,
            'password'    => null,
        ]);
    }
}
