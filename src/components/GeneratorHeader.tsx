'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { User, LogOut, ChevronDown } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { useQuiz } from '@/contexts/QuizContext';
import ProtectedLink from '@/components/ProtectedLink';

// NOTE: This header assumes a responsive approach using Tailwind CSS.
// It is designed to work with both light and dark themes.

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isToolsMenuOpen, setIsToolsMenuOpen] = useState(false);
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  const { isQuizInProgress } = useQuiz();
  const darkMode = theme === 'dark';

  const handleLogout = async () => {
    try {
      await logout();
      setIsUserDropdownOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    // Header container with sticky position and backdrop blur for a frosted glass effect
    <header className={`border-b sticky top-0 z-50 transition-colors duration-300 backdrop-blur-sm ${darkMode ? 'bg-zinc-900/95 border-zinc-700' : 'bg-white/95 border-zinc-200'}`}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo - updated to redirect to appropriate page based on auth status */}
          {isQuizInProgress ? (
            <div className="flex items-center space-x-3">
              <h1 className="exo-2-brand text-[25px] bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent opacity-60">
                ElevateEd
              </h1>
              <span className="text-xs px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full">
                Quiz in Progress
              </span>
            </div>
          ) : (
            <ProtectedLink href={user ? "/home" : "/"} className="flex items-center space-x-3 group">
              <h1 className="exo-2-brand text-[25px] bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent transition-all duration-300 group-hover:from-purple-700 group-hover:via-pink-700 group-hover:to-orange-600">
                ElevateEd
              </h1>
            </ProtectedLink>
          )}

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <ProtectedLink href={user ? "/home" : "/"} className={`font-['SF-Pro-Display-Regular'] text-sm transition-all duration-300 hover:text-purple-500 ${isQuizInProgress ? 'opacity-50 cursor-not-allowed' : ''} ${darkMode ? 'text-zinc-300 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'}`}>
              Home
            </ProtectedLink>

            {/* Tools Dropdown for Desktop */}
            <div className="relative group">
              <button 
                className={`flex items-center space-x-1 focus:outline-none transition-all duration-300 hover:text-purple-500 ${isQuizInProgress ? 'opacity-50 cursor-not-allowed' : ''} ${darkMode ? 'text-zinc-300 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'}`}
                disabled={isQuizInProgress}
              >
                <span className="font-['SF-Pro-Display-Regular'] text-sm">Tools</span>
                <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
              </button>
              {/* Dropdown menu content with smooth transition effect */}
              <div className={`absolute left-0 mt-3 w-56 border rounded-xl shadow-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-out ${
                  darkMode ? 'bg-zinc-800/95 border-zinc-700 backdrop-blur-sm' : 'bg-white/95 border-zinc-200 backdrop-blur-sm'
                } ${isQuizInProgress ? 'pointer-events-none opacity-50' : ''}`}>
                  <div className="py-2">
                    <ProtectedLink
                      href="/summariser"
                      className={`block w-full text-left px-4 py-3 text-sm font-['SF-Pro-Display-Regular'] transition-all duration-200 ${
                        darkMode ? 'text-zinc-300 hover:text-white hover:bg-zinc-700/50' : 'text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50'
                      }`}
                    >
                      Summariser
                    </ProtectedLink>
                    <ProtectedLink
                      href="/translator"
                      className={`block w-full text-left px-4 py-3 text-sm font-['SF-Pro-Display-Regular'] transition-all duration-200 ${
                        darkMode ? 'text-zinc-300 hover:text-white hover:bg-zinc-700/50' : 'text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50'
                      }`}
                    >
                      Translator
                    </ProtectedLink>
                    <ProtectedLink
                      href="/generator"
                      className={`block w-full text-left px-4 py-3 text-sm font-['SF-Pro-Display-Regular'] transition-all duration-200 ${
                        darkMode ? 'text-zinc-300 hover:text-white hover:bg-zinc-700/50' : 'text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50'
                      }`}
                    >
                      Quiz Generator
                    </ProtectedLink>
                    <ProtectedLink
                      href="/flowchart"
                      className={`block w-full text-left px-4 py-3 text-sm font-['SF-Pro-Display-Regular'] transition-all duration-200 ${
                        darkMode ? 'text-zinc-300 hover:text-white hover:bg-zinc-700/50' : 'text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50'
                      }`}
                    >
                      Flowchart Generator
                    </ProtectedLink>
                    <ProtectedLink
                      href="/flashcard"
                      className={`block w-full text-left px-4 py-3 text-sm font-['SF-Pro-Display-Regular'] transition-all duration-200 ${
                        darkMode ? 'text-zinc-300 hover:text-white hover:bg-zinc-700/50' : 'text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50'
                      }`}
                    >
                      Flashcard Generator
                    </ProtectedLink>
                  </div>
              </div>
            </div>

            <ProtectedLink href="/features" className={`font-['SF-Pro-Display-Regular'] text-sm transition-all duration-300 hover:text-purple-500 ${isQuizInProgress ? 'opacity-50 cursor-not-allowed' : ''} ${darkMode ? 'text-zinc-300 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'}`}>
              Features
            </ProtectedLink>
            <ProtectedLink href="/about" className={`font-['SF-Pro-Display-Regular'] text-sm transition-all duration-300 hover:text-purple-500 ${isQuizInProgress ? 'opacity-50 cursor-not-allowed' : ''} ${darkMode ? 'text-zinc-300 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'}`}>
              About
            </ProtectedLink>
            {user && (
              <ProtectedLink href="/profile" className={`font-['SF-Pro-Display-Regular'] text-sm transition-all duration-300 hover:text-purple-500 ${isQuizInProgress ? 'opacity-50 cursor-not-allowed' : ''} ${darkMode ? 'text-zinc-300 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'}`}>
                History
              </ProtectedLink>
            )}
            <ProtectedLink href="/help" className={`font-['SF-Pro-Display-Regular'] text-sm transition-all duration-300 hover:text-purple-500 ${isQuizInProgress ? 'opacity-50 cursor-not-allowed' : ''} ${darkMode ? 'text-zinc-300 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'}`}>
              Help
            </ProtectedLink>
            <div className="transform transition-all duration-300">
              <ThemeToggle />
            </div>
            
            {/* Conditional rendering based on authentication */}
            {user ? (
              /* User Dropdown for Desktop */
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className={`flex items-center space-x-2 transition-colors focus:outline-none ${darkMode ? 'text-zinc-300 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'}`}
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-sm">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-['SF-Pro-Display-Regular']">{user?.username || 'User'}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isUserDropdownOpen && (
                  <div className={`absolute right-0 mt-3 w-56 border rounded-xl shadow-xl overflow-hidden ${
                    darkMode ? 'bg-zinc-800/95 border-zinc-700 backdrop-blur-sm' : 'bg-white/95 border-zinc-200 backdrop-blur-sm'
                  }`}>
                    <div className={`px-4 py-4 border-b ${darkMode ? 'border-zinc-700' : 'border-zinc-200'}`}>
                      <div className={`text-sm font-['SF-Pro-Display-Regular'] ${darkMode ? 'text-white' : 'text-zinc-900'}`}>{user?.username || 'User'}</div>
                      <div className={`text-sm font-['SF-Pro-Display-Regular'] ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>{user?.email || 'user@example.com'}</div>
                    </div>
                    <div className="py-2">
                      <Link
                        href="/profile"
                        className={`flex items-center space-x-3 px-4 py-3 text-sm font-['SF-Pro-Display-Regular'] transition-all duration-200 ${
                          darkMode ? 'text-zinc-300 hover:text-white hover:bg-zinc-700/50' : 'text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50'
                        }`}
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className={`flex items-center space-x-3 w-full px-4 py-3 text-sm font-['SF-Pro-Display-Regular'] transition-all duration-200 text-left ${
                          darkMode ? 'text-zinc-300 hover:text-white hover:bg-zinc-700/50' : 'text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50'
                        }`}
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Get Started Button for non-authenticated users */
              <Link 
                href="/generator" 
                className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white px-6 py-2.5 rounded-xl transform transition-all duration-300 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 hover:scale-105 shadow-md hover:shadow-lg font-['SF-Pro-Display-Regular'] text-sm"
              >
                Get Started
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button (Hamburger) */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden p-2 relative h-10 w-10 ${darkMode ? 'text-zinc-300' : 'text-zinc-600'}`}
            aria-label="Open menu"
          >
            <div className="w-6 h-6 relative">
              <span className={`block absolute h-0.5 w-full bg-current transform transition-all duration-300 ease-in-out ${ isMenuOpen ? 'rotate-45 top-1/2 -translate-y-1/2' : 'top-[25%]' }`}></span>
              <span className={`block absolute h-0.5 w-full bg-current transform transition-all duration-300 ease-in-out top-1/2 -translate-y-1/2 ${ isMenuOpen ? 'opacity-0' : 'opacity-100' }`}></span>
              <span className={`block absolute h-0.5 w-full bg-current transform transition-all duration-300 ease-in-out ${ isMenuOpen ? '-rotate-45 top-1/2 -translate-y-1/2' : 'top-[75%]' }`}></span>
            </div>
          </button>
        </div>

        {/* Mobile Navigation (Collapsible) */}
        <nav 
          className={`
            md:hidden overflow-hidden transition-all duration-300 ease-in-out
            ${darkMode ? 'border-zinc-700' : 'border-zinc-200'}
            ${isMenuOpen 
              ? 'max-h-[1000px] opacity-100 border-t mt-4 pt-4 pb-4' 
              : 'max-h-0 opacity-0'
            }
            ${isQuizInProgress ? 'pointer-events-none opacity-50' : ''}
          `}
        >
          <div className="flex flex-col space-y-4">
            <ProtectedLink href={user ? "/home" : "/"} onClick={() => setIsMenuOpen(false)} className={`font-['SF-Pro-Display-Regular'] text-sm transition-colors ${darkMode ? 'text-zinc-300 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'}`}>
              Home
            </ProtectedLink>

            {/* Tools Collapsible for Mobile */}
            <div>
              <button
                onClick={() => setIsToolsMenuOpen(!isToolsMenuOpen)}
                disabled={isQuizInProgress}
                className={`w-full flex justify-between items-center transition-colors ${isQuizInProgress ? 'opacity-50 cursor-not-allowed' : ''} ${darkMode ? 'text-zinc-300 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'}`}
              >
                <span className="font-['SF-Pro-Display-Regular'] text-sm">Tools</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isToolsMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              <div className={`overflow-hidden pl-4 transition-all duration-300 ease-in-out ${isToolsMenuOpen ? 'max-h-60 mt-4' : 'max-h-0'}`}>
                <div className="flex flex-col space-y-4">
                  <ProtectedLink href="/summariser" onClick={() => setIsMenuOpen(false)} className={`font-['SF-Pro-Display-Regular'] text-sm transition-colors ${darkMode ? 'text-zinc-300 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'}`}>
                    Summariser
                  </ProtectedLink>
                  <ProtectedLink href="/translator" onClick={() => setIsMenuOpen(false)} className={`font-['SF-Pro-Display-Regular'] text-sm transition-colors ${darkMode ? 'text-zinc-300 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'}`}>
                    Translator
                  </ProtectedLink>
                  <ProtectedLink href="/generator" onClick={() => setIsMenuOpen(false)} className={`font-['SF-Pro-Display-Regular'] text-sm transition-colors ${darkMode ? 'text-zinc-300 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'}`}>
                    Quiz Generator
                  </ProtectedLink>
                  <ProtectedLink href="/flowchart" onClick={() => setIsMenuOpen(false)} className={`font-['SF-Pro-Display-Regular'] text-sm transition-colors ${darkMode ? 'text-zinc-300 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'}`}>
                    Flowchart Generator
                  </ProtectedLink>
                </div>
              </div>
            </div>

            <ProtectedLink href="/features" onClick={() => setIsMenuOpen(false)} className={`font-['SF-Pro-Display-Regular'] text-sm transition-colors ${darkMode ? 'text-zinc-300 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'}`}>
              Features
            </ProtectedLink>
            <ProtectedLink href="/about" onClick={() => setIsMenuOpen(false)} className={`font-['SF-Pro-Display-Regular'] text-sm transition-colors ${darkMode ? 'text-zinc-300 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'}`}>
              About
            </ProtectedLink>
            {user && (
              <ProtectedLink href="/history" onClick={() => setIsMenuOpen(false)} className={`font-['SF-Pro-Display-Regular'] text-sm transition-colors ${darkMode ? 'text-zinc-300 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'}`}>
                History
              </ProtectedLink>
            )}
            <ProtectedLink href="/help" onClick={() => setIsMenuOpen(false)} className={`font-['SF-Pro-Display-Regular'] text-sm transition-colors ${darkMode ? 'text-zinc-300 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'}`}>
              Help
            </ProtectedLink>
            
            {user ? (
              /* User Profile Section for Mobile */
              <div className={`border-t pt-4 ${darkMode ? 'border-zinc-700' : 'border-zinc-200'}`}>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-sm">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className={`text-sm font-['SF-Pro-Display-Regular'] ${darkMode ? 'text-white' : 'text-zinc-900'}`}>{user?.username || 'User'}</div>
                    <div className={`text-sm font-['SF-Pro-Display-Regular'] ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>{user?.email || 'user@example.com'}</div>
                  </div>
                </div>
                <Link 
                  href="/profile" 
                  className={`flex items-center space-x-2 mb-2 transition-colors ${darkMode ? 'text-zinc-300 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="w-4 h-4" />
                  <span className="font-['SF-Pro-Display-Regular']">Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className={`flex items-center space-x-2 transition-colors ${darkMode ? 'text-zinc-300 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'}`}
                >
                  <LogOut className="w-4 h-4" />
                  <span className="font-['SF-Pro-Display-Regular']">Logout</span>
                </button>
              </div>
            ) : (
              /* Get Started Button for Mobile */
              <div className="border-t pt-4">
                 <Link 
                    href="/generator" 
                    className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white px-6 py-2.5 rounded-xl transition-all duration-300 text-center block transform hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 font-['SF-Pro-Display-Regular'] text-sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Started
                  </Link>
              </div>
            )}
            
            <div className="pt-4 border-t">
              <ThemeToggle />
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
