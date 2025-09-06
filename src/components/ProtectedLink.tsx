"use client";

import React from 'react';
// import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuiz } from '@/contexts/QuizContext';

interface ProtectedLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const ProtectedLink: React.FC<ProtectedLinkProps> = ({ href, children, className, onClick }) => {
  const { isQuizInProgress, showNavigationWarning } = useQuiz();
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (onClick) {
      onClick();
    }

    if (isQuizInProgress) {
      showNavigationWarning(() => {
        router.push(href);
      });
    } else {
      router.push(href);
    }
  };

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
};

export default ProtectedLink;
