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