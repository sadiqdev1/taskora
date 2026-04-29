import React, { useEffect, useState, useRef } from 'react';
import { ArrowUp } from 'lucide-react';

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const lastScroll = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      const total = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setProgress(total > 0 ? (current / total) * 100 : 0);
      setVisible(current > 400 && current < lastScroll.current);
      lastScroll.current = current;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const r = 20;
  const circ = 2 * Math.PI * r;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Scroll to top"
      className={`fixed right-5 bottom-20 md:bottom-7 z-50 w-12 h-12 flex items-center justify-center transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <svg className="absolute w-12 h-12 -rotate-90" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r={r} stroke="#e5e7eb" strokeWidth="3" fill="none" />
        <circle cx="24" cy="24" r={r} stroke="#f97316" strokeWidth="3" fill="none"
          strokeDasharray={circ} strokeDashoffset={circ - (progress / 100) * circ} strokeLinecap="round" />
      </svg>
      <div className="w-9 h-9 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center hover:bg-orange-500 hover:border-orange-500 hover:text-white text-gray-600 transition-all group">
        <ArrowUp size={16} />
      </div>
    </button>
  );
};

export default ScrollToTop;
