"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
// import { useRouter } from 'next/navigation';

interface QuizContextType {
  isQuizInProgress: boolean;
  setQuizInProgress: (inProgress: boolean) => void;
  showNavigationWarning: (callback: () => void) => void;
  confirmNavigation: () => void;
  cancelNavigation: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};

interface QuizProviderProps {
  children: React.ReactNode;
}

export const QuizProvider: React.FC<QuizProviderProps> = ({ children }) => {
  const [isQuizInProgress, setIsQuizInProgress] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null);
//   const router = useRouter();

  const setQuizInProgress = useCallback((inProgress: boolean) => {
    setIsQuizInProgress(inProgress);
  }, []);

  const showNavigationWarning = useCallback((callback: () => void) => {
    if (isQuizInProgress) {
      setPendingNavigation(() => callback);
      setShowWarning(true);
    } else {
      callback();
    }
  }, [isQuizInProgress]);

  const confirmNavigation = useCallback(() => {
    setShowWarning(false);
    setIsQuizInProgress(false);
    if (pendingNavigation) {
      pendingNavigation();
      setPendingNavigation(null);
    }
  }, [pendingNavigation]);

  const cancelNavigation = useCallback(() => {
    setShowWarning(false);
    setPendingNavigation(null);
  }, []);

  // Prevent browser navigation when quiz is in progress
  useEffect(() => {
    if (isQuizInProgress) {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = 'You have a quiz in progress. Your answers will be automatically submitted if you leave.';
        return e.returnValue;
      };

      window.addEventListener('beforeunload', handleBeforeUnload);
      
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [isQuizInProgress]);

  return (
    <QuizContext.Provider value={{
      isQuizInProgress,
      setQuizInProgress,
      showNavigationWarning,
      confirmNavigation,
      cancelNavigation
    }}>
      {children}
      
      {/* Navigation Warning Modal */}
      {showWarning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
          <div className="bg-white dark:bg-zinc-800 rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <svg className="w-8 h-8 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">
              Quiz in Progress
            </h3>
            <p className="text-zinc-600 dark:text-zinc-300 mb-6">
              You have a quiz in progress. If you leave this page, your quiz will be automatically submitted with your current answers.
            </p>
            <div className="flex gap-3">
              <button
                onClick={cancelNavigation}
                className="flex-1 px-4 py-2 bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-colors"
              >
                Stay on Page
              </button>
              <button
                onClick={confirmNavigation}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Submit & Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </QuizContext.Provider>
  );
};
