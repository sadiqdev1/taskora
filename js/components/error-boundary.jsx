import { Component } from 'react';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { Link } from '@inertiajs/react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        
        // Log to error reporting service (e.g., Sentry)
        console.error('Error caught by boundary:', error, errorInfo);
        
        // You can send to your error logging service here
        // Example: Sentry.captureException(error, { extra: errorInfo });
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex items-center justify-center p-4">
                    <div className="max-w-md w-full">
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-xl p-8 text-center">
                            {/* Icon */}
                            <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                                <AlertTriangle size={32} className="text-red-500" />
                            </div>

                            {/* Title */}
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                Oops! Something went wrong
                            </h1>

                            {/* Description */}
                            <p className="text-sm text-gray-600 dark:text-zinc-400 mb-6">
                                We encountered an unexpected error. Don't worry, our team has been notified and we're working on it.
                            </p>

                            {/* Error details (only in development) */}
                            {import.meta.env.DEV && this.state.error && (
                                <div className="mb-6 p-4 bg-gray-50 dark:bg-zinc-800 rounded-xl text-left">
                                    <p className="text-xs font-mono text-red-600 dark:text-red-400 break-all">
                                        {this.state.error.toString()}
                                    </p>
                                    {this.state.errorInfo && (
                                        <details className="mt-2">
                                            <summary className="text-xs text-gray-500 dark:text-zinc-500 cursor-pointer">
                                                Stack trace
                                            </summary>
                                            <pre className="text-xs text-gray-600 dark:text-zinc-400 mt-2 overflow-auto max-h-40">
                                                {this.state.errorInfo.componentStack}
                                            </pre>
                                        </details>
                                    )}
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button
                                    onClick={this.handleReset}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold text-sm transition-all"
                                >
                                    <RefreshCw size={16} />
                                    Reload Page
                                </button>
                                <Link
                                    href="/"
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-200 rounded-xl font-semibold text-sm transition-all"
                                >
                                    <Home size={16} />
                                    Go Home
                                </Link>
                            </div>

                            {/* Help text */}
                            <p className="text-xs text-gray-400 dark:text-zinc-600 mt-6">
                                If this problem persists, please{' '}
                                <Link href="/help" className="text-orange-500 hover:text-orange-600 font-medium">
                                    contact support
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
