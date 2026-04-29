import { Link } from '@inertiajs/react';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn, toUrl } from '@/lib/utils';
import { edit as editAppearance } from '@/routes/appearance';
import { edit } from '@/routes/profile';
import { show } from '@/routes/two-factor';
import { show as showSubscription } from '@/routes/subscription';
import { edit as editPassword } from '@/routes/user-password';

const sidebarNavItems = [
    { title: 'Profile', href: edit() },
    { title: 'Password', href: editPassword() },
    { title: 'Two-Factor Auth', href: show() },
    { title: 'Verification', href: showSubscription() },
    { title: 'Appearance', href: editAppearance() },
];

export default function SettingsLayout({ children }) {
    const { isCurrentUrl } = useCurrentUrl();
    if (typeof window === 'undefined') return null;

    return (
        <div className="px-0 py-4 md:py-6">
            <div className="mb-6">
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">Settings</h1>
                <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">Manage your profile and account settings</p>
            </div>

            <div className="flex flex-col lg:flex-row lg:gap-8">
                <aside className="w-full lg:w-44 mb-5 lg:mb-0 flex-shrink-0">
                    <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0">
                        {sidebarNavItems.map((item, index) => {
                            const isActive = isCurrentUrl(item.href);
                            return (
                                <Link key={`${toUrl(item.href)}-${index}`} href={item.href}
                                    className={cn(
                                        'flex-shrink-0 px-3 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap',
                                        isActive
                                            ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 font-semibold'
                                            : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-white'
                                    )}>
                                    {item.title}
                                </Link>
                            );
                        })}
                    </nav>
                </aside>

                <div className="flex-1 min-w-0 max-w-2xl space-y-5">
                    {children}
                </div>
            </div>
        </div>
    );
}
