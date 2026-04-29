import React, { useState, useEffect, useRef, useCallback } from 'react';
import MemeCard from '../components/MemeCard';
import { Flame, Sparkles, TrendingUp } from 'lucide-react';

const generateTrending = (page, limit = 5) => {
  const start = (page - 1) * limit;
  const total = 40;
  const titles = [
    'When the code finally works', 'Me explaining the bug', 'Deploying on Friday',
    'Waiting for npm install', '404: Brain not found', 'When CSS finally behaves',
    'Junior vs Senior developer', 'Stack Overflow saves the day',
  ];
  const authors = ['@dankmemer', '@lolmaster', '@coder', '@gitgud', '@memelord', '@devlife'];
  const memes = [];
  for (let i = start + 1; i <= Math.min(start + limit, total); i++) {
    memes.push({
      id: i,
      title: titles[Math.floor(Math.random() * titles.length)],
      author: authors[Math.floor(Math.random() * authors.length)],
      likes: Math.floor(Math.random() * 20000) + 5000,
      comments: Math.floor(Math.random() * 500) + 50,
      imageUrl: `https://picsum.photos/600/600?random=${i + 100}`,
      timeAgo: `${Math.floor(Math.random() * 12) + 1}h`,
    });
  }
  return memes;
};

const Skeleton = () => (
  <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white animate-pulse">
    <div className="flex items-center gap-3 px-4 py-4">
      <div className="h-9 w-9 rounded-full bg-gray-100" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-28 rounded-full bg-gray-100" />
        <div className="h-2.5 w-16 rounded-full bg-gray-100" />
      </div>
    </div>
    <div className="aspect-square bg-gray-100" />
    <div className="space-y-2 px-4 py-4">
      <div className="h-3 w-3/4 rounded-full bg-gray-100" />
      <div className="h-2.5 w-1/2 rounded-full bg-gray-100" />
    </div>
  </div>
);

const Trending = () => {
  const [memes, setMemes] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef(null);

  const lastMemeRef = useCallback((node) => {
    if (loading || !hasMore) return;
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) setPage((p) => p + 1);
    });
    if (node) observerRef.current.observe(node);
  }, [loading, hasMore]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 800));
      if (!mounted) return;
      const newMemes = generateTrending(page, 5);
      setMemes((prev) => [...prev, ...newMemes]);
      if (page * 5 >= 40) setHasMore(false);
      setLoading(false);
      setInitialLoading(false);
    };
    load();
    return () => { mounted = false; };
  }, [page]);

  return (
    <div className="mx-auto w-full max-w-2xl">

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
              <Flame size={20} className="text-orange-500" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Trending</h1>
              <p className="text-xs text-gray-400">What everyone's laughing at</p>
            </div>
          </div>
          <span className="hidden sm:flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-600">
            <Sparkles size={12} /> Hot right now
          </span>
        </div>

        {/* Trending stats bar */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            { label: 'Posts today', value: '2.4K', icon: TrendingUp },
            { label: 'Active users', value: '18K', icon: Flame },
            { label: 'Reactions', value: '94K', icon: Sparkles },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-100 px-3 py-2.5 text-center">
              <p className="text-base font-bold text-gray-900">{value}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <section className="space-y-5">
        {initialLoading ? (
          <><Skeleton /><Skeleton /><Skeleton /></>
        ) : (
          <>
            {memes.map((meme, index) => {
              const isLast = index === memes.length - 1;
              return isLast
                ? <div ref={lastMemeRef} key={meme.id}><MemeCard meme={meme} /></div>
                : <MemeCard key={meme.id} meme={meme} />;
            })}

            {loading && <><Skeleton /><Skeleton /></>}

            {!hasMore && !loading && (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-4 py-10 text-center">
                <Flame size={28} className="text-orange-300 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700">You've seen it all 🔥</p>
                <p className="text-xs text-gray-400 mt-1">Check back later for more trending memes.</p>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Trending;
