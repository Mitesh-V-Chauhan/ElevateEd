"use client";

import React, { useState, useRef, Suspense } from 'react';
import { ChevronDown, Zap, Clipboard, Languages } from 'lucide-react';
import { baseUrl } from '@/utils/urls';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

import { useUniversalInput } from '@/contexts/InputContext';
import { useTheme } from '@/contexts/ThemeContext';

const TranslatorContent: React.FC = () => {
  const { user } = useAuth();
  const { inputContent } = useUniversalInput();
  useTheme();

  const [translatedContent, setTranslatedContent] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState('spanish');
  const [customInstruction, setCustomInstruction] = useState('');
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { id: 'spanish', name: 'Spanish' },
    { id: 'french', name: 'French' },
    { id: 'german', name: 'German' },
    { id: 'italian', name: 'Italian' },
    { id: 'portuguese', name: 'Portuguese' },
    { id: 'russian', name: 'Russian' },
    { id: 'chinese', name: 'Chinese (Simplified)' },
    { id: 'japanese', name: 'Japanese' },
    { id: 'korean', name: 'Korean' },
    { id: 'arabic', name: 'Arabic' },
    { id: 'hindi', name: 'Hindi' },
    { id: 'dutch', name: 'Dutch' },
    { id: 'swedish', name: 'Swedish' },
    { id: 'norwegian', name: 'Norwegian' },
    { id: 'danish', name: 'Danish' },
    { id: 'finnish', name: 'Finnish' },
    { id: 'polish', name: 'Polish' },
    { id: 'czech', name: 'Czech' },
    { id: 'hungarian', name: 'Hungarian' },
    { id: 'greek', name: 'Greek' },
    { id: 'turkish', name: 'Turkish' },
    { id: 'hebrew', name: 'Hebrew' },
    { id: 'thai', name: 'Thai' },
    { id: 'vietnamese', name: 'Vietnamese' },
    { id: 'indonesian', name: 'Indonesian' },
    { id: 'malay', name: 'Malay' },
    { id: 'tagalog', name: 'Filipino (Tagalog)' },
    { id: 'swahili', name: 'Swahili' },
    { id: 'urdu', name: 'Urdu' },
    { id: 'bengali', name: 'Bengali' },
    { id: 'tamil', name: 'Tamil' },
    { id: 'telugu', name: 'Telugu' },
    { id: 'marathi', name: 'Marathi' },
    { id: 'gujarati', name: 'Gujarati' },
    { id: 'punjabi', name: 'Punjabi' },
    { id: 'kannada', name: 'Kannada' },
    { id: 'malayalam', name: 'Malayalam' },
  ];

  const handleTranslate = async () => {
    if (!inputContent.trim() || inputContent.length < 50) {
      alert('Please provide at least 50 characters of content in the sidebar.');
      return;
    }
    if (!user) {
      alert('Please log in to translate content.');
      return;
    }
    setIsTranslating(true);
    setTranslatedContent(null);
    try {
      const response = await fetch(`${baseUrl}/api/v1/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: inputContent, 
          target_language: targetLanguage,
          userId: user.id,
          instruction: customInstruction.trim() || undefined
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to translate content.');
      }
      const data = await response.json();
      setTranslatedContent(data.translated_text || data.translation || data.result);
    } catch (error) {
      console.error('Error translating content:', error);
      alert(error instanceof Error ? error.message : 'An unknown error occurred.');
    } finally {
      setIsTranslating(false);
    }
  };
  
  const handleCopyTranslation = () => {
    if (!translatedContent) return;
    navigator.clipboard.writeText(translatedContent).then(() => alert('Translation copied!'));
  };

  const startNewTranslation = () => {
    setTranslatedContent(null);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-50 dark:bg-zinc-900/50" ref={dropdownRef}>
      <div className="p-4 md:p-6 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xl font-['SF-Pro-Display-Regular'] text-zinc-900 dark:text-zinc-100">AI Translator</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Configure options and translate your content to any language.</p>
      </div>

      <div className="flex-grow p-4 md:p-6 overflow-y-auto space-y-6">
        <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-sm font-['SF-Pro-Display-Regular'] mb-1.5 text-zinc-600 dark:text-zinc-400">Language</label>
                <button onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)} className="w-full text-left flex items-center justify-between p-3 rounded-lg border bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700">
                  <span>{languages.find(l => l.id === targetLanguage)?.name}</span>
                  <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isLanguageDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isLanguageDropdownOpen && (
                  <div className="absolute top-full w-full mt-1 rounded-lg shadow-lg z-20 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 max-h-60 overflow-y-auto">
                    {languages.map(item => <button key={item.id} onClick={() => { setTargetLanguage(item.id); setIsLanguageDropdownOpen(false); }} className={`block w-full text-left p-3 hover:bg-zinc-100 dark:hover:bg-zinc-700`}>{item.name}</button>)}
                  </div>
                )}
              </div>
              <div className="relative">
                <label className="block text-sm font-['SF-Pro-Display-Regular'] mb-1.5 text-zinc-600 dark:text-zinc-400">Instructions</label>
                <textarea
                  value={customInstruction}
                  onChange={(e) => setCustomInstruction(e.target.value)}
                  placeholder="e.g., 'Make it formal', 'Simplify for beginners'"
                  className="w-full p-3 border rounded-lg resize-none bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none"
                  rows={2}
                />
              </div>
            </div>
        </div>
        
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 min-h-[300px]">
          {translatedContent ? (
            <div className="prose prose-zinc dark:prose-invert max-w-none whitespace-pre-wrap text-base leading-relaxed">
              <span>{translatedContent}</span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-zinc-400 dark:text-zinc-500">
              <Languages className="w-16 h-16 mb-4" />
              <h3 className="font-['SF-Pro-Display-Regular'] text-lg">Your translation will appear here</h3>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 border-t border-zinc-200 dark:border-zinc-700">
        {translatedContent ? (
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={handleCopyTranslation} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-['SF-Pro-Display-Regular'] bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600">
                <Clipboard className="w-4 h-4" /><span>Copy</span>
              </button>
              <button onClick={startNewTranslation} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-['SF-Pro-Display-Regular'] bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600">
                <Zap className="w-4 h-4" /><span>New Translation</span>
              </button>
            </div>
        ) : (
          <button onClick={handleTranslate} disabled={inputContent.length < 50 || isTranslating} className="w-full bg-purple-600 text-white font-['SF-Pro-Display-Regular'] py-3 rounded-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed">
            {isTranslating ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Zap className="w-5 h-5" />}
            <span>{isTranslating ? 'Translating...' : 'Translate Content'}</span>
          </button>
        )}
      </div>
    </div>
  );
};

const Translator: React.FC = () => (
  <ProtectedRoute>
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <TranslatorContent />
    </Suspense>
  </ProtectedRoute>
);

export default Translator;
