<?php

namespace App\Enums;

enum TransactionType: string
{
    case Earning      = 'earning';
    case Withdrawal   = 'withdrawal';
    case Deposit      = 'deposit';
    case ReferralBonus = 'referral_bonus';
    case Bonus        = 'bonus';
}
