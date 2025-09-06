"use client"

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();

  // console.log('ThemeToggle: Current theme is:', theme);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    // console.log('ThemeToggle: Toggling from', theme, 'to', newTheme);
    setTheme(newTheme);
  };

  // const handleClick = (e: React.MouseEvent) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   // console.log('ThemeToggle: Button clicked!');
  //   toggleTheme();
  // };

  return (
    <button
      onClick={toggleTheme}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 dark:bg-zinc-800/50 backdrop-blur-sm border border-white/20 dark:border-zinc-700 hover:bg-white/20 dark:hover:bg-zinc-700/50 transition-all duration-200 ${className}`}
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
      <span className="hidden sm:inline text-sm font-['SF-Pro-Display-Regular']">
        {theme === 'dark' ? 'Light' : 'Dark'}
      </span>
    </button>
  );
}
