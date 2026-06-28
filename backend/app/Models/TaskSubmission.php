<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TaskSubmission extends Model
{
    protected $fillable = [
        'user_id',
        'campaign_id',
        'status',
        'proof',
        'rejection_reason',
        'earned',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'earned'       => 'decimal:2',
            'completed_at' => 'datetime',
        ];
    }

    /* ── Relationships ── */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function campaign()
    {
        return $this->belongsTo(Campaign::class);
    }
}
