<?php

namespace App\Enums;

enum CampaignPlatform: string
{
    case Instagram = 'instagram';
    case TikTok    = 'tiktok';
    case YouTube   = 'youtube';
    case Twitter   = 'twitter';
    case Facebook  = 'facebook';
    case Other     = 'other';
}
