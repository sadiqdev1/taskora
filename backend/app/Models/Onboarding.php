<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Onboarding extends Model
{
    protected $fillable = [
        'user_id',
        'profile_done',
        'referral_seen',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'profile_done'  => 'boolean',
            'referral_seen' => 'boolean',
            'completed_at'  => 'datetime',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
