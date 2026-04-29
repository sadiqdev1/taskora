import { Head, useForm, usePage } from '@inertiajs/react';
import { BadgeCheck, Calendar, CheckCircle2, CreditCard, Crown, Loader2, Shield, Sparkles, Star, TrendingUp, Users, Zap, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { initiate, cancel as cancelRoute } from '@/routes/subscription';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function Verification({ subscription, subscriptionStatus, isVerified, plans }) {
    const { auth, flash } = usePage().props;
    const user = auth.user;
    const [showCancelModal, setShowCancelModal] = useState(false);

    const { post, processing, setData } = useForm({
        plan_id: 'verification_onetime',
    });

    const { post: cancelPost, processing: cancelling } = useForm();

    const handleSubscribe = (planId) => {
        setData('plan_id', planId);
        post(initiate(), {
            preserveScroll: true,
        });
    };

    const handleCancelClick = () => {
        setShowCancelModal(true);
    };

    const handleCancelConfirm = () => {
        cancelPost(cancelRoute(), {
            preserveScroll: true,
            onSuccess: () => setShowCancelModal(false),
        });
    };

    const plan = plans[0]; // Verification plan

    return (
        <AppLayout>
            <Head title="Verification" />
            <SettingsLayout>
                <div className="space-y-6">

                    {/* Flash messages */}
                    {flash?.success && (
                        <div className="p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 rounded-xl text-sm text-green-700 dark:text-green-400 flex items-start gap-3">
                            <CheckCircle2 size={18} className="flex-shrink-0 mt-0.5" />
                            <span>{flash.success}</span>
                        </div>
                    )}

                    {flash?.error && (
                        <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl text-sm text-red-700 dark:text-red-400">
                            {flash.error}
                        </div>
                    )}

                    {/* Current Status */}
                    {isVerified && subscriptionStatus.has_subscription && (
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/10 rounded-2xl border border-blue-200 dark:border-blue-500/30 overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center">
                                            <BadgeCheck size={24} className="text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                                Verified Account
                                                <Crown size={18} className="text-yellow-500" />
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-zinc-400">Lifetime verification active</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white/50 dark:bg-zinc-900/50 rounded-xl p-4 mb-4">
                                    <div className="flex items-center gap-2 text-gray-500 dark:text-zinc-400 text-xs mb-1">
                                        <Calendar size={14} />
                                        <span>Purchased</span>
                                    </div>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                        {subscriptionStatus.purchased_at ? new Date(subscriptionStatus.purchased_at).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        }) : 'N/A'}
                                    </p>
                                </div>

                                <button
                                    onClick={handleCancelClick}
                                    disabled={cancelling}
                                    className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300 rounded-xl text-sm font-medium transition-all border border-gray-200 dark:border-zinc-700 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {cancelling && <Loader2 size={14} className="animate-spin" />}
                                    Remove Verification
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Benefits for Verified Users */}
                    {isVerified && subscriptionStatus.has_subscription ? (
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">
                            <div className="p-6">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <Zap size={20} className="text-yellow-500" />
                                    Your Verification Benefits
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/10 rounded-xl p-4 border border-blue-100 dark:border-blue-500/20">
                                        <TrendingUp size={24} className="text-blue-500 mb-3" />
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Increased Visibility</p>
                                        <p className="text-xs text-gray-600 dark:text-zinc-400">Your profile appears higher in search results and recommendations</p>
                                    </div>

                                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-500/10 dark:to-pink-500/10 rounded-xl p-4 border border-purple-100 dark:border-purple-500/20">
                                        <Shield size={24} className="text-purple-500 mb-3" />
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Trust & Credibility</p>
                                        <p className="text-xs text-gray-600 dark:text-zinc-400">Build authentic connections with your audience</p>
                                    </div>

                                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-500/10 dark:to-emerald-500/10 rounded-xl p-4 border border-green-100 dark:border-green-500/20">
                                        <Users size={24} className="text-green-500 mb-3" />
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Faster Growth</p>
                                        <p className="text-xs text-gray-600 dark:text-zinc-400">Attract more followers and engagement</p>
                                    </div>

                                    <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-500/10 dark:to-red-500/10 rounded-xl p-4 border border-orange-100 dark:border-orange-500/20">
                                        <Crown size={24} className="text-orange-500 mb-3" />
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Stand Out</p>
                                        <p className="text-xs text-gray-600 dark:text-zinc-400">Premium badge visible on all your content</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Verification Plan for Non-Verified Users */
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">
                            <div className="relative">
                                {/* Header with gradient */}
                                <div className="bg-gradient-to-r from-orange-500 via-orange-500 to-pink-500 p-6 text-white">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <BadgeCheck size={24} />
                                                <h2 className="text-xl font-bold">{plan.name}</h2>
                                            </div>
                                            <p className="text-orange-100 text-sm">{plan.description}</p>
                                        </div>
                                        <Sparkles size={32} className="text-yellow-300 opacity-80" />
                                    </div>

                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-bold">₦{plan.price.toLocaleString()}</span>
                                        <span className="text-orange-100 text-sm">one-time</span>
                                    </div>
                                </div>

                                {/* Features */}
                                <div className="p-6">
                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                        <Star size={16} className="text-yellow-500" />
                                        What you'll get
                                    </h3>

                                    <ul className="space-y-3 mb-6">
                                        {plan.features.map((feature, index) => (
                                            <li key={index} className="flex items-start gap-3 text-sm">
                                                <CheckCircle2 size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                                                <span className="text-gray-700 dark:text-zinc-300">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Benefits Grid */}
                                    <div className="grid grid-cols-2 gap-3 mb-6">
                                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/10 rounded-xl p-4 border border-blue-100 dark:border-blue-500/20">
                                            <TrendingUp size={20} className="text-blue-500 mb-2" />
                                            <p className="text-xs font-semibold text-gray-900 dark:text-white">Boost Visibility</p>
                                            <p className="text-xs text-gray-600 dark:text-zinc-400 mt-1">Get noticed faster</p>
                                        </div>

                                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-500/10 dark:to-pink-500/10 rounded-xl p-4 border border-purple-100 dark:border-purple-500/20">
                                            <Shield size={20} className="text-purple-500 mb-2" />
                                            <p className="text-xs font-semibold text-gray-900 dark:text-white">Build Trust</p>
                                            <p className="text-xs text-gray-600 dark:text-zinc-400 mt-1">Authentic presence</p>
                                        </div>

                                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-500/10 dark:to-emerald-500/10 rounded-xl p-4 border border-green-100 dark:border-green-500/20">
                                            <Users size={20} className="text-green-500 mb-2" />
                                            <p className="text-xs font-semibold text-gray-900 dark:text-white">Grow Faster</p>
                                            <p className="text-xs text-gray-600 dark:text-zinc-400 mt-1">Attract followers</p>
                                        </div>

                                        <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-500/10 dark:to-red-500/10 rounded-xl p-4 border border-orange-100 dark:border-orange-500/20">
                                            <Crown size={20} className="text-orange-500 mb-2" />
                                            <p className="text-xs font-semibold text-gray-900 dark:text-white">Stand Out</p>
                                            <p className="text-xs text-gray-600 dark:text-zinc-400 mt-1">Premium status</p>
                                        </div>
                                    </div>

                                    {/* CTA Button */}
                                    <button
                                        onClick={() => handleSubscribe(plan.id)}
                                        disabled={processing}
                                        className="w-full px-6 py-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-orange-500/25 disabled:opacity-50 active:scale-[.98] flex items-center justify-center gap-2"
                                    >
                                        {processing ? (
                                            <>
                                                <Loader2 size={16} className="animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <CreditCard size={16} />
                                                Get Verified Now
                                            </>
                                        )}
                                    </button>

                                    <p className="text-xs text-center text-gray-500 dark:text-zinc-500 mt-4">
                                        Secure payment powered by Paystack
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Info Card */}
                    <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-2xl border border-gray-200 dark:border-zinc-700 p-5">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">About Verification</h3>
                        <div className="space-y-2 text-xs text-gray-600 dark:text-zinc-400">
                            <p>• Verification badges help users identify authentic accounts on Chortle</p>
                            <p>• One-time payment of ₦1,500 for lifetime verification</p>
                            <p>• Your verification badge never expires</p>
                            <p>• You can remove verification anytime from this page</p>
                            <p>• Admins may also grant manual verification for special accounts</p>
                        </div>
                    </div>

                </div>
            </SettingsLayout>

            {/* Cancel Verification Modal */}
            <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="text-orange-500" size={20} />
                            Remove Verification?
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to remove your verification badge? This action will:
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-2 py-4">
                        <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-zinc-400">
                            <span className="text-red-500">•</span>
                            <span>Remove the blue verification badge from your profile</span>
                        </div>
                        <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-zinc-400">
                            <span className="text-red-500">•</span>
                            <span>Reduce your visibility in search results</span>
                        </div>
                        <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-zinc-400">
                            <span className="text-red-500">•</span>
                            <span>Remove your premium status</span>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowCancelModal(false)}
                            disabled={cancelling}
                        >
                            Keep Verification
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleCancelConfirm}
                            disabled={cancelling}
                        >
                            {cancelling && <Loader2 size={14} className="animate-spin" />}
                            Yes, Remove It
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
