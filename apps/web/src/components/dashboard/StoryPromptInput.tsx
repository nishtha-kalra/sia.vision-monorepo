"use client";
import { useState } from "react";
import { TypingIndicator } from "./TypingIndicator";

interface StoryPromptInputProps {
  promptInput: string;
  onPromptInputChange: (value: string) => void;
  onPromptSubmit: () => void;
  suggestions: string[];
  onUseSuggestion: (suggestion: string) => void;
}

export const StoryPromptInput = ({ 
  promptInput, 
  onPromptInputChange, 
  onPromptSubmit, 
  suggestions, 
  onUseSuggestion 
}: StoryPromptInputProps) => {
  const [isTyping, setIsTyping] = useState(false);

  const simulateTyping = () => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
    }, 1500);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onPromptInputChange(event.target.value);
    simulateTyping();
  };

  const handleCreateClick = () => {
    if (promptInput.trim()) {
      simulateTyping();
      onPromptSubmit();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      handleCreateClick();
    }
  };

  return (
    <div>
      <div className="relative mx-auto max-w-4xl mb-6">
        <textarea
          placeholder="Start a new storyworld based on Norse mythology but set in a cyberpunk future..."
          className="resize-none px-6 py-4 w-full bg-white rounded-2xl border-2 transition-all duration-300 ease-in-out border-[#E5E7EB] focus:border-[#6366F1] focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:ring-opacity-20 min-h-[120px] shadow-sm text-[#111827] placeholder-[#6B7280]"
          rows={4}
          value={promptInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <div className="flex absolute right-4 bottom-4 gap-3 items-center">
          <TypingIndicator isVisible={isTyping} />
          <button
            className={`flex gap-2 items-center px-6 py-2 rounded-lg transition-all duration-200 ${
              promptInput.trim()
                ? 'bg-[#6366F1] hover:bg-[#5B5BD6] text-white shadow-sm'
                : 'bg-[#F3F4F6] text-[#9CA3AF] cursor-not-allowed'
            }`}
            onClick={handleCreateClick}
            disabled={!promptInput.trim()}
          >
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
            <span>Create</span>
          </button>
        </div>
      </div>

      {/* Suggestion pills */}
      <div className="flex flex-wrap gap-2 justify-center max-w-4xl mx-auto">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onUseSuggestion(suggestion)}
            className="px-4 py-2 bg-[#F9FAFB] hover:bg-[#F3F4F6] text-[#6B7280] hover:text-[#111827] rounded-full text-sm transition-all duration-200 border border-[#E5E7EB] hover:border-[#D1D5DB]"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}; 