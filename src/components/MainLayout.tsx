"use client";

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import UniversalSidebar from './UniversalSidebar';
import GeneratorHeader from './GeneratorHeader';
import { useQuiz } from '@/contexts/QuizContext';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { isQuizInProgress } = useQuiz();
  
  // Routes that should show the input sidebar
  const inputRoutes = ['/flowchart', '/generator', '/summariser', '/flashcard', '/translator'];
  const shouldShowInputSidebar = inputRoutes.some(route => pathname.startsWith(route));
  
  // Routes that should completely hide sidebar (like quiz attempt pages)
  const hideSidebarRoutes = ['/quiz/', '/result/', '/attempt/'];
  const shouldHideSidebar = hideSidebarRoutes.some(route => pathname.includes(route)) || isQuizInProgress;

  if (shouldHideSidebar || isQuizInProgress) {
    // Full screen layout for quiz attempts
    return (
      <div className="h-screen flex flex-col bg-zinc-100 dark:bg-black text-zinc-900 dark:text-zinc-100">
        <GeneratorHeader />
        <main className="flex-grow overflow-hidden">
          {children}
        </main>
      </div>
    );
  }

  if (!shouldShowInputSidebar || isQuizInProgress) {
    // No sidebar layout for other pages or when quiz is in progress
    return (
      <div className="h-screen flex flex-col bg-zinc-100 dark:bg-black text-zinc-900 dark:text-zinc-100">
        <GeneratorHeader />
        <main className="flex-grow overflow-hidden">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-zinc-100 dark:bg-black text-zinc-900 dark:text-zinc-100">
      <GeneratorHeader />
      <main className="flex-grow overflow-hidden">
        <div className="hidden md:flex h-full">
          <PanelGroup 
            direction="horizontal" 
            className="h-full" 
            id="main-layout"
            key={`layout-${isSidebarCollapsed ? 'collapsed' : 'expanded'}`}
          >
            <Panel 
              id="sidebar-panel"
              defaultSize={isSidebarCollapsed ? 8 : 35} 
              minSize={isSidebarCollapsed ? 8 : 25} 
              maxSize={isSidebarCollapsed ? 8 : 50} 
              className="overflow-hidden"
            >
              <UniversalSidebar 
                isCollapsed={isSidebarCollapsed}
                onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              />
            </Panel>
            {!isSidebarCollapsed && (
              <PanelResizeHandle className="w-2 cursor-col-resize flex items-center justify-center bg-zinc-100 dark:bg-black group hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
                <div className="w-1 h-8 bg-zinc-300 dark:bg-zinc-700 rounded-full group-hover:bg-purple-400 transition-colors" />
              </PanelResizeHandle>
            )}
            <Panel 
              id="content-panel"
              defaultSize={isSidebarCollapsed ? 92 : 65} 
              className="overflow-hidden"
            >
              <div className="h-full w-full overflow-auto">
                {children}
              </div>
            </Panel>
          </PanelGroup>
        </div>
        
        <div className="md:hidden w-full h-full flex-grow overflow-y-auto">
          <div className="border-b border-zinc-200 dark:border-zinc-800">
            <UniversalSidebar 
              isCollapsed={false}
              onToggleCollapse={() => {}}
            />
          </div>
          <div className="h-full overflow-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainLayout;