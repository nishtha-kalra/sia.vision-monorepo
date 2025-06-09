"use client";
import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Dashboard } from './Dashboard';
import { Library } from './Library';
import { Profile } from './Profile';
import { Canvas } from './Canvas';

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

          {activeTab === 'canvas' && <Canvas />}
        </main>
      </div>
    </div>
  );
}; 