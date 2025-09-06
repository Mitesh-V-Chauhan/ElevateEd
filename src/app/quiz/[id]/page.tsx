"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronDown, Clock, CheckCircle, XCircle, RotateCcw, ArrowLeft } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useQuiz } from '@/contexts/QuizContext';
import { Quiz, QuizSubmissions } from '@/services/interfaces/interface';
import { getQuiz } from '@/services/firebaseFunctions/get';
import { submitQuiz } from '@/services/firebaseFunctions/post';
import { updateQuiz } from '@/services/firebaseFunctions/update';
import { checkQuizSubmissionLimit, updateDailyQuizCount } from '@/services/firebaseFunctions/limits';
import ProtectedRoute from '@/components/ProtectedRoute';

const QuizPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const quizId = Array.isArray(params.id) ? params.id[0] : params.id;
  const { theme } = useTheme();
  const { user } = useAuth();
  const { setQuizInProgress } = useQuiz();
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string | number | boolean>>({});
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [quizStartTime, setQuizStartTime] = useState<Date | null>(null);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackData, setFeedbackData] = useState({
    rating: 0,
    experience: '',
    improvements: ''
  });
  const [, setFeedbackSubmitted] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState<number | null>(null);
  const [, setSubmissionRemaining] = useState<number>(5);
  const [canSubmitQuiz, setCanSubmitQuiz] = useState<boolean>(true);
  
  const darkMode = theme === 'dark';
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const calculateScore = useCallback(() => {
    if (!quiz) return 0;
    
    let correctAnswers = 0;
    quiz.questions.forEach((question, index) => {
      const userAnswer = userAnswers[index + 1];
      if (userAnswer === question.correct) {
        correctAnswers++;
      }
    });
    
    return Math.round((correctAnswers / quiz.questions.length) * 100);
  }, [quiz, userAnswers]);

  const handleSubmitQuiz = useCallback(async () => {
    if (!quiz || !user || !canSubmitQuiz) return;

    const endTime = new Date();
    const timeTaken = quizStartTime ? Math.floor((endTime.getTime() - quizStartTime.getTime()) / 1000) : 0;
    const score = calculateScore();

    const submission: QuizSubmissions = {
      attempt_number: quiz.submissions.length + 1,
      time_taken: timeTaken,
      submittedAt: endTime,
      answers: userAnswers,
      score: score
    };

    try {
      console.log('🔄 Submitting quiz...');
      const res = await submitQuiz(user.id, quizId as string, submission);
      console.log('📤 Submit response:', res);
      
      if(res.status !== 200) {
        alert('Failed to submit quiz. Please try again.');
        return;
      }
      
      console.log('🔍 Current quiz submissions:', quiz.submissions);
      console.log('🆔 New submission ID:', res.id);
      
      const currentSubmissions = quiz.submissions || [];
      const updateData = { 
        submissions: [...currentSubmissions, res.id],
        total_submissions: (quiz.total_submissions || 0) + 1,
        list_score: [...(quiz.list_score || []), submission.score]
      };
      console.log('📝 Update data:', updateData);
      
      await updateQuiz(user.id, quizId as string, updateData);
      console.log('✅ Quiz updated successfully');
      
      // Show feedback modal only for first-time attempts
      if ((quiz.total_submissions || 0) === 0) {
        setShowFeedbackModal(true); // Show feedback modal for first attempt
        // Don't start countdown yet - wait for feedback completion
      } else {
        setShowResults(true); // Skip directly to results for subsequent attempts
        setRedirectCountdown(10); // Start countdown for subsequent attempts
      }
      
      setQuizInProgress(false);
      
      // Update daily quiz count
      await updateDailyQuizCount(user.id);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Failed to submit quiz. Please try again.');
    }
  }, [quiz, user, canSubmitQuiz, quizStartTime, calculateScore, userAnswers, quizId, setQuizInProgress]);

  // Load quiz data
  useEffect(() => {
    const loadQuiz = async () => {
      if (!user || !quizId) return;
      
      try {
        const quizData = await getQuiz(user.id, quizId as string);
        if (quizData) {
          setQuiz(quizData);
          setQuizInProgress(true);
          
          // Set up timer if quiz has time limit
          if (quizData.time_limit && quizData.time_limit > 0) {
            setTimeRemaining(quizData.time_limit);
            setQuizStartTime(new Date());
          }
          
          // Check submission limits
          const submissionLimit = await checkQuizSubmissionLimit(user.id, quizId as string);
          setSubmissionRemaining(submissionLimit.remaining);
          setCanSubmitQuiz(submissionLimit.canSubmit);
        } else {
          alert('Quiz not found');
          router.push('/generator');
        }
      } catch (error) {
        console.error('Error loading quiz:', error);
        alert('Failed to load quiz');
        router.push('/generator');
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [user, quizId, router, setQuizInProgress]);

  // Timer effect
  useEffect(() => {
    if (timeRemaining !== null && timeRemaining > 0 && !showResults) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev === null || prev <= 1) {
            setIsTimeUp(true);
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timeRemaining, showResults, handleSubmitQuiz]);

  // Redirect countdown effect
  useEffect(() => {
    if (redirectCountdown !== null && redirectCountdown > 0) {
      const timeout = setTimeout(() => {
        setRedirectCountdown(redirectCountdown - 1);
      }, 1000);
      return () => clearTimeout(timeout);
    } else if (redirectCountdown === 0) {
      router.push('/history');
    }
  }, [redirectCountdown, router]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answer: string | number | boolean) => {
    if (!quiz) return;
    
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion + 1]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (!quiz) return;
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setUserAnswers({});
    setShowResults(false);
    setIsTimeUp(false);
    setRedirectCountdown(null);
    
    if (quiz?.time_limit && quiz.time_limit > 0) {
      setTimeRemaining(quiz.time_limit);
      setQuizStartTime(new Date());
    }
    
    setQuizInProgress(true);
  };

  const handleFeedbackSubmit = async () => {
    if (!user || !quizId || feedbackData.rating === 0) {
      alert('Please provide a rating before submitting feedback.');
      return;
    }

    try {
      // Save feedback to the quiz document
      await updateQuiz(user.id, quizId as string, {
        feedback: {
          rating: feedbackData.rating,
          experience: feedbackData.experience,
          improvements: feedbackData.improvements,
          submittedAt: new Date()
        }
      });

      setFeedbackSubmitted(true);
      setShowFeedbackModal(false);
      setShowResults(true);
      setRedirectCountdown(10); // Start countdown after feedback completion
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    }
  };

  const handleSkipFeedback = () => {
    setShowFeedbackModal(false);
    setShowResults(true);
    setRedirectCountdown(10); // Start countdown after skipping feedback
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-zinc-900' : 'bg-zinc-50'}`}>
          <div className="max-w-4xl mx-auto px-6 py-16 flex justify-center items-center">
            <div className="text-center">
              <div className="animate-spin h-12 w-12 border-b-2 border-purple-600 rounded-full mx-auto mb-4"></div>
              <p className="text-zinc-600 dark:text-zinc-300">Loading quiz...</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!quiz) {
    return (
      <ProtectedRoute>
        <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-zinc-900' : 'bg-zinc-50'}`}>
          <div className="max-w-4xl mx-auto px-6 py-16 text-center">
            <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h3 className="text-xl font-['SF-Pro-Display-Regular'] text-zinc-900 dark:text-white mb-2">
              Quiz not found
            </h3>
            <button
              onClick={() => router.push('/generator')}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Generator</span>
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const currentQuestionData = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  if (showResults) {
    const score = calculateScore();
    const correctAnswers = Math.round((score / 100) * quiz.questions.length);
    
    return (
      <ProtectedRoute>
        <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-zinc-900' : 'bg-zinc-50'}`}>
          <div className="max-w-4xl mx-auto px-6 py-16">
            <div className={`rounded-2xl border backdrop-blur-xl p-8 text-center ${darkMode ? 'bg-zinc-800/40 border-zinc-700/50' : 'bg-white/70 border-black/50'}`}>
              <div className="mb-8">
                <div className={`text-6xl font-['SF-Pro-Display-Regular'] mb-4 ${score >= 80 ? 'text-green-500' : score >= 60 ? 'text-yellow-500' : 'text-red-500'}`}>
                  {score}%
                </div>
                <h2 className="text-2xl font-['SF-Pro-Display-Regular'] text-zinc-900 dark:text-white mb-2">
                  Quiz Completed!
                </h2>
                <p className="text-zinc-600 dark:text-zinc-300">
                  You got {correctAnswers} out of {quiz.questions.length} questions correct
                </p>
              </div>

              {isTimeUp && (
                <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg">
                  <p className="text-red-800 dark:text-red-300">⏰ Time&apos;s up! Quiz submitted automatically.</p>
                </div>
              )}

              {redirectCountdown !== null && (
                <div className="mb-6 p-4 bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg">
                  <p className="text-blue-800 dark:text-blue-300">
                    Redirecting to history in {redirectCountdown} seconds...
                  </p>
                </div>
              )}

              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  onClick={() => router.push('/history')}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>View History</span>
                </button>
                
                <button
                  onClick={resetQuiz}
                  className="flex items-center space-x-2 px-6 py-3 bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-xl hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
                  disabled={!canSubmitQuiz}
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>Retake Quiz</span>
                </button>
                
                <button
                  onClick={() => router.push('/generator')}
                  className="flex items-center space-x-2 px-6 py-3 bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-xl hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>New Quiz</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-zinc-900' : 'bg-zinc-50'}`}>
        {/* Header */}
        <div className={`border-b backdrop-blur-xl ${darkMode ? 'bg-zinc-800/40 border-zinc-700/50' : 'bg-white/70 border-black/50'}`}>
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-['SF-Pro-Display-Regular'] text-zinc-900 dark:text-white">
                  {quiz.title}
                </h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 capitalize">
                  {quiz.quiz_type === 'mcq' ? 'Multiple Choice' : quiz.quiz_type === 'truefalse' ? 'True/False' : 'Short Answer'} • {quiz.difficulty}
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                {timeRemaining !== null && (
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-lg ${timeRemaining <= 60 ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'}`}>
                    <Clock className="w-4 h-4" />
                    <span className="font-mono">{formatTime(timeRemaining)}</span>
                  </div>
                )}
                
                <div className="text-sm text-zinc-500 dark:text-zinc-400">
                  {currentQuestion + 1} / {quiz.questions.length}
                </div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4">
              <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className={`rounded-2xl border backdrop-blur-xl p-8 ${darkMode ? 'bg-zinc-800/40 border-zinc-700/50' : 'bg-white/70 border-black/50'}`}>
            <h2 className="text-2xl font-['SF-Pro-Display-Regular'] text-zinc-900 dark:text-white mb-6">
              Question {currentQuestion + 1}
            </h2>
            
            <p className="text-lg text-zinc-700 dark:text-zinc-300 mb-8">
              {currentQuestionData.question}
            </p>

            {/* Answer Options */}
            <div className="space-y-4 mb-8">
              {currentQuestionData.type === 'mcq' && currentQuestionData.options?.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    userAnswers[currentQuestion + 1] === index
                      ? 'bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-600 text-purple-800 dark:text-purple-200'
                      : darkMode
                      ? 'bg-zinc-700/50 border-zinc-600 text-zinc-300 hover:bg-zinc-600/50'
                      : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-600 text-sm font-['SF-Pro-Display-Regular']">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span>{option}</span>
                  </div>
                </button>
              ))}

              {currentQuestionData.type === 'truefalse' && (
                <div className="space-y-4">
                  <button
                    onClick={() => handleAnswerSelect(true)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      userAnswers[currentQuestion + 1] === true
                        ? 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-600 text-green-800 dark:text-green-200'
                        : darkMode
                        ? 'bg-zinc-700/50 border-zinc-600 text-zinc-300 hover:bg-zinc-600/50'
                        : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5" />
                      <span>True</span>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => handleAnswerSelect(false)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      userAnswers[currentQuestion + 1] === false
                        ? 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-600 text-red-800 dark:text-red-200'
                        : darkMode
                        ? 'bg-zinc-700/50 border-zinc-600 text-zinc-300 hover:bg-zinc-600/50'
                        : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <XCircle className="w-5 h-5" />
                      <span>False</span>
                    </div>
                  </button>
                </div>
              )}

              {currentQuestionData.type === 'short' && (
                <textarea
                  value={userAnswers[currentQuestion + 1] as string || ''}
                  onChange={(e) => handleAnswerSelect(e.target.value)}
                  placeholder="Type your answer here..."
                  className={`w-full p-4 rounded-xl border resize-none ${
                    darkMode 
                      ? 'bg-zinc-700/50 border-zinc-600 text-zinc-300 placeholder-zinc-500'
                      : 'bg-white border-zinc-200 text-zinc-700 placeholder-zinc-400'
                  }`}
                  rows={4}
                />
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestion === 0}
                className="flex items-center space-x-2 px-6 py-3 bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-xl hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              {currentQuestion === quiz.questions.length - 1 ? (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={!canSubmitQuiz}
                  className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>Submit Quiz</span>
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all"
                >
                  <span>Next</span>
                  <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md rounded-2xl p-6 ${darkMode ? 'bg-zinc-800' : 'bg-white'}`}>
            <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>
              How was your quiz experience?
            </h3>
            
            {/* Rating */}
            <div className="mb-4">
              <p className={`text-sm font-medium mb-2 ${darkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                Rate your experience (1-5 stars)
              </p>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setFeedbackData(prev => ({ ...prev, rating: star }))}
                    className={`text-2xl ${
                      star <= feedbackData.rating ? 'text-yellow-400' : 'text-zinc-300'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div className="mb-4">
              <p className={`text-sm font-medium mb-2 ${darkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                How would you describe your experience?
              </p>
              <div className="grid grid-cols-2 gap-2">
                {['Excellent', 'Good', 'Average', 'Poor'].map((option) => (
                  <button
                    key={option}
                    onClick={() => setFeedbackData(prev => ({ ...prev, experience: option }))}
                    className={`p-2 rounded-lg border text-sm transition-all ${
                      feedbackData.experience === option
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                        : 'border-zinc-300 dark:border-zinc-600 hover:border-purple-300 dark:hover:border-purple-700'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Improvements */}
            <div className="mb-6">
              <p className={`text-sm font-medium mb-2 ${darkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                What could we improve?
              </p>
              <div className="grid grid-cols-1 gap-2">
                {['Question clarity', 'Quiz difficulty', 'User interface', 'Loading speed', 'Other'].map((option) => (
                  <button
                    key={option}
                    onClick={() => setFeedbackData(prev => ({ ...prev, improvements: option }))}
                    className={`p-2 rounded-lg border text-sm text-left transition-all ${
                      feedbackData.improvements === option
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                        : 'border-zinc-300 dark:border-zinc-600 hover:border-purple-300 dark:hover:border-purple-700'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3">
              <button
                onClick={handleSkipFeedback}
                className={`flex-1 py-2 px-4 rounded-lg border transition-all ${
                  darkMode
                    ? 'border-zinc-600 text-zinc-300 hover:bg-zinc-700'
                    : 'border-zinc-300 text-zinc-700 hover:bg-zinc-50'
                }`}
              >
                Skip
              </button>
              <button
                onClick={handleFeedbackSubmit}
                disabled={feedbackData.rating === 0}
                className="flex-1 py-2 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
};

export default QuizPage;
