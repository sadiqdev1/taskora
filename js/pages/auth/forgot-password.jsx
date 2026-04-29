import { Form, Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { Loader2, Mail } from 'lucide-react';
import InputError from '@/components/input-error';
import { login } from '@/routes';
import { email } from '@/routes/password';
import chortleLogo from '@/src/assets/chortle-logo.svg';

export default function ForgotPassword({ status }) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Head title="Forgot password" />
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-orange-500 shadow-lg mb-4">
                        <img src={chortleLogo} alt="Chortle" className="h-8 w-8 object-contain" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Forgot password?</h1>
                    <p className="text-sm text-gray-500 mt-1">Enter your email to receive a reset link</p>
                </div>

                {status && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-center text-sm font-medium text-green-700">
                        {status}
                    </div>
                )}

                <Form {...email.form()} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                    {({ processing, errors }) => (
                        <>
                            <div className="space-y-1.5">
                                <label htmlFor="email" className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">Email address</label>
                                <div className="relative">
                                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input type="email" id="email" name="email" autoFocus autoComplete="off"
                                        placeholder="you@example.com"
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-300 transition bg-gray-50 focus:bg-white" />
                                </div>
                                <InputError message={errors.email} />
                            </div>

                            <button type="submit" disabled={processing} data-test="email-password-reset-link-button"
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-xl text-sm font-semibold transition-all hover:shadow-md active:scale-[.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                {processing ? <><Loader2 size={16} className="animate-spin" /> Sending...</> : 'Send reset link'}
                            </button>

                            <p className="text-xs text-gray-500 text-center pt-1">
                                Remember your password?{' '}
                                <Link href={login()} className="text-orange-500 hover:text-orange-600 font-semibold transition-colors">Sign in</Link>
                            </p>
                        </>
                    )}
                </Form>
            </div>
        </div>
    );
}
