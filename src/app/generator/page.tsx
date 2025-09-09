"use client"

import React, { useState, useRef, useEffect, Suspense, useCallback } from 'react';
import Link from 'next/link';
import { ChevronDown, Download, FileText, Zap, CheckCircle, XCircle, RotateCcw, Clock, History, AlertTriangle, Star, MessageSquare } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useUniversalInput } from '@/contexts/InputContext';
import { baseUrl } from '@/utils/urls';
import { Quiz, QuizSubmissions } from '@/services/interfaces/interface';
import { useAuth } from '@/contexts/AuthContext';
import { useQuiz } from '@/contexts/QuizContext';
import { createQuiz, submitQuiz } from '@/services/firebaseFunctions/post';
import { updateQuiz } from '@/services/firebaseFunctions/update';
import {  useRouter, useSearchParams } from 'next/navigation';
import { getQuiz } from '@/services/firebaseFunctions/get';
import ProtectedRoute from '@/components/ProtectedRoute';
import {checkQuizSubmissionLimit, checkDailyGenerationLimit, updateDailyGenerationCount, LIMITS } from '@/services/firebaseFunctions/limits';

const QuizGeneratorContent: React.FC = () => {
  const params = useSearchParams().get('quizId') || '';
  const paramId = Array.isArray(params) ? params[0] : params;
  const { theme } = useTheme();
  const { inputContent } = useUniversalInput();
  const [quizType, setQuizType] = useState('mcq');
  const [difficulty, setDifficulty] = useState('medium');
  const [questionCount, setQuestionCount] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] = useState<Quiz | null>(null);
  const [quizId, setQuizId] = useState<string>("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string | number | boolean>>({});
  const [showResults, setShowResults] = useState(false);
  const [isQuizTypeDropdownOpen, setIsQuizTypeDropdownOpen] = useState(false);
  const [isDifficultyDropdownOpen, setIsDifficultyDropdownOpen] = useState(false);
  const [enableTimeLimit] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [quizStartTime, setQuizStartTime] = useState<Date | null>(null);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState<number | null>(null);
  
  // Feedback states
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackData, setFeedbackData] = useState({
    rating: 0,
    experience: '',
    improvements: ''
  });
  
  // Limit tracking states
  const [dailyGenerationRemaining, setDailyGenerationRemaining] = useState<number>(LIMITS.DAILY_GENERATION_LIMIT);
  const [canCreateQuiz, setCanCreateQuiz] = useState<boolean>(true);
  const [submissionRemaining, setSubmissionRemaining] = useState<number>(LIMITS.MAX_QUIZ_SUBMISSIONS);
  const [canSubmitQuiz, setCanSubmitQuiz] = useState<boolean>(true);
  const [isCheckingLimits, setIsCheckingLimits] = useState<boolean>(false);

  const { user } = useAuth();
  const { setQuizInProgress } = useQuiz();

  const dropdownRef = useRef<HTMLDivElement>(null);
  const darkMode = theme === 'dark';
  const router = useRouter();

  // Function to check daily generation limits
  const checkLimits = useCallback(async () => {
    if (!user) return;
    
    setIsCheckingLimits(true);
    try {
      // Check universal generation limit
      const dailyGenerationLimit = await checkDailyGenerationLimit(user.id);
      setDailyGenerationRemaining(dailyGenerationLimit.remaining);
      setCanCreateQuiz(dailyGenerationLimit.canGenerate);
      
      // If we have a quiz loaded, check submission limits
      if (quizId) {
        const submissionLimit = await checkQuizSubmissionLimit(user.id, quizId);
        setSubmissionRemaining(submissionLimit.remaining);
        setCanSubmitQuiz(submissionLimit.canSubmit);
      }
    } catch (error) {
      console.error('Error checking limits:', error);
    } finally {
      setIsCheckingLimits(false);
    }
  }, [user, quizId]);

  useEffect(() => {
    const loadOrGenerate = async () => {
      if (!user) return;

      if (paramId) {
        const existing = await getQuiz(user.id, paramId);  // assume returns full Quiz
        if (existing && existing.id) {
          // Redirect to quiz page instead of loading it here
          router.push(`/quiz/${existing.id}`);
          return;
        }
      }
      
      // Check limits after loading quiz data
      await checkLimits();
    };
    loadOrGenerate();
  }, [user, paramId, checkLimits, router]);

  // Check limits when user changes
  useEffect(() => {
    if (user) {
      checkLimits();
    }
  }, [user, checkLimits]);

  // Calculate time limit based on difficulty and question count
  const calculateTimeLimit = () => {
    let baseTimePerQuestion = 60; // 1 minute per question for medium difficulty
    
    switch (difficulty) {
      case 'easy':
        baseTimePerQuestion = 45; // 45 seconds per question
        break;
      case 'medium':
        baseTimePerQuestion = 60; // 1 minute per question
        break;
      case 'hard':
        baseTimePerQuestion = 75; // 1 minute 15 seconds per question
        break;
    }
    
    return questionCount * baseTimePerQuestion; // Total time in seconds
  };

  // Timer effect
  useEffect(() => {
    if (enableTimeLimit && timeRemaining !== null && timeRemaining > 0 && generatedQuiz && !showResults && !isTimeUp) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev === null || prev <= 1) {
            // Time's up - show alert and start countdown
            setIsTimeUp(true);
            setRedirectCountdown(10);
            alert('Time\'s up! Your quiz will be automatically submitted in 10 seconds.');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [enableTimeLimit, timeRemaining, generatedQuiz, showResults, isTimeUp]);

  // Countdown effect for redirect after time up
  useEffect(() => {
    if (isTimeUp && redirectCountdown !== null && redirectCountdown > 0) {
      const countdownTimer = setTimeout(() => {
        setRedirectCountdown(prev => {
          if (prev === null || prev <= 1) {
            // Time to redirect - submit quiz and show results
            setQuizInProgress(false); // Clear quiz state when auto-submitting
            setShowResults(true);
            setIsTimeUp(false);
            setRedirectCountdown(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearTimeout(countdownTimer);
    }
  }, [isTimeUp, redirectCountdown, setQuizInProgress]);

  // Format time for display
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Calculate actual time spent
  const calculateTimeSpent = () => {
    if (!quizStartTime) return 'Unknown';
    
    const endTime = new Date();
    const timeSpentMs = endTime.getTime() - quizStartTime.getTime();
    const timeSpentSeconds = Math.floor(timeSpentMs / 1000);
    
    if (enableTimeLimit) {
      const totalTime = calculateTimeLimit();
      const actualTimeUsed = Math.min(timeSpentSeconds, totalTime);
      return formatTime(actualTimeUsed);
    }
    
    return formatTime(timeSpentSeconds);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsQuizTypeDropdownOpen(false);
        setIsDifficultyDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Function to extract text from PDF - No longer needed as MainLayout handles this
  /*
  const extractTextFromPDF = async (file: File) => {
    setIsLoadingTranscript(true);
    try {
      const formData = new FormData();
      formData.append('pdf_file', file);

      const response = await fetch(`${baseUrl}/api/v1/extract-text`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (response.ok) {
        // No longer setting transcript directly, using universal input
      } else {
        alert(data.detail || 'Failed to extract text from PDF');
      }

    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      alert('Failed to extract text from PDF');
    } finally {
      setIsLoadingTranscript(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Please select a PDF file');
        return;
      }
      extractTextFromPDF(file);
    }
  };
  */

  const quizTypes = [
    { id: 'mcq', name: 'Multiple Choice', icon: '📝' },
    { id: 'truefalse', name: 'True/False', icon: '✓✗' },
    { id: 'short', name: 'Short Answer', icon: '💭' },
    { id: 'mix', name: 'Mixed Format', icon: '🔀' },
  ];

  const difficulties = [
    { id: 'easy', name: 'Easy', color: 'text-green-500' },
    { id: 'medium', name: 'Medium', color: 'text-yellow-500' },
    { id: 'hard', name: 'Hard', color: 'text-red-500' },
  ];

  // Enhanced sample quiz with more questions
  

  const handleGenerateQuiz = async () => {
  if (!inputContent.trim() || inputContent.length < 100) {
    alert('Please enter at least 100 characters of content.');
    return;
  }

  if (!user) {
    alert('Please log in to generate a quiz.');
    return;
  }

  // Check daily generation limit
  const dailyGenerationLimit = await checkDailyGenerationLimit(user.id);
  if (!dailyGenerationLimit.canGenerate) {
    alert(`Daily generation limit reached! You can create ${LIMITS.DAILY_GENERATION_LIMIT} items per day across all features. Try again tomorrow.`);
    return;
  }

  setIsGenerating(true);

  try {
    const response = await fetch(`${baseUrl}/api/v1/generateQuestions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputContent,
          numbers: questionCount,
          difficulty: difficulty,
          quiz_type: quizType,
          userId: user.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to generate quiz');
      }

      const data = await response.json();
      if(process.env.NODE_ENV === 'development'){
      console.log('API Response:', data); // Debug log
      console.log('Questions in response:', data.questions); // Debug log
      }
      
      setCurrentQuestion(0);
      setUserAnswers({});
      setShowResults(false);

      const quizObj: Quiz = {
        title: data?.title || "No Title Found",
        quiz_type: quizType,
        difficulty: difficulty,
        number: questionCount,
        time_limit: calculateTimeLimit(),
        generatedAt: new Date(),
        updatesAt: new Date(),
        list_score: [],
        questions: data.questions || [], // Add fallback
        submissions: [],
        total_submissions: 0
      }
      
      if(process.env.NODE_ENV === 'development'){
      console.log('Quiz object created:', quizObj); // Debug log
      }

      // Validate quiz has questions before proceeding
      if (!quizObj.questions || quizObj.questions.length === 0) {
        console.error('No questions in quiz object:', quizObj);
        alert('Failed to generate quiz questions. Please try again.');
        return;
      }

      if(user) {
        const userId: string = user.id;
        const res = await createQuiz(userId, quizObj);
        if(res.status == 200){
          setQuizId(res.id);
          if(process.env.NODE_ENV === 'development'){
          console.log('Quiz created successfully, quizId:', res.id); // Debug log
          }
          // Update daily generation count
          await updateDailyGenerationCount(userId);
          // Refresh limits
          await checkLimits();
          // Redirect to quiz page
          router.push(`/quiz/${res.id}`);
          return; // Exit early to prevent further execution
        }else{
          alert('Failed to create quiz. Please try again.');
          return;
        }
      }

      
    } catch (error) {
      console.error('Error generating quiz:', error);
      alert('Failed to generate quiz. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  

  const handleAnswerSelect = (questionId: number, answer: string | number | boolean) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmitQuiz = async () => {
    if (!generatedQuiz) return;
    
    // Check submission limit
    if (user && quizId) {
      const submissionLimit = await checkQuizSubmissionLimit(user.id, quizId);
      if (!submissionLimit.canSubmit) {
        alert(`Submission limit reached! You can only submit ${LIMITS.MAX_QUIZ_SUBMISSIONS} attempts per quiz.`);
        return;
      }
    }
    
    // Check if all questions are answered (only if not submitted due to time limit)
    if (timeRemaining === null || timeRemaining > 0) {
      const unansweredQuestions = generatedQuiz.questions.filter(q => 
        userAnswers[q.id] === undefined || userAnswers[q.id] === null
      );
      
      if (unansweredQuestions.length > 0) {
        const proceed = confirm(`You have ${unansweredQuestions.length} unanswered questions. Submit anyway?`);
        if (!proceed) return;
      }
    }
    
    // Stop the timer and submit quiz
    
    if(user?.id && quizId && userAnswers){
      const timeSpent = timeRemaining !== null ? calculateTimeLimit() - timeRemaining : calculateTimeLimit();
      const submissionObj: QuizSubmissions = {
        attempt_number: generatedQuiz.total_submissions + 1,
        time_taken: timeSpent,
        submittedAt: new Date(),
        answers: userAnswers,
        score: calculateScore(),
      }
      const res = await submitQuiz(user.id, quizId, submissionObj);
      await updateQuiz(user.id, quizId, {total_submissions: generatedQuiz.total_submissions+1, list_score: [...generatedQuiz.list_score, submissionObj.score], submissions: [...generatedQuiz.submissions, res.id]});
      if(res.status !== 200) {
        alert('Failed to submit quiz. Please try again.');
        return;
      }
      // Refresh limits after successful submission
      await checkLimits();
    }
    setTimeRemaining(null);
    setQuizInProgress(false); // Mark quiz as completed
    
    // Show feedback modal only for first-time attempts
    if (generatedQuiz.total_submissions === 0) {
      setShowFeedbackModal(true); // Show feedback modal for first attempt
    } else {
      setShowResults(true); // Skip directly to results for subsequent attempts
    }
  };

  const calculateScore = () => {
    if (!generatedQuiz) return 0;
    let correct = 0;
    let gradableQuestions = 0;
    
    generatedQuiz.questions.forEach(q => {
      if (q.type === 'short') {
        // Short answer questions are not auto-gradable
        return;
      }
      gradableQuestions++;
      if (userAnswers[q.id] === q.correct) correct++;
    });
    
    if (gradableQuestions === 0) return 0;
    return Math.round((correct / gradableQuestions) * 100);
  };

  const handleFeedbackSubmit = async () => {
    if (!user || !quizId || feedbackData.rating === 0) {
      alert('Please provide a rating before submitting feedback.');
      return;
    }

    try {
      // Save feedback to the quiz document
      await updateQuiz(user.id, quizId, {
        feedback: {
          rating: feedbackData.rating,
          experience: feedbackData.experience,
          improvements: feedbackData.improvements,
          submittedAt: new Date()
        }
      });

      setShowFeedbackModal(false);
      setShowResults(true);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    }
  };

  const handleSkipFeedback = () => {
    setShowFeedbackModal(false);
    setShowResults(true);
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return "Excellent! Outstanding performance! 🎉";
    if (score >= 80) return "Great job! Very good understanding! 👏";
    if (score >= 70) return "Good work! Keep it up! 👍";
    if (score >= 60) return "Not bad! Room for improvement. 📚";
    return "Keep studying! You'll get there! 💪";
  };

  const exportToPDF = () => {
    if (!generatedQuiz) return;
    
    // Enhanced PDF export simulation
    const score = calculateScore();
    const gradableQuestions = generatedQuiz.questions.filter(q => q.type !== 'short');
    const correctCount = gradableQuestions.filter(q => userAnswers[q.id] === q.correct).length;
    const shortAnswerQuestions = generatedQuiz.questions.filter(q => q.type === 'short');
    
    const results = `Quiz Results Summary:
    
Title: ${generatedQuiz.title}
${gradableQuestions.length > 0 ? `Auto-Graded Score: ${score}%` : 'Score: Manual review required'}
${gradableQuestions.length > 0 ? `Correct Answers: ${correctCount} / ${gradableQuestions.length}` : ''}
${shortAnswerQuestions.length > 0 ? `Short Answer Questions: ${shortAnswerQuestions.length} (requires manual review)` : ''}
Date: ${new Date().toLocaleDateString()}

Questions and Answers:
${generatedQuiz.questions.map((q, index) => {
  const userAnswer = userAnswers[q.id];
  let userAnswerText = 'Not answered';
  let correctAnswerText = '';
  
  if (q.type === 'mcq' && q.options) {
    userAnswerText = userAnswer !== undefined && typeof userAnswer === 'number' ? q.options[userAnswer] || 'Not answered' : 'Not answered';
    correctAnswerText = q.options[q.correct as number];
  } else if (q.type === 'truefalse') {
    userAnswerText = userAnswer !== undefined ? (userAnswer ? 'True' : 'False') : 'Not answered';
    correctAnswerText = q.correct ? 'True' : 'False';
  } else if (q.type === 'short') {
    userAnswerText = typeof userAnswer === 'string' ? userAnswer : 'Not answered';
    correctAnswerText = q.correct ? `Sample Answer: ${q.correct}` : 'Sample answer not provided';
  }
  
  const isCorrect = q.type === 'short' ? 'Requires manual review' : (userAnswers[q.id] === q.correct ? '✓ Correct' : '✗ Incorrect');
  
  return `
${index + 1}. ${q.question}
Your Answer: ${userAnswerText}
${q.type === 'short' ? correctAnswerText : `Correct Answer: ${correctAnswerText}`}
${isCorrect}
`;
}).join('')}`;

    // Create and download blob
    const blob = new Blob([results], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quiz-results-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetQuiz = async () => {
    // Check if user can still submit
    if (user && quizId) {
      const submissionLimit = await checkQuizSubmissionLimit(user.id, quizId);
      if (!submissionLimit.canSubmit) {
        alert(`You have reached the maximum number of submissions (${LIMITS.MAX_QUIZ_SUBMISSIONS}) for this quiz.`);
        return;
      }
    }
    
    setUserAnswers({});
    setShowResults(false);
    setCurrentQuestion(0);
    setQuizInProgress(true); // Mark quiz as in progress again
    // Reset timer if enabled
    if (enableTimeLimit) {
      setTimeRemaining(calculateTimeLimit());
      setQuizStartTime(new Date());
    }
    
    // Refresh limits
    await checkLimits();
  };

  const restartFromBeginning = () => {
    setGeneratedQuiz(null);
    setUserAnswers({});
    setShowResults(false);
    setCurrentQuestion(0);
    setTimeRemaining(null);
    setQuizStartTime(null);
    setQuizInProgress(false); // Clear quiz state
  };

  return (
    <ProtectedRoute>
    <div className={`h-full overflow-y-auto transition-colors duration-300 ${darkMode ? 'bg-zinc-950' : 'bg-zinc-50'}`} ref={dropdownRef}>
      <div className="p-6">
        {/* Debug info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-4 p-2 bg-blue-100 dark:bg-blue-900 text-xs">
            Debug: generatedQuiz={generatedQuiz ? 'exists' : 'null'}, showResults={showResults.toString()}, questions={generatedQuiz?.questions?.length || 0}
          </div>
        )}
        {!generatedQuiz ? (
          /* Configuration Section */
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className={`text-3xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                AI Quiz Generator
              </h2>
              <p className={`text-lg ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                Configure your quiz settings and generate from your sidebar content
              </p>
              
              {/* Content Status */}
              <div className={`mt-4 p-4 rounded-lg border ${
                inputContent.length >= 100 
                  ? darkMode ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'
                  : darkMode ? 'bg-amber-900/20 border-amber-800' : 'bg-amber-50 border-amber-200'
              }`}>
                <div className="flex items-center justify-center space-x-2">
                  <FileText className={`w-5 h-5 ${
                    inputContent.length >= 100 ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'
                  }`} />
                  <span className={`font-medium ${
                    inputContent.length >= 100 
                      ? 'text-green-700 dark:text-green-300' 
                      : 'text-amber-700 dark:text-amber-300'
                  }`}>
                    {inputContent.length >= 100 
                      ? `Content ready: ${inputContent.length} characters`
                      : `Need more content: ${inputContent.length}/100 characters`
                    }
                  </span>
                </div>
                {inputContent.length < 100 && (
                  <p className={`text-sm mt-1 ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>
                    Add more content to the sidebar to enable quiz generation
                  </p>
                )}
              </div>

              {/* Limits Display */}
              {!isCheckingLimits && (
                <div className="flex justify-center items-center space-x-6 mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm text-blue-700 dark:text-blue-300">
                      Daily Generations: {dailyGenerationRemaining} remaining (all features)
                    </span>
                  </div>
                </div>
              )}
              
              {/* Warning for limits */}
              {!canCreateQuiz && (
                <div className="flex items-center justify-center space-x-2 mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                  <span className="text-sm text-red-700 dark:text-red-300">
                    Daily generation limit reached. You can create {LIMITS.DAILY_GENERATION_LIMIT} items per day across all features.
                  </span>
                </div>
              )}
              
              {/* Quick Access to History */}
              <div className="flex justify-center mt-4">
                <Link
                  href="/history"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-sm"
                >
                  <History className="w-4 h-4" />
                  <span>View Quiz History</span>
                </Link>
              </div>
            </div>

            {/* Configuration Card */}
            <div className={`rounded-xl p-6 border ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                Quiz Configuration
              </h3>
              
              {/* Configuration Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Quiz Type */}
                <div className="relative">
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                    Quiz Type
                  </label>
                  <button
                    onClick={() => {
                      setIsQuizTypeDropdownOpen(!isQuizTypeDropdownOpen);
                      setIsDifficultyDropdownOpen(false);
                    }}
                    className={`w-full border rounded-lg px-4 py-3 text-left flex items-center justify-between transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-20 ${
                      darkMode 
                        ? 'bg-zinc-800 border-zinc-700 text-white hover:border-purple-500' 
                        : 'bg-white border-zinc-300 text-zinc-900 hover:border-purple-300'
                    }`}
                  >
                    <span>{quizTypes.find(t => t.id === quizType)?.name}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isQuizTypeDropdownOpen ? 'rotate-180' : ''} ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}`} />
                  </button>
                  {isQuizTypeDropdownOpen && (
                    <div className={`absolute top-full left-0 right-0 mt-1 border rounded-lg shadow-lg z-10 ${
                      darkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-zinc-200'
                    }`}>
                      {quizTypes.map(type => (
                        <button
                          key={type.id}
                          onClick={() => {
                            setQuizType(type.id);
                            setIsQuizTypeDropdownOpen(false);
                          }}
                          className={`w-full px-4 py-3 text-left first:rounded-t-lg last:rounded-b-lg flex items-center space-x-3 transition-colors ${
                            quizType === type.id 
                              ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' 
                              : darkMode ? 'text-white hover:bg-zinc-700' : 'text-zinc-900 hover:bg-zinc-50'
                          }`}
                        >
                          <span>{type.icon}</span>
                          <span>{type.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Difficulty */}
                <div className="relative">
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                    Difficulty
                  </label>
                  <button
                    onClick={() => {
                      setIsDifficultyDropdownOpen(!isDifficultyDropdownOpen);
                      setIsQuizTypeDropdownOpen(false);
                    }}
                    className={`w-full border rounded-lg px-4 py-3 text-left flex items-center justify-between transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-20 ${
                      darkMode 
                        ? 'bg-zinc-800 border-zinc-700 text-white hover:border-purple-500' 
                        : 'bg-white border-zinc-300 text-zinc-900 hover:border-purple-300'
                    }`}
                  >
                    <span className={difficulties.find(d => d.id === difficulty)?.color}>
                      {difficulties.find(d => d.id === difficulty)?.name}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isDifficultyDropdownOpen ? 'rotate-180' : ''} ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}`} />
                  </button>
                  {isDifficultyDropdownOpen && (
                    <div className={`absolute top-full left-0 right-0 mt-1 border rounded-lg shadow-lg z-10 ${
                      darkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-zinc-200'
                    }`}>
                      {difficulties.map(diff => (
                        <button
                          key={diff.id}
                          onClick={() => {
                            setDifficulty(diff.id);
                            setIsDifficultyDropdownOpen(false);
                          }}
                          className={`w-full px-4 py-3 text-left first:rounded-t-lg last:rounded-b-lg transition-colors ${
                            difficulty === diff.id 
                              ? 'bg-purple-50 dark:bg-purple-900/30' 
                              : darkMode ? 'hover:bg-zinc-700' : 'hover:bg-zinc-50'
                          }`}
                        >
                          <span className={diff.color}>{diff.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Question Count */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                    Questions
                  </label>
                  <select
                    value={questionCount}
                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                    className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-20 ${
                      darkMode 
                        ? 'bg-zinc-800 border-zinc-700 text-white focus:border-purple-500' 
                        : 'bg-white border-zinc-300 text-zinc-900 focus:border-purple-300'
                    }`}
                  >
                    <option value={5}>5 Questions</option>
                    <option value={10}>10 Questions</option>
                    <option value={15}>15 Questions</option>
                    <option value={20}>20 Questions</option>
                  </select>
                </div>
              </div>

              {/* Time Limit Configuration */}
              <div className="mb-6">
                <label className={`block text-sm font-medium mb-3 ${darkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                  Time Limit (Automatically Set)
                </label>
                {enableTimeLimit && (
                  <div className={`border rounded-lg p-4 ${darkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-100 border-zinc-200'}`}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <p className={darkMode ? 'text-zinc-400' : 'text-zinc-600'}>Easy</p>
                        <p className="font-semibold text-green-600 dark:text-green-400">
                          {formatTime(questionCount * 45)}
                        </p>
                        <p className="text-xs text-zinc-500">45 sec/question</p>
                      </div>
                      <div className="text-center">
                        <p className={darkMode ? 'text-zinc-400' : 'text-zinc-600'}>Medium</p>
                        <p className="font-semibold text-yellow-600 dark:text-yellow-400">
                          {formatTime(questionCount * 60)}
                        </p>
                        <p className="text-xs text-zinc-500">1 min/question</p>
                      </div>
                      <div className="text-center">
                        <p className={darkMode ? 'text-zinc-400' : 'text-zinc-600'}>Hard</p>
                        <p className="font-semibold text-red-600 dark:text-red-400">
                          {formatTime(questionCount * 75)}
                        </p>
                        <p className="text-xs text-zinc-500">1:15 min/question</p>
                      </div>
                    </div>
                    <div className="mt-3 text-center">
                      <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                        Your quiz will have: {formatTime(calculateTimeLimit())}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerateQuiz}
                disabled={inputContent.length < 100 || isGenerating || !canCreateQuiz || isCheckingLimits}
                className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Generating Quiz...</span>
                  </>
                ) : isCheckingLimits ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Checking Limits...</span>
                  </>
                ) : !canCreateQuiz ? (
                  <>
                    <AlertTriangle className="w-5 h-5" />
                    <span>Daily Limit Reached</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    <span>Generate AI Quiz</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : !showResults ? (
          /* Quiz Section */
          <div className="space-y-4">
            {/* Quiz Header */}
            <div className={`rounded-lg border p-4 ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <h2 className={`text-xl font-semibold break-words ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                  {generatedQuiz.title}
                </h2>
                <div className="flex flex-col xs:flex-row xs:items-center gap-2">
                  <div className="flex flex-row justify-center gap-2">
                    {enableTimeLimit && timeRemaining !== null && (
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium ${
                        timeRemaining <= 300
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                          : timeRemaining <= 600
                          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                          : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                      }`}>
                        <Clock className="w-4 h-4" />
                        <span className="font-mono">{formatTime(timeRemaining)}</span>
                      </div>
                    )}
                    {isTimeUp && redirectCountdown !== null && (
                      <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 animate-pulse">
                        <Clock className="w-4 h-4" />
                        <span className="font-mono">Auto-submit in {redirectCountdown}s</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-row justify-center gap-2">
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center">
                      Question {currentQuestion + 1} of {generatedQuiz.questions.length}
                    </span>
                    <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs">
                      <FileText className="w-3 h-3" />
                      <span>{submissionRemaining} left</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Submission limit warning */}
              {!canSubmitQuiz && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                    <span className="text-sm text-red-700 dark:text-red-300">
                      Maximum submissions reached for this quiz ({LIMITS.MAX_QUIZ_SUBMISSIONS}/{LIMITS.MAX_QUIZ_SUBMISSIONS})
                    </span>
                  </div>
                </div>
              )}
              
              {/* Progress Bar */}
              <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / generatedQuiz.questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Current Question */}
            <div className={`rounded-lg border p-6 ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
              {generatedQuiz.questions.map((question, index) => (
                <div
                  key={question.id}
                  className={index === currentQuestion ? 'block' : 'hidden'}
                >
                  <h3 className="text-lg sm:text-xl font-['SF-Pro-Display-Regular'] text-zinc-900 dark:text-white mb-4 sm:mb-6 break-words">
                    {question.question}
                  </h3>

                  {question.type === 'mcq' && question.options && (
                    <div className="flex flex-col gap-3">
                      {question.options.map((option, optionIndex) => (
                        <button
                          key={optionIndex}
                          onClick={() => handleAnswerSelect(question.id, optionIndex)}
                          className={`w-full p-3 sm:p-4 text-left rounded-lg border-2 transition-all text-base sm:text-lg flex items-center gap-2 sm:gap-3
                            ${userAnswers[question.id] === optionIndex
                              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 dark:border-purple-400 scale-[1.03] shadow-md'
                              : 'border-black dark:border-zinc-600 hover:border-purple-300 dark:hover:border-purple-500 dark:bg-zinc-700'}
                          `}
                          style={{ minHeight: '48px' }}
                        >
                          <span className="font-['SF-Pro-Display-Regular'] text-zinc-900 dark:text-white">{String.fromCharCode(65 + optionIndex)}.</span>
                          <span className="text-zinc-900 dark:text-white ml-2 break-words">{option}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {question.type === 'truefalse' && (
                    <div className="flex flex-col gap-3">
                      <button
                        onClick={() => handleAnswerSelect(question.id, true)}
                        className={`w-full p-3 sm:p-4 text-left rounded-lg border-2 transition-all text-base sm:text-lg flex items-center gap-2 sm:gap-3
                          ${userAnswers[question.id] === true
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/30 dark:border-green-400 scale-[1.03] shadow-md'
                            : 'border-black dark:border-zinc-600 hover:border-green-300 dark:hover:border-green-500 dark:bg-zinc-700'}
                        `}
                        style={{ minHeight: '48px' }}
                      >
                        <CheckCircle className="w-5 h-5 inline mr-2 text-green-500" />
                        <span className="text-zinc-900 dark:text-white">True</span>
                      </button>
                      <button
                        onClick={() => handleAnswerSelect(question.id, false)}
                        className={`w-full p-3 sm:p-4 text-left rounded-lg border-2 transition-all text-base sm:text-lg flex items-center gap-2 sm:gap-3
                          ${userAnswers[question.id] === false
                            ? 'border-red-500 bg-red-50 dark:bg-red-900/30 dark:border-red-400 scale-[1.03] shadow-md'
                            : 'border-black dark:border-zinc-600 hover:border-red-300 dark:hover:border-red-500 dark:bg-zinc-700'}
                        `}
                        style={{ minHeight: '48px' }}
                      >
                        <XCircle className="w-5 h-5 inline mr-2 text-red-500" />
                        <span className="text-zinc-900 dark:text-white">False</span>
                      </button>
                    </div>
                  )}

                  {question.type === 'short' && (
                    <div>
                      <textarea
                        value={typeof userAnswers[question.id] === 'string' ? userAnswers[question.id] as string : ''}
                        onChange={(e) => handleAnswerSelect(question.id, e.target.value)}
                        placeholder="Enter your answer here..."
                        rows={4}
                        className="w-full p-3 sm:p-4 border-2 border-black dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-20 focus:border-purple-300 dark:focus:border-purple-500 text-zinc-900 dark:text-white bg-white dark:bg-zinc-700 placeholder-zinc-400 dark:placeholder-zinc-500 resize-none text-base sm:text-lg"
                        style={{ minHeight: '48px' }}
                      />
                      <div className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                        {typeof userAnswers[question.id] === 'string' ? (userAnswers[question.id] as string).length : 0} characters
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
                className="px-6 py-3 bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-colors"
              >
                Previous
              </button>
              
              {currentQuestion < generatedQuiz.questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestion(currentQuestion + 1)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl  transform  transition-all"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={!canSubmitQuiz}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl  transform  transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
                >
                  {!canSubmitQuiz ? (
                    <>
                      <AlertTriangle className="w-4 h-4" />
                      <span>Limit Reached</span>
                    </>
                  ) : (
                    <span>Submit Quiz</span>
                  )}
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Results Section */
          <div className="space-y-6">
            {/* Score Card */}
            <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-100 dark:border-zinc-700 p-4 sm:p-8 text-center flex flex-col items-center gap-6">
              <div className="flex flex-col items-center gap-4 w-full">
                <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-2 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 flex items-center justify-center">
                  <span className="text-2xl sm:text-3xl font-['SF-Pro-Display-Regular'] text-white">{calculateScore()}%</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-['SF-Pro-Display-Regular'] text-zinc-900 dark:text-white mb-1">Quiz Complete!</h3>
                <div className="space-y-1 sm:space-y-2 w-full">
                  {(() => {
                    const gradableQuestions = generatedQuiz.questions.filter(q => q.type !== 'short');
                    const shortAnswerQuestions = generatedQuiz.questions.filter(q => q.type === 'short');
                    const correctCount = gradableQuestions.filter(q => userAnswers[q.id] === q.correct).length;
                    return (
                      <>
                        {gradableQuestions.length > 0 && (
                          <p className="text-zinc-600 dark:text-zinc-300 text-sm sm:text-base">
                            Auto-graded score: {calculateScore()}% ({correctCount} out of {gradableQuestions.length} correct)
                          </p>
                        )}
                        {enableTimeLimit && (
                          <p className="text-blue-600 dark:text-blue-400 text-xs sm:text-sm">
                            Time spent: {calculateTimeSpent()} {timeRemaining === 0 ? '(Time limit reached)' : ''}
                          </p>
                        )}
                        {shortAnswerQuestions.length > 0 && (
                          <p className="text-orange-600 dark:text-orange-400 text-xs sm:text-sm">
                            {shortAnswerQuestions.length} short answer question{shortAnswerQuestions.length > 1 ? 's' : ''} require{shortAnswerQuestions.length === 1 ? 's' : ''} manual review
                          </p>
                        )}
                      </>
                    );
                  })()}
                  <p className="text-base sm:text-lg font-['SF-Pro-Display-Regular'] text-purple-600 dark:text-purple-400 mt-2">
                    {getScoreMessage(calculateScore())}
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 w-full mt-2">
                <button
                  onClick={resetQuiz}
                  disabled={!canSubmitQuiz}
                  className="flex items-center gap-2 w-full sm:w-auto justify-center px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-['SF-Pro-Display-Regular'] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {!canSubmitQuiz ? (
                    <>
                      <AlertTriangle className="w-4 h-4" />
                      <span>Limit Reached</span>
                    </>
                  ) : (
                    <>
                      <RotateCcw className="w-4 h-4" />
                      <span>Retake Quiz</span>
                    </>
                  )}
                </button>
                <button
                  onClick={exportToPDF}
                  className="flex items-center gap-2 w-full sm:w-auto justify-center px-4 py-3 bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-xl font-['SF-Pro-Display-Regular'] hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Results</span>
                </button>
                <Link
                  href="/history"
                  className="flex items-center gap-2 w-full sm:w-auto justify-center px-4 py-3 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-xl font-['SF-Pro-Display-Regular'] hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                >
                  <History className="w-4 h-4" />
                  <span>View History</span>
                </Link>
                <button
                  onClick={restartFromBeginning}
                  className="flex items-center gap-2 w-full sm:w-auto justify-center px-4 py-3 border border-black dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 rounded-xl font-['SF-Pro-Display-Regular'] hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span>Create New Quiz</span>
                </button>
              </div>
            </div>

            {/* Detailed Results */}
            <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-100 dark:border-zinc-700 p-8">
              <h4 className="text-xl font-['SF-Pro-Display-Regular'] text-zinc-900 dark:text-white mb-6">Detailed Results</h4>
              
              <div className="space-y-6">
                {generatedQuiz.questions.map((question, index) => {
                  const userAnswer = userAnswers[question.id];
                  const isCorrect = question.type === 'short' ? null : userAnswer === question.correct;
                  
                  return (
                    <div key={question.id} className="border border-black dark:border-zinc-600 rounded-lg p-6 bg-zinc-50 dark:bg-zinc-700/50">
                      <div className="flex items-start space-x-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          question.type === 'short'
                            ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                            : isCorrect 
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                            : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                        }`}>
                          {question.type === 'short' ? (
                            <FileText className="w-5 h-5" />
                          ) : isCorrect ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <XCircle className="w-5 h-5" />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <h5 className="font-['SF-Pro-Display-Regular'] text-zinc-900 dark:text-white mb-3">
                            {index + 1}. {question.question}
                          </h5>
                          
                          {question.type === 'mcq' && question.options && (
                            <div className="space-y-2 mb-4">
                              {question.options.map((option, optionIndex) => (
                                <div
                                  key={optionIndex}
                                  className={`p-3 rounded-lg ${
                                    optionIndex === question.correct
                                      ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700'
                                      : optionIndex === userAnswer && !isCorrect
                                      ? 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700'
                                      : 'bg-zinc-50 dark:bg-zinc-600'
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="text-zinc-900 dark:text-white">{option}</span>
                                    {optionIndex === question.correct && (
                                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                                    )}
                                    {optionIndex === userAnswer && !isCorrect && (
                                      <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {question.type === 'truefalse' && (
                            <div className="space-y-2 mb-4">
                              {[true, false].map((option) => (
                                <div
                                  key={option.toString()}
                                  className={`p-3 rounded-lg ${
                                    option === question.correct
                                      ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700'
                                      : option === userAnswer && !isCorrect
                                      ? 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700'
                                      : 'bg-zinc-50 dark:bg-zinc-600'
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="text-zinc-900 dark:text-white">
                                      {option ? 'True' : 'False'}
                                    </span>
                                    {option === question.correct && (
                                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                                    )}
                                    {option === userAnswer && !isCorrect && (
                                      <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {question.type === 'short' && (
                            <div className="space-y-4 mb-4">
                              <div className="p-4 bg-zinc-50 dark:bg-zinc-600 rounded-lg">
                                <h6 className="text-sm font-['SF-Pro-Display-Regular'] text-zinc-700 dark:text-zinc-300 mb-2">Your Answer:</h6>
                                <p className="text-zinc-900 dark:text-white">
                                  {typeof userAnswer === 'string' ? userAnswer : <span className="text-zinc-500 dark:text-zinc-400 italic">No answer provided</span>}
                                </p>
                              </div>
                              {question.correct && (
                                <div className="p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg">
                                  <h6 className="text-sm font-['SF-Pro-Display-Regular'] text-green-700 dark:text-green-300 mb-2">Sample Answer:</h6>
                                  <p className="text-green-800 dark:text-green-200">{question.correct}</p>
                                </div>
                              )}
                            </div>
                          )}

                          {question.explanation && (
                            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
                              <h6 className="text-sm font-['SF-Pro-Display-Regular'] text-blue-800 dark:text-blue-300 mb-2">
                                Explanation:
                              </h6>
                              <p className="text-blue-700 dark:text-blue-200 text-sm">
                                {question.explanation}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Feedback Modal */}
        {showFeedbackModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-zinc-800 rounded-2xl p-8 max-w-lg mx-4 shadow-2xl">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <MessageSquare className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-['SF-Pro-Display-Regular'] text-zinc-900 dark:text-white mb-2">
                  How was your quiz experience?
                </h3>
                <p className="text-zinc-600 dark:text-zinc-300">
                  Your feedback helps us improve ElevateEd for everyone!
                </p>
              </div>

              {/* Rating */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
                  Overall Rating *
                </label>
                <div className="flex justify-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setFeedbackData(prev => ({ ...prev, rating: star }))}
                      className={`p-2 transition-colors ${
                        star <= feedbackData.rating
                          ? 'text-yellow-500'
                          : 'text-zinc-300 dark:text-zinc-600 hover:text-yellow-400'
                      }`}
                    >
                      <Star className="w-8 h-8 fill-current" />
                    </button>
                  ))}
                </div>
                <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 mt-2">
                  {feedbackData.rating > 0 && (
                    <>
                      {feedbackData.rating === 1 && "Poor"}
                      {feedbackData.rating === 2 && "Fair"}
                      {feedbackData.rating === 3 && "Good"}
                      {feedbackData.rating === 4 && "Very Good"}
                      {feedbackData.rating === 5 && "Excellent"}
                    </>
                  )}
                </p>
              </div>

              {/* Experience */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  How was the quiz difficulty and content?
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    "Perfect difficulty level",
                    "Too easy for me",
                    "Too challenging",
                    "Questions were well-structured",
                    "Content was relevant",
                    "Time limit was appropriate"
                  ].map((option) => (
                    <button
                      key={option}
                      onClick={() => setFeedbackData(prev => ({ ...prev, experience: option }))}
                      className={`text-left p-3 rounded-lg border transition-colors ${
                        feedbackData.experience === option
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30'
                          : 'border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700'
                      }`}
                    >
                      <span className={`text-sm ${
                        feedbackData.experience === option
                          ? 'text-purple-700 dark:text-purple-300'
                          : 'text-zinc-700 dark:text-zinc-300'
                      }`}>
                        {option}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Improvements */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  What would you like us to improve?
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    "Better question variety",
                    "More detailed explanations",
                    "Improved user interface",
                    "Faster loading times",
                    "Better mobile experience",
                    "More quiz customization options"
                  ].map((option) => (
                    <button
                      key={option}
                      onClick={() => setFeedbackData(prev => ({ ...prev, improvements: option }))}
                      className={`text-left p-3 rounded-lg border transition-colors ${
                        feedbackData.improvements === option
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30'
                          : 'border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700'
                      }`}
                    >
                      <span className={`text-sm ${
                        feedbackData.improvements === option
                          ? 'text-purple-700 dark:text-purple-300'
                          : 'text-zinc-700 dark:text-zinc-300'
                      }`}>
                        {option}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleSkipFeedback}
                  className="flex-1 px-6 py-3 text-zinc-600 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-600 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
                >
                  Skip for now
                </button>
                <button
                  onClick={handleFeedbackSubmit}
                  disabled={feedbackData.rating === 0}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Submit Feedback
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Time Up Modal */}
        {isTimeUp && redirectCountdown !== null && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-zinc-800 rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <Clock className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-['SF-Pro-Display-Regular'] text-zinc-900 dark:text-white mb-2">Time&apos;s Up!</h3>
              <p className="text-zinc-600 dark:text-zinc-300 mb-6">
                Your quiz will be automatically submitted in:
              </p>
              <div className="text-4xl font-['SF-Pro-Display-Regular'] text-red-600 dark:text-red-400 mb-6 animate-pulse">
                {redirectCountdown}
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Please wait while we prepare your results...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
    </ProtectedRoute>
  );
};

const QuizGenerator: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QuizGeneratorContent />
    </Suspense>
  );
};

export default QuizGenerator;