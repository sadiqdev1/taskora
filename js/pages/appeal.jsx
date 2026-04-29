import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { AlertTriangle, ArrowLeft, CheckCircle2, Loader2, LogOut, Send } from 'lucide-react';
import { logout } from '@/routes';
import chortleLogo from '@/src/assets/chortle-logo.svg';

export default function Appeal() {
    const { auth, flash } = usePage().props;
    const user = auth?.user;

    const { data, setData, post, processing, errors } = useForm({ reason: '' });

    const submit = (e) => {
        e.preventDefault();
        post('/appeal', { preserveScroll: true });
    };

    const sent = flash?.appeal_sent;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4">
            <Head title="Account Appeal — Chortle" />

            <div className="w-full max-w-lg">
                {/* Logo */}
                <div className="flex items-center justify-center gap-2.5 mb-8">
                    <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center shadow-sm">
                        <img src={chortleLogo} alt="Chortle" className="h-6 w-6 object-contain" />
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white text-lg">Chortle</span>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">
                    {/* Top bar */}
                    <div className="h-1 bg-gradient-to-r from-red-500 to-orange-500" />

                    <div className="p-8">
                        {sent ? (
                            /* ── Success state ── */
                            <div className="text-center py-4">
                                <div className="w-16 h-16 rounded-full bg-green-50 dark:bg-green-500/10 flex items-center justify-center mx-auto mb-5">
                                    <CheckCircle2 size={32} className="text-green-500" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    Appeal submitted
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-zinc-400 leading-relaxed mb-6">
                                    Our moderation team will review your appeal within 24–48 hours.
                                    You'll be notified by email at <span className="font-semibold text-gray-700 dark:text-zinc-200">{user?.email}</span>.
                                </p>
                                <Link href={logout()} method="post" as="button"
                                    className="flex items-center justify-center gap-2 w-full border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800 py-3 rounded-xl text-sm font-medium transition-all">
                                    <LogOut size={15} /> Sign out
                                </Link>
                            </div>
                        ) : (
                            /* ── Appeal form ── */
                            <>
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center flex-shrink-0">
                                        <AlertTriangle size={22} className="text-red-500" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                            Account Suspended
                                        </h2>
                                        <p className="text-sm text-gray-500 dark:text-zinc-400 mt-0.5">
                                            Your account <span className="font-semibold text-gray-700 dark:text-zinc-200">{user?.email}</span> has been suspended.
                                        </p>
                                    </div>
                                </div>

                                <div className="p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 rounded-xl mb-6">
                                    <p className="text-sm text-amber-700 dark:text-amber-400 leading-relaxed">
                                        If you believe this suspension was a mistake, explain your situation below.
                                        Be specific — appeals with more detail are reviewed faster.
                                    </p>
                                </div>

                                <form onSubmit={submit} className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label htmlFor="reason" className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 uppercase tracking-wide">
                                            Your appeal
                                        </label>
                                        <textarea
                                            id="reason"
                                            rows={6}
                                            value={data.reason}
                                            onChange={(e) => setData('reason', e.target.value)}
                                            placeholder="Explain why you believe your account should be reinstated. Include any relevant context about your activity on Chortle..."
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-300 transition resize-none"
                                        />
                                        {errors.reason && (
                                            <p className="text-xs text-red-500">{errors.reason}</p>
                                        )}
                                        <p className="text-xs text-gray-400 dark:text-zinc-500 text-right">
                                            {data.reason.length} / 2000
                                        </p>
                                    </div>

                                    <button type="submit" disabled={processing || data.reason.length < 20}
                                        className="flex items-center justify-center gap-2 w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl text-sm font-semibold transition-all hover:shadow-md active:scale-[.98]">
                                        {processing
                                            ? <Loader2 size={15} className="animate-spin" />
                                            : <Send size={15} />}
                                        Submit Appeal
                                    </button>
                                </form>

                                <div className="mt-5 pt-5 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between">
                                    <p className="text-xs text-gray-400 dark:text-zinc-600">
                                        Reviews take 24–48 hours
                                    </p>
                                    <Link href={logout()} method="post" as="button"
                                        className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 transition">
                                        <LogOut size={12} /> Sign out
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
