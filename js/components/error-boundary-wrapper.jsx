import React from 'react';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        
        // Log to console in development
        if (import.meta.env.DEV) {
            console.error('Error caught by boundary:', error, errorInfo);
        }
        
        // You can also log to an error reporting service here
        // logErrorToService(error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    render() {
        if (this.state.hasError) {
            const { fallback, showDetails = false } = this.props;
            
            // Use custom fallback if provided
            if (fallback) {
                return typeof fallback === 'function' 
                    ? fallback(this.state.error, this.handleReset)
                    : fallback;
            }

            // Default error UI
            return (
                <div className="min-h-[400px] flex items-center justify-center p-6">
                    <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-lg p-8 text-center">
                        <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle size={32} className="text-red-500" />
                        </div>
                        
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            Something went wrong
                        </h2>
                        
                        <p className="text-sm text-gray-500 dark:text-zinc-400 mb-6">
                            We're sorry, but something unexpected happened. Please try refreshing the page.
                        </p>

                        {showDetails && this.state.error && (
                            <details className="text-left mb-6 p-4 bg-gray-50 dark:bg-zinc-800 rounded-xl">
                                <summary className="text-xs font-semibold text-gray-700 dark:text-zinc-300 cursor-pointer mb-2">
                                    Error Details
                                </summary>
                                <pre className="text-xs text-red-600 dark:text-red-400 overflow-auto max-h-40">
                                    {this.state.error.toString()}
                                    {this.state.errorInfo?.componentStack}
                                </pre>
                            </details>
                        )}

                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={this.handleReset}
                                className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-all shadow-sm"
                            >
                                <RefreshCw size={14} />
                                Try Again
                            </button>
                            
                            <a
                                href="/"
                                className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 text-sm font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all"
                            >
                                <Home size={14} />
                                Go Home
                            </a>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
