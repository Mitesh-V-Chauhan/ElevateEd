'use client';

import React from 'react';
import Header from '@/components/GeneratorHeader'
import Footer from '@/components/Footer';
import { useTheme } from '@/contexts/ThemeContext';

export default function Terms() {
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
            Terms of Service
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
                1. Acceptance of Terms
              </h2>
              <p className={`mb-4 ${
                darkMode ? 'text-zinc-300' : 'text-zinc-600'
              }`}>
                By accessing and using <span className="exo-2-brand">ElevateEd</span>, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className={`text-2xl font-['SF-Pro-Display-Regular'] mb-4 ${
                darkMode ? 'text-white' : 'text-zinc-900'
              }`}>
                2. Use License
              </h2>
              <p className={`mb-4 ${
                darkMode ? 'text-zinc-300' : 'text-zinc-600'
              }`}>
                Permission is granted to temporarily download one copy of <span className="exo-2-brand">ElevateEd</span> per device for personal, non-commercial transitory viewing only.
              </p>
            </section>

            <section className="mb-8">
              <h2 className={`text-2xl font-['SF-Pro-Display-Regular'] mb-4 ${
                darkMode ? 'text-white' : 'text-zinc-900'
              }`}>
                3. Disclaimer
              </h2>
              <p className={`mb-4 ${
                darkMode ? 'text-zinc-300' : 'text-zinc-600'
              }`}>
                The materials on <span className="exo-2-brand">ElevateEd</span> are provided on an &apos;as is&apos; basis. <span className="exo-2-brand">ElevateEd</span> makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section className="mb-8">
              <h2 className={`text-2xl font-['SF-Pro-Display-Regular'] mb-4 ${
                darkMode ? 'text-white' : 'text-zinc-900'
              }`}>
                4. Limitations
              </h2>
              <p className={`mb-4 ${
                darkMode ? 'text-zinc-300' : 'text-zinc-600'
              }`}>
                In no event shall <span className="exo-2-brand">ElevateEd</span> or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use <span className="exo-2-brand">ElevateEd</span>, even if <span className="exo-2-brand">ElevateEd</span> or an authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>
            </section>

            <section className="mb-8">
              <h2 className={`text-2xl font-['SF-Pro-Display-Regular'] mb-4 ${
                darkMode ? 'text-white' : 'text-zinc-900'
              }`}>
                5. Contact Information
              </h2>
              <p className={`mb-4 ${
                darkMode ? 'text-zinc-300' : 'text-zinc-600'
              }`}>
                If you have any questions about these Terms of Service, please contact us at support@elevateed-ai.com
              </p>
            </section>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
