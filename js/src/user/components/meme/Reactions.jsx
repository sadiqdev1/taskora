import React, { useState, useEffect, useRef } from 'react';

const reactions = [
  { type: 'like', emoji: '👍', label: 'Like' },
  { type: 'love', emoji: '❤️', label: 'Love' },
  { type: 'laugh', emoji: '😂', label: 'Haha' },
  { type: 'fire', emoji: '🔥', label: 'Fire' },
  { type: 'wow', emoji: '😮', label: 'Wow' },
  { type: 'sad', emoji: '😢', label: 'Sad' },
];

const Reactions = ({ children, onReact, onLike }) => {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(null);
  const timerRef = useRef(null);
  const longPressTriggered = useRef(false);

  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, []);

  const startPress = () => {
    longPressTriggered.current = false;
    timerRef.current = setTimeout(() => {
      setOpen(true);
      longPressTriggered.current = true;
    }, 450);
  };

  const endPress = () => {
    clearTimeout(timerRef.current);
    if (hovered) {
      onReact(hovered);
      setOpen(false);
      setHovered(null);
      return;
    }
    if (!longPressTriggered.current && !open) onLike();
  };

  return (
    <div
      className="relative flex-1 flex items-center justify-center"
      onMouseDown={startPress}
      onMouseUp={endPress}
      onMouseLeave={() => clearTimeout(timerRef.current)}
      onTouchStart={startPress}
      onTouchEnd={endPress}
    >
      {children}

      {open && (
        <div
          className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 flex gap-1 bg-white border border-gray-100 rounded-2xl shadow-2xl px-3 py-2.5 z-30"
          style={{ animation: 'reactionsIn .18s cubic-bezier(.16,1,.3,1)' }}
          onMouseLeave={() => setHovered(null)}
          onClick={(e) => e.stopPropagation()}
        >
          {reactions.map((r) => (
            <div
              key={r.type}
              onMouseEnter={() => setHovered(r.type)}
              onMouseDown={(e) => { e.stopPropagation(); onReact(r.type); setOpen(false); setHovered(null); }}
              className="flex flex-col items-center gap-1 cursor-pointer px-1"
            >
              <span className={`text-xl transition-all duration-150 ${hovered === r.type ? 'scale-150 -translate-y-2' : 'scale-100'}`}>
                {r.emoji}
              </span>
              {hovered === r.type && (
                <span className="text-[10px] text-gray-500 font-medium whitespace-nowrap">{r.label}</span>
              )}
            </div>
          ))}
        </div>
      )}
      <style>{`@keyframes reactionsIn{from{opacity:0;transform:translateX(-50%) scale(.8) translateY(4px)}to{opacity:1;transform:translateX(-50%) scale(1) translateY(0)}}`}</style>
    </div>
  );
};

export default Reactions;
