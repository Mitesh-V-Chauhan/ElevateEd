'use client';

import React from 'react';
import Header from '@/components/GeneratorHeader'
import Footer from '@/components/Footer';
import { useTheme } from '@/contexts/ThemeContext';

export default function Cancellation() {
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
            Cancellation & Refund Policy
          </h1>
          
          <div className={`prose max-w-none ${
            darkMode ? 'prose-invert' : ''
          }`}>
            <p className={`text-lg mb-6 ${
              darkMode ? 'text-zinc-300' : 'text-zinc-600'
            }`}>
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <div className={`mb-12 ${
              darkMode ? 'text-zinc-200' : 'text-zinc-800'
            }`}>
              <h2 className={`text-3xl font-['SF-Pro-Display-Regular'] mb-6 ${
                darkMode ? 'text-white' : 'text-zinc-900'
              }`}>
                Cancellation Policy
              </h2>
              
              <section className="mb-8">
                <h3 className={`text-2xl font-['SF-Pro-Display-Regular'] mb-4 ${
                  darkMode ? 'text-white' : 'text-zinc-900'
                }`}>
                  1. Subscription Cancellation
                </h3>
                <p className={`mb-4 ${
                  darkMode ? 'text-zinc-300' : 'text-zinc-600'
                }`}>
                  You may cancel your <span className="exo-2-brand">ElevateEd</span> subscription at any time through your account settings or by contacting our support team. Cancellations take effect at the end of your current billing period.
                </p>
              </section>
              
              <section className="mb-8">
                <h3 className={`text-2xl font-['SF-Pro-Display-Regular'] mb-4 ${
                  darkMode ? 'text-white' : 'text-zinc-900'
                }`}>
                  2. How to Cancel
                </h3>
                <ul className={`mb-4 list-disc pl-6 ${
                  darkMode ? 'text-zinc-300' : 'text-zinc-600'
                }`}>
                  <li>Log into your account and navigate to subscription settings</li>
                  <li>Click &quot;Cancel Subscription&quot; and follow the prompts</li>
                </ul>
              </section>

              <section className="mb-8">
                <h3 className={`text-2xl font-['SF-Pro-Display-Regular'] mb-4 ${
                  darkMode ? 'text-white' : 'text-zinc-900'
                }`}>
                  3. Service Access After Cancellation
                </h3>
                <p className={`mb-4 ${
                  darkMode ? 'text-zinc-300' : 'text-zinc-600'
                }`}>
                  After cancelling, you will retain access to premium features until the end of your current billing period. Your account will then be downgraded to the free tier with limited functionality.
                </p>
              </section>

              <section className="mb-8">
                <h3 className={`text-2xl font-['SF-Pro-Display-Regular'] mb-4 ${
                  darkMode ? 'text-white' : 'text-zinc-900'
                }`}>
                  4. Free Trial Cancellation
                </h3>
                <p className={`mb-4 ${
                  darkMode ? 'text-zinc-300' : 'text-zinc-600'
                }`}>
                  Free trial users can cancel at any time during the trial period without being charged. If not cancelled before the trial ends, you will be automatically enrolled in the paid subscription.
                </p>
              </section>
            </div>

            <div className={`mb-12 ${
              darkMode ? 'text-zinc-200' : 'text-zinc-800'
            }`}>
              <h2 className={`text-3xl font-['SF-Pro-Display-Regular'] mb-6 ${
                darkMode ? 'text-white' : 'text-zinc-900'
              }`}>
                Refund Policy
              </h2>

              <section className="mb-8">
                <h3 className={`text-2xl font-['SF-Pro-Display-Regular'] mb-4 ${
                  darkMode ? 'text-white' : 'text-zinc-900'
                }`}>
                  1. 30-Day Money Back Guarantee
                </h3>
                <p className={`mb-4 ${
                  darkMode ? 'text-zinc-300' : 'text-zinc-600'
                }`}>
                  We offer a full refund within 30 days of your initial subscription purchase if you are not satisfied with <span className="exo-2-brand">ElevateEd</span>. This applies to first-time subscribers only.
                </p>
              </section>

              <section className="mb-8">
                <h3 className={`text-2xl font-['SF-Pro-Display-Regular'] mb-4 ${
                  darkMode ? 'text-white' : 'text-zinc-900'
                }`}>
                  2. Refund Eligibility
                </h3>
                <ul className={`mb-4 list-disc pl-6 ${
                  darkMode ? 'text-zinc-300' : 'text-zinc-600'
                }`}>
                  <li>Request must be made within 30 days of purchase</li>
                  <li>Account must not have violated our terms of service</li>
                  <li>Applies only to subscription fees, not usage-based charges</li>
                  <li>One refund per customer lifetime</li>
                </ul>
              </section>

              <section className="mb-8">
                <h3 className={`text-2xl font-['SF-Pro-Display-Regular'] mb-4 ${
                  darkMode ? 'text-white' : 'text-zinc-900'
                }`}>
                  4. Processing Time
                </h3>
                <p className={`mb-4 ${
                  darkMode ? 'text-zinc-300' : 'text-zinc-600'
                }`}>
                  Approved refunds are processed within 5-7 business days. The refund will be credited back to your original payment method. Bank processing times may vary.
                </p>
              </section>

              <section className="mb-8">
                <h3 className={`text-2xl font-['SF-Pro-Display-Regular'] mb-4 ${
                  darkMode ? 'text-white' : 'text-zinc-900'
                }`}>
                  5. Partial Refunds
                </h3>
                <p className={`mb-4 ${
                  darkMode ? 'text-zinc-300' : 'text-zinc-600'
                }`}>
                  For annual subscriptions, partial refunds may be considered on a case-by-case basis, calculated on a pro-rata basis for unused months remaining in the subscription period.
                </p>
              </section>

              <section className="mb-8">
                <h3 className={`text-2xl font-['SF-Pro-Display-Regular'] mb-4 ${
                  darkMode ? 'text-white' : 'text-zinc-900'
                }`}>
                  6. Data Retention After Refund
                </h3>
                <p className={`mb-4 ${
                  darkMode ? 'text-zinc-300' : 'text-zinc-600'
                }`}>
                  Your quiz history and generated content will be preserved for 30 days after refund processing. After this period, premium content may be archived or removed from your account.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}