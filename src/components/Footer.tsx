'use client'

import React from 'react'
import Link from 'next/link'
// import { Brain } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

export default function Footer() {
  const { actualTheme } = useTheme()
  const darkMode = actualTheme === 'dark'
  
  return (
    <footer className={`border-t py-12 transition-colors duration-300 ${
      darkMode ? 'bg-zinc-900/50' : 'bg-zinc-50/50'
    } backdrop-blur-xl`}>
      <div className="container mx-auto px-4 py-12">
        <div className={`rounded-2xl p-8 ${
          darkMode ? 'bg-zinc-800/50 border-zinc-700/50' : 'bg-white/70 border-black'
        } backdrop-blur-xl border`}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4 group">
            <div className="flex items-center space-x-3 transition-transform duration-300 group-">
              
              <span className="exo-2-brand text-[25px] font-semibold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
                ElevateEd
              </span>
            </div>
            <p className={`text-sm leading-relaxed transition-colors duration-300 font-['SF-Pro-Display-Regular'] ${
              actualTheme === 'dark' ? 'text-zinc-400 group-hover:text-zinc-300' : 'text-zinc-600 group-hover:text-zinc-500'
            }`}>
              Transform your content into interactive quizzes, summaries, and flowcharts with AI-powered analysis.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={`font-['SF-Pro-Display-Regular'] mb-4 ${
              actualTheme === 'dark' ? 'text-white' : 'text-zinc-900'
            }`}>Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className={`transition-all duration-300 font-['SF-Pro-Display-Regular'] ${
                  actualTheme === 'dark' 
                    ? 'text-zinc-400 hover:text-white' 
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/summariser" className={`transition-all duration-300 font-['SF-Pro-Display-Regular'] ${
                  actualTheme === 'dark' 
                    ? 'text-zinc-400 hover:text-white' 
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}>
                  Summariser
                </Link>
              </li>
              <li>
                <Link href="/generator" className={`transition-all duration-300 font-['SF-Pro-Display-Regular'] ${
                  actualTheme === 'dark' 
                    ? 'text-zinc-400 hover:text-white' 
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}>
                  Quiz Generator
                </Link>
              </li>
              <li>
                <Link href="/flowchart" className={`transition-all duration-300 font-['SF-Pro-Display-Regular'] ${
                  actualTheme === 'dark' 
                    ? 'text-zinc-400 hover:text-white' 
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}>
                  Flowchart Generator
                </Link>
              </li>
              <li>
                <Link href="/features" className={`transition-all duration-300 font-['SF-Pro-Display-Regular'] ${
                  actualTheme === 'dark' 
                    ? 'text-zinc-400 hover:text-white' 
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}>
                  Features
                </Link>
              </li>
              <li>
                <Link href="/auth" className={`transition-all duration-300 font-['SF-Pro-Display-Regular'] ${
                  actualTheme === 'dark' 
                    ? 'text-zinc-400 hover:text-white' 
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}>
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className={`font-['SF-Pro-Display-Regular'] mb-4 ${
              actualTheme === 'dark' ? 'text-white' : 'text-zinc-900'
            }`}>Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className={`transition-all duration-300 font-['SF-Pro-Display-Regular'] ${
                  actualTheme === 'dark' 
                    ? 'text-zinc-400 hover:text-white' 
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}>
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/feedback" className={`transition-all duration-300 font-['SF-Pro-Display-Regular'] ${
                  actualTheme === 'dark' 
                    ? 'text-zinc-400 hover:text-white' 
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}>
                  Send Feedback
                </Link>
              </li>
              <li>
                <a 
                  href="mailto:contact@elevateed.ai" 
                  className={`transition-all duration-300 font-['SF-Pro-Display-Regular'] ${
                    actualTheme === 'dark' 
                      ? 'text-zinc-400 hover:text-white' 
                      : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  Contact Support
                </a>
              </li>
              <li>
                <Link href="/privacy" className={`transition-all duration-300 font-['SF-Pro-Display-Regular'] ${
                  actualTheme === 'dark' 
                    ? 'text-zinc-400 hover:text-white' 
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className={`transition-all duration-300 font-['SF-Pro-Display-Regular'] ${
                  actualTheme === 'dark' 
                    ? 'text-zinc-400 hover:text-white' 
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}>
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect & Social */}
          <div>
            <h3 className={`font-['SF-Pro-Display-Regular'] mb-4 ${
              actualTheme === 'dark' ? 'text-white' : 'text-zinc-900'
            }`}>Connect</h3>
            <div className="space-y-3">
              <div className="flex space-x-4">
                {/* Instagram */}
                <a 
                  href="https://instagram.com/elevateed.ai" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`transition-all duration-300  hover:-translate-y-1 ${
                    actualTheme === 'dark' 
                      ? 'text-zinc-400 hover:text-white' 
                      : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                  aria-label="Follow us on Instagram"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                
                {/* Twitter */}
                <a 
                  href="https://x.com/ElevateEd_ai" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`transition-all duration-300  hover:-translate-y-1 ${
                    actualTheme === 'dark' 
                      ? 'text-zinc-400 hover:text-blue-400' 
                      : 'text-zinc-600 hover:text-blue-500'
                  }`}
                  aria-label="Follow us on Twitter"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                
                {/* Email */}
                <a 
                  href="mailto:support@elevateed-ai.com" 
                  className={`transition-colors ${
                    actualTheme === 'dark' 
                      ? 'text-zinc-400 hover:text-green-400' 
                      : 'text-zinc-600 hover:text-green-600'
                  }`}
                  aria-label="Contact us via email"
                >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                </a>
              </div>
              
              {/* Contact Information */}
              <div className="mt-4 space-y-2">
                {/* <p className={`text-sm ${
                  actualTheme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'
                }`}>
                  Email: support@elevateed.ai
                </p> */}
                <p className={`text-sm font-['SF-Pro-Display-Regular'] ${
                  actualTheme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'
                }`}>
                  Follow us for updates and tips!
                </p>
              </div>
            </div>
          </div>
          </div>

          <div className={`border-t mt-8 pt-8 text-center ${
            actualTheme === 'dark' ? 'border-white/10' : 'border-black'
          }`}>
            <p className={`text-sm font-['SF-Pro-Display-Regular'] ${
              actualTheme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'
            }`}>
              © {new Date().getFullYear()} <span className="exo-2-brand font-['SF-Pro-Display-Regular']">ElevateEd</span>. All rights reserved. Built with ❤️ for education.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}