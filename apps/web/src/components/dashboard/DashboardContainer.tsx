"use client";
import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Dashboard } from './Dashboard';
import { Library } from './Library';
import { Profile } from './Profile';

export const DashboardContainer: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [promptInput, setPromptInput] = useState('');
  const [libraryFilter, setLibraryFilter] = useState('all');

  // Suggestion prompts for the main dashboard
  const suggestions = [
    'Start a new storyworld based on Norse mythology but set in a cyberpunk future',
    'Create a character who is a time-traveling detective',
    'Design a magical academy hidden in modern Tokyo',
    'Build a post-apocalyptic world where music has power'
  ];

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleLibraryOpen = () => {
    setActiveTab('library');
  };

  const handlePromptSubmit = () => {
    if (promptInput.trim()) {
      // TODO: Implement story creation logic
      console.log('Creating story with prompt:', promptInput);
    }
  };

  const handleUseSuggestion = (suggestion: string) => {
    setPromptInput(suggestion);
  };

  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] font-[Inter]">
      <div className="flex h-screen">
        <Sidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onLibraryOpen={handleLibraryOpen}
        />

        <main className="flex-1 overflow-hidden bg-[#FAFAFA]">
          {activeTab === 'dashboard' && (
            <Dashboard
              promptInput={promptInput}
              onPromptInputChange={setPromptInput}
              onPromptSubmit={handlePromptSubmit}
              suggestions={suggestions}
              onUseSuggestion={handleUseSuggestion}
            />
          )}

          {activeTab === 'library' && (
            <Library
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              libraryFilter={libraryFilter}
              onFilterChange={setLibraryFilter}
              libraryAssets={[]} // Library manages its own collections now
            />
          )}

          {activeTab === 'profile' && (
            <Profile />
          )}

          {activeTab === 'canvas' && (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#F3F4F6] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#9CA3AF]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-[#111827] mb-2">Canvas Coming Soon</h3>
                <p className="text-[#6B7280]">The collaborative canvas editor is under development.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}; 