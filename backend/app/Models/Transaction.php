<?php

namespace App\Models;

use App\Enums\TransactionStatus;
use App\Enums\TransactionType;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $fillable = [
        'user_id',
        'related_user_id',
        'type',
        'amount',
        'status',
        'description',
        'reference',
        'balance_after',
        'transactionable_type',
        'transactionable_id',
    ];

    protected function casts(): array
    {
        return [
            'amount'        => 'decimal:2',
            'balance_after' => 'decimal:2',
            'type'          => TransactionType::class,
            'status'        => TransactionStatus::class,
        ];
    }

    /* ── Relationships ── */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function transactionable()
    {
        return $this->morphTo();
    }
}
