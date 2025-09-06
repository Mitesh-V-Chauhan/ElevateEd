'use client';

import React from 'react';
import Link from 'next/link';
import { Brain, Users, Target,  Mail } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import Header from '@/components/GeneratorHeader'
import Footer from '@/components/Footer';

export default function About() {
  const { theme } = useTheme();
  const darkMode = theme === 'dark';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-zinc-900' : 'bg-zinc-50'}`}>
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Hero Section */}
        <div className="text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 rounded-2xl sm:rounded-3xl mb-6 sm:mb-8 transform transition-all duration-500  hover:rotate-3">
            <Brain className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          
          <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-['SF-Pro-Display-Regular'] mb-4 sm:mb-6 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
            About 
            <span className="exo-2-brand bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent"> ElevateEd</span>
          </h1>
          
          <p className={`text-base sm:text-lg lg:text-xl max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed px-2 ${darkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>
            We&apos;re on a mission to provide educational tools powered by AI - from intelligent summaries and interactive quizzes to visual flowcharts, flashcards, and translations - to make students&apos; life easier.
          </p>
        </div>

        {/* Mission Statement */}
        <div className="mb-16 sm:mb-20">
          <div className={`p-8 sm:p-12 rounded-2xl sm:rounded-3xl ${darkMode ? 'bg-zinc-800/50' : 'bg-white/70'} backdrop-blur-xl border ${darkMode ? 'border-zinc-700/50' : 'border-black'} text-center transform transition-all duration-500 `}>
            <h2 className={`text-3xl sm:text-4xl font-['SF-Pro-Display-Regular'] mb-6 sm:mb-8 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
              Our Mission
            </h2>
            <p className={`text-lg sm:text-xl mb-6 sm:mb-8 leading-relaxed max-w-4xl mx-auto ${darkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>
              At <span className="exo-2-brand">ElevateEd</span>, we are dedicated to revolutionizing education through cutting-edge AI technology. 
              Our mission is simple yet powerful: to provide educational tools powered by artificial intelligence 
              that make students&apos; lives easier, learning more engaging, and knowledge more accessible.
            </p>
            <p className={`text-base sm:text-lg leading-relaxed max-w-3xl mx-auto ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
              We believe that every student deserves access to personalized, intelligent learning tools that adapt 
              to their unique pace and style. By harnessing the power of AI, we&apos;re breaking down barriers in 
              education and creating opportunities for learners worldwide to succeed.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-16 sm:mb-20">
          <h2 className={`text-2xl sm:text-3xl font-['SF-Pro-Display-Regular'] text-center mb-8 sm:mb-12 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
            What Drives Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className={`p-6 sm:p-8 rounded-xl sm:rounded-2xl ${darkMode ? 'bg-zinc-800/50' : 'bg-white/70'} backdrop-blur-xl border ${darkMode ? 'border-zinc-700/50' : 'border-black'} text-center group  transition-all duration-300`}>
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 mx-auto group- transition-transform duration-300">
                <Target className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className={`text-lg sm:text-xl font-['SF-Pro-Display-Regular'] mb-3 sm:mb-4 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>Accessibility</h3>
              <p className={`text-sm sm:text-base leading-relaxed ${darkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>
                Making quality education accessible to everyone, regardless of their background or circumstances.
              </p>
            </div>

            <div className={`p-6 sm:p-8 rounded-xl sm:rounded-2xl ${darkMode ? 'bg-zinc-800/50' : 'bg-white/70'} backdrop-blur-xl border ${darkMode ? 'border-zinc-700/50' : 'border-black'} text-center group  transition-all duration-300`}>
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 mx-auto group- transition-transform duration-300">
                <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className={`text-lg sm:text-xl font-['SF-Pro-Display-Regular'] mb-3 sm:mb-4 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>Innovation</h3>
              <p className={`text-sm sm:text-base leading-relaxed ${darkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>
                Continuously pushing the boundaries of what&apos;s possible with AI in education.
              </p>
            </div>

            <div className={`p-6 sm:p-8 rounded-xl sm:rounded-2xl ${darkMode ? 'bg-zinc-800/50' : 'bg-white/70'} backdrop-blur-xl border ${darkMode ? 'border-zinc-700/50' : 'border-black'} text-center group  transition-all duration-300`}>
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 mx-auto group- transition-transform duration-300">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className={`text-lg sm:text-xl font-['SF-Pro-Display-Regular'] mb-3 sm:mb-4 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>Community</h3>
              <p className={`text-sm sm:text-base leading-relaxed ${darkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>
                Building a supportive community of educators and learners who inspire each other.
              </p>
            </div>
          </div>
        </div>

        {/* How We Help */}
        <div className="mb-16 sm:mb-20">
          <div className={`rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 ${darkMode ? 'bg-zinc-800/50' : 'bg-white/70'} backdrop-blur-xl border ${darkMode ? 'border-zinc-700/50' : 'border-black'}`}>
            <h2 className={`text-2xl sm:text-3xl font-['SF-Pro-Display-Regular'] text-center mb-8 sm:mb-12 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
              How We Make Learning Easier
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start space-x-3 sm:space-x-4 group">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0 group- transition-transform duration-300">
                    <span className="text-white font-['SF-Pro-Display-Regular'] text-sm sm:text-base">1</span>
                  </div>
                  <div>
                    <h3 className={`font-['SF-Pro-Display-Regular'] mb-1 sm:mb-2 text-sm sm:text-base ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                      Smart Content Analysis
                    </h3>
                    <p className={`text-xs sm:text-sm ${darkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>
                      Our AI understands your content and generates summaries, quizzes, and flowcharts automatically.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4 group">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0 group- transition-transform duration-300">
                    <span className="text-white font-['SF-Pro-Display-Regular'] text-sm sm:text-base">2</span>
                  </div>
                  <div>
                    <h3 className={`font-['SF-Pro-Display-Regular'] mb-1 sm:mb-2 text-sm sm:text-base ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                      Instant Content Generation
                    </h3>
                    <p className={`text-xs sm:text-sm ${darkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>
                      Transform hours of manual work into seconds of automated content generation.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4 group">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0 group- transition-transform duration-300">
                    <span className="text-white font-['SF-Pro-Display-Regular'] text-sm sm:text-base">3</span>
                  </div>
                  <div>
                    <h3 className={`font-['SF-Pro-Display-Regular'] mb-1 sm:mb-2 text-sm sm:text-base ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                      Adaptive Learning
                    </h3>
                    <p className={`text-xs sm:text-sm ${darkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>
                      Personalized difficulty levels and question types that match learning objectives.
                    </p>
                  </div>
                </div>
              </div>

 
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mb-16 sm:mb-20">
          <div className={`rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 text-center ${darkMode ? 'bg-zinc-800/50' : 'bg-white/70'} backdrop-blur-xl border ${darkMode ? 'border-zinc-700/50' : 'border-black'} transform transition-all duration-500 `}>
            <h2 className={`text-2xl sm:text-3xl font-['SF-Pro-Display-Regular'] mb-4 sm:mb-6 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
              Get in Touch
            </h2>
            <p className={`text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto px-2 ${darkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>
              Have questions, feedback, or want to partner with us? We&apos;d love to hear from you!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <a 
                href="mailto:support@elevateed-ai.com"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-['SF-Pro-Display-Regular']  transform  transition-all text-sm sm:text-base"
              >
                <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Contact Us</span>
              </a>
              <div className="flex space-x-3 sm:space-x-4">
                  {/* Instagram */}
                <a 
                  href="https://instagram.com/elevateed.ai" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`transition-all duration-300  hover:-translate-y-1 ${
                    theme === 'dark' 
                      ? 'text-zinc-400 hover:text-white' 
                      : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                  aria-label="Follow us on GitHub"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                
                {/* Twitter */}
                <a 
                  href="https://linkedin.com/company/elevateed-ai" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`transition-all duration-300  hover:-translate-y-1 ${
                    theme === 'dark' 
                      ? 'text-zinc-400 hover:text-blue-400' 
                      : 'text-zinc-600 hover:text-blue-500'
                  }`}
                  aria-label="Follow us on LinkedIn"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 text-center text-white transform transition-all duration-500 ">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-['SF-Pro-Display-Regular'] mb-3 sm:mb-4">
            Ready to Join Our Community?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 opacity-90">
            Start creating amazing summaries, quizzes, and flowcharts with AI today
          </p>
          <Link 
            href="/generator"
            className="bg-white text-purple-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-['SF-Pro-Display-Regular'] hover:bg-zinc-100 transition-all duration-300  inline-flex items-center space-x-2 text-sm sm:text-base"
          >
            <Brain className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Get Started Free</span>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
