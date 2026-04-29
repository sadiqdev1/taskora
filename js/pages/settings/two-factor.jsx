import { Form, Head } from '@inertiajs/react';
import { Shield, ShieldBan, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import TwoFactorRecoveryCodes from '@/components/two-factor-recovery-codes';
import TwoFactorSetupModal from '@/components/two-factor-setup-modal';
import { useTwoFactorAuth } from '@/hooks/use-two-factor-auth';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { disable, enable, show } from '@/routes/two-factor';

const breadcrumbs = [{ title: 'Two-Factor Authentication', href: show.url() }];

export default function TwoFactor({ requiresConfirmation = false, twoFactorEnabled = false }) {
    const { qrCodeSvg, hasSetupData, manualSetupKey, clearSetupData, fetchSetupData, recoveryCodesList, fetchRecoveryCodes, errors } = useTwoFactorAuth();
    const [showSetupModal, setShowSetupModal] = useState(false);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Two-Factor Authentication" />
            <SettingsLayout>
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">
                    <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-zinc-800">
                        <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center">
                            <Shield size={16} className="text-orange-500" />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Two-Factor Authentication</h2>
                            <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">Add an extra layer of security</p>
                        </div>
                    </div>

                    <div className="px-5 py-5 space-y-4">
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
                            twoFactorEnabled
                                ? 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/30'
                                : 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/30'
                        }`}>
                            {twoFactorEnabled ? <ShieldCheck size={13} /> : <ShieldBan size={13} />}
                            {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                        </div>

                        {twoFactorEnabled ? (
                            <div className="space-y-4">
                                <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">
                                    Two-factor authentication is active. You'll be prompted for a secure pin during login.
                                </p>
                                <TwoFactorRecoveryCodes recoveryCodesList={recoveryCodesList} fetchRecoveryCodes={fetchRecoveryCodes} errors={errors} />
                                <Form {...disable.form()}>
                                    {({ processing }) => (
                                        <button type="submit" disabled={processing}
                                            className="flex items-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-full text-sm font-semibold transition-all disabled:opacity-50">
                                            <ShieldBan size={15} /> Disable 2FA
                                        </button>
                                    )}
                                </Form>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">
                                    When enabled, you'll be prompted for a secure pin during login from a TOTP app.
                                </p>
                                {hasSetupData ? (
                                    <button onClick={() => setShowSetupModal(true)}
                                        className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-sm font-semibold transition-all">
                                        <ShieldCheck size={15} /> Continue Setup
                                    </button>
                                ) : (
                                    <Form {...enable.form()} onSuccess={() => setShowSetupModal(true)}>
                                        {({ processing }) => (
                                            <button type="submit" disabled={processing}
                                                className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-sm font-semibold transition-all disabled:opacity-50">
                                                <ShieldCheck size={15} /> Enable 2FA
                                            </button>
                                        )}
                                    </Form>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <TwoFactorSetupModal isOpen={showSetupModal} onClose={() => setShowSetupModal(false)}
                    requiresConfirmation={requiresConfirmation} twoFactorEnabled={twoFactorEnabled}
                    qrCodeSvg={qrCodeSvg} manualSetupKey={manualSetupKey}
                    clearSetupData={clearSetupData} fetchSetupData={fetchSetupData} errors={errors} />
            </SettingsLayout>
        </AppLayout>
    );
}
