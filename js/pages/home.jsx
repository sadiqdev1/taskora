import { Head, Link, usePage } from "@inertiajs/react";
import axios from "axios";
import { Clock, Image as ImageIcon, RefreshCw, Star, TrendingUp, Type } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import AppLayout from "@/layouts/app-layout";
import MemeCard from "@/components/meme-card";

const TABS = [
  { id: "latest",   label: "Latest",   icon: Clock      },
  { id: "trending", label: "Trending", icon: TrendingUp },
  { id: "top",      label: "Top",      icon: Star       },
];

const Skeleton = () => (
  <div className="overflow-hidden rounded-2xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm animate-pulse">
    {/* Author row */}
    <div className="flex items-center gap-3 px-4 py-3.5">
      <div className="h-9 w-9 rounded-full bg-gray-100 dark:bg-zinc-800 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-28 rounded-full bg-gray-100 dark:bg-zinc-800" />
        <div className="h-2.5 w-16 rounded-full bg-gray-100 dark:bg-zinc-800" />
      </div>
      <div className="h-7 w-16 rounded-full bg-gray-100 dark:bg-zinc-800" />
    </div>
    {/* Image placeholder — variable height feels more natural */}
    <div className="bg-gray-100 dark:bg-zinc-800" style={{ height: '280px' }} />
    {/* Stats row */}
    <div className="flex items-center gap-3 px-4 py-2.5">
      <div className="h-2.5 w-20 rounded-full bg-gray-100 dark:bg-zinc-800" />
      <div className="h-2.5 w-16 rounded-full bg-gray-100 dark:bg-zinc-800" />
    </div>
    {/* Caption */}
    <div className="px-4 pb-3 space-y-2">
      <div className="h-3 w-3/4 rounded-full bg-gray-100 dark:bg-zinc-800" />
    </div>
    {/* Action bar */}
    <div className="flex items-center border-t border-gray-100 dark:border-zinc-800">
      {[1,2,3].map(i => (
        <div key={i} className="flex-1 flex items-center justify-center py-3">
          <div className="h-3 w-14 rounded-full bg-gray-100 dark:bg-zinc-800" />
        </div>
      ))}
    </div>
  </div>
);

export default function Home() {
  const { memes: serverMemes, activeTab: serverTab, trendingTags } = usePage().props;
  return (
    <AppLayout>
      <Head>
        <title>Home — Chortle</title>
        <meta name="description" content="Your personalized meme feed. Discover the latest, trending, and top memes from creators you follow on Chortle." />
        <meta name="robots" content="noindex, follow" />
      </Head>
      <Feed serverMemes={serverMemes} serverTab={serverTab} trendingTags={trendingTags} />
    </AppLayout>
  );
}

function Feed({ serverMemes, serverTab, trendingTags }) {
  const { auth } = usePage().props;
  const user = auth?.user;
  const avatarUrl = user
    ? (user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=f97316&color=fff&length=2&size=80`)
    : null;

  const [activeTab, setActiveTab] = useState(serverTab ?? "latest");
  const [memes, setMemes] = useState(serverMemes?.data ?? []);
  const [nextPageUrl, setNextPageUrl] = useState(serverMemes?.next_page_url ?? null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const sentinelRef = useRef(null);

  const fetchMemes = useCallback(async (tab, append = false) => {
    if (!append) setInitialLoading(true); else setLoading(true);
    try {
      const res = await axios.get("/", { 
        params: { tab }, 
        headers: { 
          "X-Inertia": true, 
          "X-Inertia-Partial-Data": "memes,activeTab", 
          "X-Inertia-Partial-Component": "home",
          "X-Requested-With": "XMLHttpRequest"
        } 
      });
      const data = res.data?.props?.memes;
      if (data) {
        setMemes(append ? (p) => [...p, ...data.data] : data.data);
        setNextPageUrl(data.next_page_url);
      }
    } catch (error) {
      // Silently handle 409 conflicts (usually cache/race condition issues)
      if (error.response?.status !== 409) {
        console.error('Failed to fetch memes:', error);
      }
    }
    setInitialLoading(false);
    setLoading(false);
  }, []);

  const loadMore = useCallback(async () => {
    if (!nextPageUrl || loading) return;
    setLoading(true);
    try {
      const res = await axios.get(nextPageUrl, { 
        params: { tab: activeTab }, 
        headers: { 
          "X-Inertia": true, 
          "X-Inertia-Partial-Data": "memes", 
          "X-Inertia-Partial-Component": "home",
          "X-Requested-With": "XMLHttpRequest"
        } 
      });
      const data = res.data?.props?.memes;
      if (data) { setMemes((p) => [...p, ...data.data]); setNextPageUrl(data.next_page_url); }
    } catch (error) {
      // Silently handle 409 conflicts
      if (error.response?.status !== 409) {
        console.error('Failed to load more memes:', error);
      }
    }
    setLoading(false);
  }, [nextPageUrl, loading, activeTab]);

  const switchTab = (tab) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    setMemes([]);
    setNextPageUrl(null);
    setInitialLoading(true); // show skeletons immediately on tab switch
    fetchMemes(tab);
  };

  const refresh = async () => {
    if (refreshing) return;
    setRefreshing(true);
    await fetchMemes(activeTab);
    setRefreshing(false);
  };

  useEffect(() => {
    if (!sentinelRef.current || !nextPageUrl) return;
    const obs = new IntersectionObserver((e) => { if (e[0].isIntersecting) loadMore(); }, { threshold: 0.1 });
    obs.observe(sentinelRef.current);
    return () => obs.disconnect();
  }, [nextPageUrl, loadMore]);

  return (
    <div className="mx-auto w-full max-w-2xl space-y-5">
      {refreshing && <div className="flex items-center justify-center gap-2 py-3 text-sm text-orange-500 font-medium"><RefreshCw size={15} className="animate-spin" /> Refreshing...</div>}

      {/* ── Composer ── */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">
        {/* Top row: avatar + fake input */}
        <div className="flex items-center gap-3 px-4 pt-4 pb-3">
          {avatarUrl ? (
            <img src={avatarUrl} alt={user?.name ?? 'You'}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-orange-100 dark:ring-orange-500/20 flex-shrink-0" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center flex-shrink-0">
              <span className="text-orange-500 text-sm font-bold">?</span>
            </div>
          )}
                <Link
                    href="/upload"
                    className="flex-1 px-4 py-2.5 rounded-full bg-gray-100 dark:bg-zinc-800 text-sm text-gray-400 dark:text-zinc-500 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors cursor-text select-none"
                    role="button"
                    aria-label="Create a new post"
                >
                    What's on your mind?
                </Link>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-100 dark:bg-zinc-800 mx-4" />

        {/* Action buttons */}
        <div className="flex items-center px-2 py-1">
          <Link
            href="/upload"
            className="flex flex-1 items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-gray-500 dark:text-zinc-400 hover:bg-orange-50 dark:hover:bg-orange-500/10 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
          >
            <ImageIcon size={18} className="text-orange-500" />
            <span>Image</span>
          </Link>
          <div className="w-px h-5 bg-gray-100 dark:bg-zinc-800" />
          <Link
            href="/upload"
            className="flex flex-1 items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-gray-500 dark:text-zinc-400 hover:bg-orange-50 dark:hover:bg-orange-500/10 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
          >
            <Type size={18} className="text-purple-500" />
            <span>Text</span>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 rounded-2xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-1.5 shadow-sm">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} type="button" onClick={() => switchTab(id)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all ${
              activeTab === id
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-gray-400 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-800'
            }`}>
            <Icon size={14} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Feed */}
      <section className="space-y-5">
        {initialLoading && (
          <>
            <Skeleton />
            <div className="opacity-70"><Skeleton /></div>
            <div className="opacity-40"><Skeleton /></div>
          </>
        )}
        {memes.map((meme, i) => {
          const isLast = i === memes.length - 1;
          return isLast
            ? <div ref={sentinelRef} key={meme.id}><MemeCard meme={meme} /></div>
            : <MemeCard key={meme.id} meme={meme} />;
        })}
        {loading && !initialLoading && <><Skeleton /><Skeleton /></>}
        {!nextPageUrl && !loading && memes.length > 0 && (
          <div className="flex flex-col items-center gap-2 py-10 text-center">
            <span className="text-2xl"></span>
            <p className="text-sm font-medium text-gray-700 dark:text-zinc-300">You are all caught up!</p>
            <button type="button" onClick={refresh} className="mt-2 flex items-center gap-2 rounded-full border border-gray-200 dark:border-zinc-700 px-4 py-2 text-xs font-medium text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"><RefreshCw size={13} /> Refresh</button>
          </div>
        )}
        {memes.length === 0 && !initialLoading && (
          <div className="text-center py-20 text-gray-400 dark:text-zinc-500 text-sm">No memes yet. Be the first to upload!</div>
        )}
      </section>
    </div>
  );
}
