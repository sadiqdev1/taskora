<?php

namespace Database\Seeders;

use App\Models\TaskType;
use Illuminate\Database\Seeder;

class TaskTypeSeeder extends Seeder
{
    /**
     * Canonical task type catalogue.
     * reward = NGN amount per completion (integer, matches frontend TASK_TYPES).
     * Changing a price here is the ONLY place it needs to change.
     */
    public function run(): void
    {
        $types = [
            ['value' => 'post_tweet',                'label' => 'Post a tweet on X',                          'platform' => 'twitter',   'reward' => 300,  'sort_order' => 10],
            ['value' => 'twitter_retweet',           'label' => 'Retweet a post',                             'platform' => 'twitter',   'reward' => 12,   'sort_order' => 11],
            ['value' => 'twitter_reply_hashtag',     'label' => 'Reply to a tweet using a specified hashtag', 'platform' => 'twitter',   'reward' => 35,   'sort_order' => 12],
            ['value' => 'twitter_like_comment_rt',   'label' => 'Like, comment and retweet (Twitter)',        'platform' => 'twitter',   'reward' => 25,   'sort_order' => 13],
            ['value' => 'tiktok_follow',             'label' => 'Follow a TikTok page',                       'platform' => 'tiktok',    'reward' => 12,   'sort_order' => 20],
            ['value' => 'tiktok_comment',            'label' => 'TikTok comment',                             'platform' => 'tiktok',    'reward' => 9,    'sort_order' => 21],
            ['value' => 'tiktok_favourite',          'label' => 'Favourite a TikTok video',                   'platform' => 'tiktok',    'reward' => 15,   'sort_order' => 22],
            ['value' => 'tiktok_like_comment_save',  'label' => 'Like, comment and save (TikTok)',            'platform' => 'tiktok',    'reward' => 25,   'sort_order' => 23],
            ['value' => 'tiktok_sound_use',          'label' => 'TikTok sound use',                           'platform' => 'tiktok',    'reward' => 250,  'sort_order' => 24],
            ['value' => 'tiktok_post_video_song',    'label' => 'Post a video on TikTok with a song',         'platform' => 'tiktok',    'reward' => 3000, 'sort_order' => 25],
            ['value' => 'instagram_like_comment_rp', 'label' => 'Like, comment and repost (Instagram)',       'platform' => 'instagram', 'reward' => 30,   'sort_order' => 30],
            ['value' => 'share_story',               'label' => 'Share to story',                             'platform' => 'instagram', 'reward' => 24,   'sort_order' => 31],
            ['value' => 'share_post_story',          'label' => 'Share a post on your Instagram story',       'platform' => 'instagram', 'reward' => 21,   'sort_order' => 32],
            ['value' => 'instagram_post_song',       'label' => 'Post a song on your Instagram story',        'platform' => 'instagram', 'reward' => 2500, 'sort_order' => 33],
            ['value' => 'youtube_subscribe',         'label' => 'Subscribe to a YouTube channel',             'platform' => 'youtube',   'reward' => 13,   'sort_order' => 40],
            ['value' => 'youtube_like',              'label' => 'Like a YouTube video',                       'platform' => 'youtube',   'reward' => 13,   'sort_order' => 41],
            ['value' => 'youtube_comment',           'label' => 'Comment on a YouTube video',                 'platform' => 'youtube',   'reward' => 13,   'sort_order' => 42],
            ['value' => 'facebook_follow',           'label' => 'Follow a Facebook page',                     'platform' => 'facebook',  'reward' => 13,   'sort_order' => 50],
            ['value' => 'facebook_comment',          'label' => 'Comment on a Facebook post',                 'platform' => 'facebook',  'reward' => 13,   'sort_order' => 51],
            ['value' => 'whatsapp_group_join',       'label' => 'WhatsApp group join',                        'platform' => 'other',     'reward' => 18,   'sort_order' => 60],
            ['value' => 'whatsapp_contact_save',     'label' => 'WhatsApp contact save',                      'platform' => 'other',     'reward' => 20,   'sort_order' => 61],
            ['value' => 'boomplay_follow',           'label' => 'Follow a BoomPlay profile',                  'platform' => 'other',     'reward' => 25,   'sort_order' => 62],
            ['value' => 'comment_song',              'label' => 'Comment on a song',                          'platform' => 'other',     'reward' => 18,   'sort_order' => 63],
            ['value' => 'like_song',                 'label' => 'Like a song',                                'platform' => 'other',     'reward' => 21,   'sort_order' => 64],
            ['value' => 'stream_song',               'label' => 'Stream a song',                              'platform' => 'other',     'reward' => 70,   'sort_order' => 65],
            ['value' => 'tag_person',                'label' => 'Tag a person',                               'platform' => 'other',     'reward' => 24,   'sort_order' => 70],
            ['value' => 'tag_friend',                'label' => 'Tag a friend',                               'platform' => 'other',     'reward' => 24,   'sort_order' => 71],
            ['value' => 'join_group_channel',        'label' => 'Join a group/channel',                       'platform' => 'other',     'reward' => 15,   'sort_order' => 72],
            ['value' => 'telegram_bot',              'label' => 'Start a Telegram bot',                       'platform' => 'other',     'reward' => 21,   'sort_order' => 73],
            ['value' => 'artist_profile_follow',     'label' => 'Follow an artist profile',                   'platform' => 'other',     'reward' => 13,   'sort_order' => 74],
            ['value' => 'comment_post',              'label' => 'Comment on a post',                          'platform' => 'other',     'reward' => 12,   'sort_order' => 75],
            ['value' => 'follow_page',               'label' => 'Follow a page',                              'platform' => 'other',     'reward' => 12,   'sort_order' => 76],
            ['value' => 'like_post',                 'label' => 'Like a post',                                'platform' => 'other',     'reward' => 12,   'sort_order' => 77],
            ['value' => 'vote_post',                 'label' => 'Vote for someone on a post',                 'platform' => 'other',     'reward' => 20,   'sort_order' => 78],
            ['value' => 'vote_website',              'label' => 'Vote for someone via a website',             'platform' => 'other',     'reward' => 30,   'sort_order' => 79],
            ['value' => 'vote_sms',                  'label' => 'Vote for someone via SMS',                   'platform' => 'other',     'reward' => 75,   'sort_order' => 80],
            ['value' => 'watch_video',               'label' => 'Watch a video',                              'platform' => 'other',     'reward' => 33,   'sort_order' => 81],
            ['value' => 'signup_website',            'label' => 'Sign up on a website',                       'platform' => 'other',     'reward' => 33,   'sort_order' => 82],
            ['value' => 'download_app',              'label' => 'Download an app',                            'platform' => 'other',     'reward' => 45,   'sort_order' => 83],
            ['value' => 'download_signup',           'label' => 'Download and sign up',                       'platform' => 'other',     'reward' => 70,   'sort_order' => 84],
            ['value' => 'fill_survey',               'label' => 'Fill out a survey',                          'platform' => 'other',     'reward' => 150,  'sort_order' => 85],
            ['value' => 'birthday_wish',             'label' => 'Wish someone happy birthday',                'platform' => 'other',     'reward' => 10,   'sort_order' => 86],
            ['value' => 'custom_task',               'label' => 'Custom task',                                'platform' => 'other',     'reward' => 50,   'sort_order' => 99],
        ];

        $instructions = [
            'post_tweet'                => "1. Go to the link provided.\n2. Post a tweet about it using the hashtag or content specified.\n3. Screenshot your posted tweet showing your username.\n4. Submit the screenshot as proof.",
            'twitter_retweet'           => "1. Open the tweet link provided.\n2. Retweet the post.\n3. Screenshot the retweet on your profile.\n4. Submit the screenshot as proof.",
            'twitter_reply_hashtag'     => "1. Open the tweet link provided.\n2. Reply including the specified hashtag.\n3. Screenshot your reply showing your username and hashtag.\n4. Submit as proof.",
            'twitter_like_comment_rt'   => "1. Open the tweet link.\n2. Like the tweet.\n3. Leave a genuine comment.\n4. Retweet.\n5. Screenshot showing all three actions.\n6. Submit as proof.",
            'tiktok_follow'             => "1. Open the TikTok link provided.\n2. Follow the account.\n3. Screenshot showing you're following.\n4. Submit as proof.",
            'tiktok_comment'            => "1. Open the TikTok video link.\n2. Leave a genuine comment.\n3. Screenshot your comment showing your username.\n4. Submit as proof.",
            'tiktok_favourite'          => "1. Open the TikTok video link.\n2. Tap the bookmark/favourite icon.\n3. Screenshot showing the video is favourited.\n4. Submit as proof.",
            'tiktok_like_comment_save'  => "1. Open the TikTok video link.\n2. Like the video.\n3. Leave a genuine comment.\n4. Save/favourite the video.\n5. Screenshot showing all three actions.\n6. Submit as proof.",
            'tiktok_sound_use'          => "1. Open the TikTok sound link.\n2. Create a TikTok video using this sound.\n3. Post the video publicly.\n4. Screenshot your posted video showing the sound used.\n5. Submit as proof.",
            'tiktok_post_video_song'    => "1. Open the TikTok sound/song link.\n2. Record and post a TikTok video using this song.\n3. Ensure your video is public.\n4. Screenshot showing the song and your username.\n5. Submit as proof.",
            'instagram_like_comment_rp' => "1. Open the Instagram post link.\n2. Like the post.\n3. Leave a genuine comment.\n4. Repost/share to your story or feed.\n5. Screenshot showing all three actions.\n6. Submit as proof.",
            'share_story'               => "1. Open the link provided.\n2. Share the post/content to your story.\n3. Screenshot your story showing the shared content.\n4. Submit as proof.",
            'share_post_story'          => "1. Open the Instagram post link.\n2. Share the post to your story.\n3. Make your story visible.\n4. Screenshot your story showing the shared post.\n5. Submit as proof.",
            'instagram_post_song'       => "1. Open the song link.\n2. Add the song to your Instagram story using the music sticker.\n3. Post your story publicly.\n4. Screenshot your story showing the song.\n5. Submit as proof.",
            'youtube_subscribe'         => "1. Open the YouTube channel link.\n2. Click Subscribe.\n3. Screenshot showing you are subscribed.\n4. Submit as proof.",
            'youtube_like'              => "1. Open the YouTube video link.\n2. Like the video (thumbs up).\n3. Screenshot showing the video is liked.\n4. Submit as proof.",
            'youtube_comment'           => "1. Open the YouTube video link.\n2. Leave a genuine comment.\n3. Screenshot your comment showing your channel name.\n4. Submit as proof.",
            'facebook_follow'           => "1. Open the Facebook page link.\n2. Click Follow.\n3. Screenshot showing you follow the page.\n4. Submit as proof.",
            'facebook_comment'          => "1. Open the Facebook post link.\n2. Leave a genuine comment.\n3. Screenshot your comment showing your profile name.\n4. Submit as proof.",
            'whatsapp_group_join'       => "1. Open the WhatsApp group invite link.\n2. Join the group.\n3. Screenshot showing you are a member.\n4. Submit as proof.",
            'whatsapp_contact_save'     => "1. Save the phone number to your contacts.\n2. Open WhatsApp and find the contact.\n3. Screenshot showing the contact in WhatsApp.\n4. Submit as proof.",
            'boomplay_follow'           => "1. Open the BoomPlay profile link.\n2. Follow the profile.\n3. Screenshot showing you're following.\n4. Submit as proof.",
            'comment_song'              => "1. Open the song link.\n2. Leave a genuine comment.\n3. Screenshot your comment showing your username.\n4. Submit as proof.",
            'like_song'                 => "1. Open the song link.\n2. Like/heart the song.\n3. Screenshot showing the song is liked.\n4. Submit as proof.",
            'stream_song'               => "1. Open the song link.\n2. Stream/play the full song.\n3. Screenshot showing the song playing near the end.\n4. Submit as proof.",
            'tag_person'                => "1. Open the post/content link.\n2. Tag the specified person in the comments.\n3. Screenshot your comment showing the tag and your username.\n4. Submit as proof.",
            'tag_friend'                => "1. Open the post/content link.\n2. Tag a friend in the comments.\n3. Screenshot your comment showing the tag and your username.\n4. Submit as proof.",
            'join_group_channel'        => "1. Open the group/channel link.\n2. Join the group or channel.\n3. Screenshot showing you are a member.\n4. Submit as proof.",
            'telegram_bot'              => "1. Open the Telegram bot link.\n2. Press Start to activate the bot.\n3. Screenshot showing the bot conversation has started.\n4. Submit as proof.",
            'artist_profile_follow'     => "1. Open the artist profile link.\n2. Follow the artist profile.\n3. Screenshot showing you are following.\n4. Submit as proof.",
            'comment_post'              => "1. Open the post link.\n2. Leave a genuine comment.\n3. Screenshot your comment showing your username.\n4. Submit as proof.",
            'follow_page'               => "1. Open the page/profile link.\n2. Follow the page.\n3. Screenshot showing you are following.\n4. Submit as proof.",
            'like_post'                 => "1. Open the post link.\n2. Like the post.\n3. Screenshot showing the post is liked.\n4. Submit as proof.",
            'vote_post'                 => "1. Open the post link.\n2. Vote/react for the specified person.\n3. Screenshot showing your vote/reaction.\n4. Submit as proof.",
            'vote_website'              => "1. Open the voting website link.\n2. Cast your vote for the specified person.\n3. Screenshot the confirmation page.\n4. Submit as proof.",
            'vote_sms'                  => "1. Send an SMS vote to the number/keyword provided.\n2. Screenshot the sent message or confirmation reply.\n3. Submit as proof.",
            'watch_video'               => "1. Open the video link.\n2. Watch the full video.\n3. Screenshot near the end showing watch progress.\n4. Submit as proof.",
            'signup_website'            => "1. Open the website link.\n2. Create an account.\n3. Screenshot your new profile or the welcome page.\n4. Submit as proof.",
            'download_app'              => "1. Open the app link (App Store or Play Store).\n2. Download and install the app.\n3. Screenshot the app installed or open on your screen.\n4. Submit as proof.",
            'download_signup'           => "1. Open the app/website link.\n2. Download the app or visit the website.\n3. Create a new account.\n4. Screenshot your new profile or welcome screen.\n5. Submit as proof.",
            'fill_survey'               => "1. Open the survey link.\n2. Fill out the survey honestly and completely.\n3. Screenshot the confirmation/thank you page.\n4. Submit as proof.",
            'birthday_wish'             => "1. Open the profile/post link.\n2. Write a happy birthday message.\n3. Screenshot your message showing your username.\n4. Submit as proof.",
            'custom_task'               => "1. Read the task instructions carefully.\n2. Complete the task as described.\n3. Screenshot proof of completion.\n4. Submit as proof.",
        ];

        foreach ($types as $type) {
            TaskType::updateOrCreate(
                ['value' => $type['value']],
                array_merge($type, ['instructions' => $instructions[$type['value']] ?? ''])
            );
        }

        // Bust the task_types cache so the API serves fresh prices immediately
        \Illuminate\Support\Facades\Cache::forget('task_types');
    }
}
