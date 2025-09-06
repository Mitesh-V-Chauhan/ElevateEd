'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/GeneratorHeader'
import Footer from '../../components/Footer';
import { Brain, Zap, FileText, ArrowRight, Upload, Shield, Star, Spline, Languages, CreditCard } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export default function Features() {
  const { theme } = useTheme();
  const darkMode = theme === 'dark';
  
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Quiz Generation",
      description: "Our advanced AI algorithms analyze your content and generate intelligent quiz questions with multiple formats and difficulty levels."
    },
    {
      icon: FileText,
      title: "Smart Summarization",
      description: "Transform lengthy documents into concise, comprehensive summaries that capture all key points and essential information."
    },
    {
      icon: CreditCard,
      title: "Interactive Flashcards",
      description: "Create dynamic flashcards for spaced repetition learning, perfect for memorizing key concepts and building knowledge retention."
    },
    {
      icon: Spline,
      title: "Visual Flowcharts",
      description: "Transform complex processes and concepts into clear, interactive flowcharts that make understanding easier and more visual."
    },
    {
      icon: Languages,
      title: "AI Translation",
      description: "Break down language barriers with accurate, context-aware translations that preserve meaning and technical accuracy."
    },
    {
      icon: Zap,
      title: "Lightning Fast Processing",
      description: "Generate comprehensive content from PDFs, text, websites, or YouTube videos in seconds, not minutes."
    },
    {
      icon: Star,
      title: "Smart Customization",
      description: "Adjust difficulty levels, question types, and output formats to match your specific learning objectives and audience."
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your data is processed securely with enterprise-grade encryption and is never stored permanently on our servers."
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      // Changed bg-zinc-50 to bg-zinc-100 for better contrast in light mode
      darkMode ? 'bg-zinc-900' : 'bg-zinc-100'
    }`}>
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Hero Section */}
        <div className="text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 mb-4 sm:mb-6">
            <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-['SF-Pro-Display-Regular'] mb-4 sm:mb-6 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
            Powerful{' '}
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
              Features
            </span>
          </h1>
          <p className={`font-['SF-Pro-Display-Regular'] text-base sm:text-lg lg:text-xl max-w-3xl mx-auto mb-8 sm:mb-12 leading-relaxed px-2 ${darkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>
            Discover why thousands of educators, students, and content creators choose <span className="exo-2-brand">ElevateEd</span> AI for generating quizzes, summaries, flashcards, flowcharts, translations, and transforming any content into interactive learning experiences.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-16 sm:mb-20">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`rounded-xl sm:rounded-2xl border backdrop-blur-xl p-6 sm:p-8 transition-all duration-300 group ${
                // Adjusted border color for light mode for better visibility
                darkMode ? 'bg-zinc-800/40 border-zinc-700/50 hover:bg-zinc-800/60' : 'bg-white/70 border-zinc-300 hover:bg-white/90'
              }`}
            >
              <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 mb-4 sm:mb-6 transition-transform duration-300">
                <feature.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
              </div>
              <h3 className={`text-lg sm:text-xl font-['SF-Pro-Display-Regular'] mb-3 sm:mb-4 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                {feature.title}
              </h3>
              <p className={`leading-relaxed text-sm sm:text-base font-['SF-Pro-Display-Regular'] ${darkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* How It Works Section */}
        <div className={`rounded-xl sm:rounded-2xl border backdrop-blur-xl p-6 sm:p-8 mb-12 sm:mb-16 ${
          // Adjusted border color for light mode for better visibility
          darkMode ? 'bg-zinc-800/40 border-zinc-700/50' : 'bg-white/70 border-zinc-300'
        }`}>
          <h2 className={`text-2xl sm:text-3xl font-['SF-Pro-Display-Regular'] text-center mb-8 sm:mb-12 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
            How It Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {[
              { step: 1, title: "Upload Content", desc: "Upload PDF, paste text, add website URL, or YouTube link" },
              { step: 2, title: "AI Analysis", desc: "Our AI processes and analyzes your content intelligently" },
              { step: 3, title: "Generate & Create", desc: "Smart quizzes, summaries, flashcards, flowcharts, and translations created instantly" },
              { step: 4, title: "Review & Export", desc: "Customize, review, and share your generated content" }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className={`inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full ${darkMode ? 'bg-white' : 'bg-black'} ${darkMode ? 'text-black' : 'text-white'} font-['SF-Pro-Display-Regular'] text-base sm:text-lg mb-3 sm:mb-4`}>
                  {step.step}
                </div>
                <h3 className={`font-['SF-Pro-Display-Regular'] mb-2 text-sm sm:text-base ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                  {step.title}
                </h3>
                <p className={`text-xs sm:text-sm font-['SF-Pro-Display-Regular'] ${darkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className={`rounded-xl sm:rounded-2xl border backdrop-blur-xl p-6 sm:p-8 lg:p-12 text-center ${
          // Adjusted border color for light mode for better visibility
          darkMode ? 'bg-zinc-800/40 border-zinc-700/50' : 'bg-white/70 border-zinc-300'
        }`}>
          <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-['SF-Pro-Display-Regular'] mb-4 sm:mb-6 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
            Ready to Experience the Power?
          </h2>
          <p className={`font-['SF-Pro-Display-Regular'] text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto px-2 ${darkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>
            Join thousands of users who are already leveraging our advanced AI technology for quizzes, summaries, flashcards, flowcharts, and translations.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Link
              href="/generator"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white font-['SF-Pro-Display-Regular'] py-3 sm:py-4 px-6 sm:px-8 rounded-lg sm:rounded-xl transform transition-all duration-300 hover:scale-105 text-sm sm:text-base w-full sm:w-auto justify-center"
            >
              <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Try It Now - Free</span>
            </Link>
            <Link
              href="/about"
              className={`inline-flex items-center space-x-2 border font-['SF-Pro-Display-Regular'] py-3 sm:py-4 px-6 sm:px-8 rounded-lg sm:rounded-xl transform transition-all duration-300 hover:scale-105 text-sm sm:text-base w-full sm:w-auto justify-center ${
                darkMode 
                  ? 'border-zinc-600 text-zinc-300 hover:bg-zinc-700' 
                  : 'border-zinc-300 text-zinc-700 hover:bg-zinc-50'
              }`}
            >
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Learn More</span>
            </Link>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
