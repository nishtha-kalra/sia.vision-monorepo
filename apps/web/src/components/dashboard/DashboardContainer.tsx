"use client";
import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Dashboard } from './Dashboard';
import { Library } from './Library';
import LibraryIntegrated from './LibraryIntegrated';
import { Profile } from './Profile';
import { Canvas } from './Canvas';
import { StoryworldHub } from './StoryworldHub';
import { Explore } from './Explore';
import { OnboardingFlow } from './OnboardingFlow';
import { StoryworldConfirmationModal } from './StoryworldConfirmationModal';


import { Asset, Project, AssetContent } from './types';
import { Asset as BackendAsset, Storyworld } from '@/types';
import { useFirebaseFunctions } from '@/hooks/useFirebaseFunctions';
import { useAuthState } from '@/hooks/useAuth';

export const DashboardContainer = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [promptInput, setPromptInput] = useState('');
  const [isProcessingPrompt, setIsProcessingPrompt] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
  
  // Storyworld confirmation modal state
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [pendingStoryworldDetails, setPendingStoryworldDetails] = useState<any>(null);
  const [aiConfidence, setAiConfidence] = useState(0);
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
  
  // Hooks
  const { processCreativePrompt, createStoryworld, enhanceStoryworld } = useFirebaseFunctions();
  const [user] = useAuthState();

  const handlePromptSubmit = async () => {
    if (promptInput.trim() && user) {
      setIsProcessingPrompt(true);
      try {
        console.log('🤖 Processing prompt with AI:', promptInput);
        
        // Process the prompt with AI
        const aiResponse = await processCreativePrompt({
          prompt: promptInput.trim(),
          userId: user.uid,
          context: {
            currentStoryworldId: currentProject?.id,
            lastActivity: activeTab
          }
        });

        console.log('🎯 AI Response:', aiResponse);

        if (aiResponse.success) {
          console.log('✅ AI Response successful');
          console.log('📊 Analysis:', aiResponse.analysis);
          console.log('💡 Suggestions:', aiResponse.suggestions);
          console.log('🎭 Generated Content:', aiResponse.generatedContent);
          
          // Store AI suggestions for display  
          const suggestions = [{
            ...aiResponse.suggestions,
            type: aiResponse.suggestions.type || 'general_advice'
          }];
          if (aiResponse.suggestions.alternatives) {
            const alternativesWithType = aiResponse.suggestions.alternatives.map(alt => ({
              ...alt,
              type: alt.type || aiResponse.suggestions.type || 'general_advice'
            }));
            suggestions.push(...alternativesWithType);
          }
          
          console.log('🔄 Setting AI suggestions:', suggestions);
          setAiSuggestions(suggestions);

          // Check if we should show confirmation modal for storyworld creation
          console.log(`🎯 Confidence: ${aiResponse.analysis.confidence}, Threshold: 0.8`);
          if (aiResponse.analysis.confidence > 0.8 && aiResponse.suggestions.action?.function === 'createStoryworld' && aiResponse.generatedContent?.storyworld) {
            console.log('📋 Showing confirmation modal for storyworld creation');
            
            // Store complete AI context for database storage
            const aiContext = {
              originalPrompt: promptInput.trim(),
              aiResponse: aiResponse,
              storyworld: aiResponse.generatedContent.storyworld
            };
            
            const modalDetails = {
              ...aiResponse.generatedContent.storyworld,
              aiContext // Store AI context for later use
            };
            
            console.log('🎭 Setting modal details:', modalDetails);
            console.log('🎯 AI confidence:', aiResponse.analysis.confidence);
            
            setPendingStoryworldDetails(modalDetails);
            setAiConfidence(aiResponse.analysis.confidence);
            setShowConfirmationModal(true);
          } else if (aiResponse.analysis.confidence > 0.8 && aiResponse.suggestions.action) {
            console.log('🚀 Auto-executing non-storyworld action:', aiResponse.suggestions.action);
            await executeAiSuggestion(aiResponse.suggestions.action, aiResponse.generatedContent);
          } else {
            console.log('⏸️ Not auto-executing - confidence too low or no action available');
          }
        } else {
          console.log('⚠️ AI Response not successful, but showing suggestions anyway');
          // Even if not successful, we might have useful suggestions
          if (aiResponse.suggestions) {
            const suggestions = [{
              ...aiResponse.suggestions,
              type: aiResponse.suggestions.type || 'general_advice'
            }];
            setAiSuggestions(suggestions);
          }
        }
      } catch (error) {
        console.error('Failed to process prompt:', error);
        // Fallback to basic handling
        console.log('Using fallback processing for:', promptInput);
      } finally {
        setIsProcessingPrompt(false);
        setPromptInput('');
      }
    }
  };

  const executeAiSuggestion = async (action: any, generatedContent?: any) => {
    try {
      if (action.function === 'createStoryworld' && generatedContent?.storyworld) {
        console.log('🏗️ Creating storyworld from AI suggestion:', generatedContent.storyworld);
        
        const result = await createStoryworld({
          name: generatedContent.storyworld.name,
          description: generatedContent.storyworld.description
        });

        // Navigate to the new storyworld
        const newProject: Project = {
          id: result.storyworldId,
          ownerId: user?.uid || 'current_user',
          name: generatedContent.storyworld.name,
          description: generatedContent.storyworld.description,
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

      } else if (action.function === 'createAsset') {
        console.log('📝 Creating asset from AI suggestion:', action.parameters);
        handleCreateAsset(action.parameters.type);
      }
    } catch (error) {
      console.error('Failed to execute AI suggestion:', error);
    }
  };

  const handleUseSuggestion = (suggestion: string) => {
    setPromptInput(suggestion);
  };

  const handleUseAiSuggestion = async (suggestion: any) => {
    if (suggestion.action) {
      await executeAiSuggestion(suggestion.action);
    } else {
      setPromptInput(suggestion.title);
    }
  };

  const handleConfirmStoryworld = async (details: any) => {
    try {
      console.log('🏗️ Creating confirmed storyworld:', details);
      console.log('🔍 User:', user);
      console.log('🔍 AI Context:', details.aiContext);
      
      // Validate required fields
      if (!details.name || !details.description) {
        throw new Error('Name and description are required');
      }
      
      if (!user?.uid) {
        throw new Error('User not authenticated');
      }
      
      // Prepare AI context for database storage
      const aiContextForDb = details.aiContext ? {
        originalPrompt: details.aiContext.originalPrompt,
        aiResponse: details.aiContext.aiResponse,
        confidence: aiConfidence,
        analysis: details.aiContext.aiResponse?.analysis,
        generatedContent: details.aiContext.aiResponse?.generatedContent
      } : undefined;
      
      console.log('📤 Calling createStoryworld with:', {
        name: details.name,
        description: details.description,
        genre: details.genre,
        themes: details.themes,
        aiContext: aiContextForDb
      });

      const result = await createStoryworld({
        name: details.name,
        description: details.description,
        genre: details.genre,
        themes: details.themes,
        aiContext: aiContextForDb
      });

      console.log('✅ Storyworld created successfully:', result);

      // Navigate to the new storyworld
      const newProject: Project = {
        id: result.storyworldId,
        ownerId: user.uid,
        name: details.name,
        description: details.description,
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
      
      console.log('🧭 Navigating to new storyworld:', newProject);
      
      setCurrentProject(newProject);
      setViewingStoryworldHub(true);
      setActiveTab('library');
      setShowConfirmationModal(false);
      setPendingStoryworldDetails(null);
      
      console.log('✅ Storyworld created and navigation complete');
      
      // Show success message
      console.log('🎉 Success! Your storyworld has been created.');
      
    } catch (error) {
      console.error('❌ Failed to create confirmed storyworld:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        details,
        user: user?.uid
      });
      
      // Show error message to user
      alert(`Failed to create storyworld: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleCloseConfirmation = () => {
    setShowConfirmationModal(false);
    setPendingStoryworldDetails(null);
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
            // AI-enhanced props
            isProcessingPrompt={isProcessingPrompt}
            aiSuggestions={aiSuggestions}
            onUseAiSuggestion={handleUseAiSuggestion}
          />
        );
      
      case 'library':
        // Use the new integrated library for testing SIA functionality
        return (
          <div className="p-6">
            <div className="mb-4">
              <div className="bg-[#F0F4FF] border border-[#C7D2FE] rounded-xl p-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🚀</span>
                  <div>
                    <h3 className="font-semibold text-[#1E1B4B]">Backend Integration Active</h3>
                    <p className="text-sm text-[#4C1D95]">Now using real Firebase Functions for storyworld and asset management</p>
                  </div>
                </div>
              </div>
            </div>
            <LibraryIntegrated
              onAssetSelect={(asset: BackendAsset) => {
                console.log('Selected backend asset:', asset);
                // Convert backend asset to canvas-compatible format and open in Canvas
                const canvasAsset: Asset = {
                  id: asset.id,
                  ownerId: (asset as any).uploadedBy || 'current_user',
                  name: asset.name,
                  parentId: null,
                  projectId: 'backend_integrated',
                  type: asset.type,
                  content: asset.content || getDefaultAssetContent(asset.type),
                  visibility: 'PRIVATE',
                  ipStatus: asset.ipStatus === 'PENDING' ? 'UNREGISTERED' : (asset.ipStatus as 'UNREGISTERED' | 'REGISTERED'),
                  createdAt: asset.createdAt ? new Date(asset.createdAt.seconds * 1000) : new Date(),
                  updatedAt: asset.updatedAt ? new Date(asset.updatedAt.seconds * 1000) : new Date()
                };
                
                setEditingAsset(canvasAsset);
                setActiveTab('canvas');
              }}
              onStoryworldSelect={(storyworld: Storyworld) => {
                console.log('Selected storyworld:', storyworld);
                // Navigate within the integrated component
              }}
              onCreateStoryline={(storyworldId: string) => {
                console.log('Creating storyline for storyworld:', storyworldId);
                // Create a new storyline asset and open in Canvas
                const newStoryline: Asset = {
                  id: `storyline_${Date.now()}`,
                  ownerId: 'current_user',
                  name: 'New Storyline',
                  parentId: null,
                  projectId: storyworldId,
                  type: 'STORYLINE',
                  content: getDefaultAssetContent('STORYLINE'),
                  visibility: 'PRIVATE',
                  ipStatus: 'UNREGISTERED',
                  createdAt: new Date(),
                  updatedAt: new Date()
                };
                
                setEditingAsset(newStoryline);
                setActiveTab('canvas');
              }}
            />
          </div>
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
          // Clear AI suggestions when changing tabs
          if (tab !== 'dashboard') {
            setAiSuggestions([]);
          }
        }}
      />
      <main className="flex-1 overflow-hidden">
        {renderMainContent()}
      </main>
      
      {/* Storyworld Confirmation Modal */}
      <StoryworldConfirmationModal
        isOpen={showConfirmationModal}
        onClose={handleCloseConfirmation}
        onConfirm={handleConfirmStoryworld}
        initialDetails={pendingStoryworldDetails && pendingStoryworldDetails.name ? pendingStoryworldDetails : {
          name: 'AI Generated Storyworld',
          description: 'A creative universe generated by AI',
          genre: 'fantasy',
          themes: ['adventure', 'creativity']
        }}
        confidence={aiConfidence}
      />
    </div>
  );
}; 