import { Head, Link, usePage } from '@inertiajs/react';
import axios from 'axios';
import { Flame, Sparkles } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import MemeCard from '@/components/meme-card';

const Skeleton = () => (
    <div className="overflow-hidden rounded-2xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 animate-pulse">
        <div className="flex items-center gap-3 px-4 py-4">
            <div className="h-9 w-9 rounded-full bg-gray-100 dark:bg-zinc-800" />
            <div className="flex-1 space-y-2">
                <div className="h-3 w-28 rounded-full bg-gray-100 dark:bg-zinc-800" />
                <div className="h-2.5 w-16 rounded-full bg-gray-100 dark:bg-zinc-800" />
            </div>
        </div>
        <div className="aspect-[4/3] bg-gray-100 dark:bg-zinc-800" />
        <div className="space-y-2 px-4 py-4">
            <div className="h-3 w-3/4 rounded-full bg-gray-100 dark:bg-zinc-800" />
            <div className="h-2.5 w-1/2 rounded-full bg-gray-100 dark:bg-zinc-800" />
        </div>
    </div>
);

export default function Trending() {
    const { memes: serverMemes } = usePage().props;

    const [memes, setMemes] = useState(serverMemes?.data ?? []);
    const [nextPageUrl, setNextPageUrl] = useState(serverMemes?.next_page_url ?? null);    const [loading, setLoading] = useState(false);
    const sentinelRef = useRef(null);

    const loadMore = useCallback(async () => {
        if (!nextPageUrl || loading) return;
        setLoading(true);
        try {
            const res = await axios.get(nextPageUrl, {
                headers: {
                    'X-Inertia': true,
                    'X-Inertia-Partial-Data': 'memes',
                    'X-Inertia-Partial-Component': 'trending',
                },
            });
            const data = res.data?.props?.memes;
            if (data) {
                setMemes((p) => [...p, ...data.data]);
                setNextPageUrl(data.next_page_url);
            }
        } catch {}
        setLoading(false);
    }, [nextPageUrl, loading]);

    useEffect(() => {
        if (!sentinelRef.current || !nextPageUrl) return;
        const obs = new IntersectionObserver(
            (e) => { if (e[0].isIntersecting) loadMore(); },
            { threshold: 0.1 }
        );
        obs.observe(sentinelRef.current);
        return () => obs.disconnect();
    }, [nextPageUrl, loadMore]);

    return (
        <AppLayout>
            <Head>
                <title>Trending Memes — Chortle</title>
                <meta name="description" content="Discover the hottest trending memes right now on Chortle. See what the community is laughing at today." />
                <meta property="og:title" content="Trending Memes — Chortle" />
                <meta property="og:description" content="Discover the hottest trending memes right now on Chortle." />
            </Head>
            <div className="mx-auto w-full max-w-2xl">

                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center">
                                <Flame size={20} className="text-orange-500" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-gray-900 dark:text-white">Trending</h1>
                                <p className="text-xs text-gray-400 dark:text-zinc-500">What everyone's laughing at</p>
                            </div>
                        </div>
                        <span className="hidden sm:flex items-center gap-1.5 rounded-full bg-orange-50 dark:bg-orange-500/10 px-3 py-1.5 text-xs font-semibold text-orange-600">
                            <Sparkles size={12} /> Hot right now
                        </span>
                    </div>

                </div>

                {/* Feed */}
                <section className="space-y-5">
                    {memes.length === 0 && !loading && (
                        <div className="text-center py-20 text-gray-400 dark:text-zinc-500 text-sm">
                            No trending memes yet. Be the first to upload!
                        </div>
                    )}

                    {memes.map((meme, index) => {
                        const isLast = index === memes.length - 1;
                        return isLast
                            ? <div ref={sentinelRef} key={meme.id}><MemeCard meme={meme} /></div>
                            : <MemeCard key={meme.id} meme={meme} />;
                    })}

                    {loading && <><Skeleton /><Skeleton /></>}

                    {!nextPageUrl && !loading && memes.length > 0 && (
                        <div className="rounded-2xl border border-dashed border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-10 text-center">
                            <Flame size={28} className="text-orange-300 mx-auto mb-2" />
                            <p className="text-sm font-medium text-gray-700 dark:text-zinc-300">You've seen it all 🔥</p>
                            <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1">Check back later for more trending memes.</p>
                        </div>
                    )}
                </section>
            </div>
        </AppLayout>
    );
}
