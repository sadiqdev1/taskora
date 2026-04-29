import { BookOpen, ChevronDown, Code, FileText, Flag, Headphones, HelpCircle, Mail, MessageCircle, Search, Shield, Smartphone, TrendingUp, Upload, Video, X } from 'lucide-react';
import { useState } from 'react';

const FAQS = [
    { id: 1, q: 'How do I upload a meme?', a: 'Click "New Meme" in the Memes tab, select an image, add a title, and submit. It goes live immediately as approved.' },
    { id: 2, q: 'How are memes moderated?', a: 'Pending memes appear in the Memes tab. Approve or reject them from the actions column.' },
    { id: 3, q: 'How does the trending algorithm work?', a: 'Trending memes are ranked by likes, comments, and recency. High engagement content rises automatically.' },
    { id: 4, q: 'How do I suspend a user?', a: 'Go to the Users tab, find the user, and click the suspend icon. They will see a suspension notice and can submit an appeal.' },
    { id: 5, q: 'How do I handle reports?', a: 'Open the Reports tab. Pending reports can be resolved (action taken) or dismissed (no action needed).' },
    { id: 6, q: 'How do I create a new user?', a: 'In the Users tab, click "New User", fill in their details and assign a role. They can log in immediately.' },
];

const CATEGORIES = [
    { icon: Upload,     title: 'Content',         desc: 'Managing memes and uploads.',      details: 'Use the Memes tab to review, approve, reject, and delete content. You can also create memes directly from the admin panel.' },
    { icon: Flag,       title: 'Moderation',      desc: 'Reports and content policies.',    details: 'The Reports tab shows all user-submitted reports. Resolve reports when action is taken, or dismiss if no violation occurred.' },
    { icon: TrendingUp, title: 'Trending',         desc: 'How the trending feed works.',     details: 'The Trending tab shows top-performing memes ranked by engagement. Use it to monitor platform health and viral content.' },
    { icon: Shield,     title: 'Users',            desc: 'Accounts, roles, and access.',    details: 'Manage users from the Users tab. You can create accounts, assign roles (user/moderator/admin), suspend accounts, or delete them.' },
    { icon: Smartphone, title: 'Notifications',    desc: 'System events and alerts.',        details: 'The Notifications tab shows system events — new reports, new users, pending memes, and feedback submissions.' },
    { icon: HelpCircle, title: 'Settings',         desc: 'Platform configuration.',          details: 'The Settings tab lets you configure site name, description, moderation rules, and notification preferences.' },
];

export default function HelpView() {
    const [search, setSearch] = useState('');
    const [openFaq, setOpenFaq] = useState(null);
    const [selectedCat, setSelectedCat] = useState(null);

    const filtered = FAQS.filter((f) =>
        f.q.toLowerCase().includes(search.toLowerCase()) ||
        f.a.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6 max-w-4xl mx-auto">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                style={{ animation: 'fadeUp .3s ease both' }}>
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center">
                        <HelpCircle size={17} className="text-orange-500" />
                    </div>
                    <div>
                        <h2 className="text-base font-semibold text-gray-900 dark:text-white">Help Center</h2>
                        <p className="text-xs text-gray-400 dark:text-zinc-500">Admin documentation and guides</p>
                    </div>
                </div>
                <div className="relative w-full sm:w-60">
                    <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500 pointer-events-none" />
                    <input type="text" placeholder="Search help..." value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:bg-white dark:focus:bg-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-300 transition" />
                </div>
            </div>

            {/* Category cards */}
            {!search && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3"
                    style={{ animation: 'fadeUp .3s .05s ease both' }}>
                    {CATEGORIES.map(({ icon: Icon, title, desc, details }, i) => (
                        <button key={title} onClick={() => setSelectedCat({ icon: Icon, title, desc, details })}
                            className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm p-4 text-left hover:shadow-md hover:-translate-y-0.5 transition-all group"
                            style={{ animation: `fadeUp .3s ${.08 + i * .04}s ease both` }}>
                            <div className="w-9 h-9 rounded-xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                                <Icon size={16} className="text-orange-500" />
                            </div>
                            <p className="text-sm font-semibold text-gray-800 dark:text-zinc-200">{title}</p>
                            <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">{desc}</p>
                        </button>
                    ))}
                </div>
            )}

            {/* FAQs */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden"
                style={{ animation: 'fadeUp .3s .15s ease both' }}>
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-zinc-800">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <HelpCircle size={14} className="text-orange-500" />
                        {search ? `Results for "${search}"` : 'Frequently Asked Questions'}
                    </h3>
                    {search && (
                        <button onClick={() => setSearch('')}
                            className="flex items-center gap-1 text-xs text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 transition">
                            <X size={12} /> Clear
                        </button>
                    )}
                </div>
                <div className="divide-y divide-gray-50 dark:divide-zinc-800">
                    {filtered.length > 0 ? filtered.map((faq) => (
                        <div key={faq.id}>
                            <button onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50/50 dark:hover:bg-zinc-800/50 transition-colors">
                                <span className="text-sm font-medium text-gray-800 dark:text-zinc-200 pr-4">{faq.q}</span>
                                <ChevronDown size={14} className={`text-gray-400 dark:text-zinc-500 flex-shrink-0 transition-transform duration-200 ${openFaq === faq.id ? 'rotate-180' : ''}`} />
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4"
                style={{ animation: 'fadeUp .3s .2s ease both' }}>
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm p-5">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                        <BookOpen size={14} className="text-orange-500" /> Documentation
                    </h3>
                    <ul className="space-y-2.5">
                        {[
                            { icon: FileText, label: 'Admin Guide' },
                            { icon: Video,    label: 'Video Tutorials' },
                            { icon: Code,     label: 'API Reference' },
                        ].map(({ icon: Icon, label }) => (
                            <li key={label}>
                                <a href="#" className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-zinc-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors group">
                                    <Icon size={14} className="text-zinc-400 dark:text-zinc-500 flex-shrink-0" />
                                    <span className="group-hover:underline">{label}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm p-5">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                        <Headphones size={14} className="text-orange-500" /> Contact Support
                    </h3>
                    <p className="text-xs text-gray-400 dark:text-zinc-500 mb-3">Our team is available 24/7.</p>
                    <div className="space-y-2">
                        {[
                            { icon: Mail,          title: 'Email Us',  sub: 'support@chortle.app', href: 'mailto:support@chortle.app' },
                            { icon: MessageCircle, title: 'Live Chat', sub: 'Available 9am–5pm',   href: '#' },
                        ].map(({ icon: Icon, title, sub, href }) => (
                            <a key={title} href={href}
                                className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:border-gray-200 dark:hover:border-zinc-700 transition-all">
                                <div className="w-8 h-8 bg-orange-50 dark:bg-orange-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Icon size={14} className="text-orange-500" />
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

            {/* Category detail modal */}
            {selectedCat && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                    onClick={() => setSelectedCat(null)}>
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl max-w-md w-full border border-gray-100 dark:border-zinc-800"
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
                @keyframes fadeUp  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
                @keyframes modalIn { from{opacity:0;transform:scale(.95) translateY(8px)} to{opacity:1;transform:scale(1) translateY(0)} }
            `}</style>
        </div>
    );
}
