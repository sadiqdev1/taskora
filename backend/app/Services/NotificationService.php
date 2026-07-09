<?php

namespace App\Services;

use App\Enums\NotificationType;
use App\Enums\WithdrawalStatus;
use App\Models\Notification;

class NotificationService
{
    public static function send(
        int             $userId,
        NotificationType $type,
        string          $title,
        string          $body      = '',
        string          $actionUrl = '',
        array           $meta      = []
    ): Notification {
        return Notification::create([
            'user_id'    => $userId,
            'type'       => $type,
            'title'      => $title,
            'body'       => $body,
            'action_url' => $actionUrl,
            'meta'       => $meta ?: null,
        ]);
    }

    public static function earning(int $userId, string $campaignTitle, float $amount): void
    {
        self::send(
            $userId,
            NotificationType::Earning,
            'Task Approved! 🎉',
            "You earned ₦" . number_format($amount, 2) . " from: {$campaignTitle}",
            '/tasks'
        );
    }

    public static function withdrawal(int $userId, float $amount, string $status): void
    {
        $isCompleted = $status === WithdrawalStatus::Completed->value;
        self::send(
            $userId,
            NotificationType::Withdrawal,
            $isCompleted ? 'Withdrawal Sent ✅' : 'Withdrawal Rejected ❌',
            $isCompleted
                ? "₦" . number_format($amount, 2) . " has been sent to your bank account."
                : "Your withdrawal of ₦" . number_format($amount, 2) . " was rejected.",
            '/wallet'
        );
    }

    public static function referralBonus(int $userId, string $refereeName, float $amount): void
    {
        self::send(
            $userId,
            NotificationType::ReferralBonus,
            'Referral Bonus Earned! 👥',
            "You earned ₦" . number_format($amount, 2) . " because {$refereeName} joined via your link.",
            '/referrals'
        );
    }

    public static function system(int $userId, string $title, string $body = ''): void
    {
        self::send($userId, NotificationType::System, $title, $body);
    }
}
