"use client";
import { useState, useEffect } from "react";
import { TypingIndicator } from "./TypingIndicator";

interface StoryPromptInputProps {
  promptInput: string;
  onPromptInputChange: (value: string) => void;
  onPromptSubmit: () => void;
  suggestions: string[];
  onUseSuggestion: (suggestion: string) => void;
  isProcessing?: boolean;
}

export const StoryPromptInput = ({ 
  promptInput, 
  onPromptInputChange, 
  onPromptSubmit, 
  suggestions, 
  onUseSuggestion,
  isProcessing = false
}: StoryPromptInputProps) => {
  const [isTyping, setIsTyping] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  // Dynamic placeholder examples that rotate
  const placeholderExamples = [
    "A cyberpunk hacker discovers they're an AI in a simulated world...",
    "In a world where memories can be traded, a young artist...",
    "The last library on Earth holds secrets that could save humanity...",
    "A shape-shifting alien falls in love with a human astronaut...",
    "Dragons return to modern Tokyo, but they're here to help..."
  ];

  useEffect(() => {
    // Rotate placeholder text every 4 seconds
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholderExamples.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

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

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div className="relative">
      {/* Main Input Area */}
      <div className={`relative transition-all duration-300 ${
        isFocused ? 'transform scale-[1.02]' : ''
      }`}>
        <textarea
          placeholder={`${placeholderExamples[placeholderIndex]}`}
          className={`resize-none px-6 py-5 w-full bg-white rounded-2xl border-2 transition-all duration-300 ease-in-out shadow-sm text-[#111827] placeholder-[#9CA3AF] min-h-[140px] ${
            isFocused 
              ? 'border-[#6366F1] shadow-xl shadow-[#6366F1]/10 ring-4 ring-[#6366F1]/10' 
              : 'border-[#E5E7EB] hover:border-[#D1D5DB] hover:shadow-md'
          }`}
          rows={4}
          value={promptInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        
        {/* Enhanced Bottom Bar */}
        <div className="flex absolute right-4 bottom-4 gap-3 items-center">
          <TypingIndicator isVisible={isTyping} />
          
          {/* Character Count */}
          {promptInput.length > 0 && (
            <span className="text-xs text-[#6B7280] bg-white/80 px-2 py-1 rounded-lg">
              {promptInput.length}/1000
            </span>
          )}
          
          {/* Create Button */}
          <button
            className={`flex gap-2 items-center px-6 py-3 rounded-xl transition-all duration-200 font-medium text-sm ${
              promptInput.trim() && !isProcessing
                ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#5B5BD6] hover:to-[#7C3AED] text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                : 'bg-[#F3F4F6] text-[#9CA3AF] cursor-not-allowed'
            }`}
            onClick={handleCreateClick}
            disabled={!promptInput.trim() || isProcessing}
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
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
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <span>Create with AI</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Writing Tips */}
      {isFocused && promptInput.length === 0 && (
        <div className="mt-4 p-4 bg-gradient-to-r from-[#6366F1]/5 to-[#8B5CF6]/5 rounded-xl border border-[#6366F1]/20 animate-fadeIn">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-[#6366F1] rounded-lg flex items-center justify-center text-white text-sm">
              💡
            </div>
            <div>
              <h4 className="font-medium text-[#111827] mb-1">Writing Tips</h4>
              <div className="text-sm text-[#6B7280] space-y-1">
                <p>• Describe characters, settings, or plot ideas</p>
                <p>• Include genre, mood, or specific themes</p>
                <p>• Mention any inspirations or references</p>
                <p>• Press <kbd className="px-1 py-0.5 bg-white rounded text-xs font-mono">⌘+Enter</kbd> to create</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Processing Indicator */}
      {(isTyping && promptInput.length > 20) || isProcessing ? (
        <div className="mt-3 flex items-center gap-2 text-sm text-[#6366F1]">
          <div className="w-2 h-2 bg-[#6366F1] rounded-full animate-pulse"></div>
          <span>{isProcessing ? 'AI is processing your request...' : 'AI is analyzing your prompt...'}</span>
        </div>
      ) : null}

      {/* Suggestion pills - only show if no smart suggestions are active */}
      {suggestions.length > 0 && !isFocused && promptInput.length === 0 && (
        <div className="mt-6">
          <div className="text-center mb-3">
            <span className="text-sm text-[#6B7280]">Or try one of these ideas:</span>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => onUseSuggestion(suggestion)}
                className="px-4 py-2 bg-white hover:bg-[#F9FAFB] text-[#6B7280] hover:text-[#111827] rounded-full text-sm transition-all duration-200 border border-[#E5E7EB] hover:border-[#D1D5DB] hover:shadow-md"
              >
                {suggestion.length > 60 ? `${suggestion.substring(0, 60)}...` : suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}; 