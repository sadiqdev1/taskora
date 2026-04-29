import { Head, Link } from '@inertiajs/react';
import { ArrowRight, CheckCircle2, Flame, Image as ImageIcon, MessageCircle, Play, Share2, Sparkles, TrendingUp, Upload, Users, Zap } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { login, register } from '@/routes';
import chortleLogo from '@/src/assets/chortle-logo.svg';

// ── Typing effect hook ────────────────────────────────────────────────────────
const TYPING_PHRASES = [
    'Make the internet laugh.',
    'Turn moments into memes.',
    'Go viral in seconds.',
    'Build your audience.',
    'Own the trending feed.',
    'Create. Share. Repeat.',
];

function useTypingEffect(phrases, { typingSpeed = 80, deletingSpeed = 40, pauseMs = 1800 } = {}) {
    const [displayed, setDisplayed] = useState('');
    const [phraseIdx, setPhraseIdx] = useState(0);
    const [charIdx, setCharIdx] = useState(0);
    const [deleting, setDeleting] = useState(false);
    const [paused, setPaused] = useState(false);

    useEffect(() => {
        if (paused) {
            const t = setTimeout(() => { setPaused(false); setDeleting(true); }, pauseMs);
            return () => clearTimeout(t);
        }
        const current = phrases[phraseIdx];
        if (!deleting) {
            if (charIdx < current.length) {
                const t = setTimeout(() => {
                    setDisplayed(current.slice(0, charIdx + 1));
                    setCharIdx((c) => c + 1);
                }, typingSpeed);
                return () => clearTimeout(t);
            } else {
                setPaused(true);
            }
        } else {
            if (charIdx > 0) {
                const t = setTimeout(() => {
                    setDisplayed(current.slice(0, charIdx - 1));
                    setCharIdx((c) => c - 1);
                }, deletingSpeed);
                return () => clearTimeout(t);
            } else {
                setDeleting(false);
                setPhraseIdx((i) => (i + 1) % phrases.length);
            }
        }
    }, [charIdx, deleting, paused, phraseIdx, phrases, typingSpeed, deletingSpeed, pauseMs]);

    return displayed;
}

// ── Animated counter ──────────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = '', duration = 1800 }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const started = useRef(false);

    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting && !started.current) {
                started.current = true;
                const num = parseFloat(target);
                const steps = 60;
                const inc = num / steps;
                let cur = 0;
                const timer = setInterval(() => {
                    cur += inc;
                    if (cur >= num) { cur = num; clearInterval(timer); }
                    setCount(cur);
                }, duration / steps);
            }
        }, { threshold: 0.3 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, [target, duration]);

    const display = count >= 1000 ? (count / 1000).toFixed(count >= 10000 ? 0 : 1) + 'K' : Math.floor(count).toString();

    return <span ref={ref}>{display}{suffix}</span>;
}

// ── Scroll reveal hook ────────────────────────────────────────────────────────
function useScrollReveal(threshold = 0.15) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, [threshold]);
    return [ref, visible];
}

// ── Data ──────────────────────────────────────────────────────────────────────
const MOCK_MEMES = [
    { id: 1, img: 'https://picsum.photos/400/400?random=11', likes: '12.4K', author: 'dankmemer',  delay: 0    },
    { id: 2, img: 'https://picsum.photos/400/400?random=22', likes: '8.1K',  author: 'lolmaster',  delay: 0.1  },
    { id: 3, img: 'https://picsum.photos/400/400?random=33', likes: '21K',   author: 'sadiqdev',   delay: 0.2  },
    { id: 4, img: 'https://picsum.photos/400/400?random=44', likes: '5.7K',  author: 'gitgud',     delay: 0.05 },
    { id: 5, img: 'https://picsum.photos/400/400?random=55', likes: '14.2K', author: 'coder',      delay: 0.15 },
    { id: 6, img: 'https://picsum.photos/400/400?random=66', likes: '9.8K',  author: 'devlife',    delay: 0.25 },
];

const STATS = [
    { target: '50000', suffix: '+', label: 'Memes shared'    },
    { target: '12000', suffix: '+', label: 'Active creators'  },
    { target: '200',   suffix: 'K+',label: 'Daily reactions'  },
    { target: '98',    suffix: '%', label: 'Satisfaction rate' },
];

const FEATURES = [
    { icon: Upload,       color: 'bg-orange-50 dark:bg-orange-500/10 text-orange-500', title: 'Upload in seconds',  desc: 'Drag & drop your meme, add a caption, pick tags — live in under 10 seconds.' },
    { icon: TrendingUp,   color: 'bg-orange-50 dark:bg-orange-500/10 text-orange-500', title: 'Real-time trending', desc: 'An algorithm-free trending feed driven purely by community reactions.' },
    { icon: Users,        color: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400', title: 'Grow your audience',  desc: 'Follow creators, get followers, and build a loyal fanbase around your humor.' },
    { icon: Zap,          color: 'bg-orange-50 dark:bg-orange-500/10 text-orange-500', title: 'Instant reactions',  desc: 'Like, comment, and share in one tap. Get notified the moment someone reacts.' },
    { icon: MessageCircle,color: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400', title: 'Threaded comments',  desc: 'Nested replies, comment likes, and @mention support — just like the big apps.' },
    { icon: Share2,       color: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400', title: 'One-tap sharing',    desc: 'Share to any platform or copy a direct link. Your meme, your reach.' },
];

const HOW_IT_WORKS = [
    {
        step: '01', icon: Upload,
        title: 'Upload your meme',
        desc: 'Pick an image from your device, add a punchy caption, and tag it so the right people find it.',
        color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-500/10',
    },
    {
        step: '02', icon: Flame,
        title: 'Watch it spread',
        desc: 'The community reacts, shares, and comments. If it hits, it climbs the trending feed automatically.',
        color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-500/10',
    },
    {
        step: '03', icon: Users,
        title: 'Build your following',
        desc: 'Every post grows your profile. Followers get notified, your reach compounds, and your audience is yours.',
        color: 'text-zinc-500 dark:text-zinc-400', bg: 'bg-zinc-100 dark:bg-zinc-800',
    },
];

const AVATARS = [
    'https://ui-avatars.com/api/?name=Dan+K&background=f97316&color=fff&size=32',
    'https://ui-avatars.com/api/?name=Lol+M&background=3b82f6&color=fff&size=32',
    'https://ui-avatars.com/api/?name=Sad+D&background=8b5cf6&color=fff&size=32',
    'https://ui-avatars.com/api/?name=Git+G&background=10b981&color=fff&size=32',
    'https://ui-avatars.com/api/?name=Dev+L&background=ec4899&color=fff&size=32',
];

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Welcome({ canRegister = true }) {
    const typedText = useTypingEffect(TYPING_PHRASES);
    const [featuresRef, featuresVisible] = useScrollReveal();
    const [howRef, howVisible] = useScrollReveal();
    const [statsRef, statsVisible] = useScrollReveal();

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 text-gray-900 dark:text-white overflow-x-hidden">
            <Head>
                <title>Chortle — Share memes. Make people laugh.</title>
                <meta name="description" content="Chortle is the internet's funniest meme community. Upload your memes, discover what's trending, and react to content that makes your day. Free forever." />
                <meta property="og:title" content="Chortle — Share memes. Make people laugh." />
                <meta property="og:description" content="The internet's funniest meme community. Upload, discover, and react to content that makes your day." />
                <meta property="og:type" content="website" />
                <meta name="twitter:title" content="Chortle — Share memes. Make people laugh." />
                <meta name="twitter:description" content="The internet's funniest meme community. Upload, discover, and react to content that makes your day." />
            </Head>

            {/* ── Nav ── */}
            <header className="sticky top-0 z-30 border-b border-gray-100 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md"
                style={{ animation: 'fadeDown .5s ease both' }}>
                <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-6">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center shadow-sm">
                            <img src={chortleLogo} alt="Chortle" className="h-5 w-5 object-contain" />
                        </div>
                        <span className="font-bold text-gray-900 dark:text-white text-base">Chortle</span>
                    </div>
                    <nav className="flex items-center gap-2">
                        <Link href={login()} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800">
                            Log in
                        </Link>
                        {canRegister && (
                            <Link href={register()} className="px-4 py-2 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-full transition-all hover:shadow-md active:scale-[.97]">
                                Get started
                            </Link>
                        )}
                    </nav>
                </div>
            </header>

            {/* ── Hero ── */}
            <main>
            <section className="relative mx-auto max-w-6xl px-4 md:px-6 pt-20 pb-8 text-center overflow-hidden">
                {/* Background glow */}
                <div className="pointer-events-none absolute inset-0 -z-10">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-orange-400/10 dark:bg-orange-500/5 rounded-full blur-3xl" />
                </div>

                {/* Badge */}
                <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20 px-4 py-1.5 text-xs font-semibold text-orange-600 mb-7"
                    style={{ animation: 'fadeUp .5s .1s ease both', opacity: 0 }}>
                    <Flame size={13} className="animate-pulse" /> The internet's funniest meme community
                </div>

                {/* Headline */}
                <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] mb-5 tracking-tight"
                    style={{ animation: 'fadeUp .6s .2s ease both', opacity: 0 }}>
                    <span className="text-gray-900 dark:text-white">The home for</span>
                    <br />
                    <span className="relative inline-block">
                        <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
                            internet humor.
                        </span>
                        <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 300 8" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path d="M2 6 Q75 2 150 5 Q225 8 298 4" stroke="url(#ug)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                            <defs><linearGradient id="ug" x1="0" y1="0" x2="300" y2="0" gradientUnits="userSpaceOnUse"><stop stopColor="#f97316"/><stop offset="1" stopColor="#ec4899"/></linearGradient></defs>
                        </svg>
                    </span>
                </h1>

                {/* Typing line */}
                <div className="text-xl md:text-2xl font-semibold text-gray-600 dark:text-zinc-300 mb-6 h-9 flex items-center justify-center gap-1"
                    style={{ animation: 'fadeUp .6s .3s ease both', opacity: 0 }}>
                    <span className="text-orange-500">{typedText}</span>
                    <span className="inline-block w-0.5 h-6 bg-orange-500 ml-0.5 align-middle animate-blink" />
                </div>

                <p className="text-base md:text-lg text-gray-500 dark:text-zinc-400 max-w-lg mx-auto mb-10 leading-relaxed"
                    style={{ animation: 'fadeUp .6s .35s ease both', opacity: 0 }}>
                    Upload, discover, and react to the content that makes your day. Built for creators who take humor seriously.
                </p>

                {/* CTAs */}
                <div className="flex items-center justify-center gap-3 flex-wrap mb-10"
                    style={{ animation: 'fadeUp .6s .4s ease both', opacity: 0 }}>
                    {canRegister && (
                        <Link href={register()}
                            className="group px-7 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full transition-all hover:shadow-xl hover:shadow-orange-500/30 active:scale-[.97] text-sm flex items-center gap-2">
                            Start for free
                            <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                    )}
                    <Link href={login()}
                        className="px-7 py-3.5 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 font-semibold rounded-full hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all text-sm flex items-center gap-2">
                        <Play size={13} className="fill-current" /> See what's trending
                    </Link>
                </div>

                {/* Trust row */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-14"
                    style={{ animation: 'fadeUp .6s .45s ease both', opacity: 0 }}>
                    <div className="flex items-center gap-2.5">
                        <div className="flex -space-x-2">
                            {AVATARS.map((src, i) => (
                                <img key={i} src={src} alt="" className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-950 object-cover" />
                            ))}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-zinc-400">
                            <span className="font-semibold text-gray-900 dark:text-white">12,000+</span> creators
                        </p>
                    </div>
                    <div className="hidden sm:block w-px h-5 bg-gray-200 dark:bg-zinc-700" />
                    {[
                        { icon: CheckCircle2, text: 'Free forever' },
                        { icon: CheckCircle2, text: 'No ads' },
                        { icon: CheckCircle2, text: 'No algorithm' },
                    ].map(({ icon: Icon, text }) => (
                        <div key={text} className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-zinc-400">
                            <Icon size={14} className="text-green-500 flex-shrink-0" />
                            {text}
                        </div>
                    ))}
                </div>

                {/* Meme grid preview */}
                <div className="relative" style={{ animation: 'fadeUp .7s .55s ease both', opacity: 0 }}>
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white dark:from-zinc-950 to-transparent z-10 pointer-events-none" />
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3 max-w-4xl mx-auto">
                        {MOCK_MEMES.map((meme) => (
                            <div key={meme.id}
                                className="rounded-xl overflow-hidden border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 group cursor-pointer">
                                <div className="aspect-square bg-gray-100 dark:bg-zinc-800 overflow-hidden relative">
                                    <img src={meme.img} alt="meme"
                                        className="w-full h-full object-cover group-hover:scale-[1.08] transition-transform duration-500" loading="lazy" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-2">
                                        <div>
                                            <p className="text-white text-[10px] font-bold">❤️ {meme.likes}</p>
                                            <p className="text-white/70 text-[9px]">@{meme.author}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Stats ── */}
            <section ref={statsRef} className="mx-auto max-w-6xl px-4 md:px-6 py-16">
                <div className={`grid grid-cols-2 md:grid-cols-4 gap-5 transition-all duration-700 ${statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    {STATS.map(({ target, suffix, label }, i) => (
                        <div key={label}
                            className="text-center p-6 rounded-2xl bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800"
                            style={{ transitionDelay: `${i * 80}ms` }}>
                            <p className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
                                {statsVisible && <AnimatedCounter target={target} suffix={suffix} />}
                            </p>
                            <p className="text-sm text-gray-400 dark:text-zinc-500 mt-1">{label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── How it works ── */}
            <section ref={howRef} className="mx-auto max-w-6xl px-4 md:px-6 py-16">
                <div className={`text-center mb-12 transition-all duration-700 ${howVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 dark:bg-zinc-800 px-4 py-1.5 text-xs font-semibold text-gray-600 dark:text-zinc-400 mb-4">
                        <Sparkles size={12} /> How it works
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Three steps to viral</h2>
                    <p className="text-gray-500 dark:text-zinc-400 mt-3 max-w-md mx-auto">From idea to trending in minutes. No complicated setup, no gatekeeping.</p>
                </div>
                <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="hidden md:block absolute top-10 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-gradient-to-r from-orange-200 via-pink-200 to-purple-200 dark:from-orange-500/20 dark:via-pink-500/20 dark:to-purple-500/20 z-0" />
                    {HOW_IT_WORKS.map(({ step, icon: Icon, title, desc, color, bg }, i) => (
                        <div key={step}
                            className={`relative z-10 flex flex-col items-center text-center p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all duration-500 ${howVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                            style={{ transitionDelay: `${i * 120}ms` }}>
                            <div className={`w-14 h-14 rounded-2xl ${bg} flex items-center justify-center mb-4 shadow-sm`}>
                                <Icon size={24} className={color} />
                            </div>
                            <span className={`text-xs font-bold tracking-widest uppercase ${color} mb-2`}>{step}</span>
                            <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">{title}</h3>
                            <p className="text-sm text-gray-500 dark:text-zinc-400 leading-relaxed">{desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Features ── */}
            <section ref={featuresRef} className="mx-auto max-w-6xl px-4 md:px-6 py-16">
                <div className={`text-center mb-12 transition-all duration-700 ${featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 dark:bg-zinc-800 px-4 py-1.5 text-xs font-semibold text-gray-600 dark:text-zinc-400 mb-4">
                        <Sparkles size={12} /> Everything you need
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Built for meme culture</h2>
                    <p className="text-gray-500 dark:text-zinc-400 mt-3 max-w-md mx-auto">Every feature you need to create, share, and discover the best memes on the internet.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {FEATURES.map(({ icon: Icon, color, title, desc }, i) => (
                        <div key={title}
                            className={`bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-500 group ${featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                            style={{ transitionDelay: `${i * 70}ms` }}>
                            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                <Icon size={20} />
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{title}</h3>
                            <p className="text-sm text-gray-500 dark:text-zinc-400 leading-relaxed">{desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Testimonial strip ── */}
            <section className="bg-gray-50 dark:bg-zinc-900 border-y border-gray-100 dark:border-zinc-800 py-12 overflow-hidden">
                <p className="text-center text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-zinc-600 mb-6">What creators are saying</p>
                <div className="flex gap-6 animate-marquee whitespace-nowrap">
                    {[...Array(2)].map((_, rep) => (
                        [
                            { text: '"Chortle is literally my daily dose of serotonin 😂"',  name: '@dankmemer',  role: 'Meme creator'    },
                            { text: '"Finally a meme platform that doesn\'t suck"',           name: '@lolmaster',  role: 'Content creator' },
                            { text: '"The trending feed is insanely good"',                   name: '@sadiqdev',   role: 'Developer'       },
                            { text: '"I uploaded my first meme and got 10K likes overnight"', name: '@gitgud',     role: 'New creator'     },
                            { text: '"The comment section is actually fun here"',             name: '@coder',      role: 'Software dev'    },
                            { text: '"Dark mode + memes = perfect combo"',                    name: '@devlife',    role: 'Designer'        },
                        ].map((t, i) => (
                            <div key={`${rep}-${i}`} className="flex-shrink-0 bg-white dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-zinc-700 px-5 py-4 shadow-sm min-w-[260px]">
                                <p className="text-sm text-gray-700 dark:text-zinc-200 font-medium leading-relaxed">{t.text}</p>
                                <div className="flex items-center gap-2 mt-3">
                                    <div className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center">
                                        <span className="text-[10px] font-bold text-orange-600">{t.name[1].toUpperCase()}</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-orange-500">{t.name}</p>
                                        <p className="text-[10px] text-gray-400 dark:text-zinc-500">{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ))}
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="mx-auto max-w-6xl px-4 md:px-6 py-24">
                <div className="relative bg-gradient-to-br from-orange-500 via-orange-500 to-pink-500 rounded-3xl p-10 md:p-16 text-center overflow-hidden">
                    <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none" />
                    <div className="absolute top-6 left-8 text-3xl opacity-40 animate-float select-none">😂</div>
                    <div className="absolute top-10 right-12 text-2xl opacity-30 animate-float-slow select-none">🔥</div>
                    <div className="absolute bottom-8 left-16 text-2xl opacity-30 animate-float select-none">💀</div>
                    <div className="absolute bottom-6 right-8 text-3xl opacity-40 animate-float-slow select-none">🤣</div>
                    <div className="absolute top-1/2 left-6 text-xl opacity-20 animate-float-slow select-none">😭</div>
                    <div className="absolute top-1/2 right-6 text-xl opacity-20 animate-float select-none">💯</div>

                    <div className="relative z-10">
                        <div className="text-5xl mb-5 animate-bounce-slow">😂</div>
                        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
                            Ready to make<br />the internet laugh?
                        </h2>
                        <p className="text-white/80 mb-8 max-w-md mx-auto text-lg">
                            Join thousands of creators sharing the funniest content on the internet. It's free, forever.
                        </p>
                        {canRegister && (
                            <Link href={register()}
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-orange-600 font-bold rounded-full hover:bg-orange-50 transition-all hover:shadow-2xl active:scale-[.97] text-sm">
                                Create your free account <ArrowRight size={15} />
                            </Link>
                        )}
                        <p className="text-white/50 text-xs mt-4">No credit card · No ads · No algorithm</p>
                    </div>
                </div>
            </section>
            </main>

            {/* ── Footer ── */}
            <footer className="border-t border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-8">
                <div className="mx-auto max-w-6xl px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center">
                            <img src={chortleLogo} alt="Chortle" className="h-4 w-4 object-contain" />
                        </div>
                        <span className="font-bold text-gray-900 dark:text-white text-sm">Chortle</span>
                    </div>
                    <p className="text-xs text-gray-400 dark:text-zinc-600">
                        &copy; {new Date().getFullYear()} Chortle · All rights reserved
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-zinc-600">
                        {['Privacy', 'Terms', 'Contact'].map((l) => (
                            <span key={l} className="hover:text-gray-600 dark:hover:text-zinc-400 cursor-pointer transition-colors">{l}</span>
                        ))}
                    </div>
                </div>
            </footer>

            <style>{`
                @keyframes fadeDown  { from{opacity:0;transform:translateY(-12px)} to{opacity:1;transform:translateY(0)} }
                @keyframes fadeUp    { from{opacity:0;transform:translateY(20px)}  to{opacity:1;transform:translateY(0)} }
                @keyframes blink     { 0%,100%{opacity:1} 50%{opacity:0} }
                @keyframes marquee   { from{transform:translateX(0)} to{transform:translateX(-50%)} }
                @keyframes float     { 0%,100%{transform:translateY(0) rotate(-3deg)} 50%{transform:translateY(-10px) rotate(3deg)} }
                @keyframes floatSlow { 0%,100%{transform:translateY(0) rotate(3deg)} 50%{transform:translateY(-14px) rotate(-3deg)} }
                @keyframes bounceSlow{ 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
                .animate-blink       { animation: blink 1s step-end infinite; }
                .animate-marquee     { animation: marquee 35s linear infinite; }
                .animate-float       { animation: float 3s ease-in-out infinite; }
                .animate-float-slow  { animation: floatSlow 4.5s ease-in-out infinite; }
                .animate-bounce-slow { animation: bounceSlow 2.5s ease-in-out infinite; }
            `}</style>
        </div>
    );
}
