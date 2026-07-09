'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { apiGet } from '@/lib/api';
import Loader from '@/components/Loader';
import OnboardingWizard from '@/components/OnboardingWizard';

export default function OnboardingPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    // Not logged in — send to login
    if (!user) {
      router.replace('/login');
      return;
    }

    // Admin users skip onboarding
    if (user.role === 'admin') {
      router.replace('/admin');
      return;
    }

    // Check if already onboarded via the backend
    apiGet('/onboarding')
      .then(data => {
        if (data?.onboarding?.completed_at) {
          // Already completed — redirect to dashboard
          router.replace('/dashboard');
        } else {
          setChecking(false);
        }
      })
      .catch(() => {
        // Can't check — just show the wizard anyway
        setChecking(false);
      });
  }, [user, authLoading, router]);

  if (authLoading || checking) return <Loader fullscreen />;

  return (
    <OnboardingWizard
      onComplete={() => router.replace('/dashboard')}
      standalone
    />
  );
}
