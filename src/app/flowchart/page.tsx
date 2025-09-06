"use client";

import React, { useState, Suspense, useCallback } from 'react';
import { Spline, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import InteractiveFlowchart from '@/components/InteractiveFlowchart';
import { baseUrl } from '@/utils/urls';
import { saveFlowChartData } from '@/services/firebaseFunctions/post';
import { useUniversalInput } from '@/contexts/InputContext';
import { useAuth } from '@/contexts/AuthContext';

export interface FlowchartResponse {
  id?: string;
  title: string;
  flowchart: {
    nodes: Array<{ label: string; children?: number[]; }>;
  };
  generatedAt?: Date | { seconds: number };
}

const FlowchartGeneratorContent: React.FC = () => {
  const { user } = useAuth();
  const { inputContent, selectedLanguage } = useUniversalInput(); // Get content and language from context
  const router = useRouter();
  
  const [generatedFlowchart, setGeneratedFlowchart] = useState<FlowchartResponse['flowchart'] | null>(null);
  const [flowchartTitle, setFlowchartTitle] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadFunction, setDownloadFunction] = useState<(() => void) | null>(null);
  const [customInstructions, setCustomInstructions] = useState<string>('');
  
  const handleGenerateFlowchart = async () => {
    if (!inputContent.trim() || inputContent.length < 100) {
      alert('Please provide at least 100 characters of content in the sidebar.');
      return;
    }
    setIsGenerating(true);
    setGeneratedFlowchart(null);
    setFlowchartTitle(null);

    try {
        const response = await fetch(`${baseUrl}/api/v1/flowchart`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                text: inputContent,
                userId: user?.id,
                language: selectedLanguage,
                instructions: customInstructions.trim() || undefined
            }),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to generate flowchart.');
        }

        const flowChartData: FlowchartResponse = await response.json();
        setFlowchartTitle(flowChartData.title);
        setGeneratedFlowchart(flowChartData.flowchart);
        
        // Save to Firebase and redirect to view page
        if(user) {
            const saveResult = await saveFlowChartData(user.id, flowChartData);
            if (saveResult.status === 200 && saveResult.id) {
                // Redirect to the view page with the generated ID
                router.push(`/flowchart/view/${saveResult.id}`);
                return; // Exit early since we're redirecting
            }
        }
    } catch (error) {
        console.error('Error generating flowchart:', error);
        alert(error instanceof Error ? error.message : 'An unknown error occurred.');
    } finally {
        setIsGenerating(false);
    }
  };

  const handleDownload = useCallback(() => {
    if (!downloadFunction || isDownloading) return;
    setIsDownloading(true);
    downloadFunction();
    setTimeout(() => setIsDownloading(false), 3000);
  }, [downloadFunction, isDownloading]);

  return (
    <div className="flex h-full bg-white dark:bg-zinc-900/50">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <div className="flex-shrink-0 p-4 md:p-6 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">{flowchartTitle || 'Flowchart Generator'}</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Visualize your content as an interactive flowchart.</p>
        </div>
        
        <div className="flex-grow relative" style={{ minHeight: 0 }}>
          {generatedFlowchart ? (
            <InteractiveFlowchart 
              data={{ title: flowchartTitle || 'Untitled', flowchart: generatedFlowchart }} 
              onDownload={setDownloadFunction}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-zinc-600 dark:text-zinc-300">Your flowchart will appear here</h3>
                <button onClick={handleGenerateFlowchart} disabled={inputContent.length < 100 || isGenerating} className="mt-6 bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:bg-purple-700">
                  {isGenerating ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Spline className="w-5 h-5" />}
                  <span>{isGenerating ? 'Generating...' : 'Generate Flowchart'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
        
        {generatedFlowchart && (
          <div className="flex-shrink-0 p-4 border-t border-zinc-200 dark:border-zinc-700 flex gap-4">
            <button onClick={handleGenerateFlowchart} disabled={isGenerating} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold">
              {isGenerating ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <Spline className="w-4 h-4" />}
              <span>Regenerate</span>
            </button>
            <button onClick={handleDownload} disabled={isDownloading || !downloadFunction} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold">
              {isDownloading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Download className="w-4 h-4" />}
              <span>{isDownloading ? 'Downloading...' : 'Download PNG'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Instructions Sidebar */}
      <div className="w-80 border-l border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex flex-col">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Custom Instructions</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Add specific instructions for your flowchart generation</p>
        </div>
        
        <div className="flex-1 p-4">
          <textarea
            value={customInstructions}
            onChange={(e) => setCustomInstructions(e.target.value)}
            placeholder="e.g., Focus on the main process steps, use colors for different categories, include decision points..."
            className="w-full h-32 p-3 border rounded-lg resize-none bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none text-sm"
            maxLength={500}
          />
          <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
            {customInstructions.length}/500 characters
          </div>
        </div>

        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Output Language</label>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 p-2 rounded">
              {selectedLanguage}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Wrapper component
const FlowchartGenerator: React.FC = () => (
  <ProtectedRoute>
      <Suspense fallback={<div>Loading...</div>}>
        <FlowchartGeneratorContent />
      </Suspense>
  </ProtectedRoute>
);

export default FlowchartGenerator;