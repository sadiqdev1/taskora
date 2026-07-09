<?php

namespace App\Models;

use App\Enums\CampaignPlatform;
use Illuminate\Database\Eloquent\Model;

class TaskType extends Model
{
    protected $fillable = [
        'value',
        'label',
        'platform',
        'reward',
        'instructions',
        'is_active',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'platform'  => CampaignPlatform::class,
            'reward'    => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true)->orderBy('sort_order')->orderBy('label');
    }
}
