'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Brain, Zap, FileText, CheckCircle, ArrowRight, BookOpen, FlaskConical, Spline, Languages, CreditCard } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import Header from '@/components/GeneratorHeader'
import Footer from '@/components/Footer';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../services/firebase';

export default function Page() {
  const { theme } = useTheme();
  const darkMode = theme === 'dark';

  useEffect(() => {
    if (analytics) {
      logEvent(analytics, 'home_page_view');
    }
  }, [])

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-zinc-950 text-zinc-50' : 'bg-zinc-50 text-zinc-900'} font-sans`}>
      <Header />

      <main>
        {/* Hero Section */}
        <div className="relative overflow-hidden pt-24 sm:pt-32 pb-16 sm:pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative text-center">
            <h1 className={`font-['SF-Pro-Display-Bold'] text-4xl sm:text-6xl md:text-7xl lg:text-8xl mb-4 sm:mb-6 leading-none tracking-tight ${darkMode ? 'text-white' : 'text-zinc-950'} animate-fade-in-up-delay-1`}>
              The next chapter of learning.
            </h1>
            <p className="font-['SF-Pro-Display-Regular'] text-lg sm:text-xl lg:text-2xl max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed px-2 text-zinc-600 dark:text-zinc-300 animate-fade-in-up-delay-2">
              Powerful tools, intuitive design. <span className="exo-2-brand">ElevateEd</span> is the all-in-one platform for modern students and educators to simplify and accelerate learning.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center px-4 animate-fade-in-up-delay-3">
              <Link 
                href="/summariser"
                className="group bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white py-4 sm:py-5 px-6 sm:px-8 transform transition-all duration-300 hover:scale-105 rounded-xl font-['SF-Pro-Display-Regular'] flex items-center justify-center space-x-3 text-sm sm:text-base shadow-lg hover:shadow-2xl"
              >
                <span>Start Summarizing</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link 
                href="/generator"
                className={`border py-4 sm:py-5 px-6 sm:px-8 rounded-xl font-['SF-Pro-Display-Regular'] transition-colors duration-300 hover:bg-opacity-80 text-sm sm:text-base ${
                  darkMode 
                    ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800' 
                    : 'border-zinc-300 text-zinc-700 hover:bg-zinc-200'
                }`}
              >
                Generate Quizzes
              </Link>
              <Link 
                href="/flowchart"
                className={`border py-4 sm:py-5 px-6 sm:px-8 rounded-xl font-['SF-Pro-Display-Regular'] transition-colors duration-300 hover:bg-opacity-80 text-sm sm:text-base ${
                  darkMode 
                    ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800' 
                    : 'border-zinc-300 text-zinc-700 hover:bg-zinc-200'
                }`}
              >
                Create Flowcharts
              </Link>
              <Link 
                href="/flashcard"
                className={`border py-4 sm:py-5 px-6 sm:px-8 rounded-xl font-['SF-Pro-Display-Regular'] transition-colors duration-300 hover:bg-opacity-80 text-sm sm:text-base ${
                  darkMode 
                    ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800' 
                    : 'border-zinc-300 text-zinc-700 hover:bg-zinc-200'
                }`}
              >
                Make Flashcards
              </Link>
              <Link 
                href="/translator"
                className={`border py-4 sm:py-5 px-6 sm:px-8 rounded-xl font-['SF-Pro-Display-Regular'] transition-colors duration-300 hover:bg-opacity-80 text-sm sm:text-base ${
                  darkMode 
                    ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800' 
                    : 'border-zinc-300 text-zinc-700 hover:bg-zinc-200'
                }`}
              >
                Translate Content
              </Link>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <section className="bg-gradient-to-b from-transparent to-zinc-100 dark:to-zinc-900 py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className="font-['SF-Pro-Display-Bold'] text-3xl sm:text-5xl text-center mb-4 tracking-tight animate-fade-in">
              Everything you need, beautifully integrated.
            </h2>
            <p className={`text-center text-lg max-w-3xl mx-auto mb-12 sm:mb-16 ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Five powerful AI tools to transform any content into interactive learning experiences
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
              {/* Product Card 1 - Summarizer */}
              <div className={`p-8 rounded-3xl border shadow-xl transition-all duration-300 hover:scale-105 ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mb-6 shadow-md">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <h3 className={`font-['SF-Pro-Display-Bold'] text-2xl sm:text-3xl mb-3 ${darkMode ? 'text-white' : 'text-zinc-950'}`}>Summarization</h3>
                <p className={`font-['SF-Pro-Display-Regular'] text-lg leading-relaxed ${darkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>
                  Instantly get the key takeaways from long articles and documents. Focus on what matters, without the fluff.
                </p>
                <Link href="/summariser" className="mt-6 inline-flex items-center font-['SF-Pro-Display-Regular'] text-blue-600 hover:text-blue-700 transition-colors duration-200 group">
                  Learn more <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>

              {/* Product Card 2 - Quiz Generator */}
              <div className={`p-8 rounded-3xl border shadow-xl transition-all duration-300 hover:scale-105 ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-6 shadow-md">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className={`font-['SF-Pro-Display-Bold'] text-2xl sm:text-3xl mb-3 ${darkMode ? 'text-white' : 'text-zinc-950'}`}>Quiz Generation</h3>
                <p className={`font-['SF-Pro-Display-Regular'] text-lg leading-relaxed ${darkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>
                  Transform any text into dynamic quizzes. Actively test your knowledge and reinforce your understanding.
                </p>
                <Link href="/generator" className="mt-6 inline-flex items-center font-['SF-Pro-Display-Regular'] text-blue-600 hover:text-blue-700 transition-colors duration-200 group">
                  Get started <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>

              {/* Product Card 3 - Flashcard Generator */}
              <div className={`p-8 rounded-3xl border shadow-xl transition-all duration-300 hover:scale-105 ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl mb-6 shadow-md">
                  <CreditCard className="w-8 h-8 text-white" />
                </div>
                <h3 className={`font-['SF-Pro-Display-Bold'] text-2xl sm:text-3xl mb-3 ${darkMode ? 'text-white' : 'text-zinc-950'}`}>Flashcard Creator</h3>
                <p className={`font-['SF-Pro-Display-Regular'] text-lg leading-relaxed ${darkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>
                  Create interactive flashcards for spaced repetition learning. Perfect for memorizing key concepts and facts.
                </p>
                <Link href="/flashcard" className="mt-6 inline-flex items-center font-['SF-Pro-Display-Regular'] text-blue-600 hover:text-blue-700 transition-colors duration-200 group">
                  Create flashcards <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>

              {/* Product Card 4 - Flowchart Generator */}
              <div className={`p-8 rounded-3xl border shadow-xl transition-all duration-300 hover:scale-105 ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl mb-6 shadow-md">
                  <Spline className="w-8 h-8 text-white" />
                </div>
                <h3 className={`font-['SF-Pro-Display-Bold'] text-2xl sm:text-3xl mb-3 ${darkMode ? 'text-white' : 'text-zinc-950'}`}>Flowchart Generation</h3>
                <p className={`font-['SF-Pro-Display-Regular'] text-lg leading-relaxed ${darkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>
                  Transform complex concepts into visual flowcharts. Break down processes and understand connections clearly.
                </p>
                <Link href="/flowchart" className="mt-6 inline-flex items-center font-['SF-Pro-Display-Regular'] text-blue-600 hover:text-blue-700 transition-colors duration-200 group">
                  Create flowchart <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>

              {/* Product Card 5 - Translator */}
              <div className={`p-8 rounded-3xl border shadow-xl transition-all duration-300 hover:scale-105 ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl mb-6 shadow-md">
                  <Languages className="w-8 h-8 text-white" />
                </div>
                <h3 className={`font-['SF-Pro-Display-Bold'] text-2xl sm:text-3xl mb-3 ${darkMode ? 'text-white' : 'text-zinc-950'}`}>AI Translator</h3>
                <p className={`font-['SF-Pro-Display-Regular'] text-lg leading-relaxed ${darkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>
                  Break down language barriers with accurate translations. Learn content in your preferred language.
                </p>
                <Link href="/translator" className="mt-6 inline-flex items-center font-['SF-Pro-Display-Regular'] text-blue-600 hover:text-blue-700 transition-colors duration-200 group">
                  Start translating <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>

              {/* Product Card 6 - Interactive Review */}
              <div className={`p-8 rounded-3xl border shadow-xl transition-all duration-300 hover:scale-105 ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl mb-6 shadow-md">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className={`font-['SF-Pro-Display-Bold'] text-2xl sm:text-3xl mb-3 ${darkMode ? 'text-white' : 'text-zinc-950'}`}>Interactive Review</h3>
                <p className={`font-['SF-Pro-Display-Regular'] text-lg leading-relaxed ${darkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>
                  Receive instant feedback and detailed explanations. Review your performance and master concepts with ease.
                </p>
                <Link href="/features" className="mt-6 inline-flex items-center font-['SF-Pro-Display-Regular'] text-blue-600 hover:text-blue-700 transition-colors duration-200 group">
                  Explore features <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
            
            {/* Tools at a Glance */}
            <div className="mt-16 sm:mt-20">
              <h3 className="font-['SF-Pro-Display-Bold'] text-2xl sm:text-3xl text-center mb-8 sm:mb-12 tracking-tight">
                Tools at a Glance
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
                <div className={`text-center p-4 rounded-xl ${darkMode ? 'bg-zinc-800/30' : 'bg-white/50'} backdrop-blur-sm border ${darkMode ? 'border-zinc-700/30' : 'border-zinc-200/50'}`}>
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  <h4 className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-zinc-900'}`}>Summarizer</h4>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>Key insights extraction</p>
                </div>
                <div className={`text-center p-4 rounded-xl ${darkMode ? 'bg-zinc-800/30' : 'bg-white/50'} backdrop-blur-sm border ${darkMode ? 'border-zinc-700/30' : 'border-zinc-200/50'}`}>
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                  <h4 className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-zinc-900'}`}>Quiz Generator</h4>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>Interactive assessments</p>
                </div>
                <div className={`text-center p-4 rounded-xl ${darkMode ? 'bg-zinc-800/30' : 'bg-white/50'} backdrop-blur-sm border ${darkMode ? 'border-zinc-700/30' : 'border-zinc-200/50'}`}>
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-white" />
                  </div>
                  <h4 className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-zinc-900'}`}>Flashcards</h4>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>Memory retention</p>
                </div>
                <div className={`text-center p-4 rounded-xl ${darkMode ? 'bg-zinc-800/30' : 'bg-white/50'} backdrop-blur-sm border ${darkMode ? 'border-zinc-700/30' : 'border-zinc-200/50'}`}>
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <Spline className="w-4 h-4 text-white" />
                  </div>
                  <h4 className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-zinc-900'}`}>Flowcharts</h4>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>Visual processes</p>
                </div>
                <div className={`text-center p-4 rounded-xl ${darkMode ? 'bg-zinc-800/30' : 'bg-white/50'} backdrop-blur-sm border ${darkMode ? 'border-zinc-700/30' : 'border-zinc-200/50'}`}>
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <Languages className="w-4 h-4 text-white" />
                  </div>
                  <h4 className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-zinc-900'}`}>Translator</h4>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>Language conversion</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className={`rounded-3xl p-8 sm:p-12 lg:p-16 ${darkMode ? 'bg-gradient-to-r from-zinc-900/90 to-zinc-800/90 border border-zinc-700' : 'bg-gradient-to-r from-white/90 to-zinc-50/90 border border-zinc-200'} backdrop-blur-sm shadow-2xl`}>
              <div className="text-center max-w-4xl mx-auto">
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-200/20 dark:border-purple-800/20 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-medium mb-8">
                  <Brain className="w-4 h-4" />
                  <span>Our Mission</span>
                </div>
                <h2 className="font-['SF-Pro-Display-Bold'] text-3xl sm:text-5xl lg:text-6xl mb-6 sm:mb-8 tracking-tight animate-fade-in-up">
                  <span className={`${darkMode ? 'text-white' : 'text-zinc-950'}`}>Democratizing</span>{' '}
                  <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
                    Learning
                  </span>
                </h2>
                <p className={`font-['SF-Pro-Display-Regular'] text-lg sm:text-xl lg:text-2xl leading-relaxed mb-8 ${darkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>
                  We believe that powerful learning tools should be accessible to everyone. Our mission is to transform how people learn by making advanced AI-powered educational tools simple, intuitive, and available to students, educators, and lifelong learners worldwide.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mt-12">
                  <div className="text-center">
                    <div className={`text-3xl sm:text-4xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>50K+</div>
                    <div className={`text-sm sm:text-base ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>Active Learners</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-3xl sm:text-4xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>1M+</div>
                    <div className={`text-sm sm:text-base ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>Content Pieces Generated</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-3xl sm:text-4xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>5</div>
                    <div className={`text-sm sm:text-base ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>AI-Powered Tools</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="font-['SF-Pro-Display-Bold'] text-3xl sm:text-5xl mb-12 sm:mb-16 tracking-tight animate-fade-in-up">
              Learning, simplified.
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 sm:gap-16 items-start">
              <div className="flex flex-col items-center animate-fade-in-up-delay-1">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 rounded-full flex items-center justify-center text-white text-3xl font-['SF-Pro-Display-Bold'] z-10 shadow-lg">1</div>
                  <div className="absolute inset-0 rounded-full bg-blue-600/20 blur-xl animate-pulse-slow-1s" />
                </div>
                <h3 className={`font-['SF-Pro-Display-Regular'] text-xl mt-6 mb-2 ${darkMode ? 'text-white' : 'text-zinc-950'}`}>Add Content</h3>
                <p className={`font-['SF-Pro-Display-Regular'] text-base ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>Paste text, upload a PDF, or use a link to get started.</p>
              </div>
              <div className="flex flex-col items-center animate-fade-in-up-delay-2">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 rounded-full flex items-center justify-center text-white text-3xl font-['SF-Pro-Display-Bold'] z-10 shadow-lg">2</div>
                  <div className="absolute inset-0 rounded-full bg-blue-600/20 blur-xl animate-pulse-slow-2s" />
                </div>
                <h3 className={`font-['SF-Pro-Display-Regular'] text-xl mt-6 mb-2 ${darkMode ? 'text-white' : 'text-zinc-950'}`}>AI Does the Work</h3>
                <p className={`font-['SF-Pro-Display-Regular'] text-base ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>Our powerful AI instantly creates summaries, quizzes, and visual flowcharts.</p>
              </div>
              <div className="flex flex-col items-center animate-fade-in-up-delay-3">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 rounded-full flex items-center justify-center text-white text-3xl font-['SF-Pro-Display-Bold'] z-10 shadow-lg">3</div>
                  <div className="absolute inset-0 rounded-full bg-blue-600/20 blur-xl animate-pulse-slow-3s" />
                </div>
                <h3 className={`font-['SF-Pro-Display-Regular'] text-xl mt-6 mb-2 ${darkMode ? 'text-white' : 'text-zinc-950'}`}>Engage & Learn</h3>
                <p className={`font-['SF-Pro-Display-Regular'] text-base ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>Interact with your content to solidify your knowledge.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Coming Soon Section */}
        <section className="py-16 sm:py-24 bg-gradient-to-t from-zinc-100 dark:from-zinc-900 to-transparent">
          <div className="max-7xl mx-auto px-4 sm:px-6">
            <h2 className="font-['SF-Pro-Display-Bold'] text-3xl sm:text-5xl text-center mb-12 sm:mb-16 tracking-tight animate-fade-in">
              More ways to learn. Coming soon.
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Coming Soon Card 1 */}
              <div className={`p-6 sm:p-8 rounded-3xl border-2 border-dashed shadow-inner text-center flex flex-col items-center justify-center transition-all duration-300 hover:scale-[1.02] ${darkMode ? 'bg-zinc-950 border-blue-900' : 'bg-zinc-50 border-blue-200'}`}> 
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-400 rounded-xl mx-auto mb-4 sm:mb-6 flex items-center justify-center opacity-70">
                  <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <h3 className="font-['SF-Pro-Display-Regular'] text-xl sm:text-2xl mb-2 text-blue-600 dark:text-blue-300">Study Roadmap</h3>
                <span className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 font-['SF-Pro-Display-Medium'] text-xs mb-3">Coming Soon</span>
                <p className="font-['SF-Pro-Display-Regular'] text-sm sm:text-base text-zinc-500 dark:text-zinc-400">Personalized AI-generated study plans to help you achieve your goals.</p>
              </div>

              {/* Coming Soon Card 2 */}
              <div className={`p-6 sm:p-8 rounded-3xl border-2 border-dashed shadow-inner text-center flex flex-col items-center justify-center transition-all duration-300 hover:scale-[1.02] ${darkMode ? 'bg-zinc-950 border-green-900' : 'bg-zinc-50 border-green-200'}`}> 
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-400 rounded-xl mx-auto mb-4 sm:mb-6 flex items-center justify-center opacity-70">
                  <FlaskConical className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <h3 className="font-['SF-Pro-Display-Regular'] text-xl sm:text-2xl mb-2 text-green-600 dark:text-green-300">Advanced Analytics</h3>
                <span className="inline-block px-3 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 font-['SF-Pro-Display-Regular'] text-xs mb-3">Coming Soon</span>
                <p className="font-['SF-Pro-Display-Regular'] text-sm sm:text-base text-zinc-500 dark:text-zinc-400">Track your learning progress with detailed insights and recommendations.</p>
              </div>

              {/* Coming Soon Card 3 */}
              <div className={`p-6 sm:p-8 rounded-3xl border-2 border-dashed shadow-inner text-center flex flex-col items-center justify-center transition-all duration-300 hover:scale-[1.02] ${darkMode ? 'bg-zinc-950 border-purple-900' : 'bg-zinc-50 border-purple-200'}`}> 
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mx-auto mb-4 sm:mb-6 flex items-center justify-center opacity-70">
                  <Zap className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <h3 className="font-['SF-Pro-Display-Regular'] text-xl sm:text-2xl mb-2 text-purple-600 dark:text-purple-300">Much More Coming Soon</h3>
                <span className="inline-block px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200 font-['SF-Pro-Display-Regular'] text-xs mb-3">Exciting Updates</span>
                <p className="font-['SF-Pro-Display-Regular'] text-sm sm:text-base text-zinc-500 dark:text-zinc-400">We&apos;re working on amazing new features to revolutionize your learning experience.</p>
              </div>
            </div>
            
            {/* Feedback Call-to-Action */}
            <div className="mt-12 text-center">
              <p className={`font-['SF-Pro-Display-Regular'] text-lg mb-6 ${darkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>
                Have ideas for new features? We&apos;d love to hear from you!
              </p>
              <Link 
                href="/feedback"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white font-['SF-Pro-Display-Regular'] py-3 px-6 rounded-xl transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <span>Share Your Ideas</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 rounded-3xl p-8 sm:p-12 text-center text-white overflow-hidden shadow-2xl">
              <div className="relative z-10">
                <h2 className="font-['SF-Pro-Display-Bold'] text-3xl sm:text-5xl lg:text-6xl mb-4 sm:mb-6 drop-shadow-xl">
                  Take the first step toward smarter learning.
                </h2>
                <p className="font-['SF-Pro-Display-Regular'] text-base sm:text-xl lg:text-2xl mb-8 sm:mb-10 opacity-90 max-w-4xl mx-auto">
                  Join the thousands of students and professionals who are using <span className="exo-2-brand">ElevateEd</span> to simplify their studies and maximize their results.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                  <Link 
                    href="/summariser"
                    className="bg-white text-blue-600 px-8 sm:px-10 py-4 sm:py-5 rounded-xl font-['SF-Pro-Display-Regular'] hover:bg-zinc-100 transition-all duration-300 transform hover:scale-105 inline-flex items-center space-x-3 text-base sm:text-lg shadow-lg hover:shadow-xl"
                  >
                    <span>Get Started for Free</span>
                    <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
                  </Link>
                  <Link 
                    href="/feedback"
                    className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-['SF-Pro-Display-Regular'] hover:bg-white/20 transition-all duration-300 transform hover:scale-105 inline-flex items-center space-x-2 text-sm sm:text-base"
                  >
                    <span>Share Feedback</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}