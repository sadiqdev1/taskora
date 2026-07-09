<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserProfile extends Model
{
    protected $fillable = [
        'user_id',
        'avatar',
        'display_name',
        'bio',
        'phone',
        'country',
        'twitter',
        'instagram',
        'tiktok',
        'youtube',
        'facebook',
        'website',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
