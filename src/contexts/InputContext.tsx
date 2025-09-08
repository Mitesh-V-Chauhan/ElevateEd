"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface InputContextType {
  inputContent: string;
  setInputContent: (content: string) => void;
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
}

const InputContext = createContext<InputContextType | undefined>(undefined);

export const InputProvider = ({ children }: { children: ReactNode }) => {
  const [inputContent, setInputContentState] = useState<string>('');
  const [selectedLanguage, setSelectedLanguageState] = useState<string>('English');

  // Load content from localStorage on mount, but always default language to English
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedContent = localStorage.getItem('universalInputContent');
      if (savedContent) {
        setInputContentState(savedContent);
      }
      // Always default to English on page load, don't load saved language
      setSelectedLanguageState('English');
    }
  }, []);

  // Save content to localStorage whenever it changes
  const setInputContent = (content: string) => {
    setInputContentState(content);
    if (typeof window !== 'undefined') {
      localStorage.setItem('universalInputContent', content);
    }
  };

  // Save language to localStorage whenever it changes
  const setSelectedLanguage = (language: string) => {
    setSelectedLanguageState(language);
    if (typeof window !== 'undefined') {
      localStorage.setItem('universalInputLanguage', language);
    }
  };

  return (
    <InputContext.Provider value={{
      inputContent,
      setInputContent,
      selectedLanguage,
      setSelectedLanguage
    }}>
      {children}
    </InputContext.Provider>
  );
};

export const useUniversalInput = (): InputContextType => {
  const context = useContext(InputContext);
  if (context === undefined) {
    throw new Error('useUniversalInput must be used within an InputProvider');
  }
  return context;
};
