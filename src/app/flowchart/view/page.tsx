"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Spline } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import InteractiveFlowchart from '@/components/InteractiveFlowchart';
import { getFlowChart } from '@/services/firebaseFunctions/get';
import { FlowchartResponse } from '@/app/flowchart/page';

const FlowchartView: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [flowchart, setFlowchart] = useState<FlowchartResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFlowchart = async () => {
      if (!user?.id || !id) return;
      
      try {
        setLoading(true);
        const data = await getFlowChart(user.id, id as string);
        if (data) {
          setFlowchart(data);
        } else {
          setError('Flowchart not found');
        }
      } catch (err) {
        console.error('Error fetching flowchart:', err);
        setError('Failed to load flowchart');
      } finally {
        setLoading(false);
      }
    };

    fetchFlowchart();
  }, [user?.id, id]);

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="h-full overflow-y-auto bg-zinc-100 dark:bg-black">
          <div className="flex items-center justify-center py-20">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-lg text-zinc-700 dark:text-zinc-300">
                Loading flowchart...
              </span>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !flowchart) {
    return (
      <ProtectedRoute>
        <div className="h-full overflow-y-auto bg-zinc-100 dark:bg-black">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Spline className="w-16 h-16 mx-auto mb-4 text-zinc-400" />
              <h3 className="text-xl font-['SF-Pro-Display-Regular'] mb-2 text-zinc-900 dark:text-zinc-100">
                {error || 'Flowchart not found'}
              </h3>
              <button
                onClick={() => router.back()}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Go Back</span>
              </button>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="h-full overflow-y-auto bg-zinc-100 dark:bg-black">
        
        {/* Header */}
        <div className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.back()}
                  className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                </button>
                <div>
                  <h1 className="text-2xl font-['SF-Pro-Display-Regular'] text-zinc-900 dark:text-zinc-100">
                    {flowchart.title}
                  </h1>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Created: {flowchart.generatedAt instanceof Date 
                      ? flowchart.generatedAt.toLocaleDateString() 
                      : flowchart.generatedAt?.seconds 
                      ? new Date(flowchart.generatedAt.seconds * 1000).toLocaleDateString()
                      : 'Unknown date'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Flowchart Display */}
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div 
              className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden"
              style={{ height: '70vh' }}
            >
              <InteractiveFlowchart 
                data={{ title: flowchart.title, flowchart: flowchart.flowchart }} 
                onDownload={() => {}}
              />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default FlowchartView;