"use client";


import React, { useState, Suspense, useCallback, useEffect } from 'react';
import { Layers, Download, AlertTriangle, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import InteractiveFlashcards from '@/components/InteractiveFlashcards';
import { baseUrl } from '@/utils/urls';
import { saveFlashcardData } from '@/services/firebaseFunctions/post';
import { useUniversalInput } from '@/contexts/InputContext';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { checkDailyGenerationLimit, updateDailyGenerationCount, LIMITS } from '@/services/firebaseFunctions/limits';

// Updated interface for flashcard data
export interface Flashcard {
  question: string;
  answer: string;
}

export interface FlashcardResponse {
  id?: string;
  title: string;
  flashcards?: Flashcard[];
  flashcard?: string;
  generatedAt?: Date | { seconds: number };
}

const FlashcardGeneratorContent: React.FC = () => {
  const { user } = useAuth();
  const { inputContent } = useUniversalInput(); // Get content from context
  const { theme } = useTheme();
  const router = useRouter();
  const darkMode = theme === 'dark';
  
  const [generatedFlashcards, setGeneratedFlashcards] = useState<Flashcard[] | null>(null);
  const [flashcardTitle, setFlashcardTitle] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Limit tracking states
  const [dailyGenerationRemaining, setDailyGenerationRemaining] = useState<number>(LIMITS.DAILY_GENERATION_LIMIT);
  const [canCreateFlashcard, setCanCreateFlashcard] = useState<boolean>(true);
  const [isCheckingLimits, setIsCheckingLimits] = useState<boolean>(false);

  // Check limits when component mounts and user changes
  const checkLimits = useCallback(async () => {
    if (!user) return;
    
    setIsCheckingLimits(true);
    try {
      const dailyGenerationLimit = await checkDailyGenerationLimit(user.id);
      setDailyGenerationRemaining(dailyGenerationLimit.remaining);
      setCanCreateFlashcard(dailyGenerationLimit.canGenerate);
    } catch (error) {
      console.error('Error checking limits:', error);
      setCanCreateFlashcard(true); // Allow generation on error
    } finally {
      setIsCheckingLimits(false);
    }
  }, [user]);

  useEffect(() => {
    checkLimits();
  }, [checkLimits]);

  const handleGenerateFlashcards = async () => {
    if (!inputContent.trim() || inputContent.length < 100) {
      alert('Please provide at least 100 characters of content in the sidebar.');
      return;
    }

    if (!user) {
      alert('Please log in to generate flashcards.');
      return;
    }

    // Check daily generation limit
    const dailyGenerationLimit = await checkDailyGenerationLimit(user.id);
    if (!dailyGenerationLimit.canGenerate) {
      alert(`Daily generation limit reached! You can create ${LIMITS.DAILY_GENERATION_LIMIT} items per day across all features. Try again tomorrow.`);
      return;
    }

    setIsGenerating(true);
    setGeneratedFlashcards(null);
    setFlashcardTitle(null);

    try {
      if(process.env.NODE_ENV === 'development') {
        console.log('Sending to flashcard API:', { 
            text: inputContent.substring(0, 200) + '...', 
            textLength: inputContent.length,
            userId: user?.id 
        });
      }
        
        // Updated API endpoint for flashcards
        const response = await fetch(`${baseUrl}/api/v1/flashcard`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                text: inputContent,
                userId: user?.id 
            }),
        });
        
        if (!response.ok) {
            throw new Error('Backend not available');
        }

        const flashcardData: FlashcardResponse = await response.json();
        if(process.env.NODE_ENV === 'development') {
        console.log('Flashcard API Response:', flashcardData);
        console.log('Flashcard Data Type:', typeof flashcardData);
        console.log('Flashcard Data Keys:', Object.keys(flashcardData));
        }
        
        // Check if the response has the expected structure
        if (flashcardData.flashcards && Array.isArray(flashcardData.flashcards)) {
            if(process.env.NODE_ENV === 'development') {
            console.log('Flashcards array:', flashcardData.flashcards);
            console.log('First flashcard:', flashcardData.flashcards[0]);
            }
            
            // Fix the typo in the API response (quetion -> question)
            const correctedFlashcards = flashcardData.flashcards.map((card: {question?: string; quetion?: string; answer?: string}) => ({
                question: card.question || card.quetion || 'No question available',
                answer: card.answer || 'No answer available'
            }));
            
            if(process.env.NODE_ENV === 'development') {
            console.log('Corrected flashcards:', correctedFlashcards);
            }
            
            // Check if the response is too generic and provide better fallback
            const isGenericResponse = correctedFlashcards.some((card: Flashcard) => 
                card.question.includes('main topics covered') || 
                card.answer.includes('text contains information that can be studied')
            );
            
            if (isGenericResponse && correctedFlashcards.length === 1) {
                console.warn('Backend returned generic response, creating content-based flashcards...');
                // Create better flashcards from the actual content
                const contentSummary = inputContent.substring(0, 500);
                const betterFlashcards: Flashcard[] = [
                    {
                        question: "What is the main content about?",
                        answer: contentSummary + (inputContent.length > 500 ? '...' : '')
                    },
                    {
                        question: "Key information from the text",
                        answer: inputContent.length > 1000 ? 
                            inputContent.substring(500, 1000) + '...' : 
                            inputContent.substring(contentSummary.length)
                    }
                ].filter(card => card.answer.trim().length > 0);
                
                setFlashcardTitle(flashcardData.title || 'Content Summary');
                setGeneratedFlashcards(betterFlashcards);
            } else {
                setFlashcardTitle(flashcardData.title);
                setGeneratedFlashcards(correctedFlashcards);
            }
        } else {
            console.error('Invalid flashcard data structure:', flashcardData);
            alert('Invalid API response structure. Check console for details.');
            // Try to extract data if it's in a different format
            if (typeof flashcardData === 'string') {
                // If the API is returning a string, let's create a single flashcard from it
                const singleFlashcard: Flashcard[] = [{
                    question: "Content Summary",
                    answer: flashcardData
                }];
                setFlashcardTitle("Generated Summary");
                setGeneratedFlashcards(singleFlashcard);
            } else if ((flashcardData as {flashcard?: string}).flashcard) {
                // Maybe the API returns { flashcard: "..." } instead of { flashcards: [...] }
                const singleFlashcard: Flashcard[] = [{
                    question: "Content Summary", 
                    answer: (flashcardData as {flashcard: string}).flashcard
                }];
                setFlashcardTitle(flashcardData.title || "Generated Summary");
                setGeneratedFlashcards(singleFlashcard);
            } else {
                throw new Error('API returned unexpected data structure');
            }
        }
        

        // Save flashcard data to Firebase
        if(user) {
            const saveResult = await saveFlashcardData(user.id, flashcardData);
            // Update daily generation count
            await updateDailyGenerationCount(user.id);
            // Refresh limits
            await checkLimits();

            if (saveResult.status === 200 && saveResult.id) {
                // Redirect to the view page with the generated ID
                router.push(`/flashcard/view/${saveResult.id}`);
                return; // Exit early since we're redirecting
            }
        } 
    } catch (error) {
        console.error('Backend not available, using dummy data:', error);
        
        // Dummy data fallback
        const dummyFlashcardData: FlashcardResponse = {
          title: "Sample Flashcards",
          flashcards: [
            {
              question: "What is React?",
              answer: "React is a JavaScript library for building user interfaces, particularly web applications. It was developed by Facebook and allows developers to create reusable UI components."
            },
            {
              question: "What is a component in React?",
              answer: "A component is a reusable piece of code that returns JSX elements to be rendered to the page. Components can be either functional or class-based."
            },
            {
              question: "What is JSX?",
              answer: "JSX is a syntax extension for JavaScript that allows you to write HTML-like code within JavaScript. It makes it easier to create and visualize the structure of UI components."
            },
            {
              question: "What are props in React?",
              answer: "Props (short for properties) are a way to pass data from parent components to child components. They are read-only and help make components reusable."
            },
            {
              question: "What is state in React?",
              answer: "State is a built-in object that stores data that can change over time within a component. When state changes, the component re-renders to reflect the new data."
            }
          ],
          generatedAt: new Date()
        };
        
        setFlashcardTitle(dummyFlashcardData.title);
        setGeneratedFlashcards(dummyFlashcardData.flashcards || []);
        

        // Save dummy data to Firebase
        if(user) {
            const saveResult = await saveFlashcardData(user.id, dummyFlashcardData);
            // Update daily generation count
            await updateDailyGenerationCount(user.id);
            // Refresh limits
            await checkLimits();
            if (saveResult.status === 200 && saveResult.id) {
                // Redirect to the view page with the generated ID
                router.push(`/flashcard/view/${saveResult.id}`);
                return; // Exit early since we're redirecting
            }
        }
    } finally {
        setIsGenerating(false);
    }
  };
  
  // Download handler is now specific to generating a CSV
  const handleDownload = useCallback(() => {
    if (!generatedFlashcards || isDownloading) return;
    setIsDownloading(true);

    // Prepare CSV content
    const headers = '"Question","Answer"';
    const rows = generatedFlashcards.map(card => 
        `"${card.question.replace(/"/g, '""')}","${card.answer.replace(/"/g, '""')}"`
    ).join('\n');
    const csvContent = `${headers}\n${rows}`;
    
    // Create Blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const title = flashcardTitle?.replace(/\s+/g, '_').toLowerCase() || 'flashcards';
    link.setAttribute('href', url);
    link.setAttribute('download', `${title}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setTimeout(() => setIsDownloading(false), 2000);
  }, [generatedFlashcards, flashcardTitle, isDownloading]);

  return (
    <div className={`flex flex-col h-full transition-colors duration-300 ${darkMode ? 'bg-zinc-950' : 'bg-zinc-50'}`}>
      <div className={`flex-shrink-0 p-4 md:p-6 border-b ${darkMode ? 'border-zinc-800' : 'border-zinc-200'}`}>
        {/* Updated titles and text */}
        <h2 className={`text-xl font-semibold ${darkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>{flashcardTitle || 'Flashcard Generator'}</h2>
        <p className={`text-sm ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Review your content with interactive flashcards.</p>
        
        {/* Limits Display */}
        {!isCheckingLimits && (
          <div className="flex justify-center items-center mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm text-blue-700 dark:text-blue-300">
                Daily Generations: {dailyGenerationRemaining} remaining (all features)
              </span>
            </div>
          </div>
        )}
        
        {/* Warning for limits */}
        {!canCreateFlashcard && (
          <div className="flex items-center justify-center space-x-2 mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
            <span className="text-sm text-red-700 dark:text-red-300">
              Daily generation limit reached. You can create {LIMITS.DAILY_GENERATION_LIMIT} items per day across all features.
            </span>
          </div>
        )}
      </div>
      
      <div className="flex-grow relative flex items-center justify-center p-4" style={{ minHeight: 0 }}>
        {generatedFlashcards ? (
          <InteractiveFlashcards 
            data={{ title: flashcardTitle || 'Untitled', flashcards: generatedFlashcards }} 
          />
        ) : (
          <div className={`absolute inset-0 flex flex-col items-center justify-center text-center ${darkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
            <Layers className="w-16 h-16 mb-4" /> {/* Changed icon */}
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>Your flashcards will appear here</h3>
             <button onClick={handleGenerateFlashcards} disabled={inputContent.length < 100 || isGenerating || !canCreateFlashcard} className="mt-6 bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:bg-purple-700">
                {isGenerating ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Layers className="w-5 h-5" />}
                <span>{isGenerating ? 'Generating...' : 'Generate Flashcards'}</span>
            </button>
          </div>
        )}
      </div>
      
      {generatedFlashcards && (
        <div className={`flex-shrink-0 p-4 border-t ${darkMode ? 'border-zinc-700' : 'border-zinc-200'} flex gap-4`}>
             <button onClick={handleGenerateFlashcards} disabled={isGenerating || !canCreateFlashcard} className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg ${darkMode ? 'bg-zinc-700 hover:bg-zinc-600' : 'bg-zinc-200 hover:bg-zinc-300'} disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold`}>
                {isGenerating ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <Layers className="w-4 h-4" />}
                <span>Regenerate</span>
            </button>
            <button onClick={handleDownload} disabled={isDownloading} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold">
                {isDownloading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Download className="w-4 h-4" />}
                {/* Updated download button text */}
                <span>{isDownloading ? 'Downloading...' : 'Download CSV'}</span>
            </button>
        </div>
      )}
      </div>
  );
};

// Wrapper component
const FlashcardGenerator: React.FC = () => (
  <ProtectedRoute>
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <FlashcardGeneratorContent />
    </Suspense>
  </ProtectedRoute>
);

export default FlashcardGenerator;