<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\Rules\Password as PasswordRule;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Register a new user.
     */
    public function register(Request $request)
    {
        $data = $request->validate([
            'name'          => ['required', 'string', 'max:255'],
            'email'         => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password'      => ['required', 'confirmed', PasswordRule::min(8)],
            'referral_code' => ['nullable', 'string', 'exists:users,referral_code'],
        ]);

        $referredBy = null;
        if (!empty($data['referral_code'])) {
            $referrer   = User::where('referral_code', $data['referral_code'])->first();
            $referredBy = $referrer?->id;
        }

        $user = User::create([
            'name'        => $data['name'],
            'email'       => $data['email'],
            'password'    => Hash::make($data['password']),
            'referred_by' => $referredBy,
        ]);

        // Give referral bonus to referrer
        if ($referredBy) {
            $referrer->increment('wallet_balance', 5.00);
            $referrer->increment('total_earnings', 5.00);
            Transaction::create([
                'user_id'     => $referredBy,
                'type'        => 'referral_bonus',
                'amount'      => 5.00,
                'description' => "Referral bonus for inviting {$user->name}",
                'balance_after' => $referrer->fresh()->wallet_balance,
            ]);
        }

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'user'  => $user,
            'token' => $token,
        ], 201);
    }

    /**
     * Log in an existing user.
     */
    public function login(Request $request)
    {
        $data = $request->validate([
            'email'    => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (! Auth::attempt($data)) {
            throw ValidationException::withMessages([
                'email' => ['These credentials do not match our records.'],
            ]);
        }

        $user  = Auth::user();
        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'user'  => $user,
            'token' => $token,
        ]);
    }

    /**
     * Log out the authenticated user (revoke current token).
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully.']);
    }

    /**
     * Send a password reset link to the given email.
     */
    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => ['required', 'email']]);

        $status = Password::sendResetLink($request->only('email'));

        if ($status === Password::RESET_LINK_SENT) {
            return response()->json(['message' => 'Reset link sent to your email.']);
        }

        return response()->json(['message' => __($status)], 422);
    }

    /**
     * Return the authenticated user.
     */
    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}
