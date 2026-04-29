import { useCallback, useMemo, useSyncExternalStore } from 'react';

const listeners = new Set();
let currentAppearance = 'dark';

const prefersDark = () => {
    if (typeof window === 'undefined')
        return false;

    return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const setCookie = (name, value, days = 365) => {
    if (typeof document === 'undefined')
        return;
    const maxAge = days * 24 * 60 * 60;
    document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
};

const getStoredAppearance = () => {
    if (typeof window === 'undefined')
        return 'dark';

    return localStorage.getItem('appearance') || 'dark';
};

const isDarkMode = (appearance) => {
    return appearance === 'dark' || (appearance === 'system' && prefersDark());
};

const applyTheme = (appearance) => {
    if (typeof document === 'undefined')
        return;

    const isDark = isDarkMode(appearance);

    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
};

const subscribe = (callback) => {
    listeners.add(callback);

    return () => listeners.delete(callback);
};

const notify = () => listeners.forEach((listener) => listener());

const mediaQuery = () => {
    if (typeof window === 'undefined')
        return null;

    return window.matchMedia('(prefers-color-scheme: dark)');
};

const handleSystemThemeChange = () => applyTheme(currentAppearance);

export function initializeTheme() {
    if (typeof window === 'undefined')
        return;

    // Default to 'dark' mode for better user experience
    if (!localStorage.getItem('appearance')) {
        localStorage.setItem('appearance', 'dark');
        setCookie('appearance', 'dark');
    }

    currentAppearance = getStoredAppearance();
    applyTheme(currentAppearance);

    // Set up system theme change listener
    mediaQuery()?.addEventListener('change', handleSystemThemeChange);
}

export function useAppearance() {
    const appearance = useSyncExternalStore(subscribe, () => currentAppearance, () => 'dark');

    const resolvedAppearance = useMemo(() => (isDarkMode(appearance) ? 'dark' : 'light'), [appearance]);

    const updateAppearance = useCallback((mode) => {
        currentAppearance = mode;

        // Store in localStorage for client-side persistence...
        localStorage.setItem('appearance', mode);

        // Store in cookie for SSR...
        setCookie('appearance', mode);

        applyTheme(mode);
        notify();
    }, []);

    return { appearance, resolvedAppearance, updateAppearance };
}

