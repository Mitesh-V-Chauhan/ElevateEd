"use client";

import React, { useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUniversalInput } from '@/contexts/InputContext';
import { useAuth } from '@/contexts/AuthContext';
import { Type, FileUp, Upload, FileText, ChevronLeft, ChevronRight, Bot, BarChart3, Share, Settings, Brain, Globe, Play, Languages, Music, Video} from 'lucide-react';
import { baseUrl } from '@/utils/urls';

interface UniversalSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const UniversalSidebar: React.FC<UniversalSidebarProps> = ({ isCollapsed, onToggleCollapse }) => {
  const { inputContent, setInputContent, selectedLanguage, setSelectedLanguage } = useUniversalInput();
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  // State and logic for input is now isolated here
  const [inputMethod, setInputMethod] = useState<'text' | 'pdf' | 'website' | 'youtube'>('text');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isLoadingWebsite, setIsLoadingWebsite] = useState(false);
  const [isLoadingYoutube, setIsLoadingYoutube] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Language options
  const languages = [
    'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian', 
    'Chinese', 'Japanese', 'Korean', 'Arabic', 'Hindi', 'Dutch', 'Swedish', 
    'Norwegian', 'Polish', 'Turkish', 'Greek', 'Hebrew', 'Thai'
  ];

  const tools = [
    { id: 'generator', name: 'Quiz', icon: Bot, path: '/generator' },
    { id: 'summariser', name: 'Summary', icon: BarChart3, path: '/summariser' },
    { id: 'translator', name: 'Translate', icon: Languages, path: '/translator' },
    { id: 'flowchart', name: 'Flowchart', icon: Share, path: '/flowchart' },
    { id: 'flashcard', name: 'Flashcard', icon: Brain, path: '/flashcard' },
  ];

//   const currentTool = tools.find(tool => pathname === tool.path);

//   const extractTextFromPDF = async (file: File) => {
//     setIsLoadingFile(true);
//     setInputContent('');
//     try {
//       const formData = new FormData();
//       formData.append('pdf_file', file);
//       const response = await fetch(`${baseUrl}/api/v1/extract-text`, { method: 'POST', body: formData });
//       const data = await response.json();
//       if (!response.ok) throw new Error(data.detail || 'Failed to extract text.');
//       setInputContent(data.text || '');
//     } catch (error) {
//       console.error('Error extracting text from PDF:', error);
//       alert(error instanceof Error ? error.message : 'An unknown error occurred.');
//     } finally {
//       setIsLoadingFile(false);
//     }
//   };

  const extractTextFromFile = async (file: File) => {
    setIsLoadingFile(true);
    setInputContent('');
    try {
      const formData = new FormData();
      const fileType = file.type.toLowerCase();
      const fileName = file.name.toLowerCase();
      
      // Handle text files directly without API call
      if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
        const text = await file.text();
        setInputContent(text);
        setIsLoadingFile(false);
        return;
      }
      
      // For all other file types, use the same extract-text endpoint
      // The backend will determine how to handle different file types
      formData.append('file', file);
      if (user?.id) {
        formData.append('userId', user.id);
      }
      
      const response = await fetch(`${baseUrl}/api/v1/extract-text`, { 
        method: 'POST', 
        body: formData 
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Failed to extract content from file.');
      setInputContent(data.text || data.transcript || '');
      setInputMethod('text'); // Switch to text input method to show extracted content
    } catch (error) {
      console.error('Error extracting content from file:', error);
      alert(error instanceof Error ? error.message : 'An unknown error occurred.');
    } finally {
      setIsLoadingFile(false);
    }
  };

  const extractTextFromWebsite = async (url: string) => {
    if (!url.trim()) {
      alert('Please enter a valid website URL.');
      return;
    }
    
    setIsLoadingWebsite(true);
    setInputContent('');
    try {
      const response = await fetch('https://codeed-backend-hu8z.onrender.com/api/v1/get-webpage-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          url: url.trim(),
          userId: user?.id 
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Failed to extract text from website.');
      setInputContent(data.text || data.content || '');
      setInputMethod('text'); // Switch to text input method to show extracted content
    } catch (error) {
      console.error('Error extracting text from website:', error);
      alert(error instanceof Error ? error.message : 'Failed to extract text from website.');
    } finally {
      setIsLoadingWebsite(false);
    }
  };

  const extractYoutubeTranscript = async (videoUrl: string) => {
    if (!videoUrl.trim()) {
      alert('Please enter a valid YouTube video URL.');
      return;
    }
    
    setIsLoadingYoutube(true);
    setInputContent('');
    try {
      const response = await fetch('https://codeed-backend-hu8z.onrender.com/api/v1/get-youtube-transcript', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ video_url: videoUrl.trim() }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Failed to extract YouTube transcript.');
      setInputContent(data.transcript || data.text || '');
      setInputMethod('text'); // Switch to text input method to show extracted content
    } catch (error) {
      console.error('Error extracting YouTube transcript:', error);
      alert(error instanceof Error ? error.message : 'Failed to extract YouTube transcript.');
    } finally {
      setIsLoadingYoutube(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileType = file.type.toLowerCase();
      const fileName = file.name.toLowerCase();
      
      // Check if file type is supported
      const supportedTypes = [
        'application/pdf',
        'text/plain',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];
      
      const supportedExtensions = [
        '.pdf', '.txt', '.docx', '.mp3', '.wav', '.m4a', '.mp4', '.avi', '.mov'
      ];
      
      const isSupported = supportedTypes.includes(fileType) || 
                         supportedExtensions.some(ext => fileName.endsWith(ext)) ||
                         fileType.startsWith('audio/') || 
                         fileType.startsWith('video/');
      
      if (!isSupported) {
        alert('Please select a supported file type: PDF, DOCX, TXT, MP3, MP4, or other supported audio/video files.');
        return;
      }
      
      setUploadedFile(file);
      extractTextFromFile(file);
    }
  };

  const getFileIcon = (file: File) => {
    const fileType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();
    
    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      return <FileText className="w-5 h-5 text-red-500 flex-shrink-0" />;
    } else if (fileType.startsWith('audio/') || fileName.endsWith('.mp3') || fileName.endsWith('.wav') || fileName.endsWith('.m4a')) {
      return <Music className="w-5 h-5 text-green-500 flex-shrink-0" />;
    } else if (fileType.startsWith('video/') || fileName.endsWith('.mp4') || fileName.endsWith('.avi') || fileName.endsWith('.mov')) {
      return <Video className="w-5 h-5 text-blue-500 flex-shrink-0" />;
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileName.endsWith('.docx')) {
      return <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />;
    } else if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
      return <FileText className="w-5 h-5 text-gray-500 flex-shrink-0" />;
    } else {
      return <FileText className="w-5 h-5 text-purple-500 flex-shrink-0" />;
    }
  };

  return (
    <div className={`h-full w-full bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col transition-all duration-300`}>
      {/* Header with collapse toggle - Compact */}
      <div className="flex items-center justify-between p-3 border-b border-zinc-200 dark:border-zinc-800">
        {!isCollapsed && (
          <div>
            <h2 className="text-lg font-['SF-Pro-Display-Regular'] text-zinc-900 dark:text-zinc-100">ElevateEd</h2>
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
          )}
        </button>
      </div>

      {/* Tool Navigation - Compact with Names */}
      <div className="p-2 border-b border-zinc-200 dark:border-zinc-800">
        {!isCollapsed && (
          <div className="space-y-1">
            {tools.map((tool) => {
              const isActive = pathname === tool.path;
              return (
                <button
                  key={tool.id}
                  onClick={() => router.push(tool.path)}
                  className={`w-full flex items-center p-1.5 rounded transition-colors text-xs ${
                    isActive 
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' 
                      : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  <tool.icon className="w-3.5 h-3.5 mr-2 flex-shrink-0" />
                  <span className="font-medium">{tool.name}</span>
                </button>
              );
            })}
          </div>
        )}
        {isCollapsed && (
          <div className="space-y-1">
            {tools.map((tool) => {
              const isActive = pathname === tool.path;
              return (
                <button
                  key={tool.id}
                  onClick={() => router.push(tool.path)}
                  className={`w-full flex items-center justify-center p-1.5 rounded transition-colors ${
                    isActive 
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' 
                      : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                  }`}
                  title={tool.name}
                >
                  <tool.icon className="w-3.5 h-3.5" />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Input Section - More Space for Content */}
      {!isCollapsed && (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-2">
            {/* Language Selection - Compact */}
            <div className="mb-2">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full p-1.5 text-xs border rounded-md bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 focus:ring-1 focus:ring-purple-400 focus:border-purple-400 outline-none"
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex-1 p-2 overflow-y-auto space-y-3">
            <div className="flex-1 flex flex-col space-y-2">
                <div className="bg-zinc-100 dark:bg-zinc-800 rounded-md p-0.5 grid grid-cols-2 gap-0.5">
                  <button onClick={() => setInputMethod('text')} className={`py-1 text-xs rounded-sm transition-colors ${inputMethod === 'text' ? 'bg-white dark:bg-zinc-700 shadow-sm font-["SF-Pro-Display-Regular"]' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'}`}>
                    <Type className="w-3 h-3 inline-block mr-1" />
                    Text
                  </button>
                  <button onClick={() => setInputMethod('pdf')} className={`py-1 text-xs rounded-sm transition-colors ${inputMethod === 'pdf' ? 'bg-white dark:bg-zinc-700 shadow-sm font-["SF-Pro-Display-Regular"]' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'}`}>
                    <FileUp className="w-3 h-3 inline-block mr-1" />
                    Files
                  </button>
                  <button onClick={() => setInputMethod('website')} className={`py-1 text-xs rounded-sm transition-colors ${inputMethod === 'website' ? 'bg-white dark:bg-zinc-700 shadow-sm font-["SF-Pro-Display-Regular"]' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'}`}>
                    <Globe className="w-3 h-3 inline-block mr-1" />
                    Web
                  </button>
                  <button onClick={() => setInputMethod('youtube')} className={`py-1 text-xs rounded-sm transition-colors ${inputMethod === 'youtube' ? 'bg-white dark:bg-zinc-700 shadow-sm font-["SF-Pro-Display-Regular"]' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'}`}>
                    <Play className="w-3 h-3 inline-block mr-1" />
                    YT
                  </button>
                </div>
                
                {inputMethod === 'text' ? (
                  <div className="flex-1 flex flex-col">
                    <textarea value={inputContent} onChange={(e) => setInputContent(e.target.value)} placeholder="Paste content here..."
                      className="w-full flex-1 p-3 border rounded-md resize-none bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 focus:ring-1 focus:ring-purple-400 focus:border-purple-400 outline-none text-sm" 
                      style={{ minHeight: '200px' }} />
                    <div className="mt-2 text-xs flex justify-between text-zinc-500 dark:text-zinc-400">
                      <span className={inputContent.length < 100 ? 'text-red-500' : 'text-green-500'}>{inputContent.length < 100 ? 'Min 100 chars' : 'Ready'}</span>
                      <span>{inputContent.length}</span>
                    </div>
                  </div>
                ) : inputMethod === 'pdf' ? (
                  <div className="space-y-2">
                    <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed rounded-lg p-3 text-center cursor-pointer border-zinc-300 dark:border-zinc-700 hover:border-purple-400 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all">
                      <input 
                        ref={fileInputRef} 
                        type="file" 
                        accept=".pdf,.docx,.txt,.mp3,.wav,.m4a,.mp4,.avi,.mov,audio/*,video/*" 
                        onChange={handleFileUpload} 
                        className="hidden" 
                      />
                      <Upload className="w-5 h-5 mx-auto mb-1 text-zinc-400 dark:text-zinc-500" />
                      <p className="font-['SF-Pro-Display-Regular'] text-xs text-zinc-700 dark:text-zinc-300">Upload file</p>
                    </div>
                    {uploadedFile && (
                      <div className="p-2 rounded-md border flex items-center space-x-2 bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700">
                        {getFileIcon(uploadedFile)}
                        <div className="flex-1 min-w-0">
                          <p className="font-['SF-Pro-Display-Regular'] text-xs truncate">{uploadedFile?.name}</p>
                        </div>
                      </div>
                    )}
                    {isLoadingFile && (
                      <div className="text-center">
                        <div className="inline-flex items-center space-x-1 text-xs text-purple-600 dark:text-purple-400">
                          <div className="w-3 h-3 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                          <span>Processing...</span>
                        </div>
                      </div>
                    )}
                    {inputContent && !isLoadingFile && (
                      <div className="space-y-1">
                        <div className="max-h-24 overflow-y-auto p-2 bg-zinc-50 dark:bg-zinc-800 border rounded-md border-zinc-200 dark:border-zinc-700">
                          <p className="text-xs text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap">{inputContent.substring(0, 150)}...</p>
                        </div>
                        <div className="text-xs text-zinc-500 dark:text-zinc-400">
                          <span className={inputContent.length < 100 ? 'text-red-500' : 'text-green-500'}>
                            {inputContent.length < 100 ? 'Min 100' : 'Ready'}
                          </span>
                          <span className="ml-2">{inputContent.length}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : inputMethod === 'website' ? (
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <input
                        type="url"
                        value={websiteUrl}
                        onChange={(e) => setWebsiteUrl(e.target.value)}
                        placeholder="https://example.com"
                        className="w-full p-2 border rounded-md bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 focus:ring-1 focus:ring-purple-400 focus:border-purple-400 outline-none text-xs"
                      />
                      <button
                        onClick={() => extractTextFromWebsite(websiteUrl)}
                        disabled={isLoadingWebsite || !websiteUrl.trim()}
                        className="w-full py-1.5 px-3 bg-purple-600 hover:bg-purple-700 disabled:bg-zinc-400 disabled:cursor-not-allowed text-white rounded-md transition-colors text-xs font-medium"
                      >
                        {isLoadingWebsite ? 'Extracting...' : 'Extract'}
                      </button>
                    </div>
                    {inputContent && !isLoadingWebsite && (
                      <div className="space-y-1">
                        <div className="max-h-24 overflow-y-auto p-2 bg-zinc-50 dark:bg-zinc-800 border rounded-md border-zinc-200 dark:border-zinc-700">
                          <p className="text-xs text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap">{inputContent.substring(0, 150)}...</p>
                        </div>
                        <div className="text-xs text-zinc-500 dark:text-zinc-400">
                          <span className={inputContent.length < 100 ? 'text-red-500' : 'text-green-500'}>
                            {inputContent.length < 100 ? 'Min 100' : 'Ready'}
                          </span>
                          <span className="ml-2">{inputContent.length}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <input
                        type="url"
                        value={youtubeUrl}
                        onChange={(e) => setYoutubeUrl(e.target.value)}
                        placeholder="https://youtube.com/watch?v=..."
                        className="w-full p-2 border rounded-md bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 focus:ring-1 focus:ring-purple-400 focus:border-purple-400 outline-none text-xs"
                      />
                      <button
                        onClick={() => extractYoutubeTranscript(youtubeUrl)}
                        disabled={isLoadingYoutube || !youtubeUrl.trim()}
                        className="w-full py-1.5 px-3 bg-red-600 hover:bg-red-700 disabled:bg-zinc-400 disabled:cursor-not-allowed text-white rounded-md transition-colors text-xs font-medium"
                      >
                        {isLoadingYoutube ? 'Extracting...' : 'Get Transcript'}
                      </button>
                    </div>
                    {inputContent && !isLoadingYoutube && (
                      <div className="space-y-1">
                        <div className="max-h-24 overflow-y-auto p-2 bg-zinc-50 dark:bg-zinc-800 border rounded-md border-zinc-200 dark:border-zinc-700">
                          <p className="text-xs text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap">{inputContent.substring(0, 150)}...</p>
                        </div>
                        <div className="text-xs text-zinc-500 dark:text-zinc-400">
                          <span className={inputContent.length < 100 ? 'text-red-500' : 'text-green-500'}>
                            {inputContent.length < 100 ? 'Min 100' : 'Ready'}
                          </span>
                          <span className="ml-2">{inputContent.length}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
            </div>
          </div>
        </div>
      )}

      {/* Settings - Compact footer */}
      <div className="p-2 border-t border-zinc-200 dark:border-zinc-800">
        <button className={`w-full flex items-center ${isCollapsed ? 'justify-center p-2' : 'p-2'} rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-600 dark:text-zinc-400`}>
          <Settings className={`w-4 h-4 ${!isCollapsed ? 'mr-2' : ''}`} />
          {!isCollapsed && <span className="text-xs">Settings</span>}
        </button>
      </div>
    </div>
  );
};

export default UniversalSidebar;