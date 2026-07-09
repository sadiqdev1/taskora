<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

/**
 * EmailService — sends transactional emails via Resend API
 * Uses Laravel's HTTP client to avoid class naming conflicts
 */
class EmailService
{
    private string $apiKey;
    private string $from;

    public function __construct()
    {
        // Use config() not env() — env() returns null after php artisan config:cache
        $this->apiKey = config('services.resend.key', '');

        // IMPORTANT: Your domain (taskora.io) is NOT yet verified with Resend.
        // Until you verify it at https://resend.com/domains, all emails from
        // noreply@taskora.io are rejected with 403.
        //
        // Two options:
        //   1. Verify taskora.io → set RESEND_DOMAIN_VERIFIED=true in .env → uses your brand address
        //   2. Leave unverified → uses Resend's shared sender (works immediately, all recipients)
        //
        // To verify: Resend dashboard → Domains → Add Domain → add the 3 DNS TXT/MX records
        // to your DNS provider, then set RESEND_DOMAIN_VERIFIED=true here.
        $domainVerified = config('services.resend.domain_verified', false);
        $this->from     = $domainVerified
            ? config('mail.from.address', 'noreply@taskora.io')
            : 'onboarding@resend.dev'; // Resend shared sender — works without domain verification
    }

    private function send(string $to, string $toName, string $subject, string $html): void
    {
        if (!$this->apiKey) return;

        $response = Http::withToken($this->apiKey)
            ->timeout(10)
            ->post('https://api.resend.com/emails', [
                'from'    => "Taskora <{$this->from}>",
                'to'      => ["{$toName} <{$to}>"],
                'subject' => $subject,
                'html'    => $html,
            ]);

        if (!$response->successful()) {
            \Illuminate\Support\Facades\Log::warning('EmailService: Resend API error', [
                'status'  => $response->status(),
                'body'    => $response->body(),
                'to'      => $to,
                'subject' => $subject,
            ]);
        }
    }

    public function sendVerification(string $toEmail, string $toName, string $token): void
    {
        if (!$token) return;
        $url = config('app.url', 'http://localhost:8000') . "/api/email/verify/{$token}";
        $this->send($toEmail, $toName, 'Verify your Taskora email',
            $this->wrapEmail($toName, 'Verify Your Email', "
                <p style='font-size:16px;color:#444;'>Hi {$toName},</p>
                <p style='color:#666;'>Click below to verify your email and activate your account.</p>
                <a href='{$url}' style='display:inline-block;background:#6C5CE7;color:white;padding:14px 28px;border-radius:12px;font-weight:700;text-decoration:none;margin:20px 0;'>Verify Email</a>
                <p style='color:#999;font-size:13px;'>Expires in 24 hours. Ignore if you didn't sign up.</p>
            ")
        );
    }

    public function sendPasswordReset(string $toEmail, string $toName, string $token): void
    {
        $frontendUrl = config('app.frontend_url', 'http://localhost:3000');
        $url = "{$frontendUrl}/reset-password?token={$token}&email=" . urlencode($toEmail);
        $this->send($toEmail, $toName, 'Reset your Taskora password',
            $this->wrapEmail($toName, 'Reset Your Password', "
                <p style='font-size:16px;color:#444;'>Hi {$toName},</p>
                <p style='color:#666;'>Click below to create a new password.</p>
                <a href='{$url}' style='display:inline-block;background:#6C5CE7;color:white;padding:14px 28px;border-radius:12px;font-weight:700;text-decoration:none;margin:20px 0;'>Reset Password</a>
                <p style='color:#999;font-size:13px;'>Expires in 1 hour. Ignore if you didn't request this.</p>
            ")
        );
    }

    public function sendWelcome(string $toEmail, string $toName): void
    {
        $frontendUrl = config('app.frontend_url', 'http://localhost:3000');
        $this->send($toEmail, $toName, 'Welcome to Taskora 🎉',
            $this->wrapEmail($toName, 'Welcome to Taskora 🎉', "
                <p style='font-size:16px;color:#444;'>Hi {$toName},</p>
                <p style='color:#666;'>Your account is ready. Start completing tasks and earning money to your Nigerian bank account.</p>
                <a href='{$frontendUrl}/tasks' style='display:inline-block;background:#6C5CE7;color:white;padding:14px 28px;border-radius:12px;font-weight:700;text-decoration:none;margin:20px 0;'>Browse Tasks →</a>
            ")
        );
    }

    public function sendWithdrawalUpdate(string $toEmail, string $toName, float $amount, string $status): void
    {
        $label = $status === 'completed' ? 'Withdrawal Successful ✅' : 'Withdrawal Rejected ❌';
        $body  = $status === 'completed'
            ? "₦" . number_format($amount, 2) . " has been sent to your bank account."
            : "Your withdrawal of ₦" . number_format($amount, 2) . " was rejected.";
        $this->send($toEmail, $toName, $label,
            $this->wrapEmail($toName, $label, "
                <p style='font-size:16px;color:#444;'>Hi {$toName},</p>
                <p style='color:#666;'>{$body}</p>
            ")
        );
    }

    private function wrapEmail(string $name, string $title, string $content): string
    {
        return "<!DOCTYPE html><html><body style='margin:0;padding:0;background:#F8F9FE;font-family:system-ui,sans-serif;'>
            <div style='max-width:560px;margin:40px auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);'>
                <div style='background:linear-gradient(135deg,#6C5CE7,#7C3AED);padding:28px 32px;'>
                    <span style='color:white;font-weight:900;font-size:22px;letter-spacing:-0.5px;'>Taskora</span>
                </div>
                <div style='padding:32px;'>{$content}</div>
                <div style='background:#F8F9FE;padding:20px 32px;text-align:center;'>
                    <p style='color:#AAA;font-size:12px;margin:0;'>© 2026 Taskora · You're receiving this because you signed up.</p>
                </div>
            </div>
        </body></html>";
    }
}
