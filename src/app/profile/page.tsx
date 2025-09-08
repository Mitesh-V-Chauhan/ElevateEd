"use client"

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { User, Mail, Calendar, Clock, BookOpen, Edit3, Save, X, Loader2, FileText, Spline, Brain } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
// import { baseUrl } from '@/utils/urls';
import { updateUser } from '@/services/firebaseFunctions/update';
import { getQuizzes, getFlowCharts, getFlashcards } from '@/services/firebaseFunctions/get';
import { Quiz } from '@/services/interfaces/interface';
import { FlowchartResponse } from '@/app/flowchart/page';
import { FlashcardResponse } from '@/app/flashcard/page';
import ProtectedRoute from '@/components/ProtectedRoute';

interface UserStats {
  totalQuizzes: number;
  totalFlowcharts: number;
  totalFlashcards: number;
  averageScore: number;
  totalTimeSpent: string;
  streakDays: number;
  favoriteSubject: string;
  lastQuizDate: string;
}

// interface QuizHistory {
//   id: string;
//   title: string;
//   score: number;
//   date: string;
//   time: string;
//   difficulty: string;
//   questionCount: number;
// }





const Profile: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const darkMode = theme === 'dark';
  
  // State management
  const [isEditing, setIsEditing] = useState(false);
  const [editedUsername, setEditedUsername] = useState(user?.username || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Data state
  const [] = useState<UserStats | null>(null);
  const [recentQuizzes, setRecentQuizzes] = useState<Quiz[]>([]);
  const [recentFlowcharts, setRecentFlowcharts] = useState<FlowchartResponse[]>([]);
  const [recentFlashcards, setRecentFlashcards] = useState<FlashcardResponse[]>([]);


  const fetchRecentQuizzes = useCallback(async () => {
    if(user){
      try {
        const response = await getQuizzes(user?.id);
        
        if (response) {
          setRecentQuizzes(response);
        } else {
          throw new Error('Failed to fetch recent quizzes');
        }
      } catch (error) {
        console.error('Error fetching recent quizzes:', error);
        setError('Failed to load recent quiz history');
      }
    }
  }, [user]);

  const fetchRecentFlowcharts = useCallback(async () => {
    if(user){
      try {
        const response = await getFlowCharts(user?.id);
        
        if (response) {
          setRecentFlowcharts(response);
        } else {
          throw new Error('Failed to fetch recent flowcharts');
        }
      } catch (error) {
        console.error('Error fetching recent flowcharts:', error);
        // Don't set error here to avoid blocking the profile page
      }
    }
  }, [user]);

  const fetchRecentFlashcards = useCallback(async () => {
    if(user){
      try {
        const response = await getFlashcards(user?.id);
        
        if (response) {
          setRecentFlashcards(response);
        } else {
          throw new Error('Failed to fetch recent flashcards');
        }
      } catch (error) {
        console.error('Error fetching recent flashcards:', error);
        // Don't set error here to avoid blocking the profile page
      }
    }
  }, [user]);

  const getAverageScoreOfQuizzes = () => {
    let total: number = 0;
    if(recentQuizzes.length === 0) return 0;
    for(const quiz of recentQuizzes){
      if(quiz.total_submissions !== 0) total += getAverageScoreOfQuiz(quiz);
    }
    const len = recentQuizzes.length
    return (total/len).toFixed(2) || 0; // Avoid division by zero
  }

  const getAverageScoreOfQuiz = (quiz: Quiz) => {
    let total = 0;
    for(const score of quiz.list_score){
      total += score;
    }
    const len = quiz.list_score.length
    return Number((total/len).toFixed(2)) || 0; // Avoid division by zero
  }



  // Load data on component mount
  useEffect(() => {
    if (user?.id) {
      const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
          await Promise.all([
            fetchRecentQuizzes(),
            fetchRecentFlowcharts(),
            fetchRecentFlashcards()
          ]);
        } catch (error) {
          console.error('Error loading profile data:', error);
          setError('Failed to load profile data. Please try again.');
        } finally {
          setLoading(false);
        }
      };

      loadData();
    }
  }, [user?.id, fetchRecentQuizzes, fetchRecentFlowcharts, fetchRecentFlashcards]);

  const handleSaveProfile = async () => {
    if (!editedUsername.trim() || !user) {
      setError('Username cannot be empty');
      return;
    }

    try {
      setLoading(true);
      const res = await updateUser(user.id, {'username': editedUsername});
      if(res.status !== 200){
        alert("Failed to update username")
      }
      user.username = editedUsername;
      setLoading(false);
    }catch (e){
      alert("Failed to update username");
      console.log(e);
    }
  };

  const handleCancelEdit = () => {
    setEditedUsername(user?.username || '');
    setIsEditing(false);
    setError(null);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 80) return 'text-blue-600 dark:text-blue-400';
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <ProtectedRoute>
    <div className={`h-full overflow-y-auto transition-colors duration-300 ${darkMode ? 'bg-zinc-950' : 'bg-zinc-50'}`}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-['SF-Pro-Display-Regular'] mb-2 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
            Profile Dashboard
          </h1>
          <p className={`${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
            Track your learning progress and quiz history
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg">
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex items-center space-x-3">
              <Loader2 className={`w-8 h-8 animate-spin ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
              <span className={`text-lg ${darkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                Loading your profile...
              </span>
            </div>
          </div>
        ) : (

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className={`rounded-2xl border backdrop-blur-xl p-6 ${darkMode ? 'bg-zinc-800/40 border-zinc-700/50' : 'bg-white/70 border-black/50'}`}>
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
                    <User className="w-12 h-12 text-white" />
                  </div>
                  {/* <button className="absolute bottom-0 right-0 w-8 h-8 bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center justify-center transition-colors">
                    <Camera className="w-4 h-4" />
                  </button> */}
                </div>

                {isEditing ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={editedUsername}
                      onChange={(e) => setEditedUsername(e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-zinc-700 border-zinc-600 text-white' : 'bg-white border-black text-zinc-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    />
                    <div className="flex space-x-2 justify-center">
                      <button
                        onClick={handleSaveProfile}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex items-center space-x-2 px-4 py-2 bg-zinc-600 hover:bg-zinc-700 text-white rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className={`text-xl font-['SF-Pro-Display-Regular'] mb-1 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                      {user?.username || 'User'}
                    </h2>
                    <p className={`text-sm mb-4 ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                      {user?.email || 'user@example.com'}
                    </p>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center space-x-2 mx-auto px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Edit Profile</span>
                    </button>
                  </>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-black dark:border-zinc-700">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span className={`text-sm ${darkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                      {user?.email || 'user@example.com'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    {user?.joined && (
                    <span className={`text-sm ${darkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                      joined {user.joined instanceof Date ? user.joined.toLocaleDateString() : new Date((user.joined as unknown as { seconds: number }).seconds * 1000).toLocaleDateString()}
                    </span>
                  )}

                  </div>
                  {/* <div className="flex items-center space-x-3">
                    <Settings className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <Link href="/settings" className={`text-sm hover:text-purple-600 dark:hover:text-purple-400 transition-colors ${darkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                      Account Settings
                    </Link>
                  </div> */}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className={`rounded-2xl border backdrop-blur-xl p-6 ${darkMode ? 'bg-zinc-800/40 border-zinc-700/50' : 'bg-white/70 border-black/50'}`}>
              <h3 className={`text-lg font-['SF-Pro-Display-Regular'] mb-4 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                Quick Stats
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-['SF-Pro-Display-Regular'] text-purple-600 dark:text-purple-400">
                    {recentQuizzes.length || 0}
                  </div>
                  <div className={`text-sm ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    Total Quizzes
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-['SF-Pro-Display-Regular'] text-blue-600 dark:text-blue-400">
                    {recentFlowcharts.length || 0}
                  </div>
                  <div className={`text-sm ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    Flowcharts
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-['SF-Pro-Display-Regular'] text-pink-600 dark:text-pink-400">
                    {recentFlashcards.length || 0}
                  </div>
                  <div className={`text-sm ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    Flashcards
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-['SF-Pro-Display-Regular'] text-green-600 dark:text-green-400">
                    {getAverageScoreOfQuizzes() || 0}%
                  </div>
                  <div className={`text-sm ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    Avg Quiz Score
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Dashboard Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Quizzes */}
            <div className={`rounded-2xl border backdrop-blur-xl p-6 ${darkMode ? 'bg-zinc-800/40 border-zinc-700/50' : 'bg-white/70 border-black/50'}`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-lg font-['SF-Pro-Display-Regular'] ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                  Recent Quizzes
                </h3>
                <Link
                  href="/history"
                  className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm font-['SF-Pro-Display-Regular'] transition-colors"
                >
                  View All
                </Link>
              </div>

              <div className="space-y-4">
                {recentQuizzes.length > 0 ? (
                  recentQuizzes.map((quiz, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${darkMode ? 'bg-zinc-700/50 border-zinc-600' : 'bg-zinc-50 border-black'}  transition-shadow`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className={`font-['SF-Pro-Display-Regular'] ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                            {quiz.title}
                          </h4>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className={`text-sm ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                              {quiz.generatedAt instanceof Date ? quiz.generatedAt.toLocaleDateString() : new Date((quiz.generatedAt as unknown as { seconds: number }).seconds * 1000).toLocaleDateString()} 
                            </span>
                            <span className="flex items-center space-x-1 text-sm text-zinc-500">
                              <Clock className="w-3 h-3" />
                              <span>{quiz.time_limit}</span>
                            </span>
                          </div>
                        </div>
                        <div className={`text-xl font-['SF-Pro-Display-Regular'] ${getScoreColor(getAverageScoreOfQuiz(quiz))}`}>
                          {getAverageScoreOfQuiz(quiz)}%
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className={`w-12 h-12 mx-auto mb-3 ${darkMode ? 'text-zinc-500' : 'text-zinc-400'}`} />
                    <p className={`${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                      No quizzes taken yet
                    </p>
                    <Link
                      href="/generator"
                      className="inline-flex items-center space-x-2 mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Take Your First Quiz</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Flowcharts */}
            <div className={`rounded-2xl border backdrop-blur-xl p-6 ${darkMode ? 'bg-zinc-800/40 border-zinc-700/50' : 'bg-white/70 border-black/50'}`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-lg font-['SF-Pro-Display-Regular'] ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                  Recent Flowcharts
                </h3>
                <Link
                  href="/flowchart"
                  className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm font-['SF-Pro-Display-Regular'] transition-colors"
                >
                  Create New
                </Link>
              </div>

              <div className="space-y-4">
                {recentFlowcharts.length > 0 ? (
                  recentFlowcharts.slice(0, 5).map((flowchart, index) => (
                    <Link
                      key={flowchart.id || index}
                      href={`/flowchart/view/${flowchart.id}`}
                      className={`block p-4 rounded-lg border ${darkMode ? 'bg-zinc-700/50 border-zinc-600 hover:bg-zinc-700/80' : 'bg-zinc-50 border-black hover:bg-zinc-100'} transition-all cursor-pointer hover:shadow-md`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className={`font-['SF-Pro-Display-Regular'] ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                            {flowchart.title}
                          </h4>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className={`text-sm ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                              {flowchart.generatedAt instanceof Date 
                                ? flowchart.generatedAt.toLocaleDateString() 
                                : flowchart.generatedAt?.seconds 
                                ? new Date(flowchart.generatedAt.seconds * 1000).toLocaleDateString()
                                : 'Unknown date'}
                            </span>
                            <span className="flex items-center space-x-1 text-sm text-zinc-500">
                              <Spline className="w-3 h-3" />
                              <span>{flowchart.flowchart.nodes.length} nodes</span>
                            </span>
                          </div>
                        </div>
                        <div className={`text-sm ${darkMode ? 'text-purple-400' : 'text-purple-600'} group-hover:translate-x-1 transition-transform`}>
                          <FileText className="w-5 h-5" />
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Spline className={`w-12 h-12 mx-auto mb-3 ${darkMode ? 'text-zinc-500' : 'text-zinc-400'}`} />
                    <p className={`${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                      No flowcharts created yet
                    </p>
                    <Link
                      href="/flowchart"
                      className="inline-flex items-center space-x-2 mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <Spline className="w-4 h-4" />
                      <span>Create Your First Flowchart</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Flashcards */}
            <div className={`rounded-2xl border backdrop-blur-xl p-6 ${darkMode ? 'bg-zinc-800/40 border-zinc-700/50' : 'bg-white/70 border-black/50'}`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-lg font-['SF-Pro-Display-Regular'] ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                  Recent Flashcards
                </h3>
                <Link
                  href="/flashcard"
                  className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm font-['SF-Pro-Display-Regular'] transition-colors"
                >
                  Create New
                </Link>
              </div>

              <div className="space-y-4">
                {recentFlashcards.length > 0 ? (
                  recentFlashcards.slice(0, 5).map((flashcard, index) => (
                    <Link
                      key={flashcard.id || index}
                      href={`/flashcard/view/${flashcard.id}`}
                      className={`block p-4 rounded-lg border ${darkMode ? 'bg-zinc-700/50 border-zinc-600 hover:bg-zinc-700/80' : 'bg-zinc-50 border-black hover:bg-zinc-100'} transition-all cursor-pointer hover:shadow-md`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className={`font-['SF-Pro-Display-Regular'] ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                            {flashcard.title}
                          </h4>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className={`text-sm ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                              {flashcard.generatedAt instanceof Date 
                                ? flashcard.generatedAt.toLocaleDateString() 
                                : flashcard.generatedAt?.seconds 
                                ? new Date(flashcard.generatedAt.seconds * 1000).toLocaleDateString()
                                : 'Unknown date'}
                            </span>
                            <span className="flex items-center space-x-1 text-sm text-zinc-500">
                              <BookOpen className="w-3 h-3" />
                              <span>{flashcard?.flashcards?.length} cards</span>
                            </span>
                          </div>
                        </div>
                        <div className={`text-sm ${darkMode ? 'text-pink-400' : 'text-pink-600'} group-hover:translate-x-1 transition-transform`}>
                          <Brain className="w-5 h-5" />
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Brain className={`w-12 h-12 mx-auto mb-3 ${darkMode ? 'text-zinc-500' : 'text-zinc-400'}`} />
                    <p className={`${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                      No flashcards created yet
                    </p>
                    <Link
                      href="/flashcard"
                      className="inline-flex items-center space-x-2 mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <Brain className="w-4 h-4" />
                      <span>Create Your First Flashcard Set</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
    </ProtectedRoute>
  );
};

export default Profile;
