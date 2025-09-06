"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export function AuthRedirect({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    console.log('AuthRedirect - User:', user?.id, 'Loading:', isLoading, 'Path:', pathname);
    // Only redirect if user is authenticated and on auth page
    if (user && !isLoading && pathname === '/auth') {
      console.log('AuthRedirect - User on auth page, checking onboarding status:', user.onboarding_completed);
      // Check if user has completed onboarding
      if (user.onboarding_completed) {
        console.log('AuthRedirect - Redirecting to home');
        router.push('/home');
      } else {
        console.log('AuthRedirect - Redirecting to onboarding');
        router.push('/onboarding');
      }
    }
  }, [user, isLoading, pathname, router]);

  return <>{children}</>;
}

export default AuthRedirect;
