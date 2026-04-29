import { Head, Link, usePage } from '@inertiajs/react';
import { BadgeCheck, CheckCircle2, Home, Sparkles, User } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { show } from '@/routes/subscription';

export default function PaymentSuccess() {
    const { auth } = usePage().props;
    const user = auth?.user;

    return (
        <AppLayout>
            <Head title="Payment Successful" />
            
            <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
                <div className="w-full max-w-lg">
                    
                    {/* Success Card */}
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-xl overflow-hidden">
                        
                        {/* Gradient Header */}
                        <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 p-8 text-center">
                            {/* Success Icon */}
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                                <CheckCircle2 size={48} className="text-green-500" strokeWidth={2.5} />
                            </div>
                            
                            <h1 className="text-2xl font-bold text-white mb-2">
                                Payment Successful!
                            </h1>
                            <p className="text-green-50 text-sm">
                                Your verification badge is now active
                            </p>
                        </div>

                        {/* Content */}
                        <div className="p-8">
                            
                            {/* Verification Badge Preview */}
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/10 rounded-xl p-6 mb-6 border border-blue-100 dark:border-blue-500/20">
                                <div className="flex items-center gap-3 mb-3">
                                    <BadgeCheck size={24} className="text-blue-500" />
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                        You're Verified!
                                    </h2>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">
                                    Your blue verification badge is now visible on your profile, posts, and comments. 
                                    This is a <strong>lifetime verification</strong> that never expires.
                                </p>
                            </div>

                            {/* What's Next */}
                            <div className="space-y-3 mb-6">
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                    <Sparkles size={16} className="text-yellow-500" />
                                    What's Next?
                                </h3>
                                
                                <div className="space-y-2">
                                    {[
                                        'Your verification badge is now visible to everyone',
                                        "You'll appear higher in search results",
                                        'Build trust and credibility with your audience',
                                        'Stand out in comments and posts',
                                    ].map((item, index) => (
                                        <div key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-zinc-400">
                                            <CheckCircle2 size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                                            <span>{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <Link
                                    href="/profile"
                                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-orange-500/25 active:scale-[.98]"
                                >
                                    <User size={16} />
                                    View My Profile
                                </Link>

                                <div className="grid grid-cols-2 gap-3">
                                    <Link
                                        href="/"
                                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300 rounded-xl text-sm font-medium transition-all"
                                    >
                                        <Home size={14} />
                                        Home
                                    </Link>

                                    <Link
                                        href={show()}
                                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300 rounded-xl text-sm font-medium transition-all"
                                    >
                                        <BadgeCheck size={14} />
                                        Settings
                                    </Link>
                                </div>
                            </div>

                            {/* Receipt Info */}
                            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-zinc-800">
                                <p className="text-xs text-center text-gray-500 dark:text-zinc-500">
                                    A receipt has been sent to your email address
                                </p>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}
