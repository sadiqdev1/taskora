import { Link, usePage } from '@inertiajs/react';
import { AlertTriangle, FileText, LogOut } from 'lucide-react';
import { logout } from '@/routes';

export default function SuspendedModal() {
    const { is_suspended, auth } = usePage().props;

    if (!is_suspended) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-md border border-red-100 dark:border-red-500/20 overflow-hidden"
                style={{ animation: 'modalIn .3s cubic-bezier(.16,1,.3,1)' }}>

                <div className="h-1.5 bg-gradient-to-r from-red-500 to-orange-500" />

                <div className="p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center mx-auto mb-5">
                        <AlertTriangle size={32} className="text-red-500" />
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        Account Suspended
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-zinc-400 leading-relaxed mb-1">
                        Your account <span className="font-semibold text-gray-700 dark:text-zinc-200">{auth?.user?.email}</span> has been suspended by our moderation team.
                    </p>
                    <p className="text-sm text-gray-500 dark:text-zinc-400 leading-relaxed mb-6">
                        If you believe this is a mistake, you can submit an appeal and our team will review it within 24–48 hours.
                    </p>

                    <div className="space-y-3">
                        <Link href="/appeal"
                            className="flex items-center justify-center gap-2 w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl text-sm font-semibold transition-all hover:shadow-md active:scale-[.98]">
                            <FileText size={16} />
                            Submit an Appeal
                        </Link>

                        <Link href={logout()} method="post" as="button"
                            className="flex items-center justify-center gap-2 w-full border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800 py-3 rounded-xl text-sm font-medium transition-all">
                            <LogOut size={16} />
                            Sign out
                        </Link>
                    </div>

                    <p className="text-xs text-gray-400 dark:text-zinc-600 mt-4">
                        Appeals are reviewed within 24–48 hours.
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes modalIn { from{opacity:0;transform:scale(.95) translateY(10px)} to{opacity:1;transform:scale(1) translateY(0)} }
            `}</style>
        </div>
    );
}
