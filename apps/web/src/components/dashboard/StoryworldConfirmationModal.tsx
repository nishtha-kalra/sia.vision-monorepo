"use client";
import React, { useState, useEffect } from 'react';

interface StoryworldDetails {
  name: string;
  description: string;
  genre: string;
  themes: string[];
}

interface StoryworldConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (details: StoryworldDetails) => void;
  initialDetails: StoryworldDetails;
  confidence: number;
}

export const StoryworldConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  initialDetails,
  confidence
}: StoryworldConfirmationModalProps) => {
  const [details, setDetails] = useState<StoryworldDetails>(initialDetails);
  const [isCreating, setIsCreating] = useState(false);

  // Update details when initialDetails change
  useEffect(() => {
    if (initialDetails) {
      setDetails(initialDetails);
    }
  }, [initialDetails]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsCreating(true);
    try {
      await onConfirm(details);
    } finally {
      setIsCreating(false);
    }
  };

  const handleThemeChange = (index: number, value: string) => {
    const newThemes = [...details.themes];
    newThemes[index] = value;
    setDetails({ ...details, themes: newThemes });
  };

  const addTheme = () => {
    setDetails({ ...details, themes: [...details.themes, ''] });
  };

  const removeTheme = (index: number) => {
    const newThemes = details.themes.filter((_, i) => i !== index);
    setDetails({ ...details, themes: newThemes });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-[#E5E7EB]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#111827] mb-2">
                Review Your Storyworld
              </h2>
              <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse"></div>
                <span>AI generated with {Math.round(confidence * 100)}% confidence</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-[#F3F4F6] hover:bg-[#E5E7EB] flex items-center justify-center transition-colors"
            >
              <svg className="w-5 h-5 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Storyworld Name */}
          <div>
            <label className="block text-sm font-medium text-[#111827] mb-2">
              Storyworld Name
            </label>
            <input
              type="text"
              value={details.name}
              onChange={(e) => setDetails({ ...details, name: e.target.value })}
              className="w-full px-4 py-3 border border-[#E5E7EB] rounded-xl focus:ring-2 focus:ring-[#6366F1] focus:border-transparent transition-all"
              placeholder="Enter your storyworld name..."
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[#111827] mb-2">
              Description
            </label>
            <textarea
              value={details.description}
              onChange={(e) => setDetails({ ...details, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border border-[#E5E7EB] rounded-xl focus:ring-2 focus:ring-[#6366F1] focus:border-transparent transition-all resize-none"
              placeholder="Describe your storyworld..."
            />
          </div>

          {/* Genre */}
          <div>
            <label className="block text-sm font-medium text-[#111827] mb-2">
              Genre
            </label>
            <select
              value={details.genre}
              onChange={(e) => setDetails({ ...details, genre: e.target.value })}
              className="w-full px-4 py-3 border border-[#E5E7EB] rounded-xl focus:ring-2 focus:ring-[#6366F1] focus:border-transparent transition-all"
            >
              <option value="fantasy">Fantasy</option>
              <option value="science fiction">Science Fiction</option>
              <option value="cyberpunk">Cyberpunk</option>
              <option value="steampunk">Steampunk</option>
              <option value="horror">Horror</option>
              <option value="mystery">Mystery</option>
              <option value="romance">Romance</option>
              <option value="adventure">Adventure</option>
              <option value="historical">Historical</option>
              <option value="contemporary">Contemporary</option>
              <option value="urban fantasy">Urban Fantasy</option>
              <option value="dystopian">Dystopian</option>
            </select>
          </div>

          {/* Themes */}
          <div>
            <label className="block text-sm font-medium text-[#111827] mb-2">
              Themes
            </label>
            <div className="space-y-2">
              {details.themes.map((theme, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={theme}
                    onChange={(e) => handleThemeChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent transition-all"
                    placeholder="Enter a theme..."
                  />
                  {details.themes.length > 1 && (
                    <button
                      onClick={() => removeTheme(index)}
                      className="w-8 h-8 rounded-lg bg-[#FEF2F2] hover:bg-[#FEE2E2] text-[#EF4444] flex items-center justify-center transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addTheme}
                className="flex items-center gap-2 px-3 py-2 text-[#6366F1] hover:bg-[#6366F1]/5 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-sm font-medium">Add Theme</span>
              </button>
            </div>
          </div>

          {/* Starting Point Info */}
          <div className="bg-gradient-to-r from-[#10B981]/5 to-[#6366F1]/5 rounded-xl border border-[#10B981]/20 p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#10B981] rounded-lg flex items-center justify-center text-white text-sm">
                🚀
              </div>
              <div>
                <h4 className="font-medium text-[#111827] mb-1">Your Creative Starting Point</h4>
                <p className="text-sm text-[#6B7280] mb-2">
                  This storyworld will be your creative foundation. You can add characters, storylines, lore, and media assets to bring your vision to life.
                </p>
                <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                  <div className="w-1.5 h-1.5 bg-[#10B981] rounded-full"></div>
                  <span>Original prompt and AI analysis will be saved for reference</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Tips */}
          <div className="bg-gradient-to-r from-[#6366F1]/5 to-[#8B5CF6]/5 rounded-xl border border-[#6366F1]/20 p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#6366F1] rounded-lg flex items-center justify-center text-white text-sm">
                🤖
              </div>
              <div>
                <h4 className="font-medium text-[#111827] mb-1">AI Suggestions</h4>
                <p className="text-sm text-[#6B7280]">
                  Feel free to modify any details above. The AI has analyzed your prompt and suggested these elements, 
                  but you can customize them to perfectly match your creative vision.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#E5E7EB] bg-[#F9FAFB] rounded-b-2xl">
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-6 py-3 text-[#6B7280] hover:text-[#111827] font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!details.name.trim() || !details.description.trim() || isCreating}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-medium transition-all ${
                details.name.trim() && details.description.trim() && !isCreating
                  ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#5B5BD6] hover:to-[#7C3AED] text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                  : 'bg-[#F3F4F6] text-[#9CA3AF] cursor-not-allowed'
              }`}
            >
              {isCreating ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Create Storyworld</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 