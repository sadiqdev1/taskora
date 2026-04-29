import { Head } from '@inertiajs/react';
import { Monitor, Moon, Paintbrush, Sun } from 'lucide-react';
import { useAppearance } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit as editAppearance } from '@/routes/appearance';

const breadcrumbs = [{ title: 'Appearance settings', href: editAppearance().url }];

export default function Appearance() {
    const { appearance, updateAppearance } = useAppearance();

    const themes = [
        { value: 'light', icon: Sun,     label: 'Light',  desc: 'Always light' },
        { value: 'dark',  icon: Moon,    label: 'Dark',   desc: 'Always dark'  },
        { value: 'system',icon: Monitor, label: 'System', desc: 'Follows OS'   },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Appearance settings" />
            <SettingsLayout>
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">
                    <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-zinc-800">
                        <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center">
                            <Paintbrush size={16} className="text-orange-500" />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Appearance</h2>
                            <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">Choose your preferred theme</p>
                        </div>
                    </div>

                    <div className="px-5 py-5">
                        <div className="grid grid-cols-3 gap-3">
                            {themes.map(({ value, icon: Icon, label, desc }) => {
                                const isActive = appearance === value;
                                return (
                                    <button key={value} onClick={() => updateAppearance(value)} type="button"
                                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-center ${
                                            isActive
                                                ? 'border-orange-500 bg-orange-50 dark:bg-orange-500/10'
                                                : 'border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600 hover:bg-gray-50 dark:hover:bg-zinc-800'
                                        }`}>
                                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                                            isActive ? 'bg-orange-500 text-white' : 'bg-gray-100 dark:bg-zinc-700 text-gray-500 dark:text-zinc-400'
                                        }`}>
                                            <Icon size={18} />
                                        </div>
                                        <div>
                                            <p className={`text-sm font-semibold ${isActive ? 'text-orange-600' : 'text-gray-700 dark:text-zinc-200'}`}>{label}</p>
                                            <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">{desc}</p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
