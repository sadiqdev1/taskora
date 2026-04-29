import { Form, Head } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { Check, Eye, EyeOff, Loader2, Lock, Shield } from 'lucide-react';
import { useRef, useState } from 'react';
import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import PasswordController from '@/actions/App/Http/Controllers/Settings/PasswordController';
import { edit } from '@/routes/user-password';

const breadcrumbs = [{ title: 'Password settings', href: edit().url }];

function PasswordField({ id, name, label, placeholder, autoComplete, inputRef }) {
    const [show, setShow] = useState(false);
    return (
        <div className="space-y-1.5">
            <label htmlFor={id} className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 uppercase tracking-wide">{label}</label>
            <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500" />
                <input ref={inputRef} id={id} name={name} type={show ? 'text' : 'password'}
                    autoComplete={autoComplete} placeholder={placeholder}
                    className="w-full pl-10 pr-11 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-300 transition bg-gray-100 dark:bg-zinc-800 focus:bg-gray-50 dark:focus:bg-zinc-700" />
                <button type="button" onClick={() => setShow(!show)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 transition">
                    {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
            </div>
        </div>
    );
}

export default function Password() {
    const passwordInput = useRef(null);
    const currentPasswordInput = useRef(null);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Password settings" />
            <SettingsLayout>
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">
                    <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-zinc-800">
                        <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center">
                            <Shield size={16} className="text-orange-500" />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Update password</h2>
                            <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">Use a long, random password to stay secure</p>
                        </div>
                    </div>

                    <Form {...PasswordController.update.form()} options={{ preserveScroll: true }}
                        resetOnError={['password', 'password_confirmation', 'current_password']}
                        resetOnSuccess
                        onError={(errors) => {
                            if (errors.password) passwordInput.current?.focus();
                            if (errors.current_password) currentPasswordInput.current?.focus();
                        }}
                        className="px-5 py-5 space-y-4">
                        {({ errors, processing, recentlySuccessful }) => (
                            <>
                                <PasswordField id="current_password" name="current_password" label="Current password"
                                    placeholder="Current password" autoComplete="current-password" inputRef={currentPasswordInput} />
                                <InputError message={errors.current_password} />
                                <PasswordField id="password" name="password" label="New password"
                                    placeholder="New password" autoComplete="new-password" inputRef={passwordInput} />
                                <InputError message={errors.password} />
                                <PasswordField id="password_confirmation" name="password_confirmation" label="Confirm password"
                                    placeholder="Confirm new password" autoComplete="new-password" />
                                <InputError message={errors.password_confirmation} />

                                <div className="flex items-center gap-3 pt-1">
                                    <button type="submit" disabled={processing} data-test="update-password-button"
                                        className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-sm font-semibold transition-all flex items-center gap-2 disabled:opacity-50">
                                        {processing && <Loader2 size={14} className="animate-spin" />}
                                        Update password
                                    </button>
                                    <Transition show={recentlySuccessful} enter="transition ease-in-out" enterFrom="opacity-0" leave="transition ease-in-out" leaveTo="opacity-0">
                                        <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
                                            <Check size={14} /> Saved
                                        </span>
                                    </Transition>
                                </div>
                            </>
                        )}
                    </Form>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
