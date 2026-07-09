<?php

namespace App\Models;

use App\Enums\SubmissionStatus;
use Illuminate\Database\Eloquent\Model;

class TaskSubmission extends Model
{
    protected $fillable = [
        'user_id',
        'campaign_id',
        'status',
        'proof',
        'proof_image',
        'rejection_reason',
        'reviewed_by',
        'reviewed_at',
        'earned',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'earned'       => 'decimal:2',
            'completed_at' => 'datetime',
            'reviewed_at'  => 'datetime',
            'status'       => SubmissionStatus::class,
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

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
