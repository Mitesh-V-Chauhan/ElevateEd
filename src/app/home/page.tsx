"use client";

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUniversalInput } from '@/contexts/InputContext';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  ArrowRight, FileText, BarChart3, Brain, Layers, Languages, 
  Type, FileUp, Upload, Globe, Play,
  Sparkles, Zap
} from 'lucide-react';
import { baseUrl } from '@/utils/urls';
import GeneratorHeader from '@/components/GeneratorHeader';

// Data for the sections
const tools = [
  {
    id: 'summariser',
    title: 'Summarizer',
    description: 'Condense long documents into key insights instantly. Perfect for research, articles, and reports.',
    icon: FileText,
    color: 'text-blue-500',
    path: '/summariser'
  },
  {
    id: 'generator',
    title: 'Quiz Generator',
    description: 'Automatically create insightful quizzes from your content to test and reinforce knowledge.',
    icon: Brain,
    color: 'text-purple-500',
    path: '/generator'
  },
  {
    id: 'flowchart',
    title: 'Flowchart',
    description: 'Visualize complex systems and processes with clear, easy-to-understand diagrams.',
    icon: BarChart3,
    color: 'text-emerald-500',
    path: '/flowchart'
  },
  {
    id: 'flashcard',
    title: 'Flashcards',
    description: 'Generate interactive flashcards to make studying more engaging and effective.',
    icon: Layers,
    color: 'text-orange-500',
    path: '/flashcard'
  },
  {
    id: 'translator',
    title: 'Translator',
    description: 'Break language barriers with accurate, context-aware translations for your documents.',
    icon: Languages,
    color: 'text-indigo-500',
    path: '/translator'
  }
];

const howItWorksSteps = [
  {
    icon: Upload,
    title: 'Add Your Content',
    description: 'Simply paste text, upload a file, or provide a link. We handle the rest.'
  },
  {
    icon: Zap,
    title: 'Choose a Tool',
    description: 'Select from our suite of AI tools, like the summarizer, quiz generator, or flowchart creator.'
  },
  {
    icon: Sparkles,
    title: 'Get Instant Results',
    description: 'Receive your generated content in seconds, ready to use, share, or study.'
  }
];


//================================================================
// 1. Hero & Input Section Component
//================================================================
const HeroSection: React.FC = () => {
    const { user } = useAuth();
    const { inputContent, setInputContent } = useUniversalInput();
    const router = useRouter();
    const { theme } = useTheme();
    const darkMode = theme === 'dark';

    const [inputMethod, setInputMethod] = useState<'text' | 'pdf' | 'website' | 'youtube'>('text');
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [isLoadingFile, setIsLoadingFile] = useState(false);
    const [websiteUrl, setWebsiteUrl] = useState('');
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [isLoadingWebsite, setIsLoadingWebsite] = useState(false);
    const [isLoadingYoutube, setIsLoadingYoutube] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleNavigate = (path: string) => {
        if (inputContent.trim().length < 50) {
            alert('Please enter at least 50 characters of content before proceeding.');
            return;
        }
        router.push(path);
    };

    const extractTextFromFile = async (file: File) => {
        setIsLoadingFile(true);
        setInputContent('');
        try {
            const formData = new FormData();
            formData.append('file', file);
            if (user?.id) formData.append('userId', user.id);
            
            const response = await fetch(`${baseUrl}/api/v1/extract-text`, { method: 'POST', body: formData });
            const data = await response.json();
            if (!response.ok) throw new Error(data.detail || 'Failed to extract content.');
            setInputContent(data.text || data.transcript || '');
        } catch (error) {
            console.error('Error extracting content from file:', error);
            alert(error instanceof Error ? error.message : 'An unknown error occurred.');
        } finally {
            setIsLoadingFile(false);
        }
    };
    
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setUploadedFile(file);
            extractTextFromFile(file);
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
          const response = await fetch(`${baseUrl}/api/v1/get-webpage-text`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: url.trim(), userId: user?.id }),
          });
          const data = await response.json();
          if (!response.ok) throw new Error(data.detail || 'Failed to extract text from website.');
          setInputContent(data.text || data.content || '');
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
          const response = await fetch(`${baseUrl}/api/v1/get-youtube-transcript`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ video_url: videoUrl.trim() }),
          });
          const data = await response.json();
          if (!response.ok) throw new Error(data.detail || 'Failed to extract YouTube transcript.');
          setInputContent(data.transcript || data.text || '');
        } catch (error) {
          console.error('Error extracting YouTube transcript:', error);
          alert(error instanceof Error ? error.message : 'Failed to extract YouTube transcript.');
        } finally {
          setIsLoadingYoutube(false);
        }
    };

    return (
        <section className="relative min-h-screen flex items-center justify-center py-20 px-4">
             {/* Gradient Background Removed */}
            <div className="relative z-10 w-full max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                      Elevate Your Learning
                    </h1>
                    <p className={`text-lg md:text-xl max-w-2xl mx-auto ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                      Transform any content into quizzes, summaries, and flashcards with the power of AI.
                    </p>
                </div>

                <div className={`rounded-2xl border backdrop-blur-sm transition-all duration-300 shadow-xl ${
                  darkMode ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white/90 border-zinc-200'
                }`}>
                    <div className="p-6">
                        <div className="mb-6 flex justify-center">
                            <div className={`inline-flex p-1 rounded-lg ${darkMode ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
                                {(['text', 'pdf', 'website', 'youtube'] as const).map(method => {
                                    const icons = { text: Type, pdf: FileUp, website: Globe, youtube: Play };
                                    const Icon = icons[method];
                                    const label = method === 'pdf' ? 'File' : method.charAt(0).toUpperCase() + method.slice(1);
                                    return (
                                        <button 
                                            key={method}
                                            onClick={() => setInputMethod(method)} 
                                            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm transition-all duration-200 ${
                                              inputMethod === method 
                                                ? 'bg-white text-zinc-900 shadow-sm font-semibold' 
                                                : `${darkMode ? 'text-zinc-400 hover:text-zinc-200' : 'text-zinc-500 hover:text-zinc-800'}`
                                            }`}
                                        >
                                            <Icon className="w-4 h-4" />
                                            <span>{label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {inputMethod === 'text' && (
                          <textarea
                              value={inputContent}
                              onChange={(e) => setInputContent(e.target.value)}
                              placeholder="Paste your notes, article, or any content here..."
                              className={`w-full h-40 p-4 border rounded-lg resize-none transition-all duration-300 text-base leading-relaxed ${
                                darkMode 
                                  ? 'bg-zinc-800/50 border-zinc-700 focus:border-purple-500 text-white' 
                                  : 'bg-zinc-50 border-zinc-200 focus:border-purple-500 text-zinc-900'
                              } focus:ring-2 focus:ring-purple-500/20 outline-none`}
                          />
                        )}

                        {inputMethod === 'pdf' && (
                            <div 
                                onClick={() => fileInputRef.current?.click()} 
                                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${
                                darkMode ? 'border-zinc-700 hover:border-purple-500 hover:bg-zinc-800/50' : 'border-zinc-300 hover:border-purple-500 hover:bg-zinc-50'
                                }`}
                            >
                                <input ref={fileInputRef} type="file" onChange={handleFileUpload} className="hidden" />
                                <Upload className={`w-8 h-8 mx-auto mb-3 ${darkMode ? 'text-zinc-500' : 'text-zinc-400'}`} />
                                <h3 className="text-base font-semibold mb-1">
                                    {uploadedFile ? uploadedFile.name : 'Upload Your File'}
                                </h3>
                                <p className={`text-sm ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                                    {isLoadingFile ? 'Processing...' : 'PDF, DOCX, TXT, MP3, MP4'}
                                </p>
                            </div>
                        )}
                        
                        {inputMethod === 'website' && (
                          <div className="space-y-3">
                              <input
                                type="url"
                                value={websiteUrl}
                                onChange={(e) => setWebsiteUrl(e.target.value)}
                                placeholder="https://example.com"
                                className={`w-full p-3 border rounded-lg transition-all duration-300 text-base ${
                                    darkMode 
                                    ? 'bg-zinc-900 border-zinc-700 focus:border-orange-500 text-white' 
                                    : 'bg-zinc-50 border-zinc-300 focus:border-orange-500 text-zinc-900'
                                } focus:ring-2 focus:ring-orange-500/20 outline-none`}
                              />
                              <button
                                onClick={() => extractTextFromWebsite(websiteUrl)}
                                disabled={isLoadingWebsite || !websiteUrl.trim()}
                                className={`w-full py-3 px-4 border-2 border-transparent bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 disabled:from-zinc-500 disabled:to-zinc-500 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-300 font-semibold ${
                                  !isLoadingWebsite && websiteUrl.trim() ? 'hover:shadow-lg' : ''
                                }`}
                              >
                                {isLoadingWebsite ? 'Extracting...' : 'Extract Content'}
                              </button>
                          </div>
                        )}

                        {inputMethod === 'youtube' && (
                            <div className="space-y-3">
                                <input
                                type="url"
                                value={youtubeUrl}
                                onChange={(e) => setYoutubeUrl(e.target.value)}
                                placeholder="https://youtube.com/watch?v=..."
                                className={`w-full p-3 border rounded-lg transition-all duration-300 text-base ${
                                    darkMode 
                                    ? 'bg-zinc-900 border-zinc-700 focus:border-orange-500 text-white' 
                                    : 'bg-zinc-50 border-zinc-300 focus:border-orange-500 text-zinc-900'
                                } focus:ring-2 focus:ring-orange-500/20 outline-none`}
                                />
                                <button
                                onClick={() => extractYoutubeTranscript(youtubeUrl)}
                                disabled={isLoadingYoutube || !youtubeUrl.trim()}
                                className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 disabled:bg-zinc-500 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-semibold"
                                >
                                {isLoadingYoutube ? 'Getting Transcript...' : 'Get Transcript'}
                                </button>
                            </div>
                        )}
                    </div>
                    {inputContent.length > 0 && (
                      <div className="p-6 border-t border-zinc-200 dark:border-zinc-800">
                          <div className="flex items-center justify-between mb-4">
                              <h3 className="text-sm font-semibold">Ready to Process</h3>
                              <div className={`text-xs font-medium px-2 py-1 rounded-md ${inputContent.length >= 50 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                  {inputContent.length >= 50 ? 'Content meets minimum length' : `${50 - inputContent.length} more characters needed`}
                              </div>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                              {tools.map((tool) => {
                                  const Icon = tool.icon;
                                  return (
                                      <button
                                          key={tool.id}
                                          onClick={() => handleNavigate(tool.path)}
                                          disabled={inputContent.length < 50}
                                          className={`group p-3 rounded-lg border text-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                                            darkMode ? 'bg-zinc-800 border-zinc-700 hover:border-purple-500' : 'bg-zinc-50 border-zinc-200 hover:border-purple-500'
                                          }`}
                                      >
                                          <Icon className={`w-5 h-5 mx-auto mb-1.5 ${tool.color}`} />
                                          <h4 className="text-xs font-semibold">{tool.title}</h4>
                                      </button>
                                  );
                              })}
                          </div>
                      </div>
                    )}
                </div>
            </div>
        </section>
    );
};

//================================================================
// 2. Features Section Component
//================================================================
const FeaturesSection: React.FC = () => {
  const { theme } = useTheme();
  const darkMode = theme === 'dark';

  return (
    <section className={`py-24 ${darkMode ? 'bg-zinc-900' : 'bg-zinc-50'}`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            A Tool for Every Need
          </h2>
          <p className={`text-lg max-w-3xl mx-auto ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
            From quick summaries to in-depth quizzes, our AI suite is designed to integrate seamlessly into your workflow.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div 
                key={tool.id}
                className={`p-8 rounded-2xl border transition-all duration-300 transform hover:-translate-y-2 ${
                  darkMode ? 'bg-zinc-950 border-zinc-800 hover:border-purple-500' : 'bg-white border-zinc-200 hover:border-purple-500'
                }`}
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-6 bg-zinc-100 dark:bg-zinc-800`}>
                  <Icon className={`w-6 h-6 ${tool.color}`} />
                </div>
                
                <h3 className="text-xl font-bold mb-3">
                  {tool.title}
                </h3>
                
                <p className={`leading-relaxed ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  {tool.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

//================================================================
// 3. How It Works Section Component
//================================================================
const HowItWorksSection: React.FC = () => {
  const { theme } = useTheme();
  const darkMode = theme === 'dark';

  return (
    <section className="py-24">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Learning, Simplified
          </h2>
          <p className={`text-lg max-w-3xl mx-auto ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
            Transform your materials into powerful learning aids in just three easy steps.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {howItWorksSteps.map((step, index) => (
            <div key={index} className="text-center flex flex-col items-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-purple-500 mb-6 border-2 ${darkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-100 border-zinc-200'}`}>
                <step.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">
                {step.title}
              </h3>
              <p className={` ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


//================================================================
// 4. Call-to-Action Section Component
//================================================================
const CtaSection: React.FC = () => {
  const { theme } = useTheme();
  const darkMode = theme === 'dark';

  return (
    <section className={`py-24 ${darkMode ? 'bg-zinc-900' : 'bg-zinc-50'}`}>
      <div className="max-w-4xl mx-auto px-4">
        <div className={`rounded-2xl p-12 text-center border ${darkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-200'}`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Ready to Elevate Your Learning?
          </h2>
          <p className={`text-lg mb-8 max-w-2xl mx-auto ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
            Start for free and discover a smarter, more efficient way to study and comprehend new information.
          </p>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 inline-flex items-center space-x-2 text-base shadow-lg hover:shadow-xl"
          >
            <span>Get Started Now</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};


//================================================================
// 5. Main Homepage Component
//================================================================
const HomePage: React.FC = () => {
  const { theme } = useTheme();
  const darkMode = theme === 'dark';

  return (
    <div className={`min-h-screen font-sans ${darkMode ? 'bg-zinc-950 text-white' : 'bg-white text-zinc-900'}`}>
      <GeneratorHeader />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <CtaSection />
      </main>
    </div>
  );
};

export default HomePage;