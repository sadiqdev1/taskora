<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Campaign extends Model
{
    use HasFactory;

    protected $fillable = [
        'created_by',
        'title',
        'description',
        'platform',
        'platform_icon',
        'reward_per_task',
        'total_slots',
        'filled_slots',
        'status',
        'category',
        'difficulty',
        'instructions',
        'starts_at',
        'ends_at',
    ];

    protected function casts(): array
    {
        return [
            'reward_per_task' => 'decimal:2',
            'starts_at'       => 'datetime',
            'ends_at'         => 'datetime',
        ];
    }

    protected $appends = ['progress_percentage', 'slots_remaining'];

    /* ── Relationships ── */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function taskSubmissions()
    {
        return $this->hasMany(TaskSubmission::class);
    }

    /* ── Computed ── */
    public function getProgressPercentageAttribute(): int
    {
        if ($this->total_slots === 0) return 0;
        return (int) min(100, round(($this->filled_slots / $this->total_slots) * 100));
    }

    public function getSlotsRemainingAttribute(): int
    {
        return max(0, $this->total_slots - $this->filled_slots);
    }

    /* ── Scopes ── */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
}
