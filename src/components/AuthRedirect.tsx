"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export function AuthRedirect({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('AuthRedirect - User:', user?.id, 'Loading:', isLoading, 'Path:', pathname);
    }
    // Only redirect if user is authenticated and on auth page
    if (user && !isLoading && pathname === '/auth') {
      if (process.env.NODE_ENV === 'development') {
      console.log('AuthRedirect - User on auth page, checking onboarding status:', user.onboarding_completed);
      }
      // Check if user has completed onboarding
      if (user.onboarding_completed) {
        if (process.env.NODE_ENV === 'development') {
          console.log('AuthRedirect - User has completed onboarding');
        }
        console.log('AuthRedirect - Redirecting to home');
        router.push('/home');
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.log('AuthRedirect - User has not completed onboarding');
        }
        console.log('AuthRedirect - Redirecting to onboarding');
        router.push('/onboarding');
      }
    }
  }, [user, isLoading, pathname, router]);

  return <>{children}</>;
}

export default AuthRedirect;
