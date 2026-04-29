import { Link } from '@inertiajs/react';
import { Heart, MessageCircle, Bookmark, UserPlus, X, Zap } from 'lucide-react';

/**
 * AuthPromptModal — shown when a guest tries to perform an auth-required action.
 *
 * Usage:
 *   const [authPrompt, setAuthPrompt] = useState(false);
 *   <AuthPromptModal open={authPrompt} onClose={() => setAuthPrompt(false)} action="like" />
 *
 * action: 'like' | 'comment' | 'save' | 'follow' | 'upload' | 'general'
 */

const actionMessages = {
    like:    { icon: Heart,         title: 'Like this meme?',       body: 'Create a free account to react to memes and show creators some love.' },
    comment: { icon: MessageCircle, title: 'Join the conversation',  body: 'Sign up to comment, reply, and connect with the Chortle community.' },
    save:    { icon: Bookmark,      title: 'Save for later?',        body: 'Create an account to bookmark your favourite memes and find them anytime.' },
    follow:  { icon: UserPlus,      title: 'Follow this creator?',   body: 'Sign up to follow creators and get their latest memes in your feed.' },
    upload:  { icon: Zap,           title: 'Share your memes',       body: 'Create a free account to upload memes and grow your audience.' },
    general: { icon: Zap,           title: 'Sign up to continue',    body: 'Create a free Chortle account to unlock likes, comments, follows, and more.' },
};

export default function AuthPromptModal({ open, onClose, action = 'general' }) {
    if (!open) return null;

    const { icon: Icon, title, body } = actionMessages[action] ?? actionMessages.general;

    return (
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-prompt-title"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className="relative w-full max-w-sm bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden"
                style={{ animation: 'authModalIn .25s cubic-bezier(.22,.61,.36,1)' }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    type="button"
                    className="absolute top-3 right-3 p-1.5 rounded-full text-gray-400 dark:text-zinc-500 hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
                    aria-label="Close"
                >
                    <X size={16} />
                </button>

                {/* Header gradient */}
                <div className="bg-gradient-to-br from-orange-400 to-orange-600 px-6 pt-8 pb-6 text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm mb-3">
                        <Icon size={26} className="text-white" />
                    </div>
                    <h2 id="auth-prompt-title" className="text-lg font-bold text-white">{title}</h2>
                    <p className="text-sm text-orange-100 mt-1 leading-relaxed">{body}</p>
                </div>

                {/* Actions */}
                <div className="px-6 py-5 space-y-3">
                    <Link
                        href="/register"
                        className="flex items-center justify-center w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-all hover:shadow-lg hover:shadow-orange-500/30 active:scale-[.98]"
                        onClick={onClose}
                    >
                        Create free account
                    </Link>
                    <Link
                        href="/login"
                        className="flex items-center justify-center w-full py-3 rounded-xl border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-200 text-sm font-medium hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                        onClick={onClose}
                    >
                        Log in
                    </Link>
                </div>

                {/* Footer */}
                <div className="px-6 pb-5 text-center">
                    <p className="text-xs text-gray-400 dark:text-zinc-500">
                        Free forever · No credit card required
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes authModalIn {
                    from { opacity: 0; transform: scale(.95) translateY(8px); }
                    to   { opacity: 1; transform: scale(1)  translateY(0);    }
                }
            `}</style>
        </div>
    );
}
