"use client";

import { StoryPromptInput } from './StoryPromptInput';
import { QuickActionCard } from './QuickActionCard';
import { QuickAction } from './types';

interface DashboardProps {
  promptInput: string;
  onPromptInputChange: (value: string) => void;
  onPromptSubmit: () => void;
  suggestions: string[];
  onUseSuggestion: (suggestion: string) => void;
}

export function Dashboard({
  promptInput,
  onPromptInputChange,
  onPromptSubmit,
  suggestions,
  onUseSuggestion,
}: DashboardProps) {
  const quickActions: QuickAction[] = [
    {
      title: "Character Creator",
      description: "Build detailed character profiles with rich backstories and personality traits",
      icon: "👤",
      color: "#6366F1",
    },
    {
      title: "World Builder",
      description: "Design immersive worlds with geography, cultures, and histories",
      icon: "🌍",
      color: "#8B5CF6",
    },
    {
      title: "Story Architect",
      description: "Craft compelling narratives with plot structures and story arcs",
      icon: "📚",
      color: "#06B6D4",
    },
    {
      title: "Dialogue Writer",
      description: "Generate authentic conversations and character interactions",
      icon: "💬",
      color: "#10B981",
    },
  ];

  const handleQuickAction = (action: QuickAction) => {
    console.log('Quick action clicked:', action.title);
    // Here you would navigate to the specific tool or open a modal
  };

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Main prompt input section */}
        <StoryPromptInput
          promptInput={promptInput}
          onPromptInputChange={onPromptInputChange}
          onPromptSubmit={onPromptSubmit}
          suggestions={suggestions}
          onUseSuggestion={onUseSuggestion}
        />

        {/* Quick actions section */}
        <div className="space-y-4 mb-12">
          <h3 className="text-xl font-semibold text-[#111827] text-center mb-8">
            Quick Start Tools
          </h3>
          <div className="grid gap-4">
            {quickActions.map((action, index) => (
              <QuickActionCard
                key={index}
                action={action}
                onClick={() => handleQuickAction(action)}
              />
            ))}
          </div>
        </div>

        {/* Additional help text */}
        <div className="text-center text-[#6B7280] text-sm">
          <p className="mb-2">
            Press <kbd className="px-2 py-1 bg-[#F3F4F6] rounded text-xs">⌘ + Enter</kbd> to submit your prompt
          </p>
          <p>
            Need inspiration? Try one of the suggestions above or explore our quick start tools.
          </p>
        </div>
      </div>
    </div>
  );
} 