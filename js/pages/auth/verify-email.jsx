import { Form, Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { Loader2, Mail } from 'lucide-react';
import { logout } from '@/routes';
import { send } from '@/routes/verification';
import chortleLogo from '@/src/assets/chortle-logo.svg';

export default function VerifyEmail({ status }) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Head title="Email verification" />
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-orange-500 shadow-lg mb-4">
                        <Mail size={28} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Verify your email</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Please verify your email address by clicking the link we sent you.
                    </p>
                </div>

                {status === 'verification-link-sent' && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-center text-sm font-medium text-green-700">
                        A new verification link has been sent to your email address.
                    </div>
                )}

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4 text-center">
                    <Form {...send.form()}>
                        {({ processing }) => (
                            <button type="submit" disabled={processing}
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-xl text-sm font-semibold transition-all hover:shadow-md active:scale-[.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                {processing ? <><Loader2 size={16} className="animate-spin" /> Sending...</> : 'Resend verification email'}
                            </button>
                        )}
                    </Form>

                    <Link href={logout()} method="post" as="button"
                        className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
                        Sign out
                    </Link>
                </div>
            </div>
        </div>
    );
}
