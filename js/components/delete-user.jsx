import { Form } from '@inertiajs/react';
import { AlertTriangle, Loader2, Trash2 } from 'lucide-react';
import { useRef, useState } from 'react';
import InputError from '@/components/input-error';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';

export default function DeleteUser() {
    const passwordInput = useRef(null);
    const [open, setOpen] = useState(false);

    return (
        <div className="space-y-4">
            <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Delete account</p>
                <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
                    Permanently delete your account and all associated data.
                </p>
            </div>

            <div className="rounded-xl border border-red-100 dark:border-red-500/20 bg-red-50 dark:bg-red-500/5 p-4 space-y-3">
                <div className="flex items-start gap-2 text-red-600 dark:text-red-400">
                    <AlertTriangle size={15} className="flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium">Warning</p>
                        <p className="text-xs mt-0.5 text-red-500 dark:text-red-400/80">
                            This action cannot be undone. All your memes, comments, and data will be permanently removed.
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-full transition-all active:scale-[.97]">
                    <Trash2 size={14} /> Delete account
                </button>
            </div>

            {/* Confirmation modal */}
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
                    <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-2xl p-6"
                        onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center flex-shrink-0">
                                <Trash2 size={18} className="text-red-500" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Delete your account?</h3>
                                <p className="text-xs text-gray-500 dark:text-zinc-400">This cannot be undone.</p>
                            </div>
                        </div>

                        <p className="text-sm text-gray-600 dark:text-zinc-300 mb-5">
                            All your memes, comments, followers, and data will be permanently deleted.
                            Enter your password to confirm.
                        </p>

                        <Form
                            {...ProfileController.destroy.form()}
                            options={{ preserveScroll: true }}
                            onError={() => passwordInput.current?.focus()}
                            resetOnSuccess
                            className="space-y-4">
                            {({ resetAndClearErrors, processing, errors }) => (
                                <>
                                    <div className="space-y-1">
                                        <label htmlFor="del-password" className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 uppercase tracking-wide">
                                            Password
                                        </label>
                                        <input
                                            id="del-password"
                                            type="password"
                                            name="password"
                                            ref={passwordInput}
                                            placeholder="Enter your password"
                                            autoComplete="current-password"
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-400/40 focus:border-red-300 transition"
                                        />
                                        <InputError message={errors.password} />
                                    </div>

                                    <div className="flex items-center gap-3 pt-1">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-full transition-all disabled:opacity-50">
                                            {processing
                                                ? <Loader2 size={14} className="animate-spin" />
                                                : <Trash2 size={14} />}
                                            Confirm delete
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => { resetAndClearErrors(); setOpen(false); }}
                                            className="px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition">
                                            Cancel
                                        </button>
                                    </div>
                                </>
                            )}
                        </Form>
                    </div>
                </div>
            )}
        </div>
    );
}
