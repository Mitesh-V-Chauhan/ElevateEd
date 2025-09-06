"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Calendar,
  Clock,
  Award,
  BarChart3,
  Eye,
  ArrowLeft,
  RotateCcw,
  CheckCircle,
  Target,
  XCircle,
} from "lucide-react";

import { useTheme } from "@/contexts/ThemeContext";
import { getQuiz, getSubmissions } from "@/services/firebaseFunctions/get";
import { useAuth } from "@/contexts/AuthContext";
import { Quiz, QuizSubmissions } from "@/services/interfaces/interface";
import ProtectedRoute from "@/components/ProtectedRoute";

const QuizAttemptsPage: React.FC = () => {
  const { theme } = useTheme();
  const params = useParams();
  const quizId =
    typeof params.quizId === "string" ? params.quizId : params.quizId?.[0];
  // const router = useRouter();
  const { user, isLoading } = useAuth();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [attempts, setAttempts] = useState<QuizSubmissions[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const darkMode = theme === "dark";

  useEffect(() => {
    const loadQuizAttempts = async () => {
      try {
        if (!user || !quizId) {
          // setError("User not authenticated or quiz ID missing");
          // setLoading(false);
          return;
        }

        const quiz = await getQuiz(user.id, quizId);

        if (!quiz) {
          setError("Quiz not found");
          setLoading(false);
          return;
        }

        setQuiz(quiz);

        const submissionDocs = await getSubmissions(user.id, quizId);
        const filteredAttempts: QuizSubmissions[] = submissionDocs
        .filter((attempt): attempt is QuizSubmissions => attempt !== null)
        .map((attempt, index) => ({
          ...attempt,
          submittedAt: attempt.submittedAt instanceof Date 
            ? attempt.submittedAt 
            : new Date((attempt.submittedAt as unknown as { seconds: number }).seconds * 1000),
          attemptNumber: index + 1,
        }))
        .sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime());


        setAttempts(filteredAttempts);
        setLoading(false);
      } catch (error) {
        console.error("Error loading quiz attempts:", error);
        setError("Failed to load quiz attempts");
        setLoading(false);
      }
    };

    loadQuizAttempts();
  }, [user, quizId]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 dark:text-green-400";
    if (score >= 80) return "text-blue-600 dark:text-blue-400";
    if (score >= 70) return "text-yellow-600 dark:text-yellow-400";
    if (score >= 60) return "text-orange-600 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    if (hours > 0) return `${hours}h ${minutes}m ${remainingSeconds}s`;
    if (minutes > 0) return `${minutes}m ${remainingSeconds}s`;
    return `${remainingSeconds}s`;
  };

  const getAverageScore = () => {
    if (attempts.length === 0) return 0;
    const total = attempts.reduce((sum, attempt) => sum + attempt.score, 0);
    return Math.round(total / attempts.length);
  };

  const getBestScore = () => {
    if (attempts.length === 0) return 0;
    return Math.max(...attempts.map((attempt) => attempt.score));
  };

  const getAverageTime = () => {
    if (attempts.length === 0) return 0;
    const total = attempts.reduce(
      (sum, attempt) => sum + attempt.time_taken,
      0
    );
    return Math.round(total / attempts.length);
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
      <div
        className={`h-full overflow-y-auto ${darkMode ? "bg-zinc-900" : "bg-zinc-50"}`}
      >
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <p className="text-zinc-600 dark:text-zinc-300">
            Loading user data...
          </p>
        </div>
      </div>
      </ProtectedRoute>
    );
  }

  if (!user) {
    return (
      <ProtectedRoute>
      <div
        className={`h-full overflow-y-auto ${darkMode ? "bg-zinc-900" : "bg-zinc-50"}`}
      >
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <p className="text-zinc-600 dark:text-zinc-300">
            You must be logged in to view this page.
          </p>
        </div>
      </div>
      </ProtectedRoute>
    );
  }

  if (loading) {
    return (
      <ProtectedRoute>
      <div
        className={`h-full overflow-y-auto transition-colors duration-300 ${
          darkMode ? "bg-zinc-900" : "bg-zinc-50"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-16 flex justify-center items-center">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 border-b-2 border-purple-600 rounded-full mx-auto mb-4"></div>
            <p className="text-zinc-600 dark:text-zinc-300">
              Loading quiz attempts...
            </p>
          </div>
        </div>
      </div>
      </ProtectedRoute>
    );
  }

  if (error || !quiz) {
    return (
      <ProtectedRoute>
      <div
        className={`h-full overflow-y-auto transition-colors duration-300 ${
          darkMode ? "bg-zinc-900" : "bg-zinc-50"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h3 className="text-xl font-['SF-Pro-Display-Regular'] text-zinc-900 dark:text-white mb-2">
            {error || "Quiz not found"}
          </h3>
          <Link
            href="/history"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl  transform  transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to History</span>
          </Link>
        </div>
      </div>
      </ProtectedRoute>
    );
  }
  return (
    <ProtectedRoute>
    <div
      className={`h-full overflow-y-auto transition-colors duration-300 ${
        darkMode
          ? "bg-zinc-900"
          : "bg-zinc-50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-10 sm:py-12 md:py-16">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/history"
            className="inline-flex items-center space-x-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to History</span>
          </Link>

          <h1
            className={`text-4xl font-['SF-Pro-Display-Regular'] mb-2 ${
              darkMode ? "text-white" : "text-zinc-900"
            }`}
          >
            Quiz{" "}
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
              Attempts
            </span>
          </h1>
          <h2 className="text-2xl text-zinc-600 dark:text-zinc-300 mb-2">
            {quiz.title}
          </h2>
          <div className="flex items-center space-x-4 text-sm text-zinc-500 dark:text-zinc-400">
            <span className="capitalize">
              {quiz.quiz_type === "mcq"
                ? "Multiple Choice"
                : quiz.quiz_type === "truefalse"
                ? "True/False"
                : quiz.quiz_type === "short"
                ? "Short Answer"
                : "Mixed Format"}
            </span>
            <span>•</span>
            <span className="capitalize">{quiz.difficulty}</span>
            <span>•</span>
            <span>{quiz.questions.length} questions</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div
            className={`rounded-2xl border backdrop-blur-xl p-6 ${
              darkMode
                ? "bg-zinc-800/40 border-zinc-700/50"
                : "bg-white/70 border-black/50"
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                <RotateCcw className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Total Attempts
                </p>
                <p className="text-2xl font-['SF-Pro-Display-Regular'] text-zinc-900 dark:text-white">
                  {attempts.length}
                </p>
              </div>
            </div>
          </div>

          <div
            className={`rounded-2xl border backdrop-blur-xl p-6 ${
              darkMode
                ? "bg-zinc-800/40 border-zinc-700/50"
                : "bg-white/70 border-black/50"
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Best Score
                </p>
                <p className="text-2xl font-['SF-Pro-Display-Regular'] text-zinc-900 dark:text-white">
                  {getBestScore()}%
                </p>
              </div>
            </div>
          </div>

          <div
            className={`rounded-2xl border backdrop-blur-xl p-6 ${
              darkMode
                ? "bg-zinc-800/40 border-zinc-700/50"
                : "bg-white/70 border-black/50"
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Average Score
                </p>
                <p className="text-2xl font-['SF-Pro-Display-Regular'] text-zinc-900 dark:text-white">
                  {getAverageScore()}%
                </p>
              </div>
            </div>
          </div>

          <div
            className={`rounded-2xl border backdrop-blur-xl p-6 ${
              darkMode
                ? "bg-zinc-800/40 border-zinc-700/50"
                : "bg-white/70 border-black/50"
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Avg. Time
                </p>
                <p className="text-2xl font-['SF-Pro-Display-Regular'] text-zinc-900 dark:text-white">
                  {formatTime(getAverageTime())}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Attempts List */}
        <div className="space-y-4">
          {attempts.length === 0 ? (
            <div
              className={`rounded-2xl border backdrop-blur-xl p-12 text-center ${
                darkMode
                  ? "bg-zinc-800/40 border-zinc-700/50"
                  : "bg-white/70 border-black/50"
              }`}
            >
              <CheckCircle className="w-16 h-16 mx-auto mb-4 text-zinc-400 dark:text-zinc-500" />
              <h3 className="text-xl font-['SF-Pro-Display-Regular'] text-zinc-900 dark:text-white mb-2">
                No Attempts Found
              </h3>
              <p className="text-zinc-600 dark:text-zinc-300 mb-6">
                This quiz hasn&apos;t been attempted yet.
              </p>
              <Link
                href="/generator"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl  transform  transition-all"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Take Quiz</span>
              </Link>
            </div>
          ) : (
            attempts.map((attempt, index) => (
            <div
              key={index}
              className={`rounded-2xl border backdrop-blur-xl p-4 sm:p-6 transition-all ${
                darkMode
                  ? "bg-zinc-800/40 border-zinc-700/50 hover:bg-zinc-800/60"
                  : "bg-white/70 border-black/50 hover:bg-white/90"
              }`}
            >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0 w-full overflow-x-auto">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-2 min-w-0">
                      <h3 className="text-xl font-['SF-Pro-Display-Regular'] text-zinc-900 dark:text-white">
                        Attempt #{attempt.attempt_number}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-['SF-Pro-Display-Regular'] ${
                          attempt.score >= 80
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                            : attempt.score >= 60
                            ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
                            : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                        }`}
                      >
                        {attempt.score >= 80
                          ? "Excellent"
                          : attempt.score >= 60
                          ? "Good"
                          : "Needs Improvement"}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-zinc-600 dark:text-zinc-300 min-w-0">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{attempt.submittedAt.toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{formatTime(attempt.time_taken)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Target className="w-4 h-4" />
                        <span>
                          {Math.round(
                            (attempt.score / 100) * quiz.questions.length
                          )}
                          /{quiz.questions.length} correct
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6 w-full sm:w-auto mt-4 md:mt-0">
                    <div className="text-center">
                      <div
                        className={`text-3xl font-['SF-Pro-Display-Regular'] ${getScoreColor(
                          attempt.score
                        )}`}
                      >
                        {attempt.score}%
                      </div>
                      <div className="text-sm text-zinc-500 dark:text-zinc-400">
                        Score
                      </div>
                    </div>

                    <Link
                      href={`/history/${quizId}/${index}`}
                      className="flex items-center space-x-2 px-3 py-2 sm:px-4 sm:py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors w-full sm:w-auto justify-center"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Details</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Retake Quiz Button */}
        {attempts.length > 0 && (
          <div className="mt-8 text-center">
            <Link
              href={`/generator?quizId=${quizId}`}
              className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl  transform  transition-all"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Retake Quiz</span>
            </Link>
          </div>
        )}
      </div>
    </div>
    </ProtectedRoute>
  );
};

export default QuizAttemptsPage;
