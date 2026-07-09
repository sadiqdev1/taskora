<?php

namespace App\Models;

use App\Enums\NotificationType;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $fillable = [
        'user_id', 'type', 'title', 'body', 'action_url', 'meta', 'read_at',
    ];

    protected function casts(): array
    {
        return [
            'meta'    => 'array',
            'read_at' => 'datetime',
            'type'    => NotificationType::class,
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function scopeUnread($query)
    {
        return $query->whereNull('read_at');
    }
}
