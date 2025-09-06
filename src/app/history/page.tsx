"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Award, Eye, Download, Search, FileText, Brain, CheckCircle, TrendingUp, BookOpen, Target } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { getQuizzes } from '@/services/firebaseFunctions/get';
import { useAuth } from '@/contexts/AuthContext';
import { Quiz } from '@/services/interfaces/interface';
import ProtectedRoute from '@/components/ProtectedRoute';

// interface GroupedQuiz {
//   quiz: Quiz;
//   totalAttempts: number;
//   bestScore: number;
//   averageScore: number;
//   lastAttempt: Date;
// }

// interface AttemptDetail {
//   submissionIndex: number;
//   score: number;
//   submittedAt: Date;
//   timeTaken: number;
//   answers: Record<number, any>;
// }

const QuizHistoryComponent: React.FC = () => {
  const { theme } = useTheme();
  const [quizHistory, setQuizHistory] = useState<Quiz[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');
  // const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { user } = useAuth();

  const darkMode = theme === 'dark';
  
 

  // Load quiz history from localStorage or API
  useEffect(() => {
    const loadQuizHistory = async () => {
      try {
        // Try to load from localStorage first
        if(user){
        const quizzes = await getQuizzes(user?.id);
        setQuizHistory(quizzes);
      }else{
        setQuizHistory([]);
      }
        
        
      } catch (error) {
        console.error('Error loading quiz history:', error);
        setQuizHistory([]);
      }
    };

    loadQuizHistory();
  }, [user]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'mcq': return '📝';
      case 'truefalse': return '✓✗';
      case 'short': return '💭';
      case 'mix': return '🔀';
      default: return '📝';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'hard': return 'text-red-500';
      default: return 'text-zinc-500';
    }
  };

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0:
        return <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs font-['SF-Pro-Display-Regular'] rounded-full">Incomplete</span>;
      default:
        return <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-['SF-Pro-Display-Regular'] rounded-full">Completed</span>
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 80) return 'text-blue-600 dark:text-blue-400';
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
    if (score >= 60) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const filteredHistory = quizHistory.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || quiz.quiz_type === filterType;
    const matchesDifficulty = filterDifficulty === 'all' || quiz.difficulty === filterDifficulty;
    return matchesSearch && matchesType && matchesDifficulty;
  });

  const sortedHistory = [...filteredHistory].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.updatesAt).getTime() - new Date(a.updatesAt).getTime();
      case 'score':
        return getAverageScoreOfQuiz(b) - getAverageScoreOfQuiz(a);
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const getAverageScoreOfQuizzes = () => {
    const completed = quizHistory.filter(q => q.total_submissions > 0);
    if (completed.length === 0) return 0;
    const total = completed.reduce((sum, quiz) => sum + getAverageScoreOfQuiz(quiz), 0);
    return Math.round((total / completed.length) * 100) / 100;
  };

  
    const getAverageScoreOfQuiz = (quiz: Quiz) => {
      if (quiz.list_score.length === 0) return 0;
      const total = quiz.list_score.reduce((sum, score) => sum + score, 0);
      return Math.round((total / quiz.list_score.length) * 100) / 100; // rounded to 2 decimals
    };


  const getBestScoreofQuiz = (quiz: Quiz) => {
    if (quiz.list_score.length === 0) return 0;
    return Math.max(...quiz.list_score);
  };


  const getTotalQuizzesTaken = () => quizHistory.length;
  const getCompletedQuizzes = () => quizHistory.filter(q => q.total_submissions !== 0).length;
  const getBestScore = () => {
    const completedQuizzes = quizHistory.filter(q => q.total_submissions !== 0);
    if (completedQuizzes.length === 0) return 0;
    return Math.max(...completedQuizzes.map(q => getBestScoreofQuiz(q)));
  };


  // // Function to save quiz result to history (call this from quiz completion)
  // const saveQuizToHistory = (quizResult: QuizHistory) => {
  //   const updatedHistory = [quizResult, ...quizHistory];
  //   setQuizHistory(updatedHistory);
  //   localStorage.setItem('quizHistory', JSON.stringify(updatedHistory));
  // };

  // Function to export quiz history data
  const exportQuizHistory = (quiz: Quiz) => {
    const bestScore = getBestScoreofQuiz(quiz);
    const averageScore = getAverageScoreOfQuiz(quiz);
    
    const exportData = `Quiz Results Export

Title: ${quiz.title}
Date Created: ${new Date(quiz.generatedAt).toLocaleDateString()}
Last Updated: ${quiz.updatesAt instanceof Date ? quiz.updatesAt.toLocaleDateString() : new Date((quiz.updatesAt as unknown as { seconds: number }).seconds * 1000).toLocaleDateString()}
Best Score: ${bestScore}%
Average Score: ${averageScore}%
Total Attempts: ${quiz.total_submissions}
Difficulty: ${quiz.difficulty}
Type: ${quiz.quiz_type}
Questions: ${quiz.questions.length}
Time Limit: ${quiz.time_limit} minutes

Questions:
${quiz.questions.map((question, index) => `
${index + 1}. ${question.question}
Type: ${question.type}
${question.type === 'mcq' && question.options ? `Options: ${question.options.join(', ')}` : ''}
Correct Answer: ${question.correct}
${question.explanation ? `Explanation: ${question.explanation}` : ''}
`).join('\n')}

Attempt History:
${quiz.submissions.map((submission, index) => `
Attempt ${index + 1}:
- Score: ${quiz.list_score[index]}%
`).join('\n')}

Generated on: ${new Date().toLocaleDateString()}
`;

    const blob = new Blob([exportData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quiz-${quiz.title.replace(/\s+/g, '-').toLowerCase()}-${quiz.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <ProtectedRoute>
    <div className={`h-full overflow-y-auto transition-colors duration-300 ${darkMode ? 'bg-zinc-950' : 'bg-zinc-50'} overflow-x-hidden`}>
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-10 sm:py-12 md:py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`text-4xl font-['SF-Pro-Display-Regular'] mb-4 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
            Quiz <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">History</span>
          </h1>
          <p className="text-zinc-600 dark:text-zinc-300 text-lg">Track your learning progress and review past quiz performances</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className={`rounded-2xl border backdrop-blur-xl p-6 ${darkMode ? 'bg-zinc-800/40 border-zinc-700/50' : 'bg-white/70 border-black/50'}`}>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Total Quizzes</p>
                <p className="text-2xl font-['SF-Pro-Display-Regular'] text-zinc-900 dark:text-white">{getTotalQuizzesTaken()}</p>
              </div>
            </div>
          </div>

          <div className={`rounded-2xl border backdrop-blur-xl p-6 ${darkMode ? 'bg-zinc-800/40 border-zinc-700/50' : 'bg-white/70 border-black/50'}`}>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Completed</p>
                <p className="text-2xl font-['SF-Pro-Display-Regular'] text-zinc-900 dark:text-white">{getCompletedQuizzes()}</p>
              </div>
            </div>
          </div>

          <div className={`rounded-2xl border backdrop-blur-xl p-6 ${darkMode ? 'bg-zinc-800/40 border-zinc-700/50' : 'bg-white/70 border-black/50'}`}>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Average Score</p>
                <p className="text-2xl font-['SF-Pro-Display-Regular'] text-zinc-900 dark:text-white">{getAverageScoreOfQuizzes().toFixed(2)}%</p>
              </div>
            </div>
          </div>

          <div className={`rounded-2xl border backdrop-blur-xl p-6 ${darkMode ? 'bg-zinc-800/40 border-zinc-700/50' : 'bg-white/70 border-black/50'}`}>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Best Score</p>
                <p className="text-2xl font-['SF-Pro-Display-Regular'] text-zinc-900 dark:text-white">{getBestScore().toFixed(2)}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className={`rounded-2xl border backdrop-blur-xl p-4 sm:p-6 mb-8 ${darkMode ? 'bg-zinc-800/40 border-zinc-700/50' : 'bg-white/70 border-black/50'}`}> 
          <div className="flex flex-col md:flex-row gap-2 md:gap-4">
            {/* Search */}
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search quizzes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-zinc-50 dark:bg-zinc-700 border border-black dark:border-zinc-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-20 text-zinc-900 dark:text-white"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-3 bg-zinc-50 dark:bg-zinc-700 border border-black dark:border-zinc-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-zinc-900 dark:text-white"
              >
                <option value="all">All Types</option>
                <option value="mcq">Multiple Choice</option>
                <option value="truefalse">True/False</option>
                <option value="short">Short Answer</option>
                <option value="mix">Mixed Format</option>
              </select>

              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="px-4 py-3 bg-zinc-50 dark:bg-zinc-700 border border-black dark:border-zinc-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-zinc-900 dark:text-white"
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-zinc-50 dark:bg-zinc-700 border border-black dark:border-zinc-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-zinc-900 dark:text-white"
              >
                <option value="date">Sort by Date</option>
                <option value="score">Sort by Score</option>
                <option value="title">Sort by Title</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quiz History List */}
        <div className="space-y-4">
          {sortedHistory.length === 0 ? (
            <div className={`rounded-2xl border backdrop-blur-xl p-8 sm:p-12 text-center ${darkMode ? 'bg-zinc-800/40 border-zinc-700/50' : 'bg-white/70 border-black/50'}`}>
              <FileText className="w-16 h-16 mx-auto mb-4 text-zinc-400 dark:text-zinc-500" />
              <h3 className="text-xl font-['SF-Pro-Display-Regular'] text-zinc-900 dark:text-white mb-2">No Quizzes Found</h3>
              <p className="text-zinc-600 dark:text-zinc-300 mb-6">
                {searchTerm || filterType !== 'all' || filterDifficulty !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : "You haven't taken any quizzes yet"}
              </p>
              <Link 
                href="/generator"
                className="inline-flex items-center space-x-2 px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl transition-all w-full sm:w-auto justify-center"
              >
                <Brain className="w-5 h-5" />
                <span>Create Your First Quiz</span>
              </Link>
            </div>
          ) : (
            sortedHistory.map((quiz) => (
            <div key={quiz.id} className={`rounded-2xl border backdrop-blur-xl p-4 sm:p-6 transition-all ${darkMode ? 'bg-zinc-800/40 border-zinc-700/50 hover:bg-zinc-800/60' : 'bg-white/70 border-black/50 hover:bg-white/90'}`}> 
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0 w-full overflow-x-auto">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-2 min-w-0">
                      <h3 className="text-xl font-['SF-Pro-Display-Regular'] text-zinc-900 dark:text-white">{quiz.title}</h3>
                      {getStatusBadge(quiz.total_submissions)}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-zinc-600 dark:text-zinc-300 min-w-0">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{quiz.updatesAt instanceof Date ? quiz.updatesAt.toLocaleDateString() : new Date((quiz.updatesAt as unknown as { seconds: number }).seconds * 1000).toLocaleDateString()}</span>
                      </div>
                      {/* <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{quiz.timeSpent}</span>
                      </div> */}
                      <div className="flex items-center space-x-2">
                        <span>{getTypeIcon(quiz.quiz_type)}</span>
                        <span className="capitalize">{quiz.quiz_type === 'mcq' ? 'Multiple Choice' : quiz.quiz_type === 'truefalse' ? 'True/False' : quiz.quiz_type === 'short' ? 'Short Answer' : 'Mixed Format'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Target className="w-4 h-4" />
                        <span className={`capitalize font-['SF-Pro-Display-Regular'] ${getDifficultyColor(quiz.difficulty)}`}>
                          {quiz.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6 w-full sm:w-auto mt-4 md:mt-0">
                    {quiz.total_submissions !== 0 && (
                      <div className="text-center">
                        <div className={`text-3xl font-['SF-Pro-Display-Regular'] ${getScoreColor(getBestScoreofQuiz(quiz))}`}>
                          {getBestScoreofQuiz(quiz).toFixed(2)}%
                        </div>
                        <div className="text-sm text-zinc-500 dark:text-zinc-400">
                          Best Score
                        </div>
                        <div className="text-xs text-zinc-500 dark:text-zinc-400">
                          {quiz.total_submissions} attempt{quiz.total_submissions !== 1 ? 's' : ''}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col xs:flex-row gap-2 w-full sm:w-auto">
                      {quiz.total_submissions > 0 ? (
                        <Link
                          href={`/history/${quiz.id}`}
                          className="flex items-center space-x-2 px-3 py-2 sm:px-4 sm:py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors w-full sm:w-auto justify-center"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View Attempts ({quiz.total_submissions})</span>
                        </Link>
                      ) : (
                        <button
                          disabled
                          className="flex items-center space-x-2 px-3 py-2 sm:px-4 sm:py-2 bg-zinc-100 dark:bg-zinc-700 text-zinc-400 dark:text-zinc-500 rounded-lg cursor-not-allowed w-full sm:w-auto justify-center"
                        >
                          <Eye className="w-4 h-4" />
                          <span>No Attempts</span>
                        </button>
                      )}
                      <button 
                        onClick={() => exportQuizHistory(quiz)}
                        className="flex items-center space-x-2 px-3 py-2 sm:px-4 sm:py-2 bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-colors w-full sm:w-auto justify-center"
                      >
                        <Download className="w-4 h-4" />
                        <span>Export</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination would go here for large datasets */}
        {sortedHistory.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-zinc-600 dark:text-zinc-300">
              Showing {sortedHistory.length} of {quizHistory.length} quizzes
            </p>
          </div>
        )}
      </div>
    </div>
    </ProtectedRoute>
  );
};

export default QuizHistoryComponent;
