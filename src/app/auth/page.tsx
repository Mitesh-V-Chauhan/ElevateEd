'use client';

import React, { useState, useEffect } from 'react';
import { 
  Brain, Mail, Lock, User, Eye, EyeOff, ArrowRight, 
  Zap, Shield, List, BarChart3, Share2
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function SplitAuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);
  const { theme } = useTheme();
  const { login, register, googleLogin } = useAuth();
  const darkMode = theme === 'dark';

  const router = useRouter();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    username: '',
    agreeToTerms: false
  });

  const features = [
    { icon: <Brain />, title: "AI-Powered Analysis" },
    { icon: <Zap />, title: "Lightning Fast Generation" },
    { icon: <Shield />, title: "Secure & Private" },
    { icon: <List />, title: "Multiple Quiz Types" },
    { icon: <BarChart3 />, title: "Variable Difficulty Levels" },
    { icon: <Share2 />, title: "Export & Share Easily" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [features.length]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (isSignUp) {
        if (formData.password !== formData.confirmPassword) {
          console.error('Passwords do not match.');
          setIsLoading(false);
          return;
        }
        await register(formData.email, formData.password, formData.username);
      } else {
        await login(formData.email, formData.password);
      }
      window.location.href = '/generator';
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred. Please try again.';
      console.error('Auth error:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await googleLogin();
      window.location.href = '/generator';
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during Google login. Please try again.';
      console.error('Google login error:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      username: '',
      agreeToTerms: false
    });
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleForgotPassword = async () => {
    router.push('/forgot_password');
  };

  return (
    <div className={`h-screen flex items-center justify-center p-8 sm:p-4 lg:p-6 transition-colors duration-300 ${
      darkMode ? 'bg-zinc-950' : 'bg-zinc-100'
    }`}>
      <div className="flex flex-col xl:flex-row w-full max-w-7xl xl:h-[750px] gap-3 sm:gap-4 lg:gap-8">
        {/* Left Side - Auth Form (Unchanged) */}
        <div className={`w-full xl:w-2/5 flex flex-col px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 py-4 sm:py-6 xl:py-0 rounded-xl sm:rounded-2xl transition-colors duration-300 ${
          darkMode ? 'bg-zinc-900 border border-zinc-800' : 'bg-white border'
        }`}>
            {/* Logo at top center */}
            <div className="flex items-center justify-center space-x-2 pt-2 sm:pt-4 xl:pt-6 mb-3 sm:mb-4 xl:mb-6">
                <span className="exo-2-brand text-[24px] sm:text-[32px] lg:text-[40px] bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
                    ElevateEd
                </span>
            </div>

            {/* Form Container */}
            <div className="flex-1 flex flex-col justify-center py-1 sm:py-2 xl:py-4">
                <div className="w-full max-w-sm mx-auto">
                    {/* Header */}
                    <div className="mb-3 sm:mb-4 xl:mb-6">
                        <h1 className={`text-lg sm:text-xl lg:text-2xl font-['SF-Pro-Display-Regular'] mb-1 sm:mb-2 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                            {isSignUp ? 'Create your account' : 'Welcome back'}
                        </h1>
                        <p className={`text-xs sm:text-sm font-['SF-Pro-Display-Regular'] ${darkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>
                            {isSignUp 
                            ? 'Start your AI-powered learning journey today' 
                            : 'Sign in to continue your learning progress'
                            }
                        </p>
                    </div>

                    {/* Form */}
                    <div className="space-y-2 sm:space-y-3 xl:space-y-4">
                        {isSignUp && (
                            <div>
                                <label className={`block text-xs font-['SF-Pro-Display-Regular'] mb-1 ${darkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>Username</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-zinc-400" />
                                    <input type="text" name="username" value={formData.username} onChange={handleInputChange} required={isSignUp} className={`w-full pl-8 sm:pl-9 pr-3 py-2 sm:py-2.5 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors font-['SF-Pro-Display-Regular'] ${darkMode ? 'bg-zinc-800 border-zinc-600 text-white placeholder-zinc-400' : 'bg-white border-zinc-300 text-zinc-900 placeholder-zinc-500'}`} placeholder="Enter the Username" />
                                </div>
                            </div>
                        )}
                        <div>
                            <label className={`block text-xs font-['SF-Pro-Display-Regular'] mb-1 ${darkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-zinc-400" />
                                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className={`w-full pl-8 sm:pl-9 pr-3 py-2 sm:py-2.5 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors font-['SF-Pro-Display-Regular'] ${darkMode ? 'bg-zinc-800 border-zinc-600 text-white placeholder-zinc-400' : 'bg-white border-zinc-300 text-zinc-900 placeholder-zinc-500'}`} placeholder="Enter your email" />
                            </div>
                        </div>
                        <div>
                            <label className={`block text-xs font-['SF-Pro-Display-Regular'] mb-1 ${darkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-zinc-400" />
                                <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleInputChange} required className={`w-full pl-8 sm:pl-9 pr-9 sm:pr-10 py-2 sm:py-2.5 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors font-['SF-Pro-Display-Regular'] ${darkMode ? 'bg-zinc-800 border-zinc-600 text-white placeholder-zinc-400' : 'bg-white border-zinc-300 text-zinc-900 placeholder-zinc-500'}`} placeholder="Enter your password" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-600">
                                    {showPassword ? <EyeOff className="w-3 h-3 sm:w-4 sm:h-4" /> : <Eye className="w-3 h-3 sm:w-4 sm:h-4" />}
                                </button>
                            </div>
                        </div>
                        {isSignUp && (
                            <div>
                                <label className={`block text-xs font-['SF-Pro-Display-Regular'] mb-1 ${darkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>Confirm Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-zinc-400" />
                                    <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} required={isSignUp} className={`w-full pl-8 sm:pl-9 pr-9 sm:pr-10 py-2 sm:py-2.5 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors font-['SF-Pro-Display-Regular'] ${darkMode ? 'bg-zinc-800 border-zinc-600 text-white placeholder-zinc-400' : 'bg-white border-zinc-300 text-zinc-900 placeholder-zinc-500'}`} placeholder="Confirm your password" />
                                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-600">
                                        {showConfirmPassword ? <EyeOff className="w-3 h-3 sm:w-4 sm:h-4" /> : <Eye className="w-3 h-3 sm:w-4 sm:h-4" />}
                                    </button>
                                </div>
                            </div>
                        )}
                        {isSignUp && (
                            <div className="flex items-start space-x-2">
                                <input type="checkbox" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleInputChange} required={isSignUp} className="mt-0.5 w-3 h-3 text-purple-600 border-zinc-400 rounded focus:ring-purple-500" />
                                <label className={`text-xs font-['SF-Pro-Display-Regular'] ${darkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>
                                    I agree to the <a href="/terms" className="text-purple-600 hover:text-purple-500 font-['SF-Pro-Display-Regular']">Terms of Service</a> and <a href="/privacy" className="text-purple-600 hover:text-purple-500 font-['SF-Pro-Display-Regular']">Privacy Policy</a>
                                </label>
                            </div>
                        )}
                        {!isSignUp && (
                            <div className="text-right">
                                <button onClick={() => handleForgotPassword()} disabled={isLoading} className="text-xs text-purple-600 hover:text-purple-500 font-['SF-Pro-Display-Regular']">
                                    Forgot your password?
                                </button>
                            </div>
                        )}
                        <button onClick={handleSubmit} disabled={isLoading || (isSignUp && !formData.agreeToTerms)} className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white py-2 sm:py-2.5 rounded-lg font-['SF-Pro-Display-Regular'] transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm group">
                            {isLoading ? <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><span>{isSignUp ? 'Create Account' : 'Sign In'}</span><ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:w-4 sm:group-hover:w-5 transition-all duration-200" /></>}
                        </button>
                    </div>

                    {/* Divider and Social Login */}
                    <div className="my-2 sm:my-3 xl:my-4">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center"><div className={`w-full border-t ${darkMode ? 'border-zinc-600' : 'border-zinc-300'}`} /></div>
                            <div className="relative flex justify-center text-xs"><span className={`px-3 font-['SF-Pro-Display-Regular'] ${darkMode ? 'bg-zinc-900 text-zinc-400' : 'bg-white text-zinc-500'}`}>Or continue with</span></div>
                        </div>
                    </div>
                    <div className="mb-2 sm:mb-3 xl:mb-4">
                        <button className={`w-full flex items-center justify-center space-x-2 sm:space-x-3 py-2 sm:py-2.5 px-4 border rounded-lg font-['SF-Pro-Display-Regular'] transition-colors ${ darkMode ? 'border-zinc-600 text-zinc-300 hover:bg-zinc-800' : 'border-zinc-300 text-zinc-700 hover:bg-zinc-50' }`} onClick={handleGoogleLogin}>
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                            <span className="text-xs sm:text-sm font-['SF-Pro-Display-Regular']">Continue with Google</span>
                        </button>
                    </div>

                    {/* Toggle Auth Mode */}
                    <div className="text-center">
                        <p className={`text-xs font-['SF-Pro-Display-Regular'] ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                            <button type="button" onClick={toggleAuthMode} className="text-purple-600 hover:text-purple-500 font-['SF-Pro-Display-Regular']">
                                {isSignUp ? 'Sign in' : 'Sign up'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {/* Right Side - Minimalist Branding & Features */}
        <div className={`w-full xl:w-3/5 relative rounded-2xl overflow-hidden border flex flex-col items-center justify-center p-8 text-center transition-colors duration-300
            bg-zinc-100 border-zinc-200
            dark:bg-zinc-900 dark:border-zinc-800
        `}>
            {/* Grainy effect overlay */}
            <div className="absolute inset-0 grainy opacity-5 dark:opacity-10"></div>

            {/* Background Gradient Aurora */}
            <div
              className="absolute -top-1/4 -left-1/4 w-[150%] h-[150%] transition-opacity duration-300
                opacity-[0.15] dark:opacity-25"
              style={{
                backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(168, 85, 247, 0.4), transparent 40%), radial-gradient(circle at 80% 70%, rgba(236, 72, 153, 0.4), transparent 40%)',
              }}
            />

            {/* Main Content */}
            <div className="relative z-10 flex-grow flex flex-col items-center justify-center">
                <h2 className="exo-2-brand text-6xl md:text-7xl lg:text-8xl bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 bg-clip-text text-transparent mb-4">
                    ElevateEd
                </h2>
                <p className="font-['SF-Pro-Display-Regular'] text-lg md:text-xl text-zinc-600 dark:text-zinc-300 max-w-lg">
                    Smarter tools for focused learning, all powered by AI.
                </p>
            </div>

            {/* Minimalist Feature Showcase */}
            <div className="relative z-10 w-full min-h-[96px] pt-8 mt-8 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-center">
                <div key={currentFeature} className="flex flex-col items-center justify-center space-y-4 animate-fade-in">
                    <div className="text-purple-600 dark:text-purple-400">
                        {React.cloneElement(features[currentFeature].icon, { className: "w-8 h-8" })}
                    </div>
                    <p className="font-['SF-Pro-Display-Regular'] text-base text-zinc-800 dark:text-zinc-200">
                        {features[currentFeature].title}
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}