import { Head, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, CreditCard, Loader2, Shield } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { show } from '@/routes/subscription';

export default function Payment({ paymentData, paystackPublicKey }) {
    const { auth } = usePage().props;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Load Paystack inline script
        const script = document.createElement('script');
        script.src = 'https://js.paystack.co/v1/inline.js';
        script.async = true;
        script.onload = () => {
            setLoading(false);
            initializePayment();
        };
        script.onerror = () => {
            setError('Failed to load payment gateway. Please try again.');
            setLoading(false);
        };
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const initializePayment = () => {
        if (!window.PaystackPop) {
            setError('Payment gateway not available. Please refresh and try again.');
            return;
        }

        const handler = window.PaystackPop.setup({
            key: paystackPublicKey,
            email: paymentData.email,
            amount: paymentData.amount,
            currency: paymentData.currency,
            ref: paymentData.reference,
            metadata: paymentData.metadata,
            callback: function(response) {
                // Payment successful, redirect to verification endpoint
                window.location.href = paymentData.callback_url;
            },
            onClose: function() {
                // User closed payment modal - redirect to failed page
                window.location.href = `/subscription/failed?reason=cancelled&reference=${paymentData.reference}`;
            }
        });

        handler.openIframe();
    };

    return (
        <AppLayout>
            <Head title="Complete Payment" />
            
            <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
                <div className="w-full max-w-md">
                    
                    {/* Loading State */}
                    {loading && (
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-lg p-8">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-orange-50 dark:bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Loader2 size={32} className="text-orange-500 animate-spin" />
                                </div>
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                    Initializing Payment
                                </h2>
                                <p className="text-sm text-gray-600 dark:text-zinc-400">
                                    Please wait while we set up your secure payment...
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-lg p-8">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CreditCard size={32} className="text-red-500" />
                                </div>
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                    Payment Error
                                </h2>
                                <p className="text-sm text-gray-600 dark:text-zinc-400 mb-6">
                                    {error}
                                </p>
                                <a
                                    href={show()}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-semibold transition-all active:scale-[.98]"
                                >
                                    <ArrowLeft size={16} />
                                    Back to Verification
                                </a>
                            </div>
                        </div>
                    )}

                    {/* Payment Info */}
                    {!loading && !error && (
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-lg p-8">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-green-50 dark:bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Shield size={32} className="text-green-500" />
                                </div>
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                    Secure Payment
                                </h2>
                                <p className="text-sm text-gray-600 dark:text-zinc-400 mb-6">
                                    Complete your payment in the Paystack window
                                </p>

                                <div className="bg-gray-50 dark:bg-zinc-800 rounded-xl p-4 mb-6">
                                    <div className="flex items-center justify-between text-sm mb-2">
                                        <span className="text-gray-600 dark:text-zinc-400">Amount</span>
                                        <span className="font-semibold text-gray-900 dark:text-white">
                                            ₦{(paymentData.amount / 100).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600 dark:text-zinc-400">Reference</span>
                                        <span className="font-mono text-xs text-gray-900 dark:text-white">
                                            {paymentData.reference}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2 text-xs text-gray-500 dark:text-zinc-500">
                                    <CheckCircle2 size={14} className="flex-shrink-0 mt-0.5" />
                                    <p className="text-left">
                                        Your payment is secured by Paystack. We never store your card details.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </AppLayout>
    );
}
