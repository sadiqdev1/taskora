import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Image as ImageIcon, Smile, Tag, Sparkles, TrendingUp, Clock, Star, RefreshCw } from 'lucide-react';
import MemeCard from '../components/MemeCard';
import { Link } from 'react-router-dom';

const generateMockMemes = (page, limit = 5) => {
  const start = (page - 1) * limit;
  const end = start + limit;
  const total = 50;

  const titles = [
    'When the code finally works',
    'Me explaining the bug',
    'Dev life be like',
    'React developers after a build',
    'When you fix one bug and create three',
    'My code on Monday vs Friday',
    'CSS in production',
    'Junior vs Senior developer',
    'When the PM asks for a quick change',
    'Deploying on a Friday',
    'The real MVP',
    'Waiting for npm install',
    'When you forget to git pull',
    '404: Brain not found',
    'Stack Overflow to the rescue',
  ];

  const authors = ['dankmemer', 'lolmaster', 'sadiqdev', 'gitgud', 'coder', 'devlife', 'programmerhumor'];
  const memes = [];

  for (let i = start + 1; i <= Math.min(end, total); i++) {
    memes.push({
      id: i,
      title: titles[Math.floor(Math.random() * titles.length)],
      author: authors[Math.floor(Math.random() * authors.length)],
      likes: Math.floor(Math.random() * 20000) + 1000,
      comments: Math.floor(Math.random() * 500) + 10,
      imageUrl: `https://picsum.photos/600/600?random=${i}`,
      timeAgo: `${Math.floor(Math.random() * 5) + 1}h`,
    });
  }

  return memes;
};

const MemeCardSkeleton = () => (
  <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm animate-pulse">
    <div className="flex items-center gap-3 px-4 py-4">
      <div className="h-10 w-10 rounded-full bg-gray-100" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 w-32 rounded-full bg-gray-100" />
        <div className="h-3 w-20 rounded-full bg-gray-100" />
      </div>
    </div>
    <div className="aspect-square bg-gray-100" />
    <div className="space-y-2.5 px-4 py-4">
      <div className="h-3.5 w-3/4 rounded-full bg-gray-100" />
      <div className="h-3 w-1/2 rounded-full bg-gray-100" />
    </div>
  </div>
);

const FEED_TABS = [
  { id: 'latest', label: 'Latest', icon: Clock },
  { id: 'trending', label: 'Trending', icon: TrendingUp },
  { id: 'top', label: 'Top', icon: Star },
];

const Home = () => {
  const [memes, setMemes] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('latest');

  const observerRef = useRef(null);
  const touchStartY = useRef(0);

  const currentUser = {
    name: 'John Doe',
    avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=f97316&color=fff&length=2&size=40',
  };

  const loadMemes = async (pageToLoad) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    const newMemes = generateMockMemes(pageToLoad, 5);
    setMemes((prev) => [...prev, ...newMemes]);
    if (pageToLoad * 5 >= 50) setHasMore(false);
    setLoading(false);
    setInitialLoading(false);
  };

  const refreshFeed = async () => {
    if (refreshing) return;
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    const freshMemes = generateMockMemes(1, 5);
    setMemes(freshMemes);
    setPage(1);
    setHasMore(true);
    setRefreshing(false);
  };

  const handleTabChange = (tabId) => {
    if (tabId === activeTab) return;
    setActiveTab(tabId);
    setMemes([]);
    setPage(1);
    setHasMore(true);
    setInitialLoading(true);
  };

  const handleTouchStart = (e) => { touchStartY.current = e.touches[0].clientY; };
  const handleTouchEnd = (e) => {
    const endY = e.changedTouches[0].clientY;
    if (window.scrollY === 0 && endY - touchStartY.current > 120) refreshFeed();
  };

  const lastMemeRef = useCallback(
    (node) => {
      if (loading || !hasMore) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0]?.isIntersecting) setPage((prev) => prev + 1);
      });
      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => { loadMemes(page); }, [page]);

  useEffect(() => {
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <div className="mx-auto w-full max-w-2xl space-y-5">

      {/* Pull-to-refresh indicator */}
      {refreshing && (
        <div className="flex items-center justify-center gap-2 py-3 text-sm text-orange-500 font-medium">
          <RefreshCw size={15} className="animate-spin" />
          <span>Refreshing feed...</span>
        </div>
      )}

      {/* Composer */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="p-4">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="h-10 w-10 rounded-full object-cover ring-2 ring-orange-100 flex-shrink-0"
            />
            <Link
              to="/upload"
              className="flex-1 rounded-full border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-400 hover:bg-gray-100 hover:border-gray-300 transition-all"
            >
              Share something funny...
            </Link>
          </div>

          <div className="mt-3 flex items-center gap-1 border-t border-gray-100 pt-3">
            <Link
              to="/upload"
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              <ImageIcon size={15} className="text-blue-500" />
              Photo
            </Link>
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-gray-500 hover:bg-yellow-50 hover:text-yellow-600 transition-colors"
            >
              <Smile size={15} className="text-yellow-500" />
              Feeling
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-gray-500 hover:bg-green-50 hover:text-green-600 transition-colors"
            >
              <Tag size={15} className="text-green-500" />
              Tag
            </button>
            <Link
              to="/trending"
              className="ml-auto flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-600 hover:bg-orange-100 transition-colors sm:flex hidden"
            >
              <Sparkles size={13} />
              Trending
            </Link>
          </div>
        </div>
      </div>

      {/* Feed Tabs */}
      <div className="flex items-center gap-1 rounded-2xl border border-gray-100 bg-white p-1.5 shadow-sm">
        {FEED_TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => handleTabChange(id)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-all ${
              activeTab === id
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
            }`}
          >
            <Icon size={15} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Feed */}
      <section className="space-y-5">
        {initialLoading && (
          <>
            <MemeCardSkeleton />
            <MemeCardSkeleton />
            <MemeCardSkeleton />
          </>
        )}

        {memes.map((meme, index) => {
          const isLast = index === memes.length - 1;
          return isLast ? (
            <div ref={lastMemeRef} key={meme.id}>
              <MemeCard meme={meme} />
            </div>
          ) : (
            <MemeCard key={meme.id} meme={meme} />
          );
        })}

        {loading && !initialLoading && (
          <>
            <MemeCardSkeleton />
            <MemeCardSkeleton />
          </>
        )}

        {!hasMore && !loading && (
          <div className="flex flex-col items-center gap-2 py-10 text-center">
            <span className="text-2xl">🎉</span>
            <p className="text-sm font-medium text-gray-700">You're all caught up!</p>
            <p className="text-xs text-gray-400">Check back later for more memes.</p>
            <button
              type="button"
              onClick={refreshFeed}
              className="mt-2 flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <RefreshCw size={13} />
              Refresh feed
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
