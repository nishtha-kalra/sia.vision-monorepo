"use client";
import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Dashboard } from './Dashboard';
import { Library } from './Library';
import { Profile } from './Profile';
import { Canvas } from './Canvas';
import { StoryworldHub } from './StoryworldHub';
import { Explore } from './Explore';
import { OnboardingFlow } from './OnboardingFlow';
import { Asset, Project, AssetContent } from './types';

export const DashboardContainer = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [promptInput, setPromptInput] = useState('');
  const [suggestions] = useState([
    'Create a cyberpunk character with Norse mythology elements',
    'Design a futuristic city where ancient gods control the internet',
    'Write a story about AI entities that think they are Norse gods',
    'Develop lore for a world where magic and technology are indistinguishable'
  ]);
  
  // Library states
  const [searchQuery, setSearchQuery] = useState('');
  const [libraryFilter, setLibraryFilter] = useState('all');
  
  // Canvas states
  const [currentProject, setCurrentProject] = useState<Project | undefined>();
  const [currentAsset, setCurrentAsset] = useState<Asset | undefined>();
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  
  // Navigation states
  const [viewingStoryworldHub, setViewingStoryworldHub] = useState(false);
  
  // Onboarding state
  const [showOnboarding, setShowOnboarding] = useState(false); // In real app, detect first-time users
  
  const handlePromptSubmit = () => {
    if (promptInput.trim()) {
      console.log('Processing prompt:', promptInput);
      // In real app: analyze prompt and either create asset or show suggestions
      setPromptInput('');
    }
  };

  const handleUseSuggestion = (suggestion: string) => {
    setPromptInput(suggestion);
  };

  const getDefaultAssetContent = (assetType: Asset['type']): AssetContent => {
    switch (assetType) {
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

  const handleCreateAsset = (assetType: Asset['type']) => {
    console.log('Creating asset of type:', assetType);
    
    // Create a new asset
    const newAsset: Asset = {
      id: `asset_${Date.now()}`,
      ownerId: 'current_user',
      name: `New ${assetType.toLowerCase()}`,
      parentId: null,
      projectId: currentProject?.id || 'default',
      type: assetType,
      content: getDefaultAssetContent(assetType),
      visibility: 'PRIVATE',
      ipStatus: 'UNREGISTERED',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setEditingAsset(newAsset);
    setActiveTab('canvas');
    setViewingStoryworldHub(false);
  };

  const handleAssetSelect = (asset: Asset) => {
    setCurrentAsset(asset);
    setEditingAsset(asset);
    setActiveTab('canvas');
    setViewingStoryworldHub(false);
  };

  const handleProjectSelect = (project: Project) => {
    setCurrentProject(project);
    setViewingStoryworldHub(true);
    setActiveTab('library');
  };

  const handleCreateProject = () => {
    console.log('Creating new project/storyworld');
    
    // Create a new project
    const newProject: Project = {
      id: `project_${Date.now()}`,
      ownerId: 'current_user',
      name: 'New Storyworld',
      description: 'A new creative universe waiting to be built.',
      visibility: 'PRIVATE',
      createdAt: new Date(),
      updatedAt: new Date(),
      stats: {
        totalAssets: 0,
        characters: 0,
        storylines: 0,
        loreEntries: 0
      }
    };
    
    setCurrentProject(newProject);
    setViewingStoryworldHub(true);
    setActiveTab('library');
  };

  const handleBackToLibrary = () => {
    setViewingStoryworldHub(false);
    setCurrentProject(undefined);
  };

  const handleLicenseAsset = (asset: Asset) => {
    console.log('Licensing asset:', asset);
    // In real app: trigger licensing flow with blockchain transaction
  };

  if (showOnboarding) {
    return (
      <OnboardingFlow
        onCreateAsset={handleCreateAsset}
        onSkip={() => setShowOnboarding(false)}
      />
    );
  }

  const renderMainContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            promptInput={promptInput}
            onPromptInputChange={setPromptInput}
            onPromptSubmit={handlePromptSubmit}
            suggestions={suggestions}
            onUseSuggestion={handleUseSuggestion}
            onCreateAsset={handleCreateAsset}
          />
        );
      
      case 'library':
        // Show Storyworld Hub if viewing a specific project
        if (viewingStoryworldHub && currentProject) {
          return (
            <StoryworldHub
              project={currentProject}
              onCreateAsset={handleCreateAsset}
              onAssetSelect={handleAssetSelect}
              onEditProject={() => console.log('Edit project:', currentProject)}
              onBack={handleBackToLibrary}
            />
          );
        }
        
        // Otherwise show main library
        return (
          <Library
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            libraryFilter={libraryFilter}
            onFilterChange={setLibraryFilter}
            onAssetSelect={handleAssetSelect}
            onProjectSelect={handleProjectSelect}
            onCreateProject={handleCreateProject}
          />
        );

      case 'explore':
        return (
          <Explore
            onAssetSelect={handleAssetSelect}
            onLicenseAsset={handleLicenseAsset}
          />
        );
        
      case 'canvas':
        // Always use the simple Notion-style Canvas for editing
        return (
          <Canvas
            currentProject={currentProject}
            currentAsset={editingAsset || currentAsset}
            onCreateAsset={handleCreateAsset}
            onAssetSelect={handleAssetSelect}
            onProjectSelect={handleProjectSelect}
          />
        );
      
      case 'profile':
        return <Profile />;
        
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Select a tab to get started</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={(tab) => {
          setActiveTab(tab);
          // Reset storyworld hub when switching tabs
          if (tab !== 'library') {
            setViewingStoryworldHub(false);
          }
        }}
      />
      <main className="flex-1 overflow-hidden">
        {renderMainContent()}
      </main>
    </div>
  );
}; 