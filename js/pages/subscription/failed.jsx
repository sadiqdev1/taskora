import { Head, Link } from '@inertiajs/react';
import { AlertCircle, ArrowLeft, HelpCircle, Home, RefreshCw, XCircle } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { show } from '@/routes/subscription';

export default function PaymentFailed({ reason, reference }) {
    const failureReasons = {
        'declined': {
            title: 'Card Declined',
            message: 'Your card was declined by your bank. Please try a different payment method or contact your bank.',
            icon: XCircle,
            color: 'red',
        },
        'insufficient_funds': {
            title: 'Insufficient Funds',
            message: 'Your account does not have sufficient funds to complete this transaction.',
            icon: AlertCircle,
            color: 'orange',
        },
        'expired_card': {
            title: 'Card Expired',
            message: 'The card you used has expired. Please use a different card.',
            icon: XCircle,
            color: 'red',
        },
        'cancelled': {
            title: 'Payment Cancelled',
            message: 'You cancelled the payment process. No charges were made.',
            icon: AlertCircle,
            color: 'gray',
        },
        'timeout': {
            title: 'Payment Timeout',
            message: 'The payment session expired. Please try again.',
            icon: AlertCircle,
            color: 'orange',
        },
        'default': {
            title: 'Payment Failed',
            message: 'We couldn\'t process your payment. Please try again or use a different payment method.',
            icon: XCircle,
            color: 'red',
        },
    };

    const failure = failureReasons[reason] || failureReasons.default;
    const Icon = failure.icon;

    const colorClasses = {
        red: {
            bg: 'from-red-500 via-rose-500 to-pink-500',
            icon: 'bg-red-50 dark:bg-red-500/10 text-red-500',
            border: 'border-red-100 dark:border-red-500/20',
        },
        orange: {
            bg: 'from-orange-500 via-amber-500 to-yellow-500',
            icon: 'bg-orange-50 dark:bg-orange-500/10 text-orange-500',
            border: 'border-orange-100 dark:border-orange-500/20',
        },
        gray: {
            bg: 'from-gray-500 via-slate-500 to-zinc-500',
            icon: 'bg-gray-50 dark:bg-gray-500/10 text-gray-500',
            border: 'border-gray-100 dark:border-gray-500/20',
        },
    };

    const colors = colorClasses[failure.color] || colorClasses.red;

    return (
        <AppLayout>
            <Head title="Payment Failed" />
            
            <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
                <div className="w-full max-w-lg">
                    
                    {/* Failed Card */}
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-xl overflow-hidden">
                        
                        {/* Gradient Header */}
                        <div className={`bg-gradient-to-r ${colors.bg} p-8 text-center relative overflow-hidden`}>
                            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
                            
                            <div className="relative">
                                {/* Failed Icon with Animation */}
                                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-shake">
                                    <Icon size={48} className={colors.icon.split(' ')[colors.icon.split(' ').length - 1]} strokeWidth={2.5} />
                                </div>
                                
                                <h1 className="text-2xl font-bold text-white mb-2">
                                    {failure.title}
                                </h1>
                                <p className="text-white/90 text-sm">
                                    {failure.message}
                                </p>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-8">
                            
                            {/* Reference Number */}
                            {reference && (
                                <div className={`bg-gray-50 dark:bg-zinc-800 rounded-xl p-4 mb-6 border ${colors.border}`}>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600 dark:text-zinc-400">Reference</span>
                                        <span className="font-mono text-xs text-gray-900 dark:text-white">
                                            {reference}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* What to do next */}
                            <div className="space-y-3 mb-6">
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                    <HelpCircle size={16} className="text-blue-500" />
                                    What can you do?
                                </h3>
                                
                                <div className="space-y-2">
                                    {reason === 'declined' && [
                                        'Contact your bank to authorize the transaction',
                                        'Try using a different card',
                                        'Ensure your card has international transactions enabled',
                                    ].map((item, index) => (
                                        <div key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-zinc-400">
                                            <div className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-zinc-500 flex-shrink-0 mt-1.5" />
                                            <span>{item}</span>
                                        </div>
                                    ))}

                                    {reason === 'insufficient_funds' && [
                                        'Add funds to your account',
                                        'Try using a different card',
                                        'Contact your bank for assistance',
                                    ].map((item, index) => (
                                        <div key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-zinc-400">
                                            <div className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-zinc-500 flex-shrink-0 mt-1.5" />
                                            <span>{item}</span>
                                        </div>
                                    ))}

                                    {(reason === 'cancelled' || reason === 'timeout' || !reason) && [
                                        'Try the payment again',
                                        'Ensure you have a stable internet connection',
                                        'Contact support if the issue persists',
                                    ].map((item, index) => (
                                        <div key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-zinc-400">
                                            <div className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-zinc-500 flex-shrink-0 mt-1.5" />
                                            <span>{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <Link
                                    href={show()}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-orange-500/25 active:scale-[.98]"
                                >
                                    <RefreshCw size={16} />
                                    Try Again
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
                                        href="/help"
                                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300 rounded-xl text-sm font-medium transition-all"
                                    >
                                        <HelpCircle size={14} />
                                        Help
                                    </Link>
                                </div>
                            </div>

                            {/* Support Info */}
                            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-zinc-800">
                                <p className="text-xs text-center text-gray-500 dark:text-zinc-500">
                                    Need help? Contact our support team at support@chortle.com
                                </p>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}
