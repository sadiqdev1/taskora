import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

// Check if Pusher is configured
const pusherKey = import.meta.env.VITE_PUSHER_APP_KEY;
const reverbKey = import.meta.env.VITE_REVERB_APP_KEY;

if (pusherKey) {
    // Use Pusher
    window.Echo = new Echo({
        broadcaster: 'pusher',
        key: pusherKey,
        cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER ?? 'mt1',
        forceTLS: true,
    });
    
    console.log('✅ Laravel Echo initialized with Pusher');
} else if (reverbKey) {
    // Use Reverb
    window.Echo = new Echo({
        broadcaster: 'reverb',
        key: reverbKey,
        wsHost: import.meta.env.VITE_REVERB_HOST,
        wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,
        wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
        forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
        enabledTransports: ['ws', 'wss'],
    });
    
    console.log('✅ Laravel Echo initialized with Reverb');
} else {
    console.log('ℹ️ Broadcasting not configured. Set VITE_PUSHER_APP_KEY or VITE_REVERB_APP_KEY to enable real-time features.');
}

export default window.Echo;
