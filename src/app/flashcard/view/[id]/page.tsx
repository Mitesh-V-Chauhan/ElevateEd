"use client"

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import InteractiveFlashcards from '@/components/InteractiveFlashcards';
import { FlashcardData } from '@/services/interfaces/interface';

const FlashcardView: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const darkMode = theme === 'dark';
  
  const [flashcardData, setFlashcardData] = useState<FlashcardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const flashcardId = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    const fetchFlashcard = async () => {
      if (!user || !flashcardId) return;

      try {
        setLoading(true);
        setError(null);

        // Import the get function here to avoid circular imports
        const { getFlashcard } = await import('@/services/firebaseFunctions/get');
        const data = await getFlashcard(user.id, flashcardId);

        if (data) {
          setFlashcardData(data);
        } else {
          setError('Flashcard not found');
        }
      } catch (error) {
        console.error('Error fetching flashcard:', error);
        setError('Failed to load flashcard. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcard();
  }, [user, flashcardId]);

  const handleBack = () => {
    router.push('/profile');
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className={`h-full overflow-y-auto transition-colors duration-300 ${darkMode ? 'bg-zinc-950' : 'bg-zinc-50'}`}>
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 border-2 border-t-transparent rounded-full animate-spin ${darkMode ? 'border-purple-400' : 'border-purple-600'}`}></div>
              <span className={`text-lg ${darkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                Loading flashcard...
              </span>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !flashcardData) {
    return (
      <ProtectedRoute>
        <div className={`h-full overflow-y-auto transition-colors duration-300 ${darkMode ? 'bg-zinc-950' : 'bg-zinc-50'}`}>
          <div className="max-w-4xl mx-auto px-6 py-8">
            <button
              onClick={handleBack}
              className={`flex items-center space-x-2 mb-6 px-4 py-2 rounded-lg transition-colors ${darkMode ? 'text-zinc-300 hover:bg-zinc-800' : 'text-zinc-700 hover:bg-zinc-100'}`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Profile</span>
            </button>

            <div className="text-center py-20">
              <BookOpen className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-zinc-500' : 'text-zinc-400'}`} />
              <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                {error || 'Flashcard Not Found'}
              </h2>
              <p className={`${darkMode ? 'text-zinc-400' : 'text-zinc-600'} mb-6`}>
                The flashcard you&apos;re looking for doesn&apos;t exist or has been removed.
              </p>
              <button
                onClick={handleBack}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Return to Profile
              </button>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className={`h-full overflow-y-auto transition-colors duration-300 ${darkMode ? 'bg-zinc-950' : 'bg-zinc-50'}`}>
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Simple Header with Back Button and Title */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={handleBack}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${darkMode ? 'text-zinc-300 hover:bg-zinc-800' : 'text-zinc-700 hover:bg-zinc-100'}`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Profile</span>
            </button>
            
            <h1 className={`text-2xl font-['SF-Pro-Display-Regular'] ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
              {flashcardData.title}
            </h1>
          </div>

          {/* Interactive Flashcards Component */}
          <div className={`rounded-2xl border backdrop-blur-xl ${darkMode ? 'bg-zinc-800/40 border-zinc-700/50' : 'bg-white/70 border-black/50'}`}>
            <InteractiveFlashcards 
              flashcards={flashcardData.flashcards}
            />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default FlashcardView;
