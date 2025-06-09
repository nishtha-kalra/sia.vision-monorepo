"use client";
import React, { useState, useEffect } from 'react';
import { StoryPromptInput } from './StoryPromptInput';
import { Asset } from './types';

interface DashboardProps {
  promptInput: string;
  onPromptInputChange: (value: string) => void;
  onPromptSubmit: () => void;
  suggestions: string[];
  onUseSuggestion: (suggestion: string) => void;
  onCreateAsset: (assetType: Asset['type']) => void;
}

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-[#E5E7EB] border-t-[#6366F1] rounded-full animate-spin"></div>
      </div>
      <div className="text-center">
        <h3 className="text-lg font-medium text-[#111827] mb-1">Loading your creative workspace</h3>
        <p className="text-sm text-[#6B7280]">Preparing your stories and assets...</p>
      </div>
    </div>
  </div>
);

export const Dashboard = ({
  promptInput,
  onPromptInputChange,
  onPromptSubmit,
  suggestions,
  onUseSuggestion,
  onCreateAsset,
}: DashboardProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    // Simulate loading for smooth transition
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const quickActions = [
    {
      icon: '👤',
      label: 'Character',
      description: 'Create a character profile',
      type: 'CHARACTER' as Asset['type'],
      color: 'bg-[#6366F1]'
    },
    {
      icon: '📖',
      label: 'Storyline',
      description: 'Write a new chapter',
      type: 'STORYLINE' as Asset['type'],
      color: 'bg-[#8B5CF6]'
    },
    {
      icon: '📚',
      label: 'Lore',
      description: 'Define world rules',
      type: 'LORE' as Asset['type'],
      color: 'bg-[#10B981]'
    },
    {
      icon: '🎨',
      label: 'Image',
      description: 'Upload or create images',
      type: 'IMAGE' as Asset['type'],
      color: 'bg-[#F59E0B]'
    },
    {
      icon: '🎬',
      label: 'Video',
      description: 'Upload or create videos',
      type: 'VIDEO' as Asset['type'],
      color: 'bg-[#EF4444]'
    },
    {
      icon: '🎵',
      label: 'Audio',
      description: 'Upload or create audio',
      type: 'AUDIO' as Asset['type'],
      color: 'bg-[#8B5CF6]'
    }
  ];

  const handleCreateAsset = async (assetType: Asset['type']) => {
    setIsCreating(true);
    // Add a brief delay to show the loading state
    await new Promise(resolve => setTimeout(resolve, 300));
    onCreateAsset(assetType);
    setIsCreating(false);
  };

  if (isLoading) {
    return (
      <div className="h-full bg-gradient-to-br from-[#FAFBFC] via-[#F9FAFB] to-[#F3F4F6] flex flex-col">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="h-full bg-gradient-to-br from-[#FAFBFC] via-[#F9FAFB] to-[#F3F4F6] flex flex-col">
      {/* Main Content Area - Single Unified Section */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6 py-12">
          {/* Header with Input */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#111827] mb-3">
              What story will you build today?
            </h1>
            <p className="text-xl text-[#6B7280] leading-relaxed mb-8 max-w-2xl mx-auto">
              Describe your creative vision and watch it come to life. Build characters, worlds, and narratives with AI assistance.
            </p>

            {/* Input Section */}
            <div className="max-w-2xl mx-auto mb-12">
              <StoryPromptInput
                promptInput={promptInput}
                onPromptInputChange={onPromptInputChange}
                onPromptSubmit={onPromptSubmit}
                suggestions={suggestions}
                onUseSuggestion={onUseSuggestion}
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
            {quickActions.map((action) => (
              <button
                key={action.type}
                onClick={() => handleCreateAsset(action.type)}
                disabled={isCreating}
                className="group flex flex-col items-center p-6 bg-white rounded-2xl border border-[#E5E7EB] hover:border-[#D1D5DB] hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center text-white text-xl mb-3 group-hover:scale-110 transition-transform duration-200`}>
                  {isCreating ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    action.icon
                  )}
                </div>
                <div className="font-medium text-[#111827] mb-1 text-sm">{action.label}</div>
                <div className="text-xs text-[#6B7280] text-center">{action.description}</div>
              </button>
            ))}
          </div>

          {/* Creative Universe Section */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-[#E5E7EB] p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#111827] mb-2">
                Your Creative Universe Awaits
              </h3>
              <p className="text-[#6B7280] max-w-md mx-auto mb-6">
                Start building your first storyworld. Every character, storyline, and asset you create becomes part of your expanding creative universe.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/80 rounded-lg border border-[#E5E7EB]">
                  <div className="w-2 h-2 bg-[#6366F1] rounded-full"></div>
                  <span className="text-[#6B7280]">AI-Powered Creation</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/80 rounded-lg border border-[#E5E7EB]">
                  <div className="w-2 h-2 bg-[#10B981] rounded-full"></div>
                  <span className="text-[#6B7280]">Rich Media Support</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/80 rounded-lg border border-[#E5E7EB]">
                  <div className="w-2 h-2 bg-[#F59E0B] rounded-full"></div>
                  <span className="text-[#6B7280]">Publishing Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 