<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'wallet_balance',
        'total_earnings',
        'referral_code',
        'referred_by',
        'is_verified',
        'avatar',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $appends = ['tasks_completed', 'success_rate'];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
            'wallet_balance'    => 'decimal:2',
            'total_earnings'    => 'decimal:2',
            'is_verified'       => 'boolean',
        ];
    }

    /* ── Boot ── */
    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (User $user) {
            if (empty($user->referral_code)) {
                $user->referral_code = strtoupper(Str::random(8));
            }
        });
    }

    /* ── Relationships ── */
    public function campaigns()
    {
        return $this->hasMany(Campaign::class, 'created_by');
    }

    public function taskSubmissions()
    {
        return $this->hasMany(TaskSubmission::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    public function withdrawals()
    {
        return $this->hasMany(Withdrawal::class);
    }

    public function referredUsers()
    {
        return $this->hasMany(User::class, 'referred_by');
    }

    public function referrer()
    {
        return $this->belongsTo(User::class, 'referred_by');
    }

    /* ── Computed attributes ── */
    public function getTasksCompletedAttribute(): int
    {
        return $this->taskSubmissions()->where('status', 'approved')->count();
    }

    public function getSuccessRateAttribute(): float
    {
        $total = $this->taskSubmissions()->count();
        if ($total === 0) return 0;
        $approved = $this->taskSubmissions()->where('status', 'approved')->count();
        return round(($approved / $total) * 100, 1);
    }

    /* ── Helpers ── */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }
}

