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
  // AI-enhanced props
  isProcessingPrompt?: boolean;
  aiSuggestions?: any[];
  onUseAiSuggestion?: (suggestion: any) => void;
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

interface FlywheelStepProps {
  step: 'create' | 'build' | 'distribute';
  title: string;
  description: string;
  icon: string;
  isActive?: boolean;
  progress?: number;
}

const FlywheelStep = ({
  title,
  description,
  icon,
  isActive = false,
  progress = 0,
}: FlywheelStepProps) => (
  <div
    className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${
      isActive
        ? 'border-[#6366F1] bg-gradient-to-br from-[#6366F1]/5 to-[#8B5CF6]/5 shadow-lg'
        : 'border-[#E5E7EB] bg-white hover:border-[#D1D5DB] hover:shadow-md'
    }`}
  >
    <div className="flex items-start gap-4">
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
          isActive
            ? 'bg-[#6366F1] text-white shadow-lg'
            : 'bg-[#F3F4F6] text-[#6B7280]'
        }`}
      >
        {icon}
      </div>
      <div className="flex-1">
        <h3
          className={`font-semibold text-lg mb-2 ${isActive ? 'text-[#6366F1]' : 'text-[#111827]'}`}
        >
          {title}
        </h3>
        <p className="text-[#6B7280] text-sm leading-relaxed">{description}</p>
        {isActive && progress > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-[#6366F1] mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-[#E5E7EB] rounded-full h-2">
              <div
                className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>

    {isActive && (
      <div className="absolute top-4 right-4">
        <div className="w-3 h-3 bg-[#6366F1] rounded-full animate-pulse"></div>
      </div>
    )}
  </div>
);

interface SmartSuggestionProps {
  type: Asset['type'];
  title: string;
  description: string;
  icon: string;
  confidence: number;
  onClick: () => void;
}

const SmartSuggestion = ({
  title,
  description,
  icon,
  confidence,
  onClick,
}: SmartSuggestionProps) => (
  <button
    onClick={onClick}
    className="group w-full p-4 bg-white border border-[#E5E7EB] rounded-xl hover:border-[#6366F1] hover:shadow-lg transition-all duration-200 text-left"
  >
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-[#6366F1] rounded-lg flex items-center justify-center text-white text-lg group-hover:scale-110 transition-transform duration-200">
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-medium text-[#111827] group-hover:text-[#6366F1] transition-colors">
            {title}
          </h4>
          <div className="flex items-center gap-1 text-xs text-[#6B7280]">
            <span>{confidence}% match</span>
            <div className="w-2 h-2 bg-[#10B981] rounded-full"></div>
          </div>
        </div>
        <p className="text-sm text-[#6B7280]">{description}</p>
      </div>
      <svg
        className="w-5 h-5 text-[#D1D5DB] group-hover:text-[#6366F1] group-hover:translate-x-1 transition-all duration-200"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </div>
  </button>
);

export const Dashboard = ({
  promptInput,
  onPromptInputChange,
  onPromptSubmit,
  onUseSuggestion,
  onCreateAsset,
  isProcessingPrompt = false,
  aiSuggestions = [],
  onUseAiSuggestion,
}: DashboardProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showSmartSuggestions, setShowSmartSuggestions] = useState(false);
  const [currentStep, setCurrentStep] = useState<'create' | 'build' | 'distribute'>('create');

  useEffect(() => {
    // Simulate loading for smooth transition
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Smart AI suggestions based on user input
  useEffect(() => {
    if (promptInput.length > 10) {
      setShowSmartSuggestions(true);
    } else {
      setShowSmartSuggestions(false);
    }
  }, [promptInput]);

  const getSmartSuggestions = () => {
    const input = promptInput.toLowerCase();
    const suggestions: SmartSuggestionProps[] = [];

    if (input.includes('character') || input.includes('hero') || input.includes('protagonist')) {
      suggestions.push({
        type: 'CHARACTER',
        title: 'Create Character Profile',
        description: 'Build a detailed character with traits, background, and motivations',
        icon: '👤',
        confidence: 95,
        onClick: () => handleCreateAsset('CHARACTER')
      });
    }

    if (input.includes('story') || input.includes('chapter') || input.includes('narrative')) {
      suggestions.push({
        type: 'STORYLINE',
        title: 'Start New Storyline',
        description: 'Write your narrative with our advanced story editor',
        icon: '📖',
        confidence: 90,
        onClick: () => handleCreateAsset('STORYLINE')
      });
    }

    if (input.includes('world') || input.includes('lore') || input.includes('mythology')) {
      suggestions.push({
        type: 'LORE',
        title: 'Define World Lore',
        description: 'Establish the rules, history, and mythology of your universe',
        icon: '📚',
        confidence: 88,
        onClick: () => handleCreateAsset('LORE')
      });
    }

    if (input.includes('image') || input.includes('visual') || input.includes('art')) {
      suggestions.push({
        type: 'IMAGE',
        title: 'Add Visual Content',
        description: 'Upload or create images to bring your story to life',
        icon: '🎨',
        confidence: 85,
        onClick: () => handleCreateAsset('IMAGE')
      });
    }

    return suggestions.slice(0, 3); // Show max 3 suggestions
  };

  const handleCreateAsset = async (assetType: Asset['type']) => {
    setIsCreating(true);
    setCurrentStep('create');
    
    // Add a brief delay to show the loading state
    await new Promise(resolve => setTimeout(resolve, 300));
    onCreateAsset(assetType);
    setIsCreating(false);
  };

  const quickActions = [
    {
      icon: '👤',
      label: 'Character',
      description: 'Create character profiles',
      type: 'CHARACTER' as Asset['type'],
      color: 'bg-[#6366F1]'
    },
    {
      icon: '📖',
      label: 'Story',
      description: 'Write narratives',
      type: 'STORYLINE' as Asset['type'],
      color: 'bg-[#8B5CF6]'
    },
    {
      icon: '📚',
      label: 'Lore',
      description: 'Build world rules',
      type: 'LORE' as Asset['type'],
      color: 'bg-[#10B981]'
    },
    {
      icon: '🎨',
      label: 'Visuals',
      description: 'Add images & art',
      type: 'IMAGE' as Asset['type'],
      color: 'bg-[#F59E0B]'
    }
  ];

  if (isLoading) {
    return (
      <div className="h-full bg-gradient-to-br from-[#FAFBFC] via-[#F9FAFB] to-[#F3F4F6] flex flex-col">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="h-full bg-gradient-to-br from-[#FAFBFC] via-[#F9FAFB] to-[#F3F4F6] flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6 py-8">
          
          {/* Hero Section - More Focused */}
          <div className="text-center mb-12">
            <div className="mb-6">
              <h1 className="text-5xl font-bold text-[#111827] mb-4 tracking-tight">
                What story will you build today?
              </h1>
              <p className="text-xl text-[#6B7280] leading-relaxed max-w-3xl mx-auto">
                Turn your creative vision into reality. Our AI-powered platform helps you create, protect, and share your stories.
              </p>
            </div>

            {/* Enhanced Input Section */}
            <div className="max-w-3xl mx-auto mb-8">
                          <StoryPromptInput
              promptInput={promptInput}
              onPromptInputChange={onPromptInputChange}
              onPromptSubmit={onPromptSubmit}
              suggestions={[]} // We'll use smart suggestions instead
              onUseSuggestion={onUseSuggestion}
              isProcessing={isProcessingPrompt}
            />
              
              {/* AI Suggestions from Backend */}
              {aiSuggestions.length > 0 && (
                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-[#6B7280] mb-3">
                    <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse"></div>
                    <span>AI detected your intent - here are some suggestions:</span>
                  </div>
                  {aiSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => onUseAiSuggestion?.(suggestion)}
                      className="group w-full p-4 bg-white border border-[#E5E7EB] rounded-xl hover:border-[#6366F1] hover:shadow-lg transition-all duration-200 text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#6366F1] rounded-lg flex items-center justify-center text-white text-lg group-hover:scale-110 transition-transform duration-200">
                          📖
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-[#111827] group-hover:text-[#6366F1] transition-colors">
                              {suggestion.title}
                            </h4>
                            <div className="flex items-center gap-1 text-xs text-[#6B7280]">
                              <span>90% match</span>
                              <div className="w-2 h-2 bg-[#10B981] rounded-full"></div>
                            </div>
                          </div>
                          <p className="text-sm text-[#6B7280]">{suggestion.description}</p>
                        </div>
                        <svg
                          className="w-5 h-5 text-[#D1D5DB] group-hover:text-[#6366F1] group-hover:translate-x-1 transition-all duration-200"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              
              {/* Local Smart Suggestions (fallback) */}
              {aiSuggestions.length === 0 && showSmartSuggestions && (
                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-[#6B7280] mb-3">
                    <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse"></div>
                    <span>AI detected your intent - here are some suggestions:</span>
                  </div>
                  {getSmartSuggestions().map((suggestion, index) => (
                    <SmartSuggestion key={index} {...suggestion} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Create > Build > Distribute Flywheel */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-[#111827] mb-3">Your Creative Journey</h2>
              <p className="text-[#6B7280] max-w-2xl mx-auto">
                Follow our proven flywheel to turn ideas into protected intellectual property
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <FlywheelStep
                step="create"
                title="Create"
                description="Start with characters, stories, or world-building. Every great IP begins with a spark of creativity."
                icon="✨"
                isActive={currentStep === 'create'}
                progress={20}
              />
              <FlywheelStep
                step="build"
                title="Build"
                description="Develop your assets into rich, interconnected narratives. Use our tools to expand your universe."
                icon="🔧"
                isActive={currentStep === 'build'}
              />
              <FlywheelStep
                step="distribute"
                title="Distribute"
                description="Protect your IP on-chain and share with the world. Turn creativity into programmable ownership."
                icon="🚀"
                isActive={currentStep === 'distribute'}
              />
            </div>
          </div>

          {/* Simplified Quick Actions */}
          {!showSmartSuggestions && (
            <div className="mb-12">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-[#111827] mb-2">Start Creating</h3>
                <p className="text-[#6B7280]">Choose what you'd like to create first</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                {quickActions.map((action) => (
                  <button
                    key={action.type}
                    onClick={() => handleCreateAsset(action.type)}
                    disabled={isCreating}
                    className="group p-6 bg-white rounded-2xl border border-[#E5E7EB] hover:border-[#D1D5DB] hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className={`w-16 h-16 ${action.color} rounded-2xl flex items-center justify-center text-white text-2xl mb-4 mx-auto group-hover:scale-110 transition-transform duration-200`}>
                      {isCreating ? (
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        action.icon
                      )}
                    </div>
                    <div className="font-semibold text-[#111827] mb-1">{action.label}</div>
                    <div className="text-sm text-[#6B7280]">{action.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* IP Protection Journey */}
          <div className="bg-gradient-to-r from-[#6366F1]/10 via-[#8B5CF6]/10 to-[#EC4899]/10 rounded-3xl border border-[#6366F1]/20 p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#111827] mb-3">
                Programmable IP Protection
              </h3>
              <p className="text-[#6B7280] max-w-2xl mx-auto mb-6">
                Every asset you create can be registered on-chain, giving you programmable ownership rights. 
                Set licensing terms, earn royalties, and build a sustainable creative business.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/80 rounded-xl border border-[#E5E7EB]">
                  <div className="w-2 h-2 bg-[#6366F1] rounded-full"></div>
                  <span className="text-[#6B7280]">Blockchain-backed ownership</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/80 rounded-xl border border-[#E5E7EB]">
                  <div className="w-2 h-2 bg-[#10B981] rounded-full"></div>
                  <span className="text-[#6B7280]">Automated licensing</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/80 rounded-xl border border-[#E5E7EB]">
                  <div className="w-2 h-2 bg-[#F59E0B] rounded-full"></div>
                  <span className="text-[#6B7280]">Revenue sharing</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/80 rounded-xl border border-[#E5E7EB]">
                  <div className="w-2 h-2 bg-[#EC4899] rounded-full"></div>
                  <span className="text-[#6B7280]">Community building</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 