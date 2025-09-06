'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ["latin"] });
// const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState('');
  const { theme } = useTheme();
  const { forgotPassword } = useAuth();
  const darkMode = theme === 'dark';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);

    try {
      if (forgotPassword) {
        await forgotPassword(email);
        setIsEmailSent(true);
      } else {
        setError('Password reset functionality is not available.');
      }
    } catch (error: unknown) {
      console.error('Reset error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to send reset email. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setIsLoading(true);
    setError('');

    try {
      if (forgotPassword) {
        await forgotPassword(email);
        setError('');
      }
    } catch (error: unknown) {
      console.error('Resend error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to resend email. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-3 sm:p-4 lg:p-6 transition-colors duration-300 ${
      darkMode ? 'bg-zinc-950' : 'bg-zinc-100'
    } ${inter.className}`}>
      <div className="w-full max-w-md">
        <div className={`px-4 sm:px-8 py-8 sm:py-10 rounded-xl sm:rounded-2xl shadow-2xl transition-colors duration-300 transform transition-all duration-300 ease-in-out ${
          darkMode ? 'bg-zinc-900 border border-zinc-800' : 'bg-white border border-black'
        }`}>
          {/* Logo */}
          <div className="flex items-center justify-center space-x-2 pt-2 sm:pt-4 xl:pt-6 mb-3 sm:mb-4 xl:mb-6">
            <span className={`exo-2-brand text-[24px] sm:text-[32px] lg:text-[40px] bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent`}>
              ElevateEd
            </span>
          </div>

          {!isEmailSent ? (
            <>
              {/* Header */}
              <div className="text-center mb-6 sm:mb-8">
                <h1 className={`font-['SF-Pro-Display-Semibold'] text-xl sm:text-2xl font-['SF-Pro-Display-Regular'] mb-1 sm:mb-2 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                  Forgot Password?
                </h1>
                <p className={`font-['SF-Pro-Display-Semibold'] text-xs sm:text-sm ${darkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>
                  No worries! Enter your email and we&apos;ll send a link to reset your password.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Email Input */}
                <div>
                  <label className={`font-['SF-Pro-Display-Semibold'] block text-xs sm:text-sm font-['SF-Pro-Display-Regular'] mb-1 ${darkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-zinc-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className={`font-['SF-Pro-Display-Semibold'] w-full pl-8 sm:pl-9 pr-4 py-2 sm:py-2.5 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                        darkMode 
                          ? 'bg-zinc-800 border-zinc-600 text-white placeholder-zinc-400' 
                          : 'bg-white border-black text-zinc-900 placeholder-zinc-500'
                      }`}
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="flex items-center space-x-2 p-3 rounded-lg bg-red-950/20 border border-red-800/40 text-red-400">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <p className="text-xs">{error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white py-2 sm:py-2.5 rounded-lg font-['SF-Pro-Display-Regular'] transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm group"
                >
                  {isLoading ? (
                    <div className="font-['SF-Pro-Display-Semibold'] w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span className="font-['SF-Pro-Display-Semibold']">Send Reset Link</span>
                      <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:w-4 sm:group-hover:w-5 transition-all duration-200" />
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-950/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 border border-green-800/40">
                  <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
                </div>
                
                <h1 className={`font-['SF-Pro-Display-Semibold'] text-xl sm:text-2xl font-['SF-Pro-Display-Regular'] mb-1 sm:mb-2 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                  Check Your Email
                </h1>
                
                <p className={`font-['SF-Pro-Display-Semibold'] text-xs sm:text-sm mb-4 sm:mb-6 ${darkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>
                  We&apos;ve sent a password reset link to:
                </p>
                
                <div className={`p-3 rounded-lg mb-4 sm:mb-6 ${darkMode ? 'bg-zinc-800' : 'bg-zinc-50'}`}>
                  <p className={`font-['SF-Pro-Display-Semibold'] text-sm font-['SF-Pro-Display-Regular'] ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                    {email}
                  </p>
                </div>
                
                <p className={`font-['SF-Pro-Display-Semibold'] text-xs sm:text-sm mb-6 sm:mb-8 ${darkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>
                  Click the link in the email to reset your password. If you don&apos;t see the email, check your spam folder.
                </p>

                {/* Error Message for Resend */}
                {error && (
                  <div className="flex items-center space-x-2 p-3 rounded-lg bg-red-950/20 border border-red-800/40 text-red-400 mb-4">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <p className="text-xs">{error}</p>
                  </div>
                )}

                {/* Resend Button */}
                <button
                  onClick={handleResendEmail}
                  disabled={isLoading}
                  className={`w-full py-2 sm:py-2.5 rounded-lg font-['SF-Pro-Display-Regular'] transition-colors ${
                    darkMode 
                      ? "font-['SF-Pro-Display-Semibold'] bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-600" 
                      : "font-['SF-Pro-Display-Semibold'] bg-zinc-100 text-zinc-700 hover:bg-zinc-200 border border-black"
                  } disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm`}
                >
                  {isLoading ? (
                    <div className="font-['SF-Pro-Display-Semibold'] w-3 h-3 sm:w-4 sm:h-4 border-2 border-current border-t-transparent rounded-full animate-spin mx-auto" />
                  ) : (
                    'Resend Email'
                  )}
                </button>
              </div>
            </>
          )}

          {/* Back to Sign In */}
          <div className="mt-6 sm:mt-8 text-center">
            <Link 
              href="/auth" 
              className={`inline-flex items-center space-x-2 text-xs sm:text-sm font-['SF-Pro-Display-Regular'] hover:text-purple-600 transition-colors ${
                darkMode ? 'text-zinc-300' : 'text-zinc-600'
              }`}
            >
              <ArrowLeft className="font-['SF-Pro-Display-Semibold'] w-3 h-3 sm:w-4 sm:h-4" />
              <span className="font-['SF-Pro-Display-Semibold']">Back to Sign In</span>
            </Link>
          </div>
        </div>

        {/* Additional Help */}
        <div className="mt-4 sm:mt-6 text-center">
          <p className={`font-['SF-Pro-Display-Semibold'] text-xs sm:text-sm ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
            Still having trouble?{' '}
            <a 
              href="/help" 
              className={`font-['SF-Pro-Display-Semibold'] text-purple-600 hover:text-purple-500 font-['SF-Pro-Display-Regular']`}
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
