<?php

namespace App\Enums;

enum NotificationType: string
{
    case Earning      = 'earning';
    case Withdrawal   = 'withdrawal';
    case ReferralBonus = 'referral_bonus';
    case System       = 'system';
    case Campaign     = 'campaign';
}
