<?php

namespace App\Models;

use App\Enums\WithdrawalStatus;
use Illuminate\Database\Eloquent\Model;

class Withdrawal extends Model
{
    protected $fillable = [
        'user_id',
        'amount',
        'status',
        'payment_method',
        'payment_details',
        'bank_code',
        'bank_name',
        'account_number',
        'account_name',
        'reference',
        'rejection_reason',
        'processed_at',
    ];

    protected function casts(): array
    {
        return [
            'amount'       => 'decimal:2',
            'processed_at' => 'datetime',
            'status'       => WithdrawalStatus::class,
        ];
    }

    /* ── Relationships ── */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
