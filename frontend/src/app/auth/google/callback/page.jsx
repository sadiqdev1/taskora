'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { setToken } from '@/lib/auth';
import { apiGet, apiPost } from '@/lib/api';
import Loader from '@/components/Loader';

/* ── Inner component needs Suspense because it uses useSearchParams ── */
function OAuthHandler() {
  const router      = useRouter();
  const params      = useSearchParams();
  const { setUser } = useAuth();

  useEffect(() => {
    const code  = params.get('code');
    const error = params.get('error');

    if (error || !code) {
      router.replace('/login?error=' + (error ?? 'oauth_failed'));
      return;
    }

    // Exchange the one-time code for a real token.
    // The token never touches the URL — only the short-lived code does.
    apiPost('/auth/google/exchange', { code })
      .then(async ({ token, user }) => {
        setToken(token);
        setUser(user);

        if (user.role === 'admin') {
          router.replace('/admin');
          return;
        }

        // Check onboarding status for non-admin users
        try {
          const onboardingData = await apiGet('/onboarding');
          if (!onboardingData?.onboarding?.completed_at) {
            router.replace('/onboarding');
            return;
          }
        } catch { /* can't check — go to dashboard */ }

        router.replace('/dashboard');
      })
      .catch(() => {
        router.replace('/login?error=oauth_failed');
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Loader fullscreen message="Signing you in with Google…" />;
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={<Loader fullscreen message="Signing you in with Google…" />}>
      <OAuthHandler />
    </Suspense>
  );
}
