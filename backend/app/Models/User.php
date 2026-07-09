<?php

namespace App\Models;

use App\Enums\UserRole;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'username',
        'email',
        'password',
        'role',
        'is_verified',
        'avatar',
        'google_id',
        'wallet_balance',
        'pending_balance',
        'total_earnings',
        'referral_code',
        'referred_by',
        'bank_account',
        'banned_at',
        'ban_reason',
        'email_verification_token',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'google_id',
        'email_verification_token',
    ];

    protected $appends = ['tasks_completed', 'success_rate', 'bank_set_up', 'referrals_count'];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'banned_at'         => 'datetime',
            'password'          => 'hashed',
            'wallet_balance'    => 'decimal:2',
            'pending_balance'   => 'decimal:2',
            'total_earnings'    => 'decimal:2',
            'is_verified'       => 'boolean',
            'bank_account'      => 'array',
            'role'              => UserRole::class,
        ];
    }

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
    public function appNotifications()  { return $this->hasMany(\App\Models\Notification::class); }
    public function profile()           { return $this->hasOne(UserProfile::class); }
    public function campaigns()         { return $this->hasMany(Campaign::class, 'created_by'); }
    public function taskSubmissions()   { return $this->hasMany(TaskSubmission::class); }
    public function transactions()      { return $this->hasMany(Transaction::class); }
    public function withdrawals()       { return $this->hasMany(Withdrawal::class); }
    public function referredUsers()     { return $this->hasMany(User::class, 'referred_by'); }
    public function referrer()          { return $this->belongsTo(User::class, 'referred_by'); }

    /* ── Computed attributes ── */
    public function getTasksCompletedAttribute(): int
    {
        return $this->taskSubmissions()->where('status', \App\Enums\SubmissionStatus::Approved)->count();
    }

    public function getSuccessRateAttribute(): float
    {
        $total = $this->taskSubmissions()->count();
        if ($total === 0) return 0.0;
        return round(
            ($this->taskSubmissions()->where('status', \App\Enums\SubmissionStatus::Approved)->count() / $total) * 100,
            1
        );
    }

    public function getBankSetUpAttribute(): bool
    {
        return !empty($this->bank_account['account_number']);
    }

    public function getReferralsCountAttribute(): int
    {
        return $this->referredUsers()->count();
    }

    /* ── Helpers ── */
    public function isAdmin(): bool  { return $this->role === UserRole::Admin; }
    public function isBanned(): bool { return !is_null($this->banned_at); }
    public function getSlugAttribute(): string { return $this->username ?? 'user-' . $this->id; }
}
