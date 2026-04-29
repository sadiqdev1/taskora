import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, X, Heart, MessageCircle, AlertCircle, Users } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';
import VerifiedBadge from '../../../components/VerifiedBadge';

const fmt = (n) => n >= 1e6 ? (n / 1e6).toFixed(1) + 'M' : n >= 1e3 ? (n / 1e3).toFixed(1) + 'K' : String(n);

const MOCK_MEMES = [
  { id: 'meme-1', type: 'meme', title: 'When the code finally works', author: '@dankmemer', likes: 12400, comments: 342, imageUrl: 'https://picsum.photos/80/80?random=1', timeAgo: '2h' },
  { id: 'meme-2', type: 'meme', title: 'Me explaining the bug', author: '@lolmaster', likes: 8200, comments: 156, imageUrl: 'https://picsum.photos/80/80?random=2', timeAgo: '4h' },
  { id: 'meme-3', type: 'meme', title: 'CSS in production', author: '@coder', likes: 4300, comments: 67, imageUrl: 'https://picsum.photos/80/80?random=4', timeAgo: '8h' },
  { id: 'meme-4', type: 'meme', title: 'Junior vs Senior developer', author: '@devlife', likes: 9100, comments: 203, imageUrl: 'https://picsum.photos/80/80?random=5', timeAgo: '10h' },
  { id: 'meme-5', type: 'meme', title: 'Deploying on Friday', author: '@gitgud', likes: 15600, comments: 421, imageUrl: 'https://picsum.photos/80/80?random=6', timeAgo: '1d' },
];

const MOCK_USERS = [
  { id: 'user-1', type: 'user', username: 'dankmemer', fullName: 'Dank Memer', followers: 12500, avatar: 'https://ui-avatars.com/api/?name=Dank+Memer&background=f97316&color=fff&length=2&size=40' },
  { id: 'user-2', type: 'user', username: 'lolmaster', fullName: 'Lol Master', followers: 8300, avatar: 'https://ui-avatars.com/api/?name=Lol+Master&background=3b82f6&color=fff&length=2&size=40' },
  { id: 'user-3', type: 'user', username: 'sadiqdev', fullName: 'Sadiq Dev', followers: 5600, avatar: 'https://ui-avatars.com/api/?name=Sadiq+Dev&background=8b5cf6&color=fff&length=2&size=40' },
  { id: 'user-4', type: 'user', username: 'gitgud', fullName: 'Git Gud', followers: 4200, avatar: 'https://ui-avatars.com/api/?name=Git+Gud&background=10b981&color=fff&length=2&size=40' },
];

const MemeSkeleton = () => (
  <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 animate-pulse">
    <div className="w-14 h-14 rounded-xl bg-gray-100 flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-3.5 w-3/4 rounded-full bg-gray-100" />
      <div className="h-3 w-1/2 rounded-full bg-gray-100" />
      <div className="flex gap-3">
        <div className="h-2.5 w-14 rounded-full bg-gray-100" />
        <div className="h-2.5 w-14 rounded-full bg-gray-100" />
      </div>
    </div>
  </div>
);

const UserSkeleton = () => (
  <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 animate-pulse">
    <div className="w-12 h-12 rounded-full bg-gray-100 flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-3.5 w-32 rounded-full bg-gray-100" />
      <div className="h-3 w-24 rounded-full bg-gray-100" />
    </div>
    <div className="w-20 h-8 rounded-full bg-gray-100" />
  </div>
);

const TABS = ['all', 'memes', 'users'];

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [filter, setFilter] = useState(searchParams.get('filter') || 'all');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const [followingUsers, setFollowingUsers] = useState(new Set());
  const inputRef = useRef(null);
  const debouncedQuery = useDebounce(query, 300);

  const handleFollowToggle = async (e, userId, username) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const response = await fetch(`/u/${username}/follow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
        },
      });
      
      if (response.ok) {
        setFollowingUsers(prev => {
          const newSet = new Set(prev);
          if (newSet.has(userId)) {
            newSet.delete(userId);
          } else {
            newSet.add(userId);
          }
          return newSet;
        });
      }
    } catch (error) {
      console.error('Follow toggle failed:', error);
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem('recentSearches');
    if (stored) setRecentSearches(JSON.parse(stored));
  }, []);

  useEffect(() => {
    const params = {};
    if (debouncedQuery) params.q = debouncedQuery;
    if (filter !== 'all') params.filter = filter;
    setSearchParams(params);
  }, [debouncedQuery, filter, setSearchParams]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) { e.preventDefault(); inputRef.current?.focus(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (!debouncedQuery.trim()) { setResults([]); setInitialLoad(false); return; }
    const fetch = async () => {
      setLoading(true); setError(null);
      try {
        await new Promise((r) => setTimeout(r, 500));
        const q = debouncedQuery.toLowerCase();
        let combined = [];
        if (filter !== 'users') combined.push(...MOCK_MEMES.filter((m) => m.title.toLowerCase().includes(q) || m.author.toLowerCase().includes(q)));
        if (filter !== 'memes') combined.push(...MOCK_USERS.filter((u) => u.username.toLowerCase().includes(q) || u.fullName.toLowerCase().includes(q)));
        setResults(combined);
        if (combined.length > 0) {
          const updated = [debouncedQuery, ...recentSearches.filter((t) => t !== debouncedQuery)].slice(0, 5);
          setRecentSearches(updated);
          localStorage.setItem('recentSearches', JSON.stringify(updated));
        }
      } catch { setError('Something went wrong. Please try again.'); }
      finally { setLoading(false); setInitialLoad(false); }
    };
    fetch();
  }, [debouncedQuery, filter]);

  return (
    <div className="max-w-2xl mx-auto space-y-4">

      {/* Search input */}
      <div className="relative">
        <SearchIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          ref={inputRef} type="text" value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search memes, users... (Press '/')"
          className="w-full pl-11 pr-10 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-300 shadow-sm transition"
        />
        {query && (
          <button onClick={() => { setQuery(''); setResults([]); }} className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition">
            <X size={15} />
          </button>
        )}
      </div>

      {/* Recent searches */}
      {!query && recentSearches.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Recent</p>
            <button onClick={() => { setRecentSearches([]); localStorage.removeItem('recentSearches'); }} className="text-xs text-gray-400 hover:text-gray-600 transition">Clear</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((term) => (
              <button key={term} onClick={() => setQuery(term)}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition">
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-1.5 bg-white border border-gray-100 rounded-xl p-1.5 shadow-sm">
        {TABS.map((tab) => (
          <button key={tab} onClick={() => setFilter(tab)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all ${filter === tab ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Result count */}
      {!loading && !error && results.length > 0 && (
        <p className="text-xs text-gray-400 px-1">{results.length} result{results.length !== 1 ? 's' : ''} for "{debouncedQuery}"</p>
      )}

      {/* Empty state */}
      {!query && !loading && (
        <div className="text-center py-16">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <SearchIcon size={22} className="text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-700">Search for memes and users</p>
          <p className="text-xs text-gray-400 mt-1">Type something to get started</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm flex items-center gap-2">
          <AlertCircle size={16} className="flex-shrink-0" />
          {error}
        </div>
      )}

      {/* No results */}
      {!initialLoad && query && !loading && !error && results.length === 0 && (
        <div className="text-center py-14">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={22} className="text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-700">No results for "{debouncedQuery}"</p>
          <p className="text-xs text-gray-400 mt-1">Try a different search term</p>
        </div>
      )}

      {/* Results */}
      <div className="space-y-2.5">
        {results.map((item) => (
          <Link key={item.id} to={item.type === 'meme' ? `/p/meme-${item.id.split('-')[1]}` : `/profile/${item.username}`}
            className="block bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-150">
            {item.type === 'meme' ? (
              <div className="flex items-center gap-3 p-4">
                <img src={item.imageUrl} alt={item.title} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" loading="lazy" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{item.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.author}</p>
                  <div className="flex gap-3 mt-1.5 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Heart size={11} className="text-red-400" />{fmt(item.likes)}</span>
                    <span className="flex items-center gap-1"><MessageCircle size={11} className="text-blue-400" />{fmt(item.comments)}</span>
                    <span>{item.timeAgo}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4">
                <img src={item.avatar} alt={item.username} className="w-12 h-12 rounded-full flex-shrink-0" loading="lazy" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-semibold text-gray-900">{item.fullName}</p>
                    {item.is_verified && <VerifiedBadge size={13} />}
                  </div>
                  <p className="text-xs text-gray-500">@{item.username}</p>
                  <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1"><Users size={10} />{fmt(item.followers)} followers</p>
                </div>
                <button 
                  onClick={(e) => handleFollowToggle(e, item.id, item.username)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-full transition flex-shrink-0 ${
                    followingUsers.has(item.id)
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : 'bg-orange-500 text-white hover:bg-orange-600'
                  }`}>
                  {followingUsers.has(item.id) ? 'Following' : 'Follow'}
                </button>
              </div>
            )}
          </Link>
        ))}

        {loading && (
          <>{(filter !== 'users') && <MemeSkeleton />}{(filter !== 'memes') && <UserSkeleton />}<MemeSkeleton /></>
        )}
      </div>
    </div>
  );
};

export default Search;
