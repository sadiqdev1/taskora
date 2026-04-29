import { useEffect, useRef, useState } from 'react';

const reactions = [
    { type: 'like', emoji: '👍', label: 'Like', color: 'text-blue-500' },
    { type: 'love', emoji: '❤️', label: 'Love', color: 'text-red-500' },
    { type: 'haha', emoji: '😂', label: 'Haha', color: 'text-yellow-500' },
    { type: 'wow', emoji: '😮', label: 'Wow', color: 'text-orange-500' },
    { type: 'sad', emoji: '😢', label: 'Sad', color: 'text-blue-400' },
    { type: 'angry', emoji: '😠', label: 'Angry', color: 'text-red-600' },
];

export default function ReactionPicker({ onSelect, currentReaction, show, onClose }) {
    const pickerRef = useRef(null);
    const [hoveredReaction, setHoveredReaction] = useState(null);

    useEffect(() => {
        if (!show) return;

        // Use a small delay so the mouseup/touchend that triggered the long press
        // doesn't immediately close the picker before the user can choose a reaction
        let timeout;
        const handleClickOutside = (e) => {
            if (pickerRef.current && !pickerRef.current.contains(e.target)) {
                onClose?.();
            }
        };

        timeout = setTimeout(() => {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('touchstart', handleClickOutside);
        }, 100);

        return () => {
            clearTimeout(timeout);
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [show, onClose]);

    if (!show) return null;

    return (
        <div
            ref={pickerRef}
            className="absolute bottom-full left-0 mb-2 bg-white dark:bg-zinc-800 rounded-full shadow-2xl border border-gray-200 dark:border-zinc-700 px-2 py-2 flex gap-1 z-50"
            style={{ animation: 'scaleIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
        >
            {reactions.map((reaction) => (
                <button
                    key={reaction.type}
                    onClick={() => {
                        onSelect(reaction.type);
                        // Haptic feedback for mobile
                        if (navigator.vibrate) {
                            navigator.vibrate(10);
                        }
                    }}
                    onMouseEnter={() => setHoveredReaction(reaction.type)}
                    onMouseLeave={() => setHoveredReaction(null)}
                    className={`group relative w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        currentReaction === reaction.type ? 'bg-gray-100 dark:bg-zinc-700' : 'hover:bg-gray-50 dark:hover:bg-zinc-700'
                    }`}
                    title={reaction.label}
                >
                    <span 
                        className={`text-2xl transition-all duration-200 ${
                            hoveredReaction === reaction.type ? 'scale-150 -translate-y-1' : 'scale-100'
                        }`}
                        style={{ 
                            animation: hoveredReaction === reaction.type ? 'bounce 0.5s ease' : 'none'
                        }}
                    >
                        {reaction.emoji}
                    </span>
                    
                    {/* Tooltip */}
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 dark:bg-zinc-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        {reaction.label}
                    </span>
                </button>
            ))}

            <style>{`
                @keyframes scaleIn {
                    from {
                        opacity: 0;
                        transform: scale(0.8) translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }
                @keyframes bounce {
                    0%, 100% { transform: translateY(0) scale(1); }
                    25% { transform: translateY(-8px) scale(1.2); }
                    50% { transform: translateY(-4px) scale(1.15); }
                    75% { transform: translateY(-6px) scale(1.18); }
                }
            `}</style>
        </div>
    );
}

export function ReactionButton({ reactionType, count, onClick, onLongPress }) {
    const [pressing, setPressing] = useState(false);
    const [popKey, setPopKey] = useState(0); // increment to re-trigger animation
    const pressTimer = useRef(null);
    const longPressTriggered = useRef(false);

    const handleMouseDown = (e) => {
        e.preventDefault();
        longPressTriggered.current = false;
        setPressing(true);
        pressTimer.current = setTimeout(() => {
            longPressTriggered.current = true;
            onLongPress?.();
            if (navigator.vibrate) navigator.vibrate(10);
        }, 500);
    };

    const handleMouseUp = () => {
        clearTimeout(pressTimer.current);
        if (pressing && !longPressTriggered.current) {
            onClick?.();
            setPopKey(k => k + 1); // re-trigger pop animation on every click
            if (navigator.vibrate) navigator.vibrate(5);
        }
        setPressing(false);
    };

    const handleMouseLeave = () => {
        clearTimeout(pressTimer.current);
        setPressing(false);
    };

    const getReactionEmoji = (type) => reactions.find(r => r.type === type)?.emoji || null;
    const getReactionColor = (type) => reactions.find(r => r.type === type)?.color || 'text-orange-500';

    const hasReaction = !!reactionType;
    const emoji = hasReaction ? getReactionEmoji(reactionType) : null;
    const label = hasReaction
        ? (reactions.find(r => r.type === reactionType)?.label ?? 'Like')
        : 'Like';

    return (
        <>
            <button
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handleMouseDown}
                onTouchEnd={handleMouseUp}
                type="button"
                className={`flex items-center justify-center gap-1.5 py-3 w-full text-sm font-medium transition-all select-none ${
                    hasReaction ? getReactionColor(reactionType) : 'text-gray-500 dark:text-zinc-400 hover:text-orange-500'
                } ${pressing ? 'scale-95' : ''}`}
            >
                {hasReaction ? (
                    /* Emoji reaction — sized to match the other action bar icons */
                    <span
                        key={popKey}
                        className="leading-none"
                        style={{
                            fontSize: '17px',
                            lineHeight: 1,
                            display: 'inline-block',
                            animation: popKey > 0 ? 'reactionPop 0.5s cubic-bezier(0.34,1.56,0.64,1) both' : 'none',
                        }}
                    >
                        {emoji}
                    </span>
                ) : (
                    /* Default: plain thumbs-up icon, same size as Comment/Share icons */
                    <svg
                        key={popKey}
                        xmlns="http://www.w3.org/2000/svg"
                        width="17" height="17"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{
                            flexShrink: 0,
                            animation: popKey > 0 ? 'reactionPop 0.5s cubic-bezier(0.34,1.56,0.64,1) both' : 'none',
                        }}
                    >
                        <path d="M7 10v12" />
                        <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
                    </svg>
                )}
                <span>{label}</span>
            </button>

            <style>{`
                @keyframes reactionPop {
                    0%   { transform: scale(1); }
                    25%  { transform: scale(1.7) rotate(-8deg); }
                    50%  { transform: scale(1.5) rotate(6deg); }
                    75%  { transform: scale(1.6) rotate(-4deg); }
                    100% { transform: scale(1) rotate(0deg); }
                }
            `}</style>
        </>
    );
}

export function ReactionsSummary({ reactions, onClick }) {
    // Validate reactions is an object
    if (!reactions || typeof reactions !== 'object' || Array.isArray(reactions)) {
        return null;
    }

    const reactionsList = [
        { type: 'like', emoji: '👍' },
        { type: 'love', emoji: '❤️' },
        { type: 'haha', emoji: '😂' },
        { type: 'wow', emoji: '😮' },
        { type: 'sad', emoji: '😢' },
        { type: 'angry', emoji: '😠' },
    ];

    const topReactions = Object.entries(reactions)
        .filter(([_, count]) => count > 0)
        .sort(([_, a], [__, b]) => b - a)
        .slice(0, 3);

    const totalCount = Object.values(reactions).reduce((sum, count) => sum + count, 0);

    if (totalCount === 0) {
        return null;
    }

    return (
        <button
            onClick={onClick}
            className="group flex items-center gap-1.5 text-xs text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-300 transition-colors"
            title="View reactions"
        >
            <div className="flex -space-x-1 group-hover:scale-110 transition-transform">
                {topReactions.map(([type]) => {
                    const reaction = reactionsList.find(r => r.type === type);
                    return (
                        <span
                            key={type}
                            className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-xs shadow-sm"
                        >
                            {reaction?.emoji || '👍'}
                        </span>
                    );
                })}
            </div>
            <span className="font-medium">{totalCount}</span>
        </button>
    );
}
