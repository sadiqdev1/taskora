import { Form, Head } from '@inertiajs/react';
import { Check, Eye, EyeOff, Loader2, Lock, Mail, User, X, AlertCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { login } from '@/routes';
import { store } from '@/routes/register';
import chortleLogo from '@/src/assets/chortle-logo.svg';

const getStrength = (pwd) => {
    if (!pwd) return 0;
    let s = 0;
    if (pwd.length >= 8) s++;
    if (/[A-Z]/.test(pwd)) s++;
    if (/[0-9]/.test(pwd)) s++;
    if (/[^A-Za-z0-9]/.test(pwd)) s++;
    return s;
};
const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const strengthColor = ['', 'bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
const strengthText  = ['', 'text-red-500', 'text-yellow-500', 'text-blue-500', 'text-green-500'];

const inputCls = "w-full py-2.5 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-300 transition bg-gray-50 dark:bg-zinc-800 focus:bg-white dark:focus:bg-zinc-700";

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const GoogleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
);

const GitHubIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
);

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [usernameStatus, setUsernameStatus] = useState('idle');
    const usernameTimer = useRef(null);
    const [email, setEmail] = useState('');
    const [emailStatus, setEmailStatus] = useState('idle');
    const emailTimer = useRef(null);
    const strength = getStrength(password);

    useEffect(() => {
        if (!username || username.length < 3) { setUsernameStatus('idle'); return; }
        if (!/^[a-zA-Z0-9_]+$/.test(username)) { setUsernameStatus('invalid'); return; }
        clearTimeout(usernameTimer.current);
        setUsernameStatus('checking');
        usernameTimer.current = setTimeout(async () => {
            try {
                const res = await fetch(`/api/check-username/${username}`);
                const data = await res.json();
                setUsernameStatus(data.available ? 'available' : 'taken');
            } catch { setUsernameStatus('idle'); }
        }, 500);
        return () => clearTimeout(usernameTimer.current);
    }, [username]);

    useEffect(() => {
        if (!email || email.length < 5) { setEmailStatus('idle'); return; }
        if (!isValidEmail(email)) { setEmailStatus('invalid'); return; }
        clearTimeout(emailTimer.current);
        setEmailStatus('checking');
        emailTimer.current = setTimeout(async () => {
            try {
                const res = await fetch(`/api/check-email/${encodeURIComponent(email)}`);
                const data = await res.json();
                setEmailStatus(data.available ? 'available' : 'taken');
            } catch { setEmailStatus('idle'); }
        }, 500);
        return () => clearTimeout(emailTimer.current);
    }, [email]);

    const statusIcon = (s) => {
        if (s === 'checking') return <Loader2 size={14} className="animate-spin text-gray-400" />;
        if (s === 'available') return <Check size={14} className="text-green-500" />;
        if (s === 'taken') return <X size={14} className="text-red-500" />;
        if (s === 'invalid') return <AlertCircle size={14} className="text-orange-500" />;
        return null;
    };

    const isSubmitDisabled = (processing) =>
        processing ||
        ['taken','invalid','checking'].includes(usernameStatus) ||
        ['taken','checking'].includes(emailStatus);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex items-center justify-center p-4 py-8">
            <Head title="Create account" />
            <div className="w-full max-w-sm">

                {/* Logo + heading */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-orange-500 shadow-lg shadow-orange-500/30 mb-4">
                        <img src={chortleLogo} alt="Chortle" className="h-7 w-7 object-contain" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Create account</h1>
                    <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">Join the Chortle community</p>
                </div>

                {/* Single unified card */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">

                    {/* OAuth section */}
                    <div className="p-5 space-y-2.5">
                        <a href="/auth/google"
                            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-sm font-medium text-gray-700 dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600 transition-all active:scale-[.98]">
                            <GoogleIcon />
                            Continue with Google
                        </a>
                        <a href="/auth/github"
                            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-sm font-medium text-gray-700 dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600 transition-all active:scale-[.98]">
                            <GitHubIcon />
                            Continue with GitHub
                        </a>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-3 px-5">
                        <div className="flex-1 h-px bg-gray-100 dark:bg-zinc-800" />
                        <span className="text-[11px] text-gray-400 dark:text-zinc-500 font-medium uppercase tracking-wider">or</span>
                        <div className="flex-1 h-px bg-gray-100 dark:bg-zinc-800" />
                    </div>

                    {/* Email form */}
                    <Form {...store.form()} resetOnSuccess={['password', 'password_confirmation']} disableWhileProcessing
                        className="p-5 pt-4 space-y-3.5">
                        {({ processing, errors }) => (
                            <>
                                {/* Name */}
                                <div className="space-y-1">
                                    <label htmlFor="name" className="block text-xs font-semibold text-gray-600 dark:text-zinc-400">Full Name</label>
                                    <div className="relative">
                                        <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500 pointer-events-none" />
                                        <input type="text" id="name" name="name" required autoFocus autoComplete="name"
                                            placeholder="John Doe" className={`${inputCls} pl-10 pr-4`} />
                                    </div>
                                    <InputError message={errors.name} />
                                </div>

                                {/* Username */}
                                <div className="space-y-1">
                                    <label htmlFor="username" className="block text-xs font-semibold text-gray-600 dark:text-zinc-400">Username</label>
                                    <div className="relative">
                                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500 text-sm pointer-events-none">@</span>
                                        <input type="text" id="username" name="username" required autoComplete="username"
                                            placeholder="johndoe" value={username}
                                            onChange={(e) => setUsername(e.target.value.toLowerCase())}
                                            className={`${inputCls} pl-8 pr-9`} />
                                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2">{statusIcon(usernameStatus)}</div>
                                    </div>
                                    {usernameStatus === 'available' && <p className="text-xs text-green-600 dark:text-green-400">Username available</p>}
                                    {usernameStatus === 'taken'     && <p className="text-xs text-red-500">Username already taken</p>}
                                    {usernameStatus === 'invalid'   && <p className="text-xs text-orange-500">Letters, numbers, underscores only</p>}
                                    <InputError message={errors.username} />
                                </div>

                                {/* Email */}
                                <div className="space-y-1">
                                    <label htmlFor="email" className="block text-xs font-semibold text-gray-600 dark:text-zinc-400">Email</label>
                                    <div className="relative">
                                        <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500 pointer-events-none" />
                                        <input type="email" id="email" name="email" required autoComplete="email"
                                            placeholder="you@example.com" value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className={`${inputCls} pl-10 pr-9`} />
                                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2">{statusIcon(emailStatus)}</div>
                                    </div>
                                    {emailStatus === 'available' && <p className="text-xs text-green-600 dark:text-green-400">Email available</p>}
                                    {emailStatus === 'taken'     && <p className="text-xs text-red-500">Email already registered</p>}
                                    {emailStatus === 'invalid'   && <p className="text-xs text-orange-500">Enter a valid email address</p>}
                                    <InputError message={errors.email} />
                                </div>

                                {/* Password */}
                                <div className="space-y-1">
                                    <label htmlFor="password" className="block text-xs font-semibold text-gray-600 dark:text-zinc-400">Password</label>
                                    <div className="relative">
                                        <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500 pointer-events-none" />
                                        <input type={showPassword ? 'text' : 'password'} id="password" name="password"
                                            required autoComplete="new-password" placeholder="••••••••"
                                            value={password} onChange={(e) => setPassword(e.target.value)}
                                            className={`${inputCls} pl-10 pr-11`} />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 transition">
                                            {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                                        </button>
                                    </div>
                                    {password && (
                                        <div className="space-y-1 pt-0.5">
                                            <div className="flex gap-1">
                                                {[1,2,3,4].map((i) => (
                                                    <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${strength >= i ? strengthColor[strength] : 'bg-gray-200 dark:bg-zinc-700'}`} />
                                                ))}
                                            </div>
                                            <p className={`text-xs font-medium ${strengthText[strength]}`}>{strengthLabel[strength]}</p>
                                        </div>
                                    )}
                                    <InputError message={errors.password} />
                                </div>

                                {/* Confirm Password */}
                                <div className="space-y-1">
                                    <label htmlFor="password_confirmation" className="block text-xs font-semibold text-gray-600 dark:text-zinc-400">Confirm Password</label>
                                    <div className="relative">
                                        <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500 pointer-events-none" />
                                        <input type={showConfirm ? 'text' : 'password'} id="password_confirmation" name="password_confirmation"
                                            required autoComplete="new-password" placeholder="••••••••"
                                            className={`${inputCls} pl-10 pr-11`} />
                                        <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 transition">
                                            {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                                        </button>
                                    </div>
                                    <InputError message={errors.password_confirmation} />
                                </div>

                                <button type="submit" disabled={isSubmitDisabled(processing)} data-test="register-user-button"
                                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-xl text-sm font-semibold transition-all hover:shadow-md hover:shadow-orange-500/25 active:scale-[.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-1">
                                    {processing ? <><Loader2 size={16} className="animate-spin" /> Creating account...</> : 'Create account'}
                                </button>
                            </>
                        )}
                    </Form>
                </div>

                {/* Footer link */}
                <p className="text-xs text-gray-500 dark:text-zinc-400 text-center mt-4">
                    Already have an account?{' '}
                    <Link href={login()} className="text-orange-500 hover:text-orange-600 font-semibold transition-colors">Sign in</Link>
                </p>
            </div>
        </div>
    );
}
