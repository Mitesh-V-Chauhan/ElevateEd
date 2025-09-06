"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {Clock, ArrowLeft, CheckCircle, XCircle, RotateCcw, Eye, Download } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { getQuizzes, getSubmission } from '@/services/firebaseFunctions/get';
import { useAuth } from '@/contexts/AuthContext';
import { Quiz, QuizSubmissions, Question } from '@/services/interfaces/interface';
import ProtectedRoute from '@/components/ProtectedRoute';

interface AttemptResult {
  quiz: Quiz;
  attempt: QuizSubmissions;
  attemptNumber: number;
}

const AttemptResultPage: React.FC = () => {
  const { theme } = useTheme();
  const params = useParams();
  const quizId = Array.isArray(params.quizId) ? params.quizId[0] : params.quizId;
  const attemptIndex = Array.isArray(params.attemptIndex) ? params.attemptIndex[0] : params.attemptIndex;
  // const router = useRouter();
  const { user } = useAuth();
  const [result, setResult] = useState<AttemptResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAnswers, setShowAnswers] = useState(false);

  const darkMode = theme === 'dark';

  useEffect(() => {
    const loadAttemptResult = async () => {
      try {
        if (!user || !quizId || attemptIndex === undefined) {
          // setError('Missing required parameters');
          // setLoading(false);
          return;
        }

        const quizzes = await getQuizzes(user.id);
        const foundQuiz = quizzes.find(q => q.id === quizId);

        if (!foundQuiz) {
          setError('Quiz not found');
          setLoading(false);
          return;
        }

        const attemptIdx = parseInt(attemptIndex as string);
        if (isNaN(attemptIdx) || attemptIdx < 0 || attemptIdx >= foundQuiz.submissions.length) {
          setError('Attempt not found');
          setLoading(false);
          return;
        }

        const attemptId = foundQuiz.submissions[attemptIdx];
        const attempt = await getSubmission(user.id, quizId, attemptId);
        setResult({
          quiz: foundQuiz,
          attempt: attempt ?? {
            attempt_number: attemptIdx + 1,
            time_taken: 0,
            submittedAt: new Date(),
            answers: [],
            score: 0
          },
          attemptNumber: attemptIdx + 1
        });
        setLoading(false);
      } catch (error) {
        console.error('Error loading attempt result:', error);
        setError('Failed to load attempt result');
        setLoading(false);
      }
    };

    loadAttemptResult();
  }, [user, quizId, attemptIndex]);


  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 80) return 'text-blue-600 dark:text-blue-400';
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
    if (score >= 60) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  };

  const isCorrectAnswer = (question: Question, userAnswer: string | number | boolean | undefined) => {
    if (userAnswer === undefined || question.correct === undefined) return false;

    if (question.type === 'mcq' || question.type === 'truefalse') {
      return userAnswer === question.correct;
    } else if (question.type === 'short') {
      return String(userAnswer).toLowerCase().trim() === String(question.correct).toLowerCase().trim();
    }
    return false;
  };



  const getCorrectAnswersCount = () => {
    if (!result) return 0;
    return result.quiz.questions.reduce((count, question ) => {
      const userAnswer = result.attempt.answers[question.id];
      return isCorrectAnswer(question, userAnswer) ? count + 1 : count;
    }, 0);
  };

  const exportResults = () => {
    if (!result) return;

    const correctAnswers = getCorrectAnswersCount();
    const exportData = `Quiz Attempt Results

Quiz: ${result.quiz.title}
Attempt: #${result.attemptNumber}
Date: ${new Date(result.attempt.submittedAt).toLocaleDateString()}
Score: ${result.attempt.score}%
Correct Answers: ${correctAnswers}/${result.quiz.questions.length}
Time Taken: ${formatTime(result.attempt.time_taken)}
Difficulty: ${result.quiz.difficulty}
Type: ${result.quiz.quiz_type}

Questions and Answers:
${result.quiz.questions.map((question, index) => {
  const userAnswer = result.attempt.answers[index];
  const isCorrect = isCorrectAnswer(question, userAnswer);
  
  return `
${index + 1}. ${question.question}
Your Answer: ${userAnswer || 'Not answered'}
Correct Answer: ${question.correct}
Result: ${isCorrect ? 'Correct' : 'Incorrect'}
${question.explanation ? `Explanation: ${question.explanation}` : ''}
`;
}).join('\n')}

Generated on: ${new Date().toLocaleDateString()}
`;

    const blob = new Blob([exportData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quiz-attempt-${result.quiz.title.replace(/\s+/g, '-').toLowerCase()}-${result.attemptNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <ProtectedRoute>
      <div className={`h-full overflow-y-auto transition-colors duration-300 ${darkMode ? 'bg-zinc-900' : 'bg-zinc-50'}`}>
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-zinc-600 dark:text-zinc-300">Loading attempt results...</p>
            </div>
          </div>
        </div>
      </div>
      </ProtectedRoute>
    );
  }

  if (error || !result) {
    return (
      <ProtectedRoute>
      <div className={`h-full overflow-y-auto transition-colors duration-300 ${darkMode ? 'bg-zinc-900' : 'bg-zinc-50'}`}>
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">
            <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h3 className="text-xl font-['SF-Pro-Display-Regular'] text-zinc-900 dark:text-white mb-2">{error || 'Attempt not found'}</h3>
            <Link 
              href="/history"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl  transform  transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to History</span>
            </Link>
          </div>
        </div>
      </div>
      </ProtectedRoute>
    );
  }

  const correctAnswers = getCorrectAnswersCount();

  function parseToDate(input: Date | { seconds: number } | string | unknown): Date {
    if (input && typeof input === 'object' && 'seconds' in input) {
      return new Date((input as { seconds: number }).seconds * 1000);
    }
    return new Date(input as string | number | Date);
  }


  return (
    <ProtectedRoute>
    <div className={`h-full overflow-y-auto transition-colors duration-300 ${darkMode ? 'bg-zinc-900' : 'bg-zinc-50'}`}>
      
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link 
              href="/history"
              className="inline-flex items-center space-x-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>History</span>
            </Link>
            <span className="text-zinc-400">/</span>
            <Link 
              href={`/history/${quizId}`}
              className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
            >
              {result.quiz.title}
            </Link>
            <span className="text-zinc-400">/</span>
            <span className="text-zinc-600 dark:text-zinc-300">Attempt #{result.attemptNumber}</span>
          </div>
          
          <h1 className={`text-4xl font-['SF-Pro-Display-Regular'] mb-2 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
            Attempt <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">Results</span>
          </h1>
          <h2 className="text-2xl text-zinc-600 dark:text-zinc-300 mb-2">{result.quiz.title}</h2>
          <div className="flex items-center space-x-4 text-sm text-zinc-500 dark:text-zinc-400">
            <span>Attempt #{result.attemptNumber}</span>
            <span>•</span>
            <span><span>{parseToDate(result.attempt.submittedAt).toLocaleDateString()}</span></span>
            <span>•</span>
            <span>{formatTime(result.attempt.time_taken)}</span>
          </div>
        </div>

        {/* Score Overview */}
        <div className={`rounded-2xl border backdrop-blur-xl p-8 mb-8 ${darkMode ? 'bg-zinc-800/40 border-zinc-700/50' : 'bg-white/70 border-black/50'}`}>
          <div className="text-center mb-8">
            <div className={`text-6xl font-['SF-Pro-Display-Regular'] mb-2 ${getScoreColor(result.attempt.score)}`}>
              {result.attempt.score}%
            </div>
            <div className="text-xl text-zinc-600 dark:text-zinc-300 mb-4">
              {correctAnswers} out of {result.quiz.questions.length} correct
            </div>
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-['SF-Pro-Display-Regular'] ${
              result.attempt.score >= 80 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
              result.attempt.score >= 60 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' :
              'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
            }`}>
              {result.attempt.score >= 80 ? '🎉 Excellent!' : result.attempt.score >= 60 ? '👍 Good Job!' : '📚 Keep Learning!'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Time Taken</p>
              <p className="text-xl font-['SF-Pro-Display-Regular'] text-zinc-900 dark:text-white">{formatTime(result.attempt.time_taken)}</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Correct</p>
              <p className="text-xl font-['SF-Pro-Display-Regular'] text-zinc-900 dark:text-white">{correctAnswers}</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Incorrect</p>
              <p className="text-xl font-['SF-Pro-Display-Regular'] text-zinc-900 dark:text-white">{result.quiz.questions.length - correctAnswers}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setShowAnswers(!showAnswers)}
            className="flex items-center space-x-2 px-6 py-3 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-xl hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
          >
            <Eye className="w-5 h-5" />
            <span>{showAnswers ? 'Hide' : 'Show'} Answer Review</span>
          </button>
          
          <button
            onClick={exportResults}
            className="flex items-center space-x-2 px-6 py-3 bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-colors"
          >
            <Download className="w-5 h-5" />
            <span>Export Results</span>
          </button>
          
          <Link
            href={`/generator?quizId=${quizId}`}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl  transform  transition-all"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Retake Quiz</span>
          </Link>
        </div>

        {/* Answer Review */}
        {showAnswers && (
          <div className="space-y-6">
            <h3 className="text-2xl font-['SF-Pro-Display-Regular'] text-zinc-900 dark:text-white mb-6">Answer Review</h3>
            
            {result.quiz.questions.map((question, index) => {
              const userAnswer = result.attempt.answers[index+1];
              const isCorrect = isCorrectAnswer(question, userAnswer);
              
              return (
                <div key={index} className={`rounded-2xl border backdrop-blur-xl p-6 ${darkMode ? 'bg-zinc-800/40 border-zinc-700/50' : 'bg-white/70 border-black/50'}`}>
                  <div className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-['SF-Pro-Display-Regular'] ${
                      isCorrect ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                      {isCorrect ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="text-lg font-['SF-Pro-Display-Regular'] text-zinc-900 dark:text-white mb-3">
                        Question {index + 1}
                      </h4>
                      <p className="text-zinc-700 dark:text-zinc-300 mb-4">{question.question}</p>
                      
                      {question.type === 'mcq' && question.options && (
                        <div className="space-y-2 mb-4">
                          {question.options.map((option, optionIndex) => (
                            <div
                              key={optionIndex}
                              className={`p-3 rounded-lg border ${
                                optionIndex === question.correct 
                                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 text-green-800 dark:text-green-300'
                                  : optionIndex === userAnswer
                                  ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700 text-red-800 dark:text-red-300'
                                  : 'bg-zinc-50 dark:bg-zinc-700 border-black dark:border-zinc-600 text-zinc-700 dark:text-zinc-300'
                              }`}
                            >
                              <div className="flex items-center space-x-2">
                                <span className="font-['SF-Pro-Display-Regular']">{String.fromCharCode(65 + optionIndex)}.</span>
                                <span>{option}</span>
                                {optionIndex === question.correct && (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                )}
                                {optionIndex === userAnswer && optionIndex !== question.correct && (
                                  <XCircle className="w-4 h-4 text-red-600" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {question.type === 'truefalse' && (
                        <div className="space-y-2 mb-4">
                          <div className={`p-3 rounded-lg border ${
                            question.correct === true
                              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 text-green-800 dark:text-green-300'
                              : userAnswer === true
                              ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700 text-red-800 dark:text-red-300'
                              : 'bg-zinc-50 dark:bg-zinc-700 border-black dark:border-zinc-600 text-zinc-700 dark:text-zinc-300'
                          }`}>
                            <div className="flex items-center space-x-2">
                              <span>True</span>
                              {question.correct === true && <CheckCircle className="w-4 h-4 text-green-600" />}
                              {userAnswer === true && question.correct !== true && <XCircle className="w-4 h-4 text-red-600" />}
                            </div>
                          </div>
                          <div className={`p-3 rounded-lg border ${
                            question.correct === false
                              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 text-green-800 dark:text-green-300'
                              : userAnswer === false
                              ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700 text-red-800 dark:text-red-300'
                              : 'bg-zinc-50 dark:bg-zinc-700 border-black dark:border-zinc-600 text-zinc-700 dark:text-zinc-300'
                          }`}>
                            <div className="flex items-center space-x-2">
                              <span>False</span>
                              {question.correct === false && <CheckCircle className="w-4 h-4 text-green-600" />}
                              {userAnswer === false && question.correct !== false && <XCircle className="w-4 h-4 text-red-600" />}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {question.type === 'short' && (
                        <div className="space-y-3 mb-4">
                          <div>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">Your Answer:</p>
                            <div className={`p-3 rounded-lg border ${
                              isCorrect 
                                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 text-green-800 dark:text-green-300'
                                : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700 text-red-800 dark:text-red-300'
                            }`}>
                              {userAnswer || 'No answer provided'}
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">Correct Answer:</p>
                            <div className="p-3 rounded-lg border bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 text-green-800 dark:text-green-300">
                              {question.correct}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {question.explanation && (
                        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
                          <p className="text-sm font-['SF-Pro-Display-Regular'] text-blue-800 dark:text-blue-300 mb-1">Explanation:</p>
                          <p className="text-blue-700 dark:text-blue-300">{question.explanation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
    </ProtectedRoute>
  );
};

export default AttemptResultPage;
