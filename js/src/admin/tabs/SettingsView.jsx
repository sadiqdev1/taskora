import axios from 'axios';
import { Bell, Brush, Check, Globe, RotateCcw, Save, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useToast } from '../Contexts/ToastContexts';

const Toggle = ({ label, desc, value, onToggle }) => (
    <div className="flex items-center justify-between py-1">
        <div>
            <p className="text-sm font-medium text-gray-800 dark:text-zinc-200">{label}</p>
            {desc && <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">{desc}</p>}
        </div>
        <button 
            onClick={onToggle}
            className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${value ? 'bg-orange-500' : 'bg-gray-200 dark:bg-zinc-700'}`}
            role="switch" 
            aria-checked={value}
            aria-label={label}
        >
            <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${value ? 'translate-x-5' : ''}`} />
        </button>
    </div>
);

const Section = ({ icon: Icon, title, children }) => (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-zinc-800">
            <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center">
                <Icon size={15} className="text-orange-500" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h3>
        </div>
        <div className="px-5 py-4 space-y-4">{children}</div>
    </div>
);

const DEFAULTS = {
    site_name: 'Chortle',
    site_description: 'The best meme platform on the web',
    dark_mode: false,
    compact_mode: true,
    email_notifications: true,
    push_notifications: false,
    auto_approve_memes: false,
    profanity_filter: true,
};

export default function SettingsView() {
    const [settings, setSettings] = useState(DEFAULTS);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const toast = useToast();

    useEffect(() => {
        axios.get('/admin/settings')
            .then((r) => setSettings({ ...DEFAULTS, ...r.data }))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const toggle = (key) => setSettings((p) => ({ ...p, [key]: !p[key] }));

    const handleSave = async () => {
        setSaving(true);
        try {
            await axios.post('/admin/settings', settings);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
            toast.addToast('Settings saved!', 'success');
        } catch {
            toast.addToast('Failed to save settings', 'error');
        }
        setSaving(false);
    };

    const handleReset = () => {
        setSettings(DEFAULTS);
        toast.addToast('Settings reset to defaults', 'info');
    };

    if (loading) return (
        <div className="space-y-5 max-w-2xl mx-auto">
            {[1,2,3,4].map((i) => (
                <div key={i} className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm p-5 animate-pulse">
                    <div className="h-4 w-1/3 rounded-full bg-gray-100 dark:bg-zinc-800 mb-4" />
                    <div className="space-y-3">
                        <div className="h-3 w-full rounded-full bg-gray-100 dark:bg-zinc-800" />
                        <div className="h-3 w-2/3 rounded-full bg-gray-100 dark:bg-zinc-800" />
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="space-y-5 max-w-2xl mx-auto">
            <Section icon={Globe} title="General">
                <div className="space-y-3">
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 dark:text-zinc-400 uppercase tracking-wide mb-1.5">Site Name</label>
                        <input type="text" value={settings.site_name}
                            onChange={(e) => setSettings((p) => ({ ...p, site_name: e.target.value }))}
                            className="w-full max-w-md px-4 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-zinc-800 focus:bg-white dark:focus:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-300 transition" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 dark:text-zinc-400 uppercase tracking-wide mb-1.5">Site Description</label>
                        <textarea value={settings.site_description}
                            onChange={(e) => setSettings((p) => ({ ...p, site_description: e.target.value }))} rows={2}
                            className="w-full max-w-md px-4 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-zinc-800 focus:bg-white dark:focus:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-300 transition resize-none" />
                    </div>
                </div>
            </Section>

            <Section icon={Brush} title="Appearance">
                <Toggle label="Dark Mode"    desc="Switch to dark theme"              value={!!settings.dark_mode}    onToggle={() => toggle('dark_mode')} />
                <Toggle label="Compact Mode" desc="Reduce spacing for more content"   value={!!settings.compact_mode} onToggle={() => toggle('compact_mode')} />
            </Section>

            <Section icon={Bell} title="Notifications">
                <Toggle label="Email Notifications" desc="Receive updates via email"  value={!!settings.email_notifications} onToggle={() => toggle('email_notifications')} />
                <Toggle label="Push Notifications"  desc="Browser push alerts"        value={!!settings.push_notifications}  onToggle={() => toggle('push_notifications')} />
            </Section>

            <Section icon={Shield} title="Moderation">
                <Toggle label="Auto-approve memes" desc="Skip manual approval queue"  value={!!settings.auto_approve_memes} onToggle={() => toggle('auto_approve_memes')} />
                <Toggle label="Profanity Filter"   desc="Block offensive content"     value={!!settings.profanity_filter}   onToggle={() => toggle('profanity_filter')} />
            </Section>

            <div className="flex justify-end gap-2.5">
                <button onClick={handleReset}
                    className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-full text-sm font-medium text-gray-600 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition">
                    <RotateCcw size={14} /> Reset
                </button>
                <button onClick={handleSave} disabled={saving}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition shadow-sm disabled:opacity-60 ${saved ? 'bg-green-500 text-white' : 'bg-orange-500 hover:bg-orange-600 text-white'}`}>
                    {saved ? <><Check size={14} /> Saved</> : <><Save size={14} /> {saving ? 'Saving...' : 'Save Changes'}</>}
                </button>
            </div>
        </div>
    );
}
