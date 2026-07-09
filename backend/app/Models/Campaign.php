<?php

namespace App\Models;

use App\Enums\CampaignDifficulty;
use App\Enums\CampaignPlatform;
use App\Enums\CampaignStatus;
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
        'task_link',
        'starts_at',
        'ends_at',
        'slug',
    ];

    /* ── Route key ── */
    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /* ── Boot ── */
    protected static function boot(): void
    {
        parent::boot();
        static::creating(function (Campaign $campaign) {
            if (empty($campaign->slug)) {
                $campaign->slug = static::generateSlug();
            }
        });
    }

    private static function generateSlug(): string
    {
        do {
            $slug = strtolower(\Illuminate\Support\Str::random(4))
                  . '-' . substr(base_convert((string) time(), 10, 36), -4)
                  . \Illuminate\Support\Str::random(5);
        } while (static::where('slug', $slug)->exists());
        return $slug;
    }

    protected function casts(): array
    {
        return [
            'reward_per_task' => 'decimal:2',
            'starts_at'       => 'datetime',
            'ends_at'         => 'datetime',
            'status'          => CampaignStatus::class,
            'platform'        => CampaignPlatform::class,
            'difficulty'      => CampaignDifficulty::class,
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
        if (!$this->total_slots || $this->total_slots === 0) return 0;
        return (int) min(100, round(($this->filled_slots / $this->total_slots) * 100));
    }

    public function getSlotsRemainingAttribute(): int
    {
        return max(0, ($this->total_slots ?? 0) - ($this->filled_slots ?? 0));
    }

    /* ── Scopes ── */
    public function scopeActive($query)
    {
        return $query->where('status', CampaignStatus::Active);
    }
}
