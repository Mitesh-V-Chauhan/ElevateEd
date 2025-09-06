'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/GeneratorHeader';
import Footer from '@/components/Footer';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  MessageSquare, 
  Star, 
  Send, 
  CheckCircle, 
  ArrowLeft,
  Lightbulb,
  Bug,
  Heart,
  Zap,
  Users,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react';
import { submitFeedback } from '@/services/firebaseFunctions/post';

interface FeedbackData {
  overallRating: number;
  experience: string;
  features: string[];
  usageFrequency: string;
  primaryUse: string;
  deviceType: string;
  mostHelpfulFeature: string;
  improvementAreas: string[];
  recommendation: number;
  additionalComments: string;
  contactEmail: string;
}

const FeedbackPage: React.FC = () => {
  const { theme } = useTheme();
  const darkMode = theme === 'dark';
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [feedback, setFeedback] = useState<FeedbackData>({
    overallRating: 0,
    experience: '',
    features: [],
    usageFrequency: '',
    primaryUse: '',
    deviceType: '',
    mostHelpfulFeature: '',
    improvementAreas: [],
    recommendation: 0,
    additionalComments: '',
    contactEmail: ''
  });

  const experienceOptions = [
    { value: 'excellent', label: '🎉 Excellent - Exceeded expectations', icon: '🌟' },
    { value: 'good', label: '👍 Good - Met expectations', icon: '✅' },
    { value: 'average', label: '😐 Average - Could be better', icon: '⚡' },
    { value: 'poor', label: '👎 Poor - Needs improvement', icon: '🔧' },
    { value: 'terrible', label: '😞 Terrible - Major issues', icon: '🚨' }
  ];

  const featuresOptions = [
    { value: 'quiz-generation', label: 'AI Quiz Generation', icon: <Zap className="w-4 h-4" /> },
    { value: 'pdf-upload', label: 'PDF Upload Feature', icon: <Monitor className="w-4 h-4" /> },
    { value: 'text-input', label: 'Text Input Option', icon: <MessageSquare className="w-4 h-4" /> },
    { value: 'difficulty-levels', label: 'Difficulty Levels', icon: <Star className="w-4 h-4" /> },
    { value: 'export-options', label: 'Export Options', icon: <Send className="w-4 h-4" /> },
    { value: 'dark-mode', label: 'Dark Mode Theme', icon: <Heart className="w-4 h-4" /> },
    { value: 'mobile-design', label: 'Mobile Responsiveness', icon: <Smartphone className="w-4 h-4" /> },
    { value: 'user-interface', label: 'User Interface Design', icon: <Users className="w-4 h-4" /> }
  ];

  const usageFrequencyOptions = [
    { value: 'daily', label: 'Daily', description: 'Multiple times per day' },
    { value: 'weekly', label: 'Weekly', description: '2-3 times per week' },
    { value: 'monthly', label: 'Monthly', description: 'A few times per month' },
    { value: 'rarely', label: 'Rarely', description: 'Once in a while' },
    { value: 'first-time', label: 'First Time', description: 'This is my first visit' }
  ];

  const primaryUseOptions = [
    { value: 'education', label: 'Education & Teaching', icon: '🎓' },
    { value: 'training', label: 'Corporate Training', icon: '💼' },
    { value: 'self-learning', label: 'Self-Learning', icon: '📚' },
    { value: 'assessment', label: 'Student Assessment', icon: '📝' },
    { value: 'content-creation', label: 'Content Creation', icon: '✨' },
    { value: 'other', label: 'Other Purpose', icon: '🔧' }
  ];

  const deviceOptions = [
    { value: 'desktop', label: 'Desktop Computer', icon: <Monitor className="w-5 h-5" /> },
    { value: 'laptop', label: 'Laptop', icon: <Monitor className="w-5 h-5" /> },
    { value: 'tablet', label: 'Tablet', icon: <Tablet className="w-5 h-5" /> },
    { value: 'mobile', label: 'Mobile Phone', icon: <Smartphone className="w-5 h-5" /> }
  ];

  const improvementOptions = [
    { value: 'ai-accuracy', label: 'AI Question Accuracy', icon: <Lightbulb className="w-4 h-4" /> },
    { value: 'loading-speed', label: 'Loading Speed', icon: <Zap className="w-4 h-4" /> },
    { value: 'user-interface', label: 'User Interface', icon: <Monitor className="w-4 h-4" /> },
    { value: 'mobile-experience', label: 'Mobile Experience', icon: <Smartphone className="w-4 h-4" /> },
    { value: 'more-features', label: 'Additional Features', icon: <Star className="w-4 h-4" /> },
    { value: 'documentation', label: 'Help & Documentation', icon: <MessageSquare className="w-4 h-4" /> },
    { value: 'bug-fixes', label: 'Bug Fixes', icon: <Bug className="w-4 h-4" /> },
    { value: 'performance', label: 'Overall Performance', icon: <Zap className="w-4 h-4" /> }
  ];

  const handleFeatureToggle = (value: string) => {
    setFeedback(prev => ({
      ...prev,
      features: prev.features.includes(value)
        ? prev.features.filter(f => f !== value)
        : [...prev.features, value]
    }));
  };

  const handleImprovementToggle = (value: string) => {
    setFeedback(prev => ({
      ...prev,
      improvementAreas: prev.improvementAreas.includes(value)
        ? prev.improvementAreas.filter(i => i !== value)
        : [...prev.improvementAreas, value]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await submitFeedback(feedback);
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const StarRating = ({ rating, onRatingChange, label }: { rating: number; onRatingChange: (rating: number) => void; label: string }) => (
    <div className="space-y-2">
      <label className={`block text-sm font-['SF-Pro-Display-Regular'] ${darkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
        {label}
      </label>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            className={`p-1 transition-colors ${
              star <= rating
                ? 'text-yellow-400 hover:text-yellow-500'
                : 'text-zinc-300 dark:text-zinc-600 hover:text-yellow-300'
            }`}
          >
            <Star className={`w-6 h-6 ${star <= rating ? 'fill-current' : ''}`} />
          </button>
        ))}
      </div>
    </div>
  );

  if (isSubmitted) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${
        darkMode ? 'bg-zinc-900' : 'bg-zinc-50'
      }`}>
        <Header />
        
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className={`rounded-2xl border backdrop-blur-xl p-8 sm:p-12 text-center ${
            darkMode ? 'bg-zinc-800/40 border-zinc-700/50' : 'bg-white/70 border-black/50'
          }`}>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 mb-6">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            
            <h1 className={`text-2xl sm:text-3xl font-['SF-Pro-Display-Regular'] mb-4 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
              Thank You for Your Feedback! 🎉
            </h1>
            
            <p className={`text-lg mb-8 ${darkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>
              Your insights are invaluable in helping us improve <span className="exo-2-brand">ElevateEd</span> AI. We&apos;ll review your feedback and use it to enhance your experience.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Link
                href="/generator"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white font-['SF-Pro-Display-Regular'] py-3 px-6 rounded-xl transform transition-all duration-300 hover:scale-105 w-full sm:w-auto justify-center"
              >
                <Zap className="w-4 h-4" />
                <span>Continue Creating Quizzes</span>
              </Link>
              
              <Link
                href="/"
                className={`inline-flex items-center space-x-2 border font-['SF-Pro-Display-Regular'] py-3 px-6 rounded-xl transform transition-all duration-300 hover:scale-105 w-full sm:w-auto justify-center ${
                  darkMode 
                    ? 'border-zinc-600 text-zinc-300 hover:bg-zinc-700' 
                    : 'border-zinc-300 text-zinc-700 hover:bg-zinc-50'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Link>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-zinc-900' : 'bg-zinc-50'
    }`}>
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 mb-6">
            <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          
          <h1 className={`text-3xl sm:text-4xl md:text-5xl font-['SF-Pro-Display-Regular'] mb-6 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
            Help Us Improve{' '}
            <span className="exo-2-brand bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
              ElevateEd AI
            </span>
          </h1>
          
          <p className={`text-lg sm:text-xl max-w-3xl mx-auto ${darkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>
            Your feedback drives our innovation. Share your experience and help us build the best AI-powered quiz generation platform.
          </p>
        </div>

        {/* Feedback Form */}
        <div className={`rounded-2xl border backdrop-blur-xl p-6 sm:p-8 ${
          darkMode ? 'bg-zinc-800/40 border-zinc-700/50' : 'bg-white/70 border-black/50'
        }`}>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Overall Rating */}
            <div>
              <StarRating
                rating={feedback.overallRating}
                onRatingChange={(rating) => setFeedback(prev => ({ ...prev, overallRating: rating }))}
                label="Overall Experience Rating ⭐"
              />
            </div>

            {/* Experience Selection */}
            <div>
              <label className={`block text-sm font-['SF-Pro-Display-Regular'] mb-4 ${darkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                How would you describe your experience with <span className="exo-2-brand">ElevateEd</span> AI? 🎯
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {experienceOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFeedback(prev => ({ ...prev, experience: option.value }))}
                    className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                      feedback.experience === option.value
                        ? 'border-purple-500 bg-purple-500/10'
                        : darkMode
                          ? 'border-zinc-600 hover:border-zinc-500 hover:bg-zinc-700/50'
                          : 'border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{option.icon}</span>
                      <span className={`text-sm font-['SF-Pro-Display-Regular'] ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                        {option.label}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Features Liked */}
            <div>
              <label className={`block text-sm font-['SF-Pro-Display-Regular'] mb-4 ${darkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                Which features do you find most valuable? (Select all that apply) ✨
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {featuresOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleFeatureToggle(option.value)}
                    className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                      feedback.features.includes(option.value)
                        ? 'border-green-500 bg-green-500/10'
                        : darkMode
                          ? 'border-zinc-600 hover:border-zinc-500 hover:bg-zinc-700/50'
                          : 'border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`${feedback.features.includes(option.value) ? 'text-green-500' : darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                        {option.icon}
                      </div>
                      <span className={`text-sm font-['SF-Pro-Display-Regular'] ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                        {option.label}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Usage Frequency */}
            <div>
              <label className={`block text-sm font-['SF-Pro-Display-Regular'] mb-4 ${darkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                How often do you use <span className="exo-2-brand">ElevateEd</span> AI? 📅
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {usageFrequencyOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFeedback(prev => ({ ...prev, usageFrequency: option.value }))}
                    className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                      feedback.usageFrequency === option.value
                        ? 'border-blue-500 bg-blue-500/10'
                        : darkMode
                          ? 'border-zinc-600 hover:border-zinc-500 hover:bg-zinc-700/50'
                          : 'border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50'
                    }`}
                  >
                    <div className={`font-['SF-Pro-Display-Regular'] ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                      {option.label}
                    </div>
                    <div className={`text-xs mt-1 ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                      {option.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Primary Use Case */}
            <div>
              <label className={`block text-sm font-['SF-Pro-Display-Regular'] mb-4 ${darkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                What&apos;s your primary use case for <span className="exo-2-brand">ElevateEd</span> AI? 🎯
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {primaryUseOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFeedback(prev => ({ ...prev, primaryUse: option.value }))}
                    className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                      feedback.primaryUse === option.value
                        ? 'border-orange-500 bg-orange-500/10'
                        : darkMode
                          ? 'border-zinc-600 hover:border-zinc-500 hover:bg-zinc-700/50'
                          : 'border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{option.icon}</span>
                      <span className={`text-sm font-['SF-Pro-Display-Regular'] ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                        {option.label}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Device Type */}
            <div>
              <label className={`block text-sm font-['SF-Pro-Display-Regular'] mb-4 ${darkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                What device do you primarily use <span className="exo-2-brand">ElevateEd</span> AI on? 📱
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {deviceOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFeedback(prev => ({ ...prev, deviceType: option.value }))}
                    className={`p-4 rounded-xl border-2 text-center transition-all duration-200 ${
                      feedback.deviceType === option.value
                        ? 'border-pink-500 bg-pink-500/10'
                        : darkMode
                          ? 'border-zinc-600 hover:border-zinc-500 hover:bg-zinc-700/50'
                          : 'border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50'
                    }`}
                  >
                    <div className={`mb-2 ${feedback.deviceType === option.value ? 'text-pink-500' : darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                      {option.icon}
                    </div>
                    <div className={`text-sm font-['SF-Pro-Display-Regular'] ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                      {option.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Most Helpful Feature */}
            <div>
              <label className={`block text-sm font-['SF-Pro-Display-Regular'] mb-3 ${darkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                Which feature has been most helpful to you? 🌟
              </label>
              <textarea
                value={feedback.mostHelpfulFeature}
                onChange={(e) => setFeedback(prev => ({ ...prev, mostHelpfulFeature: e.target.value }))}
                placeholder="Tell us about the feature that's made the biggest impact on your workflow..."
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 resize-none h-24 ${
                  darkMode
                    ? 'bg-zinc-700/50 border-zinc-600 text-white placeholder-zinc-400 focus:border-purple-500'
                    : 'bg-white border-zinc-300 text-zinc-900 placeholder-zinc-500 focus:border-purple-500'
                } focus:outline-none`}
              />
            </div>

            {/* Areas for Improvement */}
            <div>
              <label className={`block text-sm font-['SF-Pro-Display-Regular'] mb-4 ${darkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                What areas could we improve? (Select all that apply) 🔧
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {improvementOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleImprovementToggle(option.value)}
                    className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                      feedback.improvementAreas.includes(option.value)
                        ? 'border-yellow-500 bg-yellow-500/10'
                        : darkMode
                          ? 'border-zinc-600 hover:border-zinc-500 hover:bg-zinc-700/50'
                          : 'border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`${feedback.improvementAreas.includes(option.value) ? 'text-yellow-500' : darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                        {option.icon}
                      </div>
                      <span className={`text-sm font-['SF-Pro-Display-Regular'] ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                        {option.label}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Recommendation Score */}
            <div>
              <div className="space-y-2">
                <label className={`block text-sm font-['SF-Pro-Display-Regular'] ${darkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                  How likely are you to recommend <span className="exo-2-brand">ElevateEd</span> AI to others? 💯
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedback(prev => ({ ...prev, recommendation: star }))}
                      className={`p-1 transition-colors ${
                        star <= feedback.recommendation
                          ? 'text-yellow-400 hover:text-yellow-500'
                          : 'text-zinc-300 dark:text-zinc-600 hover:text-yellow-300'
                      }`}
                    >
                      <Star className={`w-6 h-6 ${star <= feedback.recommendation ? 'fill-current' : ''}`} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Additional Comments */}
            <div>
              <label className={`block text-sm font-['SF-Pro-Display-Regular'] mb-3 ${darkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                Any additional comments or suggestions? 💭
              </label>
              <textarea
                value={feedback.additionalComments}
                onChange={(e) => setFeedback(prev => ({ ...prev, additionalComments: e.target.value }))}
                placeholder="Share any other thoughts, ideas, or feedback you have about ElevateEd AI..."
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 resize-none h-32 ${
                  darkMode
                    ? 'bg-zinc-700/50 border-zinc-600 text-white placeholder-zinc-400 focus:border-purple-500'
                    : 'bg-white border-zinc-300 text-zinc-900 placeholder-zinc-500 focus:border-purple-500'
                } focus:outline-none`}
              />
            </div>

            {/* Contact Email */}
            <div>
              <label className={`block text-sm font-['SF-Pro-Display-Regular'] mb-3 ${darkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                Email (Optional) - For follow-up questions 📧
              </label>
              <input
                type="email"
                value={feedback.contactEmail}
                onChange={(e) => setFeedback(prev => ({ ...prev, contactEmail: e.target.value }))}
                placeholder="your.email@example.com"
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                  darkMode
                    ? 'bg-zinc-700/50 border-zinc-600 text-white placeholder-zinc-400 focus:border-purple-500'
                    : 'bg-white border-zinc-300 text-zinc-900 placeholder-zinc-500 focus:border-purple-500'
                } focus:outline-none`}
              />
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4 pt-6">
              <Link
                href="/"
                className={`inline-flex items-center space-x-2 font-['SF-Pro-Display-Regular'] py-3 px-6 rounded-xl transition-all duration-300 w-full sm:w-auto justify-center ${
                  darkMode 
                    ? 'text-zinc-400 hover:text-white' 
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Link>
              
              <button
                type="submit"
                disabled={isSubmitting || !feedback.overallRating}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white font-['SF-Pro-Display-Regular'] py-3 px-8 rounded-xl transform transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none w-full sm:w-auto justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Feedback</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default FeedbackPage;
