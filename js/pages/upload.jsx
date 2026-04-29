import { Head, router, usePage } from '@inertiajs/react';
import { ChevronDown, ChevronRight, CloudUpload, Flame, Hash, Image as ImageIcon, Loader2, Shield, Sparkles, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import AppLayout from '@/layouts/app-layout';

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_CAPTION   = 200;
const MAX_TAGS      = 5;

// Production-ready category set
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
const BG_PRESETS = [
    { type: 'solid',    value: '#3b82f6',                                    label: 'Blue'       },
    { type: 'solid',    value: '#ef4444',                                    label: 'Red'        },
    { type: 'solid',    value: '#10b981',                                    label: 'Green'      },
    { type: 'solid',    value: '#f59e0b',                                    label: 'Amber'      },
    { type: 'solid',    value: '#8b5cf6',                                    label: 'Purple'     },
    { type: 'solid',    value: '#ec4899',                                    label: 'Pink'       },
    { type: 'solid',    value: '#18181b',                                    label: 'Black'      },
    { type: 'solid',    value: '#ffffff',                                    label: 'White'      },
    { type: 'gradient', value: 'linear-gradient(135deg,#f97316,#ec4899)',    label: 'Sunset'     },
    { type: 'gradient', value: 'linear-gradient(135deg,#3b82f6,#8b5cf6)',    label: 'Ocean'      },
    { type: 'gradient', value: 'linear-gradient(135deg,#10b981,#3b82f6)',    label: 'Teal'       },
    { type: 'gradient', value: 'linear-gradient(135deg,#f59e0b,#ef4444)',    label: 'Fire'       },
    { type: 'gradient', value: 'linear-gradient(135deg,#ec4899,#8b5cf6)',    label: 'Candy'      },
    { type: 'gradient', value: 'linear-gradient(135deg,#18181b,#3b82f6)',    label: 'Night'      },
];

const extractHashtags = (text) => {
    const matches = text.match(/#(\w+)/g);
    return matches ? [...new Set(matches.map((t) => t.slice(1)))].slice(0, MAX_TAGS) : [];
};

const inputCls = 'w-full px-4 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-300 transition bg-gray-100 dark:bg-zinc-800 focus:bg-gray-50 dark:focus:bg-zinc-700';

const FONTS = [
    { name: 'Arial',           sample: 'The quick brown fox' },
    { name: 'Georgia',         sample: 'The quick brown fox' },
    { name: 'Impact',          sample: 'THE QUICK BROWN FOX' },
    { name: 'Comic Sans MS',   sample: 'The quick brown fox' },
    { name: 'Courier',         sample: 'The quick brown fox' },
    { name: 'Times New Roman', sample: 'The quick brown fox' },
];

function FontPicker({ value, onChange }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const current = FONTS.find(f => f.name === value) ?? FONTS[0];

    useEffect(() => {
        const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);

    return (
        <div className="relative" ref={ref}>
            <p className="text-xs text-gray-500 dark:text-zinc-400 mb-2 font-medium">Font</p>
            <button
                type="button"
                onClick={() => setOpen(o => !o)}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 hover:border-orange-300 dark:hover:border-orange-500/50 transition-all"
            >
                <span style={{ fontFamily: current.name }} className="text-sm text-gray-800 dark:text-zinc-200 font-medium">
                    {current.name}
                </span>
                <svg
                    width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                    className={`text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                >
                    <polyline points="6 9 12 15 18 9"/>
                </svg>
            </button>

            {/* Animated dropdown */}
            <div className={`absolute z-50 left-0 right-0 mt-1.5 bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-xl shadow-xl overflow-hidden transition-all duration-200 origin-top ${
                open ? 'opacity-100 scale-y-100 translate-y-0' : 'opacity-0 scale-y-95 -translate-y-1 pointer-events-none'
            }`}>
                {FONTS.map((font) => (
                    <button
                        key={font.name}
                        type="button"
                        onClick={() => { onChange(font.name); setOpen(false); }}
                        className={`w-full text-left px-4 py-3 flex items-center justify-between transition-colors ${
                            value === font.name
                                ? 'bg-orange-50 dark:bg-orange-500/10'
                                : 'hover:bg-gray-50 dark:hover:bg-zinc-700'
                        }`}
                    >
                        <div>
                            <p style={{ fontFamily: font.name }} className="text-sm font-semibold text-gray-900 dark:text-white">
                                {font.name}
                            </p>
                            <p style={{ fontFamily: font.name }} className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">
                                {font.sample}
                            </p>
                        </div>
                        {value === font.name && (
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-orange-500 flex-shrink-0">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default function Upload() {
    const { errors } = usePage().props;

    const [uploading, setUploading]       = useState(false);
    const [uploadProgress, setProgress]   = useState(0);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [dragActive, setDragActive]     = useState(false);
    const [fieldError, setFieldError]     = useState('');

    const [form, setForm] = useState({
        caption:        '',
        category:       CATEGORIES[0].name,
        tags:           [],
        ignoredTags:    [],
        image:          null,
        imagePreview:   null,
        is_mature:      false,
        allow_comments: true,
        postType:       'image',
        textContent:    '',
        textStyle: {
            fontFamily:      'Arial',
            fontSize:        32,
            fontWeight:      'normal',
            fontStyle:       'normal',
            textAlign:       'center',
            backgroundColor: '#3b82f6',
            backgroundType:  'solid',
            borderRadius:    '0px',
        },
    });

    // close category dropdown on outside click
    useEffect(() => {
        const h = (e) => { if (catRef.current && !catRef.current.contains(e.target)) setCatOpen(false); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);

    // extract hashtags from caption
    useEffect(() => {
        const tags = extractHashtags(form.caption).filter((t) => !form.ignoredTags.includes(t));
        setForm((p) => ({ ...p, tags }));
    }, [form.caption]);

    const validateFile = (file) => {
        if (!file.type.startsWith('image/')) return 'Please upload an image file';
        if (file.size > MAX_FILE_SIZE) return `File too large. Max ${MAX_FILE_SIZE / 1024 / 1024}MB`;
        return null;
    };

    const processImage = useCallback((file) => {
        const err = validateFile(file);
        if (err) { setFieldError(err); return; }
        setFieldError('');
        const reader = new FileReader();
        reader.onloadend = () => setForm((p) => ({ ...p, image: file, imagePreview: reader.result }));
        reader.readAsDataURL(file);
    }, []);

    const handleDrag = (e) => {
        e.preventDefault(); e.stopPropagation();
        setDragActive(e.type === 'dragenter' || e.type === 'dragover');
    };

    const handleDrop = (e) => {
        e.preventDefault(); e.stopPropagation(); setDragActive(false);
        const file = e.dataTransfer.files[0];
        if (file) processImage(file);
    };

    const removeTag = (tag) => setForm((p) => ({
        ...p,
        ignoredTags: [...p.ignoredTags, tag],
        tags: p.tags.filter((t) => t !== tag),
    }));

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate based on post type
        if (form.postType === 'image' && !form.image) {
            setFieldError('Please select an image');
            return;
        }

        if (form.postType === 'text' && !form.textContent.trim()) {
            setFieldError('Please enter text content for your text post');
            return;
        }

        setFieldError('');
        setUploading(true);
        setProgress(0);

        const interval = setInterval(() => {
            setProgress((p) => (p >= 85 ? 85 : p + 5));
        }, 150);

        const data = new FormData();
        if (form.postType === 'image' && form.image) {
            data.append('image', form.image);
        }
        // caption is optional — send as 'title' for backend compatibility
        if (form.caption.trim()) {
            data.append('title', form.caption);
        }
        data.append('category',       form.category);
        data.append('is_mature',      form.is_mature ? '1' : '0');
        data.append('allow_comments', form.allow_comments ? '1' : '0');
        data.append('post_type',      form.postType);

        if (form.postType === 'text') {
            data.append('text_content', form.textContent);
            data.append('text_style[font_family]', form.textStyle.fontFamily);
            data.append('text_style[font_size]', form.textStyle.fontSize);
            data.append('text_style[font_weight]', form.textStyle.fontWeight);
            data.append('text_style[font_style]', form.textStyle.fontStyle);
            data.append('text_style[text_align]', form.textStyle.textAlign);
            data.append('text_style[background_color]', form.textStyle.backgroundColor);
            data.append('text_style[background_type]', form.textStyle.backgroundType);
            data.append('text_style[border_radius]', form.textStyle.borderRadius);
        }

        form.tags.forEach((tag) => data.append('tags[]', tag));

        router.post('/memes', data, {
            forceFormData: true,
            onProgress: (progress) => {
                if (progress?.percentage) setProgress(progress.percentage);
            },
            onSuccess: () => {
                clearInterval(interval);
                setProgress(100);
            },
            onError: () => {
                clearInterval(interval);
                setUploading(false);
                setProgress(0);
            },
            onFinish: () => clearInterval(interval),
        });
    };

    return (
        <AppLayout>
            <Head>
                <title>Upload a Meme — Chortle</title>
                <meta name="description" content="Share your funniest memes with the Chortle community. Upload an image, add a caption, and go viral." />
                <meta name="robots" content="noindex, follow" />
            </Head>
            <div className="max-w-2xl mx-auto">

                {/* Header */}
                <div className="mb-6 flex items-center gap-3" style={{ animation: 'fadeUp .4s ease both' }}>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/25">
                        <Flame size={20} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-gray-900 dark:text-white">Upload Meme</h1>
                        <p className="text-xs text-gray-400 dark:text-zinc-500">Share something funny with the community</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4" style={{ animation: 'fadeUp .4s .1s ease both' }}>

                    {/* ── Post Type Selector ── */}
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm p-5">
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">Post Type</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setForm(p => ({ ...p, postType: 'image' }))}
                                className={`flex flex-col items-center gap-2 py-4 px-4 rounded-xl border-2 transition-all ${
                                    form.postType === 'image'
                                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400'
                                        : 'border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600'
                                }`}
                            >
                                <ImageIcon size={24} />
                                <span className="text-sm font-medium">Image Post</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setForm(p => ({ ...p, postType: 'text' }))}
                                className={`flex flex-col items-center gap-2 py-4 px-4 rounded-xl border-2 transition-all ${
                                    form.postType === 'text'
                                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400'
                                        : 'border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600'
                                }`}
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M4 7V4h16v3M9 20h6M12 4v16"/>
                                </svg>
                                <span className="text-sm font-medium">Text Post</span>
                            </button>
                        </div>
                    </div>

                    {/* ── Image drop zone ── */}
                    {form.postType === 'image' && (
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">
                        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100 dark:border-zinc-800">
                            <ImageIcon size={16} className="text-orange-500" />
                            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Image</h2>
                            <span className="text-xs text-gray-400 dark:text-zinc-500 ml-auto">Max 10MB · JPG, PNG, GIF, WebP</span>
                        </div>
                        <div className="p-5">
                            {form.imagePreview ? (
                                <div className="relative group">
                                    <img src={form.imagePreview} alt="Preview"
                                        className="w-full max-h-80 object-contain rounded-xl bg-gray-50 dark:bg-zinc-800" />
                                    <button type="button"
                                        onClick={() => setForm((p) => ({ ...p, image: null, imagePreview: null }))}
                                        className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-md transition opacity-0 group-hover:opacity-100"
                                        aria-label="Remove image">
                                        <X size={15} />
                                    </button>
                                    <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
                                        {form.image?.name}
                                    </div>
                                </div>
                            ) : (
                                <div
                                    onDragEnter={handleDrag} onDragLeave={handleDrag}
                                    onDragOver={handleDrag} onDrop={handleDrop}
                                    className={`relative flex flex-col items-center justify-center w-full h-52 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                                        dragActive
                                            ? 'border-orange-500 bg-orange-50 dark:bg-orange-500/10 scale-[1.02]'
                                            : 'border-gray-200 dark:border-zinc-700 hover:border-orange-400 hover:bg-orange-50/30 dark:hover:bg-orange-500/5'
                                    }`}>
                                    <input type="file" accept="image/jpeg,image/png,image/gif,image/webp"
                                        onChange={(e) => e.target.files[0] && processImage(e.target.files[0])}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                    <CloudUpload size={36} className={`mb-3 transition-all ${dragActive ? 'text-orange-500 scale-110' : 'text-gray-300 dark:text-zinc-600'}`} />
                                    <p className="text-sm font-medium text-gray-600 dark:text-zinc-400">
                                        {dragActive ? '🔥 Drop it here!' : 'Click or drag & drop'}
                                    </p>
                                    <p className="text-xs text-gray-400 dark:text-zinc-600 mt-1">PNG, JPG, GIF, WebP up to 10MB</p>
                                </div>
                            )}
                        </div>
                    </div>
                    )}

                    {/* ── Text post editor ── */}
                    {form.postType === 'text' && (
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm">
                        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100 dark:border-zinc-800">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-orange-500">
                                <path d="M4 7V4h16v3M9 20h6M12 4v16"/>
                            </svg>
                            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Text Post</h2>
                            <span className="text-xs text-gray-400 dark:text-zinc-500 ml-auto">{form.textContent.length}/1000</span>
                        </div>
                        <div className="p-5 space-y-4">

                            {/* ── Canvas — always square, text always centered ── */}
                            {(() => {
                                const bg = form.textStyle.backgroundColor;
                                const isGradient = bg.includes('gradient') || bg.includes('linear');
                                let textColor = '#ffffff';
                                if (!isGradient) {
                                    const hex = bg.replace('#','');
                                    if (hex.length === 6) {
                                        const r = parseInt(hex.substr(0,2),16), g = parseInt(hex.substr(2,2),16), b = parseInt(hex.substr(4,2),16);
                                        textColor = (r*299 + g*587 + b*114) / 1000 > 128 ? '#000000' : '#ffffff';
                                    }
                                }
                                return (
                                    <div
                                        className="relative w-full aspect-square flex items-center justify-center overflow-hidden cursor-text shadow-lg transition-colors duration-300"
                                        style={{ background: bg, borderRadius: '0px' }}
                                        onClick={() => document.getElementById('text-canvas').focus()}
                                    >
                                        <div
                                            id="text-canvas"
                                            contentEditable
                                            suppressContentEditableWarning
                                            onInput={(e) => {
                                                const text = e.currentTarget.innerText.slice(0, 1000);
                                                setForm(p => ({ ...p, textContent: text }));
                                                if (e.currentTarget.innerText.length > 1000) {
                                                    e.currentTarget.innerText = text;
                                                    const range = document.createRange();
                                                    range.selectNodeContents(e.currentTarget);
                                                    range.collapse(false);
                                                    window.getSelection().removeAllRanges();
                                                    window.getSelection().addRange(range);
                                                }
                                            }}
                                            className="w-full px-10 outline-none break-words empty:before:content-[attr(data-placeholder)] empty:before:opacity-40"
                                            data-placeholder="What's on your mind?"
                                            style={{
                                                fontFamily: form.textStyle.fontFamily,
                                                fontSize:   `${form.textStyle.fontSize}px`,
                                                fontWeight: 'bold',
                                                textAlign:  'center',
                                                color:      textColor,
                                                lineHeight: 1.35,
                                            }}
                                        />
                                    </div>
                                );
                            })()}

                            {/* ── Toolbar: background + font only ── */}
                            <div className="space-y-3">

                                {/* Background swatches */}
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-zinc-400 mb-2 font-medium">Background</p>
                                    <div className="flex gap-2 flex-wrap items-center">
                                        {BG_PRESETS.map((preset) => (
                                            <button key={preset.value} type="button" title={preset.label}
                                                onClick={() => setForm(p => ({ ...p, textStyle: { ...p.textStyle, backgroundColor: preset.value, backgroundType: preset.type } }))}
                                                className={`w-8 h-8 rounded-full flex-shrink-0 transition-all ${form.textStyle.backgroundColor === preset.value ? 'ring-2 ring-orange-500 ring-offset-2 scale-110 shadow-md' : 'hover:scale-105 ring-1 ring-black/10'}`}
                                                style={{ background: preset.value }}
                                            />
                                        ))}
                                        <label className="relative w-8 h-8 rounded-full border-2 border-dashed border-gray-300 dark:border-zinc-600 cursor-pointer hover:scale-105 transition-all flex items-center justify-center" title="Custom color">
                                            <span className="text-gray-400 text-sm leading-none">+</span>
                                            <input type="color"
                                                onChange={(e) => setForm(p => ({ ...p, textStyle: { ...p.textStyle, backgroundColor: e.target.value, backgroundType: 'solid' } }))}
                                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                            />
                                        </label>
                                    </div>
                                </div>

                                {/* Font family — custom animated dropdown */}
                                <FontPicker
                                    value={form.textStyle.fontFamily}
                                    onChange={(f) => setForm(p => ({ ...p, textStyle: { ...p.textStyle, fontFamily: f } }))}
                                />
                            </div>
                        </div>
                    </div>
                    )}

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
                                {/* Detected hashtags */}
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
                            {showAdvanced ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
                        </button>

                        {showAdvanced && (
                            <div className="px-5 pb-5 space-y-3 border-t border-gray-100 dark:border-zinc-800 pt-4">
                                {[
                                    { key: 'is_mature',      label: 'Mature Content',   desc: 'Mark as 18+ content' },
                                    { key: 'allow_comments', label: 'Enable Comments',  desc: 'Let others comment on your meme' },
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

                    {/* ── Upload progress ── */}
                    {uploading && (
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm p-5 space-y-2">
                            <div className="flex justify-between text-xs text-gray-600 dark:text-zinc-400">
                                <span className="flex items-center gap-1.5"><Loader2 size={12} className="animate-spin text-orange-500" /> Uploading...</span>
                                <span className="font-semibold text-orange-500">{Math.round(uploadProgress)}%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }} />
                            </div>
                        </div>
                    )}

                    {/* ── Submit ── */}
                    <button type="submit"
                        disabled={uploading || (form.postType === 'image' && !form.image) || (form.postType === 'text' && !form.textContent.trim())}
                        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3.5 rounded-2xl font-semibold text-sm transition-all hover:shadow-lg hover:shadow-orange-500/30 active:scale-[.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 relative overflow-hidden group">
                        <span className="relative z-10 flex items-center gap-2">
                            {uploading
                                ? <><Loader2 size={18} className="animate-spin" /> Uploading...</>
                                : <><Flame size={18} /> Post Meme</>
                            }
                        </span>
                        {!uploading && (
                            <span className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        )}
                    </button>
                </form>
            </div>

            <style>{`
                @keyframes fadeUp { 
                    from { opacity: 0; transform: translateY(16px) } 
                    to { opacity: 1; transform: translateY(0) } 
                }
            `}</style>
        </AppLayout>
    );
}
