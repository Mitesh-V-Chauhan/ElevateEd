"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export function OnboardingCheck({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user || isLoading) return;
    
    // Skip check for certain routes
    const skipRoutes = ['/auth', '/forgot_password', '/', '/about', '/features', '/privacy', '/terms', '/help', '/cancellation'];
    if (skipRoutes.includes(pathname)) return;

    if (process.env.NODE_ENV === 'development') {
    console.log('OnboardingCheck - User data:', user);
    console.log('OnboardingCheck - Onboarding completed:', user.onboarding_completed);
    console.log('OnboardingCheck - Current pathname:', pathname);
    }
    
    // If user is on onboarding page but has already completed it, redirect to home
    if (pathname === '/onboarding' && user.onboarding_completed) {
      if (process.env.NODE_ENV === 'development') {
        console.log('OnboardingCheck - User already completed onboarding, redirecting to home...');
      }
      router.push('/home');
      return;
    }
    
    // If user hasn't completed onboarding and is not on onboarding page, redirect to onboarding
    if (!user.onboarding_completed && pathname !== '/onboarding') {
      if (process.env.NODE_ENV === 'development') {
      console.log('OnboardingCheck - User has not completed onboarding, redirecting to onboarding...');
      }
      router.push('/onboarding');
      return;
    }
  }, [user, isLoading, pathname, router]);

  return <>{children}</>;
}

export default OnboardingCheck;
