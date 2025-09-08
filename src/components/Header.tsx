'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { User, LogOut, ChevronDown } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useAuth } from '@/contexts/AuthContext'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const { theme } = useTheme()
  const { user, logout } = useAuth()
  const darkMode = theme === 'dark'

  const handleLogout = async () => {
    try {
      await logout()
      setIsUserDropdownOpen(false)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleOnClickProfile = () => {
    setIsUserDropdownOpen(false)
    if (typeof window !== 'undefined') {
      window.location.href = '/profile'
    }
  }

  return (
    <header className={`border-b sticky top-0 z-50 transition-colors duration-300 ${darkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-zinc-100'}`}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            {/* <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div> */}
            <h1 className="exo-2-brand text-[25px] bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent transition-all duration-300 group- group-hover:from-purple-700 group-hover:via-pink-700 group-hover:to-orange-600">
              ElevateEd
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className={`transition-all duration-300  hover:text-purple-500 ${darkMode ? 'text-zinc-300 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'}`}>
              Home
            </Link>
            <Link href="/generator" className={`transition-all duration-300  hover:text-purple-500 ${darkMode ? 'text-zinc-300 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'}`}>
              Quiz Generator
            </Link>
            <Link href="/features" className={`transition-all duration-300  hover:text-purple-500 ${darkMode ? 'text-zinc-300 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'}`}>
              Features
            </Link>
            <Link href="/about" className={`transition-all duration-300  hover:text-purple-500 ${darkMode ? 'text-zinc-300 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'}`}>
              About
            </Link>
            <Link href="/help" className={`transition-all duration-300  hover:text-purple-500 ${darkMode ? 'text-zinc-300 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'}`}>
              Help
            </Link>
            <div className="transform transition-all duration-300 ">
              <ThemeToggle />
            </div>
            
            {/* Conditional rendering based on authentication */}
            {user ? (
              /* User Dropdown */
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className={`flex items-center space-x-2 transition-colors focus:outline-none ${darkMode ? 'text-zinc-300 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'}`}
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-['SF-Pro-Display-Regular']">{user?.username || 'User'}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isUserDropdownOpen && (
                  <div className={`absolute right-0 mt-2 w-48 border rounded-xl shadow-lg overflow-hidden ${
                    darkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-black'
                  }`}>
                    <div className={`px-4 py-3 border-b ${darkMode ? 'border-zinc-700' : 'border-black'}`}>
                      <div className={`text-sm font-['SF-Pro-Display-Regular'] ${darkMode ? 'text-white' : 'text-zinc-900'}`}>{user?.username || 'User'}</div>
                      <div className={`text-sm ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>{user?.email || 'user@example.com'}</div>
                    </div>
                    <button
                      onClick={handleOnClickProfile}
                      className={`flex items-center space-x-2 px-4 py-2 transition-colors ${
                        darkMode ? 'text-zinc-300 hover:text-white hover:bg-zinc-700' : 'text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50'
                      }`}
                    >
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className={`flex items-center space-x-2 w-full px-4 py-2 transition-colors text-left ${
                        darkMode ? 'text-zinc-300 hover:text-white hover:bg-zinc-700' : 'text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50'
                      }`}
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Get Started Button for non-authenticated users */
              <Link 
                href="/generator" 
                className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white px-6 py-2 rounded-xl  transform  transition-all duration-300 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600"
              >
                Get Started
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
<button
  onClick={() => setIsMenuOpen(!isMenuOpen)}
  // Add relative and sizing to the button to contain the absolute-positioned lines
  className={`md:hidden p-2 relative h-10 w-10 ${darkMode ? 'text-zinc-300' : 'text-zinc-600'}`}
  aria-label="Open menu"
>
  {/* The container for the animated lines */}
  <div className="w-6 h-6 relative">
    {/* Top line */}
    <span
      className={`block absolute h-0.5 w-full bg-current transform transition-all duration-300 ease-in-out ${
        isMenuOpen ? 'rotate-45 top-1/2 -translate-y-1/2' : 'top-[25%]'
      }`}
    ></span>
    
    {/* Middle line (fades out) */}
    <span
      className={`block absolute h-0.5 w-full bg-current transform transition-all duration-300 ease-in-out top-1/2 -translate-y-1/2 ${
        isMenuOpen ? 'opacity-0' : 'opacity-100'
      }`}
    ></span>

    {/* Bottom line */}
    <span
      className={`block absolute h-0.5 w-full bg-current transform transition-all duration-300 ease-in-out ${
        isMenuOpen ? '-rotate-45 top-1/2 -translate-y-1/2' : 'top-[75%]'
      }`}
    ></span>
  </div>
</button>
        </div>

        {/* Mobile Navigation with animated slide/fade */}
        <div
          className={`md:hidden fixed top-0 left-0 w-full h-full z-40 pointer-events-none ${isMenuOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
          style={{ background: isMenuOpen ? (darkMode ? 'rgba(24,24,27,0.7)' : 'rgba(255,255,255,0.7)') : 'transparent' }}
          aria-hidden={!isMenuOpen}
        >
          <div
            className={`absolute top-0 right-0 w-4/5 max-w-xs h-full bg-white dark:bg-zinc-900 shadow-2xl border-l border-zinc-200 dark:border-zinc-700 transform transition-transform duration-500 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} pointer-events-auto`}
          >
            <nav className={`mt-8 pb-4 px-6 border-t pt-4 transition-all duration-300 ${darkMode ? 'border-zinc-700' : 'border-black'}`}>
            <div className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className={`transition-all duration-300   ${darkMode ? 'text-zinc-300 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/generator" 
                className={`transition-all duration-300   ${darkMode ? 'text-zinc-300 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Quiz Generator
              </Link>
              <Link 
                href="/features" 
                className={`transition-all duration-300   ${darkMode ? 'text-zinc-300 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link 
                href="/about" 
                className={`transition-all duration-300   ${darkMode ? 'text-zinc-300 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/help" 
                className={`transition-all duration-300   ${darkMode ? 'text-zinc-300 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Help
              </Link>
              <div className="transform transition-all duration-300 ">
                <ThemeToggle />
              </div>
              
              {/* Conditional rendering for mobile */}
              {user ? (
                /* User Profile Section for Mobile */
                <div className={`border-t pt-4 ${darkMode ? 'border-zinc-700' : 'border-black'}`}>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className={`text-sm font-['SF-Pro-Display-Regular'] ${darkMode ? 'text-white' : 'text-zinc-900'}`}>{user?.username || 'User'}</div>
                      <div className={`text-sm ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>{user?.email || 'user@example.com'}</div>
                    </div>
                  </div>
                  <Link 
                    href="/profile" 
                    className={`flex items-center space-x-2 mb-2 transition-colors ${darkMode ? 'text-zinc-300 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className={`flex items-center space-x-2 transition-colors ${darkMode ? 'text-zinc-300 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'}`}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                /* Get Started Button for Mobile */
                <Link 
                  href="/generator" 
                  className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white px-6 py-2 rounded-xl transition-all duration-300 text-center   transform"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Started
                </Link>
              )}
            </div>
          </nav>
          </div>
        </div>
      </div>
    </header>
  )
}