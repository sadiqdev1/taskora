<?php

namespace Database\Seeders;

use App\Models\Campaign;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ── Admin user ──
        $admin = User::firstOrCreate(
            ['email' => 'admin@taskora.io'],
            [
                'name'         => 'Admin',
                'password'     => Hash::make('password'),
                'role'         => 'admin',
                'is_verified'  => true,
            ]
        );

        // ── Demo user ──
        $user = User::firstOrCreate(
            ['email' => 'john@example.com'],
            [
                'name'             => 'John Doe',
                'password'         => Hash::make('password'),
                'role'             => 'user',
                'wallet_balance'   => 1250.50,
                'total_earnings'   => 3560.75,
                'is_verified'      => true,
            ]
        );

        // ── Demo transactions for John ──
        if ($user->transactions()->count() === 0) {
            $txTypes = [
                ['earning', 150.00, 'Earned from: Instagram Post Engagement'],
                ['earning',  80.00, 'Earned from: TikTok Video Promotion'],
                ['earning',  40.00, 'Earned from: YouTube Channel Boost'],
                ['withdrawal', 300.00, 'Withdrawal via PayPal'],
                ['referral_bonus', 5.00, 'Referral bonus for inviting a friend'],
                ['earning',  37.50, 'Earned from: Twitter Post Engagement'],
            ];
            $bal = 1250.50;
            foreach ($txTypes as [$type, $amount, $desc]) {
                Transaction::create([
                    'user_id'      => $user->id,
                    'type'         => $type,
                    'amount'       => $amount,
                    'description'  => $desc,
                    'balance_after'=> $bal,
                ]);
            }
        }

        // ── Demo campaigns ──
        $campaigns = [
            [
                'title'           => 'Instagram Post Engagement',
                'description'     => 'Like and comment on Instagram post',
                'platform'        => 'instagram',
                'reward_per_task' => 3.00,
                'total_slots'     => 100,
                'filled_slots'    => 50,
                'status'          => 'active',
                'difficulty'      => 'easy',
                'instructions'    => 'Visit the post, like it, and leave a genuine comment of at least 5 words.',
            ],
            [
                'title'           => 'TikTok Video Promotion',
                'description'     => 'Watch and like TikTok video',
                'platform'        => 'tiktok',
                'reward_per_task' => 4.00,
                'total_slots'     => 50,
                'filled_slots'    => 20,
                'status'          => 'active',
                'difficulty'      => 'easy',
                'instructions'    => 'Watch the full TikTok video and like it.',
            ],
            [
                'title'           => 'YouTube Channel Boost',
                'description'     => 'Subscribe and watch full video',
                'platform'        => 'youtube',
                'reward_per_task' => 4.00,
                'total_slots'     => 30,
                'filled_slots'    => 10,
                'status'          => 'active',
                'difficulty'      => 'medium',
                'instructions'    => 'Subscribe to the channel and watch the specified video to completion.',
            ],
            [
                'title'           => 'Twitter Post Engagement',
                'description'     => 'Retweet and like the post',
                'platform'        => 'twitter',
                'reward_per_task' => 2.50,
                'total_slots'     => 25,
                'filled_slots'    => 15,
                'status'          => 'active',
                'difficulty'      => 'easy',
                'instructions'    => 'Retweet and like the specified tweet.',
            ],
            [
                'title'           => 'Facebook Page Like',
                'description'     => 'Like Facebook page and stay active',
                'platform'        => 'facebook',
                'reward_per_task' => 2.50,
                'total_slots'     => 50,
                'filled_slots'    => 25,
                'status'          => 'active',
                'difficulty'      => 'easy',
                'instructions'    => 'Like the Facebook page and follow it to stay updated.',
            ],
            [
                'title'           => 'Download App & Review',
                'description'     => 'Download app and leave a 5-star review',
                'platform'        => 'other',
                'reward_per_task' => 3.80,
                'total_slots'     => 200,
                'filled_slots'    => 0,
                'status'          => 'active',
                'difficulty'      => 'hard',
                'instructions'    => 'Download the app from the Play Store, use it for 5 minutes, and leave a 5-star review.',
            ],
        ];

        foreach ($campaigns as $c) {
            Campaign::firstOrCreate(
                ['title' => $c['title']],
                [...$c, 'created_by' => $admin->id]
            );
        }
    }
}
