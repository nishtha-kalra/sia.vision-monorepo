"use client";
import React, { useState, lazy, Suspense } from 'react';
import { Sidebar } from './Sidebar';
import { Dashboard } from './Dashboard';
import { Library } from './Library';
import { Profile } from './Profile';
import { Storyworld } from './Storyworld';
import { Asset, Project } from './types';

// Lazy load heavy components to reduce initial bundle size
const StorylineEditor = lazy(() => import('./StorylineEditor').then(module => ({ default: module.StorylineEditor })));
const AssetEditor = lazy(() => import('./AssetEditor').then(module => ({ default: module.AssetEditor })));

// Loading component for lazy-loaded editors
const EditorLoading = () => (
  <div className="flex items-center justify-center h-full">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading editor...</p>
    </div>
  </div>
);

export const DashboardContainer: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [promptInput, setPromptInput] = useState('');
  const [libraryFilter, setLibraryFilter] = useState('all');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [isEditingStoryline, setIsEditingStoryline] = useState(false);
  const [isEditingAsset, setIsEditingAsset] = useState(false);

  // Suggestion prompts for the main dashboard
  const suggestions = [
    'Create a cyberpunk character who is a neural interface hacker',
    'Write the opening chapter of a space colonization story',
    'Define the lore behind an ancient magical artifact',
    'Build a post-apocalyptic world where nature has reclaimed cities'
  ];

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab !== 'storyworld') {
      setSelectedAsset(null);
      setIsEditingStoryline(false);
      setIsEditingAsset(false);
    }
  };

  const handleLibraryOpen = () => {
    setActiveTab('library');
  };

  const handlePromptSubmit = () => {
    if (promptInput.trim()) {
      // TODO: Implement AI-powered asset creation
      console.log('Creating assets with AI prompt:', promptInput);
      // For now, open Storyworld with a new storyline
      handleCreateAsset('STORYLINE');
    }
  };

  const handleUseSuggestion = (suggestion: string) => {
    setPromptInput(suggestion);
  };

  const handleCreateAsset = (assetType: Asset['type']) => {
    // Create a new asset based on type
    const newAsset: Asset = {
      id: `asset_${Date.now()}`, // Temporary ID
      ownerId: 'current_user', // TODO: Get from auth
      name: getDefaultAssetName(assetType),
      parentId: null,
      projectId: 'current_project', // TODO: Get from current project context
      type: assetType,
      content: getDefaultAssetContent(assetType),
      visibility: 'PRIVATE',
      ipStatus: 'UNREGISTERED',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setSelectedAsset(newAsset);
    setActiveTab('storyworld');
    
    // Determine which editor to open based on asset type
    if (assetType === 'STORYLINE') {
      setIsEditingStoryline(true);
      setIsEditingAsset(false);
    } else {
      setIsEditingAsset(true);
      setIsEditingStoryline(false);
    }
  };

  const handleAssetSelect = (asset: Asset) => {
    setSelectedAsset(asset);
    setActiveTab('storyworld');
    
    // Determine which editor to open based on asset type
    if (asset.type === 'STORYLINE') {
      setIsEditingStoryline(true);
      setIsEditingAsset(false);
    } else {
      setIsEditingAsset(true);
      setIsEditingStoryline(false);
    }
  };

  const handleCloseEditors = () => {
    setIsEditingStoryline(false);
    setIsEditingAsset(false);
    setSelectedAsset(null);
  };

  const getDefaultAssetName = (type: Asset['type']): string => {
    switch (type) {
      case 'CHARACTER': return 'New Character';
      case 'STORYLINE': return 'New Chapter';
      case 'LORE': return 'New Lore Entry';
      case 'IMAGE': return 'New Image';
      case 'VIDEO': return 'New Video';
      case 'AUDIO': return 'New Audio';
      case 'FOLDER': return 'New Folder';
      default: return 'New Asset';
    }
  };

  const getDefaultAssetContent = (type: Asset['type']): Asset['content'] => {
    switch (type) {
      case 'CHARACTER':
        return {
          type: 'CHARACTER',
          description: '',
          traits: [],
          tiptapJSON: {}
        };
      case 'STORYLINE':
        return {
          type: 'STORYLINE',
          tiptapJSON: {},
          plainText: ''
        };
      case 'LORE':
        return {
          type: 'LORE',
          description: '',
          significance: '',
          tiptapJSON: {}
        };
      case 'IMAGE':
        return {
          type: 'IMAGE',
          url: '',
          altText: '',
          caption: ''
        };
      case 'VIDEO':
        return {
          type: 'VIDEO',
          url: '',
          title: '',
          description: ''
        };
      case 'AUDIO':
        return {
          type: 'AUDIO',
          url: '',
          title: '',
          description: ''
        };
      case 'FOLDER':
        return { type: 'FOLDER' };
      default:
        return { type: 'FOLDER' };
    }
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
              onCreateAsset={handleCreateAsset}
            />
          )}

          {activeTab === 'library' && (
            <Library
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              libraryFilter={libraryFilter}
              onFilterChange={setLibraryFilter}
              libraryAssets={[]} // Library manages its own collections now
              onAssetSelect={handleAssetSelect}
            />
          )}

          {activeTab === 'profile' && (
            <Profile />
          )}

          {activeTab === 'storyworld' && !isEditingStoryline && !isEditingAsset && (
            <Storyworld 
              project={currentProject}
              onProjectChange={setCurrentProject}
              onCreateAsset={handleCreateAsset}
            />
          )}

          {activeTab === 'storyworld' && isEditingStoryline && selectedAsset && (
            <Suspense fallback={<EditorLoading />}>
              <StorylineEditor
                asset={selectedAsset}
                onAssetChange={setSelectedAsset}
                onClose={handleCloseEditors}
              />
            </Suspense>
          )}

          {activeTab === 'storyworld' && isEditingAsset && selectedAsset && (
            <Suspense fallback={<EditorLoading />}>
              <AssetEditor
                asset={selectedAsset}
                onAssetChange={setSelectedAsset}
                onClose={handleCloseEditors}
              />
            </Suspense>
          )}
        </main>
      </div>
    </div>
  );
}; 