"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import MainLayout from './MainLayout';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();

  // Routes that should be full page (no sidebar/header)
  const fullPageRoutes = ['/auth', '/forgot_password', '/onboarding'];
  const isFullPage = fullPageRoutes.some(route => pathname.startsWith(route)) || 
                    pathname.includes('/quiz/') || 
                    pathname.includes('/result/') ||
                    pathname === '/';

  // Routes that should show the sidebar
  const sidebarRoutes = ['/generator', '/flowchart', '/flashcard','/summariser', '/profile', '/history', '/translator'];
  const shouldShowLayout = sidebarRoutes.some(route => pathname.startsWith(route));

  // If it's a full page route, just render children
  if (isFullPage) {
    return <>{children}</>;
  }

  // If it should show the layout, use MainLayout
  if (shouldShowLayout) {
    return <MainLayout>{children}</MainLayout>;
  }

  // For other routes, just render children
  return <>{children}</>;
}