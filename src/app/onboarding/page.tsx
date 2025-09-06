"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, User, MapPin, Megaphone, Target, GraduationCap, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { updateUser } from '@/services/firebaseFunctions/update';

interface OnboardingData {
  location: string;
  hearAboutUs: string;
  primaryGoal: string;
  educationLevel: string;
  studyTime: string;
  subjectsOfInterest: string[];
}

const OnboardingPage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  useTheme();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<OnboardingData>({
    location: '',
    hearAboutUs: '',
    primaryGoal: '',
    educationLevel: '',
    studyTime: '',
    subjectsOfInterest: []
  });

  const totalSteps = 6;

  useEffect(() => {
    if (!user) {
      router.push('/auth');
      return;
    }

    // If user has already completed onboarding, redirect to home
    if (user.onboarding_completed) {
      console.log('User has already completed onboarding, redirecting to home...');
      router.push('/home');
      return;
    }
  }, [user, router]);

  const questions = [
    {
      id: 1,
      title: "Where are you from?",
      subtitle: "This helps us personalize content for your region",
      icon: <MapPin className="w-6 h-6" />,
      field: 'location' as keyof OnboardingData,
      type: 'input',
      placeholder: "e.g., New York, USA"
    },
    {
      id: 2,
      title: "How did you hear about ElevateEd?",
      subtitle: "We'd love to know how you discovered us",
      icon: <Megaphone className="w-6 h-6" />,
      field: 'hearAboutUs' as keyof OnboardingData,
      type: 'select',
      options: [
        'Social Media (Instagram, Twitter, Facebook)',
        'Search Engine (Google, Bing)',
        'Friend or Family Recommendation',
        'YouTube or Educational Content',
        'School or University',
        'Blog or Article',
        'App Store',
        'Other'
      ]
    },
    {
      id: 3,
      title: "What's your primary goal?",
      subtitle: "This helps us recommend the best tools for you",
      icon: <Target className="w-6 h-6" />,
      field: 'primaryGoal' as keyof OnboardingData,
      type: 'select',
      options: [
        'Improve Study Efficiency',
        'Create Study Materials',
        'Language Learning',
        'Exam Preparation',
        'Research and Summarization',
        'Homework Assistance',
        'Professional Development',
        'General Knowledge Enhancement'
      ]
    },
    {
      id: 4,
      title: "What's your education level?",
      subtitle: "This helps us adjust content difficulty",
      icon: <GraduationCap className="w-6 h-6" />,
      field: 'educationLevel' as keyof OnboardingData,
      type: 'select',
      options: [
        'Middle School (6th-8th Grade)',
        'High School (9th-12th Grade)',
        'College/University Student',
        'Graduate Student',
        'Working Professional',
        'Lifelong Learner',
        'Educator/Teacher',
        'Other'
      ]
    },
    {
      id: 5,
      title: "How much time do you typically study per day?",
      subtitle: "This helps us suggest appropriate study sessions",
      icon: <Clock className="w-6 h-6" />,
      field: 'studyTime' as keyof OnboardingData,
      type: 'select',
      options: [
        'Less than 1 hour',
        '1-2 hours',
        '2-4 hours',
        '4-6 hours',
        '6-8 hours',
        'More than 8 hours',
        'Varies significantly'
      ]
    },
    {
      id: 6,
      title: "What subjects interest you most?",
      subtitle: "Select all that apply (you can always change this later)",
      icon: <User className="w-6 h-6" />,
      field: 'subjectsOfInterest' as keyof OnboardingData,
      type: 'multiselect',
      options: [
        'Mathematics',
        'Science (Physics, Chemistry, Biology)',
        'History',
        'Literature and English',
        'Foreign Languages',
        'Computer Science',
        'Business and Economics',
        'Arts and Design',
        'Philosophy',
        'Psychology',
        'Engineering',
        'Medicine and Health',
        'Law',
        'Environmental Studies',
        'Other'
      ]
    }
  ];

  const currentQuestion = questions[currentStep - 1];

  const handleInputChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      [currentQuestion.field]: value
    }));
  };

  const handleMultiSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      subjectsOfInterest: prev.subjectsOfInterest.includes(value)
        ? prev.subjectsOfInterest.filter(item => item !== value)
        : [...prev.subjectsOfInterest, value]
    }));
  };

  const canProceed = () => {
    const currentValue = formData[currentQuestion.field];
    if (currentQuestion.type === 'multiselect') {
      return Array.isArray(currentValue) && currentValue.length > 0;
    }
    return currentValue && currentValue.toString().trim() !== '';
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      const onboardingData = {
        ...formData,
        onboarding_completed: true,
        onboarding_completed_at: new Date().toISOString()
      };

      console.log('Updating user with onboarding data:', onboardingData);
      const result = await updateUser(user.id, onboardingData);
      console.log('Update result:', result);
      
      console.log('User data updated, refreshing AuthContext...');
      // Refresh user data in AuthContext to reflect onboarding completion
      await refreshUser();
      
      // Add a small delay to ensure the refresh is complete
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('AuthContext refreshed, redirecting to home...');
      // Now redirect to home
      router.push('/home');
    } catch (error) {
      console.error('Error saving onboarding data:', error);
      alert('There was an error saving your preferences. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-zinc-900 dark:to-zinc-800">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-600 dark:text-zinc-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show loading if user has completed onboarding (will redirect)
  if (user.onboarding_completed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-zinc-900 dark:to-zinc-800">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-600 dark:text-zinc-400">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-zinc-900 dark:to-zinc-800 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
              {Math.round((currentStep / totalSteps) * 100)}%
            </span>
          </div>
          <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              {currentQuestion.icon}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                {currentQuestion.title}
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 mt-1">
                {currentQuestion.subtitle}
              </p>
            </div>
          </div>

          {/* Question Content */}
          <div className="space-y-4">
            {currentQuestion.type === 'input' && (
              <input
                type="text"
                value={formData[currentQuestion.field] as string}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder={currentQuestion.placeholder}
                className="w-full p-4 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              />
            )}

            {currentQuestion.type === 'select' && (
              <div className="space-y-3">
                {currentQuestion.options?.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleInputChange(option)}
                    className={`w-full p-4 text-left rounded-lg border transition-all ${
                      formData[currentQuestion.field] === option
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                        : 'border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 hover:border-purple-300 dark:hover:border-purple-700'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {currentQuestion.type === 'multiselect' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQuestion.options?.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleMultiSelectChange(option)}
                    className={`p-4 text-left rounded-lg border transition-all ${
                      formData.subjectsOfInterest.includes(option)
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                        : 'border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 hover:border-purple-300 dark:hover:border-purple-700'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-6 py-3 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>

          {currentStep === totalSteps ? (
            <button
              onClick={handleSubmit}
              disabled={!canProceed() || isSubmitting}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Completing...
                </>
              ) : (
                <>
                  Complete Setup
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
