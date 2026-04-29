import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { Check, Loader2, Mail, Trash2, User } from 'lucide-react';
import InputError from '@/components/input-error';
import DeleteUser from '@/components/delete-user';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const inputCls = "w-full px-4 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-300 transition bg-gray-50 dark:bg-zinc-800 focus:bg-white dark:focus:bg-zinc-700";

export default function Profile({ mustVerifyEmail, status }) {
    const { auth } = usePage().props;
    const user = auth.user;

    const avatarUrl = user.avatar_url ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=f97316&color=fff&size=120`;

    const { data, setData, patch, processing, recentlySuccessful, errors } = useForm({
        name:  user.name  ?? '',
        email: user.email ?? '',
    });

    const submit = (e) => {
        e.preventDefault();
        patch('/settings/profile', { preserveScroll: true });
    };

    return (
        <AppLayout>
            <Head title="Profile settings" />
            <SettingsLayout>
                <div className="space-y-6">

                    {/* Avatar card */}
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">
                        <div className="h-20 bg-gradient-to-r from-orange-400 to-pink-500" />
                        <div className="px-5 pb-5">
                            <div className="flex items-end justify-between -mt-8 mb-4">
                                <img src={avatarUrl} alt={user.name}
                                    className="w-16 h-16 rounded-2xl border-4 border-white dark:border-zinc-900 shadow-md object-cover" />
                            </div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{user.name}</p>
                            <p className="text-xs text-gray-400 dark:text-zinc-500">{user.email}</p>
                        </div>
                    </div>

                    {/* Profile form */}
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">
                        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-zinc-800">
                            <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center">
                                <User size={16} className="text-orange-500" />
                            </div>
                            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Profile information</h2>
                        </div>

                        <form onSubmit={submit} className="px-5 py-5 space-y-4">
                            <div className="space-y-1.5">
                                <label htmlFor="name" className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 uppercase tracking-wide">
                                    Display name
                                </label>
                                <div className="relative">
                                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500 pointer-events-none" />
                                    <input id="name" type="text" autoComplete="name" required
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Your name"
                                        className={`${inputCls} pl-10`} />
                                </div>
                                <InputError message={errors.name} />
                            </div>

                            <div className="space-y-1.5">
                                <label htmlFor="email" className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 uppercase tracking-wide">
                                    Email address
                                </label>
                                <div className="relative">
                                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500 pointer-events-none" />
                                    <input id="email" type="email" autoComplete="email" required
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="you@example.com"
                                        className={`${inputCls} pl-10`} />
                                </div>
                                <InputError message={errors.email} />
                            </div>

                            {mustVerifyEmail && user.email_verified_at === null && (
                                <div className="p-3 bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/30 rounded-xl text-sm text-yellow-700 dark:text-yellow-400">
                                    Your email is unverified.{' '}
                                    <Link href="/email/verification-notification" method="post" as="button"
                                        className="font-semibold underline hover:text-yellow-800 dark:hover:text-yellow-300">
                                        Resend verification email
                                    </Link>
                                </div>
                            )}

                            {status === 'profile-updated' && (
                                <div className="p-3 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 rounded-xl text-sm text-green-700 dark:text-green-400">
                                    Profile updated successfully.
                                </div>
                            )}

                            <div className="flex items-center gap-3 pt-1">
                                <button type="submit" disabled={processing}
                                    className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-sm font-semibold transition-all flex items-center gap-2 disabled:opacity-50 active:scale-[.97]">
                                    {processing && <Loader2 size={14} className="animate-spin" />}
                                    Save changes
                                </button>
                                <Transition show={recentlySuccessful}
                                    enter="transition ease-in-out duration-300" enterFrom="opacity-0"
                                    leave="transition ease-in-out duration-300" leaveTo="opacity-0">
                                    <span className="flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400 font-medium">
                                        <Check size={14} /> Saved
                                    </span>
                                </Transition>
                            </div>
                        </form>
                    </div>

                    {/* Danger zone */}
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-red-100 dark:border-red-500/20 shadow-sm overflow-hidden">
                        <div className="flex items-center gap-3 px-5 py-4 border-b border-red-100 dark:border-red-500/20">
                            <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
                                <Trash2 size={16} className="text-red-500" />
                            </div>
                            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Danger zone</h2>
                        </div>
                        <div className="px-5 py-5">
                            <DeleteUser />
                        </div>
                    </div>

                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
