import { Form, Head } from '@inertiajs/react';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { Loader2, ShieldCheck } from 'lucide-react';
import { useMemo, useState } from 'react';
import InputError from '@/components/input-error';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { OTP_MAX_LENGTH } from '@/hooks/use-two-factor-auth';
import { store } from '@/routes/two-factor/login';
import chortleLogo from '@/src/assets/chortle-logo.svg';

export default function TwoFactorChallenge() {
    const [showRecoveryInput, setShowRecoveryInput] = useState(false);
    const [code, setCode] = useState('');

    const config = useMemo(() => showRecoveryInput
        ? { title: 'Recovery Code', desc: 'Enter one of your emergency recovery codes.', toggle: 'Use authentication code instead' }
        : { title: 'Two-Factor Auth', desc: 'Enter the code from your authenticator app.', toggle: 'Use a recovery code instead' },
        [showRecoveryInput]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Head title="Two-Factor Authentication" />
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-orange-500 shadow-lg mb-4">
                        <ShieldCheck size={28} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">{config.title}</h1>
                    <p className="text-sm text-gray-500 mt-1">{config.desc}</p>
                </div>

                <Form {...store.form()} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5"
                    resetOnError resetOnSuccess={!showRecoveryInput}>
                    {({ errors, processing, clearErrors }) => (
                        <>
                            {showRecoveryInput ? (
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">Recovery Code</label>
                                    <input name="recovery_code" type="text" autoFocus required
                                        placeholder="Enter recovery code"
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-300 transition bg-gray-50 focus:bg-white" />
                                    <InputError message={errors.recovery_code} />
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-3">
                                    <InputOTP name="code" maxLength={OTP_MAX_LENGTH} value={code}
                                        onChange={(value) => setCode(value)} disabled={processing} pattern={REGEXP_ONLY_DIGITS}>
                                        <InputOTPGroup>
                                            {Array.from({ length: OTP_MAX_LENGTH }, (_, i) => (
                                                <InputOTPSlot key={i} index={i} />
                                            ))}
                                        </InputOTPGroup>
                                    </InputOTP>
                                    <InputError message={errors.code} />
                                </div>
                            )}

                            <button type="submit" disabled={processing}
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-xl text-sm font-semibold transition-all hover:shadow-md active:scale-[.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                {processing ? <><Loader2 size={16} className="animate-spin" /> Verifying...</> : 'Continue'}
                            </button>

                            <p className="text-xs text-gray-500 text-center">
                                or{' '}
                                <button type="button" onClick={() => { setShowRecoveryInput(!showRecoveryInput); clearErrors(); setCode(''); }}
                                    className="text-orange-500 hover:text-orange-600 font-semibold transition-colors">
                                    {config.toggle}
                                </button>
                            </p>
                        </>
                    )}
                </Form>
            </div>
        </div>
    );
}
