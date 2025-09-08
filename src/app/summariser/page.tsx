"use client";

import React, { useState, useRef, useEffect, Suspense, useCallback } from 'react';
import { ChevronDown, Zap, Clipboard, BookOpen, AlertTriangle } from 'lucide-react';
import { baseUrl } from '@/utils/urls';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { checkDailyGenerationLimit, updateDailyGenerationCount, LIMITS } from '@/services/firebaseFunctions/limits';
import { useUniversalInput } from '@/contexts/InputContext';
import { useTheme } from '@/contexts/ThemeContext';

const SummarizerContent: React.FC = () => {
  const { user } = useAuth();
  const { inputContent, selectedLanguage } = useUniversalInput();
  useTheme();

  const [generatedSummary, setGeneratedSummary] = useState<string | string[] | null>(null);
  const [summaryTitle, setSummaryTitle] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [summaryLength, setSummaryLength] = useState('medium');
  const [summaryFormat, setSummaryFormat] = useState('paragraph');
  const [isLengthDropdownOpen, setIsLengthDropdownOpen] = useState(false);
  const [isFormatDropdownOpen, setIsFormatDropdownOpen] = useState(false);
  const [canCreateSummary, setCanCreateSummary] = useState<boolean>(true);
  const [dailyGenerationRemaining, setDailyGenerationRemaining] = useState<number>(LIMITS.DAILY_GENERATION_LIMIT);
  const [isCheckingLimits, setIsCheckingLimits] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const summaryLengths = [{ id: 'short', name: 'Short' }, { id: 'medium', name: 'Medium' }, { id: 'long', name: 'Long' }];
  const summaryFormats = [{ id: 'paragraph', name: 'Paragraph' }, { id: 'bullet_points', name: 'Bullet Points' }];

  const checkUserLimits = useCallback(async () => {
    if (!user) return;
    console.log('Checking user limits for:', user.id);
    setIsCheckingLimits(true);
    try {
      const dailyGenerationLimit = await checkDailyGenerationLimit(user.id);
      console.log('Daily generation limit result:', dailyGenerationLimit);
      setDailyGenerationRemaining(dailyGenerationLimit.remaining);
      setCanCreateSummary(dailyGenerationLimit.canGenerate);
    } catch (error) {
      console.error('Error checking summary limits:', error);
      setCanCreateSummary(true);
    } finally {
      setIsCheckingLimits(false);
    }
  }, [user]);

  useEffect(() => {
    checkUserLimits();
  }, [checkUserLimits]);

  const handleGenerateSummary = async () => {
    if (!inputContent.trim() || inputContent.length < 100) {
      alert('Please provide at least 100 characters of content in the sidebar.');
      return;
    }
    if (!user) {
      alert('Please log in to generate summaries.');
      return;
    }

    // Check daily generation limit
    const dailyGenerationLimit = await checkDailyGenerationLimit(user.id);
    if (!dailyGenerationLimit.canGenerate) {
      alert(`Daily generation limit reached! You can create ${LIMITS.DAILY_GENERATION_LIMIT} items per day across all features. Try again tomorrow.`);
      return;
    }

    setIsGenerating(true);
    setGeneratedSummary(null);
    setSummaryTitle(null);
    try {
      const response = await fetch(`${baseUrl}/api/v1/summarize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: inputContent, 
          length: summaryLength, 
          format: summaryFormat,
          language: selectedLanguage || 'English',
          userId: user.id 
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to generate summary.');
      }
      const data = await response.json();
      setSummaryTitle(data.title || null);
      setGeneratedSummary(data.summary);
      
      // Update daily generation count
      console.log('Updating daily generation count for user:', user.id);
      const updateResult = await updateDailyGenerationCount(user.id);
      console.log('Update result:', updateResult);
      
      // Refresh limits to reflect the new count
      console.log('Refreshing limits...');
      await checkUserLimits();
      console.log('Limits refreshed');
    } catch (error) {
      console.error('Error generating summary:', error);
      alert(error instanceof Error ? error.message : 'An unknown error occurred.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleCopySummary = () => {
    if (!generatedSummary) return;
    const textToCopy = Array.isArray(generatedSummary) ? generatedSummary.join('\n') : generatedSummary;
    navigator.clipboard.writeText(textToCopy).then(() => alert('Summary copied!'));
  };

  const startNewSummary = () => {
    setGeneratedSummary(null);
    setSummaryTitle(null);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-50 dark:bg-zinc-900/50" ref={dropdownRef}>
      <div className="p-4 md:p-6 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xl font-['SF-Pro-Display-Regular'] text-zinc-900 dark:text-zinc-100">AI Summarizer</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Configure options and generate a summary from your content.</p>
        
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
        {!canCreateSummary && (
          <div className="flex items-center justify-center space-x-2 mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
            <span className="text-sm text-red-700 dark:text-red-300">
              Daily generation limit reached. You can create {LIMITS.DAILY_GENERATION_LIMIT} items per day across all features.
            </span>
          </div>
        )}
      </div>

      <div className="flex-grow p-4 md:p-6 overflow-y-auto space-y-6">
        <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-sm font-['SF-Pro-Display-Regular'] mb-1.5 text-zinc-600 dark:text-zinc-400">Length</label>
                <button onClick={() => setIsLengthDropdownOpen(!isLengthDropdownOpen)} className="w-full text-left flex items-center justify-between p-3 rounded-lg border bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700">
                  <span>{summaryLengths.find(l => l.id === summaryLength)?.name}</span>
                  <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isLengthDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isLengthDropdownOpen && (
                  <div className="absolute top-full w-full mt-1 rounded-lg shadow-lg z-20 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                    {summaryLengths.map(item => <button key={item.id} onClick={() => { setSummaryLength(item.id); setIsLengthDropdownOpen(false); }} className={`block w-full text-left p-3 hover:bg-zinc-100 dark:hover:bg-zinc-700`}>{item.name}</button>)}
                  </div>
                )}
              </div>
              <div className="relative">
                <label className="block text-sm font-['SF-Pro-Display-Regular'] mb-1.5 text-zinc-600 dark:text-zinc-400">Format</label>
                <button onClick={() => setIsFormatDropdownOpen(!isFormatDropdownOpen)} className="w-full text-left flex items-center justify-between p-3 rounded-lg border bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700">
                  <span>{summaryFormats.find(f => f.id === summaryFormat)?.name}</span>
                  <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isFormatDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isFormatDropdownOpen && (
                   <div className="absolute top-full w-full mt-1 rounded-lg shadow-lg z-20 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                    {summaryFormats.map(item => <button key={item.id} onClick={() => { setSummaryFormat(item.id); setIsFormatDropdownOpen(false); }} className={`block w-full text-left p-3 hover:bg-zinc-100 dark:hover:bg-zinc-700`}>{item.name}</button>)}
                  </div>
                )}
              </div>
            </div>
        </div>
        
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 min-h-[300px]">
          {generatedSummary ? (
            <div className="prose prose-zinc dark:prose-invert max-w-none whitespace-pre-wrap text-base leading-relaxed">
              {summaryTitle && <h3 className="mb-4 text-2xl font-['SF-Pro-Display-Regular']">{summaryTitle}</h3>}
              {Array.isArray(generatedSummary) ? (<ul className='list-disc list-inside'>{generatedSummary.map((point, idx) => <li className={idx%2 == 0 ? '' : 'text-gray-400'} key={idx}>{point}</li>)}</ul>) : (<span className='text-gray-400'>{generatedSummary}</span>)}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-zinc-400 dark:text-zinc-500">
              <BookOpen className="w-16 h-16 mb-4" />
              <h3 className="font-['SF-Pro-Display-Regular'] text-lg">Your summary will appear here</h3>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 border-t border-zinc-200 dark:border-zinc-700">
        {generatedSummary ? (
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={handleCopySummary} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-['SF-Pro-Display-Regular'] bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600">
                <Clipboard className="w-4 h-4" /><span>Copy</span>
              </button>
              <button onClick={startNewSummary} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-['SF-Pro-Display-Regular'] bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600">
                <Zap className="w-4 h-4" /><span>New Summary</span>
              </button>
            </div>
        ) : (
          <button onClick={handleGenerateSummary} disabled={inputContent.length < 100 || isGenerating || !canCreateSummary} className="w-full bg-purple-600 text-white font-['SF-Pro-Display-Regular'] py-3 rounded-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed">
            {isGenerating ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Zap className="w-5 h-5" />}
            <span>{isGenerating ? 'Generating...' : 'Generate Summary'}</span>
          </button>
        )}
      </div>
    </div>
  );
};

const Summarizer: React.FC = () => (
  <ProtectedRoute>
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <SummarizerContent />
    </Suspense>
  </ProtectedRoute>
);

export default Summarizer;