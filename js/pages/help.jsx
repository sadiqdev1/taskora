import { Head } from '@inertiajs/react';
import { BookOpen, ChevronDown, Code, FileText, Flag, Headphones, HelpCircle, Mail, MessageCircle, Search, Shield, Smartphone, TrendingUp, Upload, Video, X } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';

const FAQS = [
    { id: 1, q: 'How do I upload a meme?', a: 'Tap "Upload" in the navigation, pick an image, write a caption with #hashtags, and hit Post. Your meme goes live instantly.' },
    { id: 2, q: 'How does the trending feed work?', a: 'Trending memes are ranked by likes, comments, and recency. Fresh content with high engagement rises to the top.' },
    { id: 3, q: 'Can I delete a meme after posting?', a: 'Yes — go to your profile, tap the meme, and use the options menu to delete it.' },
    { id: 4, q: 'How do I report inappropriate content?', a: 'Tap the ··· menu on any meme and select "Report". Our team reviews all reports within 24 hours.' },
    { id: 5, q: 'Why was my account suspended?', a: 'Accounts are suspended for violating community guidelines. You can appeal via the support email below.' },
    { id: 6, q: 'How do I change my profile picture?', a: 'Go to your Profile page and tap the camera icon on your avatar to upload a new photo.' },
    { id: 7, q: 'What image formats are supported?', a: 'JPG, PNG, GIF, and WebP up to 10MB.' },
];

const CATEGORIES = [
    { icon: Upload,     title: 'Getting Started',  desc: 'New to Chortle? Start here.',      details: 'Learn how to create an account, upload your first meme, and navigate the platform. Follow users, like content, and build your profile.' },
    { icon: Flag,       title: 'Moderation',       desc: 'Reports and content policies.',    details: 'Understand our community guidelines. Learn how to report inappropriate content and what happens when content violates our policies.' },
    { icon: TrendingUp, title: 'Trending',          desc: 'How the algorithm works.',         details: 'The trending feed ranks memes by likes, comments, and recency. Fresh content with high engagement rises to the top automatically.' },
    { icon: Shield,     title: 'Account & Privacy', desc: 'Profile, settings, security.',    details: 'Manage your profile, change your password, enable two-factor authentication, and control your privacy settings.' },
    { icon: Smartphone, title: 'Mobile',            desc: 'Using Chortle on the go.',         details: 'Chortle works great on mobile browsers. Add it to your home screen for a native app-like experience.' },
    { icon: HelpCircle, title: 'FAQs',              desc: 'Common questions answered.',       details: 'Browse frequently asked questions about uploads, moderation, accounts, and more. Can\'t find what you need? Contact support.' },
];

export default function Help() {
    const [search, setSearch] = useState('');
    const [openFaq, setOpenFaq] = useState(null);
    const [selectedCat, setSelectedCat] = useState(null);

    const filtered = FAQS.filter((f) =>
        f.q.toLowerCase().includes(search.toLowerCase()) ||
        f.a.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AppLayout>
            <Head title="Help Center" />
            <div className="max-w-3xl mx-auto space-y-8">

                {/* Hero */}
                <div className="text-center py-8" style={{ animation: 'fadeUp .4s ease both' }}>
                    <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center mx-auto mb-4">
                        <HelpCircle size={28} className="text-orange-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Help Center</h1>
                    <p className="text-sm text-gray-500 dark:text-zinc-400 mb-6">Find answers, guides, and support.</p>

                    {/* Search */}
                    <div className="relative max-w-md mx-auto">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500" />
                        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search help articles..."
                            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-300 transition shadow-sm" />
                    </div>
                </div>

                    {!search && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3" style={{ animation: 'fadeUp .4s .1s ease both' }}>
                        {CATEGORIES.map(({ icon: Icon, title, desc, details }) => (
                            <button key={title} onClick={() => setSelectedCat({ icon: Icon, title, desc, details })}
                                className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm p-4 text-left hover:shadow-md hover:-translate-y-0.5 transition-all group">
                                <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                                    <Icon size={18} className="text-orange-500" />
                                </div>
                                <p className="text-sm font-semibold text-gray-800 dark:text-zinc-200">{title}</p>
                                <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">{desc}</p>
                            </button>
                        ))}
                    </div>
                )}

                {/* FAQs */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden"
                    style={{ animation: 'fadeUp .4s .2s ease both' }}>
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-zinc-800">
                        <h2 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <HelpCircle size={15} className="text-orange-500" />
                            {search ? `Results for "${search}"` : 'Frequently Asked Questions'}
                        </h2>
                        {search && (
                            <button onClick={() => setSearch('')}
                                className="flex items-center gap-1 text-xs text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 transition">
                                <X size={13} /> Clear
                            </button>
                        )}
                    </div>
                    <div className="divide-y divide-gray-50 dark:divide-zinc-800">
                        {filtered.length > 0 ? filtered.map((faq) => (
                            <div key={faq.id}>
                                <button onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50/50 dark:hover:bg-zinc-800/50 transition-colors">
                                    <span className="text-sm font-medium text-gray-800 dark:text-zinc-200 pr-4">{faq.q}</span>
                                    <ChevronDown size={15} className={`text-gray-400 dark:text-zinc-500 flex-shrink-0 transition-transform duration-200 ${openFaq === faq.id ? 'rotate-180' : ''}`} />
                                </button>
                                {openFaq === faq.id && (
                                    <div className="px-5 pb-4">
                                        <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">{faq.a}</p>
                                    </div>
                                )}
                            </div>
                        )) : (
                            <div className="px-5 py-10 text-center">
                                <p className="text-sm text-gray-400 dark:text-zinc-500">No results for "{search}"</p>
                                <button onClick={() => setSearch('')} className="mt-2 text-xs text-orange-500 hover:text-orange-600 transition">Clear search</button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Docs + Contact */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ animation: 'fadeUp .4s .3s ease both' }}>
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm p-5">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                            <BookOpen size={15} className="text-orange-500" /> Documentation
                        </h3>
                        <ul className="space-y-2.5">
                            {[
                                { icon: FileText, color: 'text-red-400',   label: 'User Guide' },
                                { icon: Video,    color: 'text-blue-400',  label: 'Video Tutorials' },
                                { icon: Code,     color: 'text-green-400', label: 'API Reference' },
                            ].map(({ icon: Icon, color, label }) => (
                                <li key={label}>
                                    <a href="#" className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-zinc-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors group">
                                        <Icon size={15} className={color} />
                                        <span className="group-hover:underline">{label}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm p-5">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                            <Headphones size={15} className="text-orange-500" /> Contact Support
                        </h3>
                        <p className="text-xs text-gray-400 dark:text-zinc-500 mb-3">Our team is available 24/7.</p>
                        <div className="space-y-2">
                            {[
                                { icon: Mail,          bg: 'bg-orange-50 dark:bg-orange-500/10', color: 'text-orange-500', title: 'Email Us',  sub: 'support@chortle.app' },
                                { icon: MessageCircle, bg: 'bg-blue-50 dark:bg-blue-500/10',     color: 'text-blue-500',   title: 'Live Chat', sub: 'Available 9am–5pm' },
                            ].map(({ icon: Icon, bg, color, title, sub }) => (
                                <a key={title} href={title === 'Email Us' ? 'mailto:support@chortle.app' : '#'}
                                    className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:border-gray-200 dark:hover:border-zinc-700 transition-all">
                                    <div className={`w-8 h-8 ${bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                        <Icon size={15} className={color} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800 dark:text-zinc-200">{title}</p>
                                        <p className="text-xs text-gray-400 dark:text-zinc-500">{sub}</p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Category detail modal */}
            {selectedCat && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto"
                    onClick={() => setSelectedCat(null)}>
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl max-w-md w-full border border-gray-100 dark:border-zinc-800 my-8"
                        style={{ animation: 'modalIn .25s cubic-bezier(.16,1,.3,1)' }}
                        onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-start justify-between px-5 py-4 border-b border-gray-100 dark:border-zinc-800">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-orange-50 dark:bg-orange-500/10 rounded-xl flex items-center justify-center">
                                    <selectedCat.icon size={16} className="text-orange-500" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">{selectedCat.title}</h3>
                                    <p className="text-xs text-gray-400 dark:text-zinc-500">{selectedCat.desc}</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedCat(null)}
                                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition text-gray-400 dark:text-zinc-500">
                                <X size={15} />
                            </button>
                        </div>
                        <div className="px-5 py-4">
                            <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">{selectedCat.details}</p>
                        </div>
                        <div className="px-5 pb-5 flex justify-end">
                            <button onClick={() => setSelectedCat(null)}
                                className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-full transition active:scale-[.97]">
                                Got it
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
                @keyframes modalIn{from{opacity:0;transform:scale(.95) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}
            `}</style>
        </AppLayout>
    );
}
