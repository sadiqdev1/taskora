import { Form, Head } from '@inertiajs/react';
import { Eye, EyeOff, Loader2, Lock } from 'lucide-react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { update } from '@/routes/password';
import chortleLogo from '@/src/assets/chortle-logo.svg';

export default function ResetPassword({ token, email }) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Head title="Reset password" />
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-orange-500 shadow-lg mb-4">
                        <img src={chortleLogo} alt="Chortle" className="h-8 w-8 object-contain" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Reset password</h1>
                    <p className="text-sm text-gray-500 mt-1">Enter your new password below</p>
                </div>

                <Form {...update.form()} transform={(data) => ({ ...data, token, email })}
                    resetOnSuccess={['password', 'password_confirmation']}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                    {({ processing, errors }) => (
                        <>
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">Email</label>
                                <input type="email" name="email" value={email} readOnly autoComplete="email"
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-100 text-gray-500 cursor-not-allowed" />
                                <InputError message={errors.email} />
                            </div>

                            <div className="space-y-1.5">
                                <label htmlFor="password" className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">New Password</label>
                                <div className="relative">
                                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input type={showPassword ? 'text' : 'password'} id="password" name="password"
                                        required autoFocus autoComplete="new-password" placeholder="New password"
                                        className="w-full pl-10 pr-11 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-300 transition bg-gray-50 focus:bg-white" />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                </div>
                                <InputError message={errors.password} />
                            </div>

                            <div className="space-y-1.5">
                                <label htmlFor="password_confirmation" className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">Confirm Password</label>
                                <div className="relative">
                                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input type={showConfirm ? 'text' : 'password'} id="password_confirmation" name="password_confirmation"
                                        required autoComplete="new-password" placeholder="Confirm password"
                                        className="w-full pl-10 pr-11 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-300 transition bg-gray-50 focus:bg-white" />
                                    <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                                        {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                </div>
                                <InputError message={errors.password_confirmation} />
                            </div>

                            <button type="submit" disabled={processing} data-test="reset-password-button"
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-xl text-sm font-semibold transition-all hover:shadow-md active:scale-[.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2">
                                {processing ? <><Loader2 size={16} className="animate-spin" /> Resetting...</> : 'Reset password'}
                            </button>
                        </>
                    )}
                </Form>
            </div>
        </div>
    );
}
