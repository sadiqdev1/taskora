import { Head, router, usePage } from '@inertiajs/react';
import { Edit2, Hash, Loader2, Shield, Sparkles, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import TextPostCanvas from '@/components/text-post-canvas';

const MAX_CAPTION = 200;
const MAX_TAGS    = 5;

const CATEGORIES = [
    { name: 'Funny',        emoji: '😂' },
    { name: 'Dark Humor',   emoji: '💀' },
    { name: 'Wholesome',    emoji: '🥹' },
    { name: 'Trending',     emoji: '🔥' },
    { name: 'School',       emoji: '🎓' },
    { name: 'Tech',         emoji: '💻' },
    { name: 'Gaming',       emoji: '🎮' },
    { name: 'Relationship', emoji: '❤️' },
    { name: 'Other',        emoji: '📦' },
];

const extractHashtags = (text) => {
    const matches = text.match(/#(\w+)/g);
    return matches ? [...new Set(matches.map((t) => t.slice(1)))].slice(0, MAX_TAGS) : [];
};

const inputCls = 'w-full px-4 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-300 transition bg-gray-100 dark:bg-zinc-800 focus:bg-gray-50 dark:focus:bg-zinc-700';

export default function EditMeme() {
    const { meme, errors } = usePage().props;

    const [saving, setSaving]             = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [fieldError, setFieldError]     = useState('');

    const [form, setForm] = useState({
        caption:        meme.title || '',
        category:       meme.category || CATEGORIES[0].name,
        tags:           meme.tags || [],
        ignoredTags:    [],
        is_mature:      meme.is_mature || false,
        allow_comments: meme.allow_comments !== undefined ? meme.allow_comments : true,
    });

    // Extract hashtags from caption
    useEffect(() => {
        const tags = extractHashtags(form.caption).filter((t) => !form.ignoredTags.includes(t));
        setForm((p) => ({ ...p, tags }));
    }, [form.caption]);

    const removeTag = (tag) => setForm((p) => ({
        ...p,
        ignoredTags: [...p.ignoredTags, tag],
        tags: p.tags.filter((t) => t !== tag),
    }));

    const handleSubmit = (e) => {
        e.preventDefault();
        setFieldError('');
        setSaving(true);

        router.patch(`/p/${meme.slug}`, {
            title:          form.caption || null,
            category:       form.category,
            tags:           form.tags,
            is_mature:      form.is_mature,
            allow_comments: form.allow_comments,
        }, {
            onSuccess: () => setSaving(false),
            onError: () => setSaving(false),
        });
    };

    const isTextPost = meme.post_type === 'text';

    return (
        <AppLayout>
            <Head>
                <title>Edit Meme — Chortle</title>
                <meta name="robots" content="noindex, follow" />
            </Head>
            <div className="max-w-2xl mx-auto">

                {/* Header */}
                <div className="mb-6 flex items-center gap-3" style={{ animation: 'fadeUp .4s ease both' }}>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/25">
                        <Edit2 size={20} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-gray-900 dark:text-white">Edit Meme</h1>
                        <p className="text-xs text-gray-400 dark:text-zinc-500">Update your meme details</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4" style={{ animation: 'fadeUp .4s .1s ease both' }}>

                    {/* ── Preview ── */}
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">
                        <div className="p-5">
                            {isTextPost ? (
                                <TextPostCanvas
                                    textContent={meme.text_content}
                                    textStyle={meme.text_style}
                                />
                            ) : (
                                <img src={meme.image_url} alt={meme.title}
                                    className="w-full max-h-80 object-contain rounded-xl bg-gray-50 dark:bg-zinc-800" />
                            )}
                            <p className="text-xs text-gray-400 dark:text-zinc-500 mt-2 text-center">
                                {isTextPost ? 'Text content cannot be changed after posting' : 'Image cannot be changed after upload'}
                            </p>
                        </div>
                    </div>

                    {/* ── Details ── */}
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm">
                        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100 dark:border-zinc-800">
                            <Sparkles size={16} className="text-orange-500" />
                            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Details</h2>
                        </div>
                        <div className="p-5 space-y-4">

                            {/* Caption — optional */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label htmlFor="caption" className="text-xs font-semibold text-gray-700 dark:text-zinc-300 uppercase tracking-wide">
                                        Caption <span className="text-gray-400 dark:text-zinc-500 font-normal normal-case">(optional)</span>
                                    </label>
                                    <span className={`text-xs ${form.caption.length >= MAX_CAPTION ? 'text-red-500' : 'text-gray-400 dark:text-zinc-500'}`}>
                                        {form.caption.length}/{MAX_CAPTION}
                                    </span>
                                </div>
                                <input
                                    id="caption" type="text" value={form.caption}
                                    onChange={(e) => { if (e.target.value.length <= MAX_CAPTION) { setForm((p) => ({ ...p, caption: e.target.value })); setFieldError(''); } }}
                                    placeholder="Add a caption... use #tags (optional)"
                                    className={`${inputCls} ${errors?.title ? 'border-red-400' : ''}`}
                                />
                                {fieldError && <p className="text-xs text-red-500 mt-1">{fieldError}</p>}
                                {errors?.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
                                {form.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                        {form.tags.map((tag) => (
                                            <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-50 dark:bg-orange-500/10 text-orange-600 rounded-full text-xs font-medium">
                                                <Hash size={10} />#{tag}
                                                <button type="button" onClick={() => removeTag(tag)}
                                                    className="text-orange-400 hover:text-orange-600 transition ml-0.5">
                                                    <X size={10} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Category — pill grid */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 uppercase tracking-wide mb-2">Category</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {CATEGORIES.map((cat) => (
                                        <button key={cat.name} type="button"
                                            onClick={() => setForm((p) => ({ ...p, category: cat.name }))}
                                            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                                                form.category === cat.name
                                                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400'
                                                    : 'border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-zinc-300 hover:border-gray-300 dark:hover:border-zinc-600'
                                            }`}>
                                            <span className="text-base leading-none">{cat.emoji}</span>
                                            <span className="text-xs truncate">{cat.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Advanced ── */}
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">
                        <button type="button" onClick={() => setShowAdvanced(!showAdvanced)}
                            className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-zinc-800 transition">
                            <div className="flex items-center gap-2.5">
                                <Shield size={16} className="text-orange-500" />
                                Advanced settings
                            </div>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                                className={`text-gray-400 transition-transform duration-200 ${showAdvanced ? 'rotate-180' : ''}`}>
                                <polyline points="6 9 12 15 18 9"/>
                            </svg>
                        </button>

                        {showAdvanced && (
                            <div className="px-5 pb-5 space-y-3 border-t border-gray-100 dark:border-zinc-800 pt-4">
                                {[
                                    { key: 'is_mature',      label: 'Mature Content',  desc: 'Mark as 18+ content' },
                                    { key: 'allow_comments', label: 'Enable Comments', desc: 'Let others comment on your meme' },
                                ].map(({ key, label, desc }) => (
                                    <div key={key} className="flex items-center justify-between py-1">
                                        <div>
                                            <p className="text-sm font-medium text-gray-800 dark:text-zinc-200">{label}</p>
                                            <p className="text-xs text-gray-400 dark:text-zinc-500">{desc}</p>
                                        </div>
                                        <button type="button"
                                            onClick={() => setForm((p) => ({ ...p, [key]: !p[key] }))}
                                            role="switch" aria-checked={form[key]}
                                            className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${form[key] ? 'bg-orange-500' : 'bg-gray-200 dark:bg-zinc-700'}`}>
                                            <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${form[key] ? 'translate-x-5' : ''}`} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── Submit ── */}
                    <div className="flex gap-3">
                        <button type="button"
                            onClick={() => router.visit(`/p/${meme.slug}`)}
                            disabled={saving}
                            className="flex-1 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-200 py-3.5 rounded-2xl font-semibold text-sm transition-all active:scale-[.98] disabled:opacity-50 disabled:cursor-not-allowed">
                            Cancel
                        </button>
                        <button type="submit" disabled={saving}
                            className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3.5 rounded-2xl font-semibold text-sm transition-all hover:shadow-lg hover:shadow-orange-500/30 active:scale-[.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                            {saving
                                ? <><Loader2 size={18} className="animate-spin" /> Saving...</>
                                : <><Edit2 size={18} /> Save Changes</>
                            }
                        </button>
                    </div>
                </form>
            </div>

            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(16px) }
                    to   { opacity: 1; transform: translateY(0) }
                }
            `}</style>
        </AppLayout>
    );
}
