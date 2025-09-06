"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@/contexts/ThemeContext';
import Header from '@/components/GeneratorHeader'
import Footer from '@/components/Footer';
import { ChevronDown, ChevronUp, Play, Upload, Brain, Zap, FileText, HelpCircle, MessageCircle } from 'lucide-react';

const HelpPage: React.FC = () => {
  const { theme } = useTheme();
  const darkMode = theme === 'dark';

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do I create a quiz from my content?",
      answer: "Upload a PDF document or paste text content into our generator, and our AI will analyze it and create interactive quiz questions automatically. The process takes just a few seconds!"
    },
    {
      question: "What types of content work best?",
      answer: "Educational materials, lectures, tutorials, and articles work best. Content with clear structure and substantial information typically produces better results."
    },
    {
      question: "Can I customize the difficulty level?",
      answer: "Yes! You can choose from Easy, Medium, or Hard difficulty levels. You can also select the number of questions (5-20) and the quiz format (multiple choice, true/false, short answer, or mixed)."
    },
    {
      question: "Which AI models are available?",
      answer: "We offer GPT-4 (most capable), GPT-3.5 Turbo (fast & efficient), and Claude 3 (analytical). Each model has different strengths for generating quiz content."
    },
    {
      question: "How accurate are the generated quizzes?",
      answer: "Our AI models are highly accurate and generate contextually relevant questions. However, we recommend reviewing questions before using them in formal assessments."
    },
    {
      question: "Can I download the generated quizzes?",
      answer: "Yes! You can download your quizzes as PDF files or export them in various formats for use in other platforms."
    },
    {
      question: "Is there a limit to content length?",
      answer: "Currently, we support content up to reasonable limits. Large documents may be processed in sections to ensure optimal quiz generation."
    },
    {
      question: "Do you support multiple languages?",
      answer: "Currently, we support English content. Multi-language support is planned for future releases."
    }
  ];

  const features = [
    {
      icon: Upload,
      title: "Content Processing",
      description: "Support for PDF uploads and direct text input for flexible content processing"
    },
    {
      icon: Brain,
      title: "AI-Powered Generation",
      description: "Advanced AI models create contextually relevant quiz questions"
    },
    {
      icon: Zap,
      title: "Instant Results",
      description: "Generate comprehensive quizzes in seconds, not hours"
    },
    {
      icon: FileText,
      title: "Multiple Formats",
      description: "Support for various question types and export formats"
    }
  ];

  const steps = [
    {
      step: 1,
      title: "Upload Content",
      description: "Upload a PDF document or paste text content into our generator"
    },
    {
      step: 2,
      title: "Configure Settings",
      description: "Choose AI model, difficulty level, question count, and format"
    },
    {
      step: 3,
      title: "Generate Quiz",
      description: "Our AI analyzes the content and creates your quiz instantly"
    },
    {
      step: 4,
      title: "Review & Export",
      description: "Review questions, take the quiz, and export in your preferred format"
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-zinc-900' : 'bg-zinc-50'
    }`}>
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 mb-6">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className={`text-4xl md:text-5xl font-['SF-Pro-Display-Regular'] mb-6 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
            How Can We{' '}
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
              Help You?
            </span>
          </h1>
          <p className={`text-xl mb-8 max-w-3xl mx-auto ${darkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>
            Everything you need to know about creating AI-powered quizzes from your content
          </p>
        </div>

        {/* Quick Start Guide */}
        <div className={`rounded-2xl border backdrop-blur-xl p-8 mb-16 ${
          darkMode ? 'bg-zinc-800/40 border-zinc-700/50' : 'bg-white/70 border-black/50'
        }`}>
          <h2 className={`text-2xl font-['SF-Pro-Display-Regular'] mb-8 text-center ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
            Getting Started in 4 Simple Steps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
              <div key={step.step} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-['SF-Pro-Display-Regular'] text-lg mb-4">
                  {step.step}
                </div>
                <h3 className={`font-['SF-Pro-Display-Regular'] mb-2 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                  {step.title}
                </h3>
                <p className={`text-sm ${darkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/generator"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white font-['SF-Pro-Display-Regular'] py-3 px-6 rounded-xl  transform  transition-all duration-200"
            >
              <Play className="w-5 h-5" />
              <span>Try It Now</span>
            </Link>
          </div>
        </div>

        {/* Features Overview */}
        <div className={`rounded-2xl border backdrop-blur-xl p-8 mb-16 ${
          darkMode ? 'bg-zinc-800/40 border-zinc-700/50' : 'bg-white/70 border-black/50'
        }`}>
          <h2 className={`text-2xl font-['SF-Pro-Display-Regular'] mb-8 text-center ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 mb-4">
                  <feature.icon className={`w-6 h-6 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                </div>
                <h3 className={`font-['SF-Pro-Display-Regular'] mb-2 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                  {feature.title}
                </h3>
                <p className={`text-sm ${darkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className={`rounded-2xl border backdrop-blur-xl p-8 mb-16 ${
          darkMode ? 'bg-zinc-800/40 border-zinc-700/50' : 'bg-white/70 border-black/50'
        }`}>
          <h2 className={`text-2xl font-['SF-Pro-Display-Regular'] mb-8 text-center ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className={`border rounded-xl ${darkMode ? 'border-zinc-700' : 'border-black'}`}>
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className={`w-full p-4 text-left flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-700/50 rounded-xl transition-colors ${darkMode ? 'text-white' : 'text-zinc-900'}`}
                >
                  <span className="font-['SF-Pro-Display-Regular']">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-zinc-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-zinc-500" />
                  )}
                </button>
                {openFaq === index && (
                  <div className={`p-4 pt-0 ${darkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className={`rounded-2xl border backdrop-blur-xl p-8 text-center ${
          darkMode ? 'bg-zinc-800/40 border-zinc-700/50' : 'bg-white/70 border-black/50'
        }`}>
          <h2 className={`text-2xl font-['SF-Pro-Display-Regular'] mb-4 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
            Get in Touch
          </h2>
          <p className={`mb-6 ${darkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>
            Have questions or need support? Reach out to us through any of these channels.
          </p>
          
          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Email */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 mb-3">
                <MessageCircle className={`w-6 h-6 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
              </div>
              <h3 className={`font-['SF-Pro-Display-Regular'] mb-2 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>Email</h3>
              <a 
                href="mailto:support@elevateed-ai.com"
                className={`text-sm hover:underline ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}
              >
                support@elevateed-ai.com
              </a>
            </div>

            {/* Instagram */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 mb-3">
                <svg className={`w-6 h-6 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
              <h3 className={`font-['SF-Pro-Display-Regular'] mb-2 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>Instagram</h3>
              <a 
                href="https://www.instagram.com/elevateed.ai"
                target="_blank"
                rel="noopener noreferrer"
                className={`text-sm hover:underline ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}
              >
                @elevateed.ai
              </a>
            </div>

            {/* Twitter/X */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 mb-3">
                <svg className={`w-6 h-6 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </div>
              <h3 className={`font-['SF-Pro-Display-Regular'] mb-2 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>Twitter</h3>
              <a 
                href="https://x.com/ElevateEd_ai"
                target="_blank"
                rel="noopener noreferrer"
                className={`text-sm hover:underline ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}
              >
                @ElevateEd_ai
              </a>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/generator"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white font-['SF-Pro-Display-Regular'] py-3 px-6 rounded-xl  transform  transition-all duration-200"
            >
              <Play className="w-5 h-5" />
              <span>Try <span className="exo-2-brand">ElevateEd</span> Now</span>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HelpPage;