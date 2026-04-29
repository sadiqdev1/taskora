import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../css/app.css';
import 'remixicon/fonts/remixicon.css';
import { initializeTheme } from './hooks/use-appearance';
import ErrorBoundary from './components/error-boundary';
import './echo'; // Initialize Laravel Echo

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Get progress bar color based on theme
const getProgressBarColor = () => {
    if (typeof document === 'undefined') return '#f97316'; // orange-500
    const isDark = document.documentElement.classList.contains('dark');
    return isDark ? '#f97316' : '#ea580c'; // orange-500 for dark, orange-600 for light
};

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) => resolvePageComponent(`./pages/${name}.jsx`, import.meta.glob('./pages/**/*.jsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <StrictMode>
                <ErrorBoundary>
                    <App {...props}/>
                </ErrorBoundary>
            </StrictMode>
        );
    },
    progress: {
        color: getProgressBarColor(),
        showSpinner: false,
    },
});

// This will set dark mode on load...
initializeTheme();