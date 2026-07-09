<?php

namespace App\Enums;

enum WithdrawalStatus: string
{
    case Pending   = 'pending';
    case Completed = 'completed';
    case Rejected  = 'rejected';
}
