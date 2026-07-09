'use client';
import { Component } from 'react';
import Link from 'next/link';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Only log in development — swap for Sentry or similar in production
    if (process.env.NODE_ENV !== 'production') {
      console.error('ErrorBoundary caught:', error, info);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
          style={{ background: 'var(--bg)' }}
        >
          <div className="w-16 h-16 rounded-2xl bg-[#FFE0E0] flex items-center justify-center text-3xl mb-4">
            ⚠️
          </div>
          <h1 className="font-black text-2xl mb-2" style={{ color: 'var(--text)' }}>
            Something went wrong
          </h1>
          <p className="text-sm mb-6 max-w-sm" style={{ color: 'var(--text-secondary)' }}>
            An unexpected error occurred. Try refreshing the page.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="bg-[#6C5CE7] hover:bg-[#5A4BD1] px-6 py-2.5 rounded-xl text-white text-sm font-bold transition-colors"
            >
              Try again
            </button>
            <Link
              href="/dashboard"
              className="px-6 py-2.5 rounded-xl text-sm font-semibold border border-[var(--border)] hover:bg-[var(--bg)] transition-colors no-underline"
              style={{ color: 'var(--text-secondary)' }}
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
