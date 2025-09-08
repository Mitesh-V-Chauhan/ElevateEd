'use client';

import React from 'react';
import Header from '@/components/GeneratorHeader'
import Footer from '@/components/Footer';
import { useTheme } from '@/contexts/ThemeContext';

export default function Privacy() {
  const { theme } = useTheme();
  const darkMode = theme === 'dark';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-zinc-900' : 'bg-zinc-50'
    }`}>
      <Header />
      
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className={`rounded-2xl border p-8 ${
          darkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-black'
        }`}>
          <h1 className={`text-4xl font-['SF-Pro-Display-Regular'] mb-8 ${
            darkMode ? 'text-white' : 'text-zinc-900'
          }`}>
            Privacy Policy
          </h1>
          
          <div className={`prose max-w-none ${
            darkMode ? 'prose-invert' : ''
          }`}>
            <p className={`text-lg mb-6 ${
              darkMode ? 'text-zinc-300' : 'text-zinc-600'
            }`}>
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className={`text-2xl font-['SF-Pro-Display-Regular'] mb-4 ${
                darkMode ? 'text-white' : 'text-zinc-900'
              }`}>
                1. Information We Collect
              </h2>
              <p className={`mb-4 ${
                darkMode ? 'text-zinc-300' : 'text-zinc-600'
              }`}>
                We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support. This may include your email address, name, and usage data.
              </p>
            </section>

            <section className="mb-8">
              <h2 className={`text-2xl font-['SF-Pro-Display-Regular'] mb-4 ${
                darkMode ? 'text-white' : 'text-zinc-900'
              }`}>
                2. How We Use Your Information
              </h2>
              <p className={`mb-4 ${
                darkMode ? 'text-zinc-300' : 'text-zinc-600'
              }`}>
                We use the information we collect to provide, maintain, and improve our services, process transactions, send communications, and ensure the security of our platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className={`text-2xl font-['SF-Pro-Display-Regular'] mb-4 ${
                darkMode ? 'text-white' : 'text-zinc-900'
              }`}>
                3. Information Sharing
              </h2>
              <p className={`mb-4 ${
                darkMode ? 'text-zinc-300' : 'text-zinc-600'
              }`}>
                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this privacy policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className={`text-2xl font-['SF-Pro-Display-Regular'] mb-4 ${
                darkMode ? 'text-white' : 'text-zinc-900'
              }`}>
                4. Data Security
              </h2>
              <p className={`mb-4 ${
                darkMode ? 'text-zinc-300' : 'text-zinc-600'
              }`}>
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section className="mb-8">
              <h2 className={`text-2xl font-['SF-Pro-Display-Regular'] mb-4 ${
                darkMode ? 'text-white' : 'text-zinc-900'
              }`}>
                5. Content Processing
              </h2>
              <p className={`mb-4 ${
                darkMode ? 'text-zinc-300' : 'text-zinc-600'
              }`}>
                When you upload PDF documents or provide text content, we process this information solely for quiz generation purposes. We do not store your content beyond what is necessary for our service, and all uploads are processed securely.
              </p>
            </section>

            <section className="mb-8">
              <h2 className={`text-2xl font-['SF-Pro-Display-Regular'] mb-4 ${
                darkMode ? 'text-white' : 'text-zinc-900'
              }`}>
                6. Data Retention
              </h2>
              <p className={`mb-4 ${
                darkMode ? 'text-zinc-300' : 'text-zinc-600'
              }`}>
                We retain your information only as long as necessary to provide our services and fulfill the purposes outlined in this privacy policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className={`text-2xl font-['SF-Pro-Display-Regular'] mb-4 ${
                darkMode ? 'text-white' : 'text-zinc-900'
              }`}>
                7. Your Rights
              </h2>
              <p className={`mb-4 ${
                darkMode ? 'text-zinc-300' : 'text-zinc-600'
              }`}>
                You have the right to access, update, or delete your personal information. You may also opt out of certain communications from us.
              </p>
            </section>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
