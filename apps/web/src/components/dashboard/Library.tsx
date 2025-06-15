// @ts-nocheck - Type compatibility issues with multiple Asset/StoryWorld interfaces
"use client";
import React, { useState, useEffect } from 'react';
import { Asset, StoryWorld } from './types';
import AssetUploadFlow from './AssetUploadFlow';
import EnhancedIPRegistrationFlow from '../story-protocol/EnhancedIPRegistrationFlow';
import { useFirebaseFunctions } from '@/hooks/useFirebaseFunctions';
import { useUserAssets } from '@/hooks/useAssets';

interface LibraryProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  libraryFilter: string;
  onFilterChange: (filter: string) => void;
  onAssetSelect: (asset: Asset) => void;
  onProjectSelect: (project: StoryWorld) => void;
  onCreateProject: () => void;
}

interface Project {
  id: string;
  name: string;
  description: string;
  visibility: 'PUBLIC' | 'PRIVATE';
  coverImageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  stats: {
    totalAssets: number;
    characters: number;
    storylines: number;
    loreEntries: number;
  };
}

// Convert MarketplaceAsset to Asset for compatibility
const convertToAsset = (marketplaceAsset: any): Asset => ({
  id: marketplaceAsset.id,
  ownerId: marketplaceAsset.ownerId,
  name: marketplaceAsset.name,
  parentId: null,
  projectId: marketplaceAsset.storyworldId || marketplaceAsset.storyworldIds?.[0] || 'unknown',
  type: marketplaceAsset.type as any,
  content: marketplaceAsset.content || { type: marketplaceAsset.type as any },
  visibility: 'PUBLIC' as const,
  ipStatus: marketplaceAsset.ipStatus as any,
  createdAt: marketplaceAsset.createdAt?.seconds ? new Date(marketplaceAsset.createdAt.seconds * 1000) : new Date(),
  updatedAt: marketplaceAsset.updatedAt?.seconds ? new Date(marketplaceAsset.updatedAt.seconds * 1000) : new Date(),
});

// Convert StoryWorld to Project for compatibility
const convertToProject = (storyworld: StoryWorld): Project => ({
  id: storyworld.id,
  name: storyworld.name,
  description: storyworld.description,
  visibility: (storyworld.visibility as 'PUBLIC' | 'PRIVATE') || 'PRIVATE',
  coverImageUrl: storyworld.coverImageUrl || undefined,
  createdAt: storyworld.createdAt,
  updatedAt: storyworld.updatedAt,
  stats: {
    totalAssets: (storyworld as any).assetCount || 0,
    characters: 0, // Will be calculated from assets
    storylines: 0, // Will be calculated from assets
    loreEntries: 0 // Will be calculated from assets
  }
});

interface IPRegistrationModalProps {
  asset: Asset;
  onRegister: (asset: Asset) => void;
  onClose: () => void;
}

const IPRegistrationModal = ({ asset, onRegister, onClose }: IPRegistrationModalProps) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl">
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-[#111827] mb-2">
          Register "{asset.name}"
        </h3>
        <p className="text-[#6B7280] mb-6">
          Secure your creation on-chain and unlock programmable ownership
        </p>
      </div>

      <div className="space-y-4 mb-6">
        <div className="p-4 bg-[#F0F4FF] rounded-xl border border-[#C7D2FE]">
          <h4 className="font-medium text-[#1E1B4B] mb-2">✅ What this means:</h4>
          <ul className="text-sm text-[#4C1D95] space-y-1">
            <li>• Permanent, verifiable ownership record on-chain</li>
            <li>• Public discoverability within Sia.vision ecosystem</li>
            <li>• Programmable licensing for collaborations</li>
            <li>• Revenue sharing capabilities</li>
          </ul>
        </div>
        
        <div className="p-4 bg-[#FEF3C7] rounded-xl border border-[#F59E0B]">
          <h4 className="font-medium text-[#92400E] mb-2">💰 Registration Fee: $2.50</h4>
          <p className="text-sm text-[#92400E]">
            One-time fee covers blockchain gas costs and platform processing
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 px-6 py-3 bg-[#F3F4F6] text-[#6B7280] rounded-xl hover:bg-[#E5E7EB] transition-colors font-medium"
        >
          Cancel
        </button>
        <button
          onClick={() => onRegister(asset)}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white rounded-xl hover:from-[#5B5BD6] hover:to-[#7C3AED] transition-all duration-200 font-medium shadow-lg"
        >
          Register & Protect
        </button>
      </div>
    </div>
  </div>
);

interface ProjectCardProps {
  project: Project;
  onSelect: (project: StoryWorld) => void;
  onUpload?: (project: Project) => void;
}

const ProjectCard = ({ project, onSelect, onUpload }: ProjectCardProps) => (
  <div className="group bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
    {/* Cover Image */}
    <div className="relative h-48 overflow-hidden">
      {project.coverImageUrl ? (
        <img
          src={project.coverImageUrl}
          alt={project.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center">
          <div className="text-6xl text-white/80">📚</div>
        </div>
      )}
      
      {/* Visibility Badge */}
      <div className="absolute top-3 right-3">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          project.visibility === 'PUBLIC'
            ? 'bg-[#10B981] text-white'
            : 'bg-[#111827]/80 text-white backdrop-blur-sm'
        }`}>
          {project.visibility === 'PUBLIC' ? '🌍 Public' : '🔒 Private'}
        </span>
      </div>
    </div>

    {/* Content */}
    <div className="p-6">
      <h3 className="text-xl font-bold text-[#111827] mb-2 group-hover:text-[#6366F1] transition-colors">
        {project.name}
      </h3>
      <p className="text-[#6B7280] text-sm mb-4 line-clamp-2">
        {project.description}
      </p>
      
      {/* Stats */}
      <div className="flex items-center justify-between text-xs text-[#6B7280] border-t border-[#E5E7EB] pt-4 mb-4">
        <div className="flex items-center gap-4">
          <span>{project.stats.totalAssets} assets</span>
          <span>{project.stats.characters} characters</span>
          <span>{project.stats.storylines} stories</span>
        </div>
        <span>Updated {project.updatedAt.toLocaleDateString()}</span>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => onSelect(project as any)}
          className="flex-1 px-4 py-2 bg-[#6366F1] text-white rounded-lg hover:bg-[#5B5BD6] transition-colors text-sm font-medium"
        >
          Open
        </button>
        {onUpload && (
          <button
            onClick={() => onUpload(project)}
            className="px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-colors text-sm font-medium flex items-center gap-1"
          >
            <span>📤</span>
            Upload
          </button>
        )}
      </div>
    </div>
  </div>
);

interface AssetCardProps {
  asset: Asset;
  projectName: string;
  onSelect: (asset: Asset) => void;
  onRegister: (asset: Asset) => void;
  onEnhancedRegister?: (asset: Asset) => void;
}

const AssetCard = ({ asset, projectName, onSelect, onRegister, onEnhancedRegister }: AssetCardProps) => {
  const getAssetIcon = () => {
    switch (asset.type) {
      case 'CHARACTER': return '👤';
      case 'STORYLINE': return '📖';
      case 'LORE': return '📚';
      case 'IMAGE': return '🎨';
      case 'VIDEO': return '🎬';
      case 'AUDIO': return '🎵';
      default: return '📄';
    }
  };

  const getStatusBadge = () => {
    switch (asset.ipStatus) {
      case 'REGISTERED':
        return (
          <div className="flex items-center gap-1 px-2 py-1 bg-[#10B981]/10 text-[#10B981] rounded-full text-xs font-medium">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Registered
          </div>
        );
      case 'UNREGISTERED':
        return (
          <div className="flex items-center gap-1 px-2 py-1 bg-[#F59E0B]/10 text-[#F59E0B] rounded-full text-xs font-medium">
            <div className="w-2 h-2 bg-[#F59E0B] rounded-full"></div>
            Draft
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#6366F1] rounded-lg flex items-center justify-center text-white text-lg">
            {getAssetIcon()}
          </div>
          <div>
            <h4 className="font-medium text-[#111827]">{asset.name}</h4>
            <p className="text-xs text-[#6B7280]">{projectName} • {asset.type.toLowerCase()}</p>
          </div>
        </div>
        {getStatusBadge()}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-[#6B7280]">
          Updated {asset.updatedAt.toLocaleDateString()}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => onSelect(asset)}
            className="px-3 py-1 text-[#6366F1] hover:bg-[#6366F1]/10 rounded-lg text-xs font-medium transition-colors"
          >
            Edit
          </button>
          {asset.ipStatus === 'UNREGISTERED' && (
            <>
              <button
                onClick={() => onRegister(asset)}
                className="px-3 py-1 text-[#6366F1] hover:bg-[#6366F1]/10 rounded-lg text-xs font-medium transition-colors border border-[#6366F1]"
              >
                Quick Register
              </button>
              {onEnhancedRegister && (
                <button
                  onClick={() => onEnhancedRegister(asset)}
                  className="px-3 py-1 bg-[#6366F1] text-white hover:bg-[#5B5BD6] rounded-lg text-xs font-medium transition-colors"
                >
                  🛡️ Protect IP
                </button>
              )}
            </>
          )}
          {asset.ipStatus === 'REGISTERED' && (
            <button className="px-3 py-1 bg-[#10B981] text-white rounded-lg text-xs font-medium">
              Distribute
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const Library = ({
  searchQuery,
  onSearchChange,
  libraryFilter,
  onFilterChange,
  onAssetSelect,
  onProjectSelect,
  onCreateProject
}: LibraryProps) => {
  const [viewMode, setViewMode] = useState<'projects' | 'assets'>('projects');
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'assets'>('recent');
  const [selectedAssetForRegistration, setSelectedAssetForRegistration] = useState<Asset | null>(null);
  const [showUploadFlow, setShowUploadFlow] = useState(false);
  const [selectedProjectForUpload, setSelectedProjectForUpload] = useState<Project | null>(null);
  const [showEnhancedIPFlow, setShowEnhancedIPFlow] = useState(false);
  const [ipRegistrationAsset, setIPRegistrationAsset] = useState<Asset | null>(null);

  const { assets } = useUserAssets();
  const { getUserStoryworlds } = useFirebaseFunctions();
  const [storyworlds, setStoryworlds] = useState<StoryWorld[]>([]);

  // Fetch storyworlds on component mount
  useEffect(() => {
    const fetchStoryworlds = async () => {
      try {
        const result = await getUserStoryworlds();
        // Convert Storyworld[] to StoryWorld[] with required properties
        const convertedStoryworlds: StoryWorld[] = result.storyworlds.map(sw => ({
          ...sw,
          visibility: (sw.isPublic ? 'PUBLIC' : 'PRIVATE') as 'PUBLIC' | 'PRIVATE',
          coverImageUrl: sw.coverImageUrl || undefined, // Convert null to undefined
          createdAt: sw.createdAt?.toDate ? sw.createdAt.toDate() : new Date(sw.createdAt),
          updatedAt: sw.updatedAt?.toDate ? sw.updatedAt.toDate() : new Date(sw.updatedAt),
          stats: {
            totalAssets: sw.assetCount || 0,
            characters: 0, // These would need to be calculated from actual assets
            storylines: 0,
            loreEntries: 0,
          }
        }));
        setStoryworlds(convertedStoryworlds);
      } catch (error) {
        console.error('Error fetching storyworlds:', error);
      }
    };
    fetchStoryworlds();
  }, [getUserStoryworlds]);

  const filteredProjects = storyworlds.filter((project: StoryWorld) => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'assets':
        return b.stats.totalAssets - a.stats.totalAssets;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'recent':
      default:
        return b.updatedAt.getTime() - a.updatedAt.getTime();
    }
  });

  const filteredAssets = assets.filter(asset => {
    const matchesProject = selectedProjectForUpload ? asset.projectId === selectedProjectForUpload.id : true;
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = libraryFilter === 'all' || 
      (libraryFilter === 'registered' && asset.ipStatus === 'REGISTERED') ||
      (libraryFilter === 'unregistered' && asset.ipStatus === 'UNREGISTERED');
    
    return matchesProject && matchesSearch && matchesFilter;
  });

  const handleRegisterAsset = (asset: Asset) => {
    // In real app, this would trigger blockchain transaction
    console.log('Registering asset:', asset);
    setSelectedAssetForRegistration(null);
    // Update asset status to registered
  };

  const handleUploadToProject = (project: Project) => {
    setSelectedProjectForUpload(project);
    setShowUploadFlow(true);
  };

  const handleUploadSuccess = (assets: Asset[]) => {
    console.log('Assets uploaded successfully:', assets);
    setShowUploadFlow(false);
    setSelectedProjectForUpload(null);
    // In real app, refresh the assets list
  };

  const handleEnhancedIPRegistration = (asset: Asset) => {
    setIPRegistrationAsset(asset);
    setShowEnhancedIPFlow(true);
    setSelectedAssetForRegistration(null); // Close old modal
  };

  const handleIPRegistrationSuccess = (result: any) => {
    console.log('IP registration successful:', result);
    setShowEnhancedIPFlow(false);
    setIPRegistrationAsset(null);
    // In real app, refresh the asset data
  };

  const getViewModeOptions = () => [
    { value: 'projects', label: 'Storyworlds', icon: '📚', count: filteredProjects.length },
    { value: 'assets', label: 'All Assets', icon: '📄', count: filteredAssets.length }
  ];

  const getFilterOptions = () => [
    { value: 'all', label: 'All Types', count: filteredAssets.length },
    { value: 'character', label: 'Characters', count: filteredAssets.filter(a => a.type === 'CHARACTER').length },
    { value: 'storyline', label: 'Storylines', count: filteredAssets.filter(a => a.type === 'STORYLINE').length },
    { value: 'lore', label: 'Lore', count: filteredAssets.filter(a => a.type === 'LORE').length },
    { value: 'image', label: 'Images', count: filteredAssets.filter(a => a.type === 'IMAGE').length },
    { value: 'video', label: 'Videos', count: filteredAssets.filter(a => a.type === 'VIDEO').length },
    { value: 'audio', label: 'Audio', count: filteredAssets.filter(a => a.type === 'AUDIO').length },
  ];

  const getProjectName = (projectId: string) => {
    const project = storyworlds.find(p => p.id === projectId);
    return project?.name || 'Unknown Project';
  };

  return (
    <div className="h-full bg-gradient-to-br from-gray-50 to-white flex flex-col">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
                Creative Library
              </h1>
              <p className="text-gray-600 text-lg">Your storyworlds, assets, and creative universe</p>
            </div>
            <button
              onClick={onCreateProject}
              className="flex items-center gap-2 px-6 py-3 bg-[#6366F1] text-white rounded-xl hover:bg-[#5B5BD6] transition-colors font-medium shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Storyworld
            </button>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4 mb-4">
            {/* Search */}
            <div className="flex-1 relative max-w-md">
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search library..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-white border border-gray-200 rounded-2xl p-1 shadow-sm">
              {getViewModeOptions().map((option) => (
                <button
                  key={option.value}
                  onClick={() => setViewMode(option.value as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors text-sm font-medium ${
                    viewMode === option.value 
                      ? 'bg-blue-500 text-white shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <span>{option.icon}</span>
                  <span>{option.label}</span>
                  <span className="text-xs opacity-75">({option.count})</span>
                </button>
              ))}
            </div>

            {/* Filters (only show for assets view) */}
            {viewMode === 'assets' && (
              <select
                value={libraryFilter}
                onChange={(e) => onFilterChange(e.target.value)}
                className="px-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[140px] shadow-sm"
              >
                {getFilterOptions().map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label} ({option.count})
                  </option>
                ))}
              </select>
            )}

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[140px] shadow-sm"
            >
              <option value="recent">Recently Updated</option>
              <option value={viewMode === 'projects' ? 'assets' : 'name'}>
                {viewMode === 'projects' ? 'Most Assets' : 'Name A-Z'}
              </option>
              <option value="name">{viewMode === 'projects' ? 'Name A-Z' : 'Type'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6">
          {viewMode === 'projects' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onSelect={onProjectSelect}
                  onUpload={handleUploadToProject}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAssets.map((asset) => {
                const projectName = getProjectName(asset.projectId);
                return (
                  <AssetCard
                    key={asset.id}
                    asset={asset}
                    projectName={projectName}
                    onSelect={onAssetSelect}
                    onRegister={setSelectedAssetForRegistration}
                    onEnhancedRegister={handleEnhancedIPRegistration}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* IP Registration Modal */}
      {selectedAssetForRegistration && (
        <IPRegistrationModal
          asset={selectedAssetForRegistration}
          onRegister={handleRegisterAsset}
          onClose={() => setSelectedAssetForRegistration(null)}
        />
      )}

      {/* Asset Upload Flow */}
      {showUploadFlow && selectedProjectForUpload && (
        <AssetUploadFlow
          storyworld={selectedProjectForUpload as any} // Convert Project to Storyworld
          isOpen={showUploadFlow}
          onClose={() => {
            setShowUploadFlow(false);
            setSelectedProjectForUpload(null);
          }}
          onSuccess={handleUploadSuccess}
        />
      )}

      {/* Enhanced IP Registration Flow */}
      {showEnhancedIPFlow && ipRegistrationAsset && selectedProjectForUpload && (
        <EnhancedIPRegistrationFlow
          asset={ipRegistrationAsset}
          storyworld={selectedProjectForUpload as any} // Convert Project to Storyworld
          isOpen={showEnhancedIPFlow}
          onClose={() => {
            setShowEnhancedIPFlow(false);
            setIPRegistrationAsset(null);
          }}
          onSuccess={handleIPRegistrationSuccess}
        />
      )}
    </div>
  );
}; 