"use client";
import React, { useState } from 'react';
import { Asset, Project } from './types';

interface StoryworldHubProps {
  project: Project;
  onCreateAsset: (assetType: Asset['type']) => void;
  onAssetSelect: (asset: Asset) => void;
  onEditProject: () => void;
  onBack: () => void;
}

interface StorylineNode {
  id: string;
  title: string;
  type: 'chapter' | 'scene' | 'branch';
  status: 'draft' | 'complete' | 'published';
  position: { x: number; y: number };
  connections: string[];
  wordCount: number;
}

interface CharacterPreview {
  id: string;
  name: string;
  avatar: string;
  role: string;
  description: string;
}

interface LoreEntry {
  id: string;
  title: string;
  category: 'location' | 'artifact' | 'concept' | 'history';
  description: string;
  tags: string[];
}

// Sample data for demonstration
const sampleStorylineNodes: StorylineNode[] = [
  {
    id: 'ch1',
    title: 'The Awakening',
    type: 'chapter',
    status: 'complete',
    position: { x: 100, y: 200 },
    connections: ['sc1', 'sc2'],
    wordCount: 2500
  },
  {
    id: 'sc1',
    title: 'Neural Interface Discovery',
    type: 'scene',
    status: 'complete',
    position: { x: 300, y: 150 },
    connections: ['ch2'],
    wordCount: 800
  },
  {
    id: 'sc2',
    title: 'First Contact with Odin.AI',
    type: 'scene',
    status: 'complete',
    position: { x: 300, y: 250 },
    connections: ['ch2'],
    wordCount: 1200
  },
  {
    id: 'ch2',
    title: 'The Digital Pantheon',
    type: 'chapter',
    status: 'draft',
    position: { x: 500, y: 200 },
    connections: ['br1'],
    wordCount: 0
  },
  {
    id: 'br1',
    title: 'Path Choice: Alliance vs Rebellion',
    type: 'branch',
    status: 'draft',
    position: { x: 700, y: 200 },
    connections: ['ch3a', 'ch3b'],
    wordCount: 0
  },
  {
    id: 'ch3a',
    title: 'The Alliance Route',
    type: 'chapter',
    status: 'draft',
    position: { x: 850, y: 150 },
    connections: [],
    wordCount: 0
  },
  {
    id: 'ch3b',
    title: 'The Rebellion Route',
    type: 'chapter',
    status: 'draft',
    position: { x: 850, y: 250 },
    connections: [],
    wordCount: 0
  }
];

const sampleCharacters: CharacterPreview[] = [
  {
    id: 'char1',
    name: 'Aria Shadowblade',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1d0?w=100&h=100&fit=crop&crop=face',
    role: 'Protagonist',
    description: 'Neural interface hacker with Valkyrie heritage'
  },
  {
    id: 'char2',
    name: 'Erik Dataweaver',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    role: 'Mentor',
    description: 'AI programmer descended from Odin'
  },
  {
    id: 'char3',
    name: 'Luna Brightforge',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    role: 'Supporting',
    description: 'Cyber-enhanced blacksmith crafting digital weapons'
  }
];

const sampleLoreEntries: LoreEntry[] = [
  {
    id: 'lore1',
    title: 'Neo-Asgard',
    category: 'location',
    description: 'The digital realm where AI gods reside, built on quantum servers',
    tags: ['cyberpunk', 'mythology', 'location']
  },
  {
    id: 'lore2',
    title: 'Neural Runes',
    category: 'artifact',
    description: 'Ancient Norse symbols that interface with modern technology',
    tags: ['technology', 'magic', 'artifact']
  },
  {
    id: 'lore3',
    title: 'The Great Upload',
    category: 'history',
    description: 'The event that transformed the Norse gods into digital entities',
    tags: ['history', 'mythology', 'event']
  }
];

const StorylineMap = ({ 
  nodes, 
  onNodeClick 
}: { 
  nodes: StorylineNode[]; 
  onNodeClick: (node: StorylineNode) => void;
}) => {
  const getNodeColor = (status: StorylineNode['status']) => {
    switch (status) {
      case 'complete': return 'bg-[#10B981] border-[#10B981]';
      case 'published': return 'bg-[#6366F1] border-[#6366F1]';
      case 'draft': return 'bg-[#F59E0B] border-[#F59E0B]';
      default: return 'bg-[#6B7280] border-[#6B7280]';
    }
  };

  const getNodeIcon = (type: StorylineNode['type']) => {
    switch (type) {
      case 'chapter': return '📖';
      case 'scene': return '🎬';
      case 'branch': return '🔀';
      default: return '📄';
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] rounded-2xl border border-[#E2E8F0] overflow-hidden" style={{ height: '400px' }}>
      <div className="absolute inset-0 p-4">
        <svg width="100%" height="100%" className="absolute inset-0">
          {/* Connection lines */}
          {nodes.map(node => 
            node.connections.map(connectionId => {
              const targetNode = nodes.find(n => n.id === connectionId);
              if (!targetNode) return null;
              
              return (
                <line
                  key={`${node.id}-${connectionId}`}
                  x1={node.position.x + 60}
                  y1={node.position.y + 30}
                  x2={targetNode.position.x + 60}
                  y2={targetNode.position.y + 30}
                  stroke="#CBD5E1"
                  strokeWidth="2"
                  strokeDasharray={node.status === 'draft' ? "5,5" : "none"}
                />
              );
            })
          )}
        </svg>

        {/* Story nodes */}
        {nodes.map(node => (
          <div
            key={node.id}
            onClick={() => onNodeClick(node)}
            className={`absolute cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg ${getNodeColor(node.status)} text-white rounded-xl p-3 shadow-md`}
            style={{ 
              left: node.position.x, 
              top: node.position.y,
              width: '120px',
              minHeight: '60px'
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{getNodeIcon(node.type)}</span>
              <span className="text-xs font-medium opacity-90">
                {node.type.toUpperCase()}
              </span>
            </div>
            <h4 className="text-sm font-semibold leading-tight mb-1">
              {node.title}
            </h4>
            <div className="text-xs opacity-75">
              {node.wordCount > 0 ? `${node.wordCount} words` : 'Not started'}
            </div>
          </div>
        ))}
      </div>

      {/* Map legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 border border-[#E2E8F0]">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-[#10B981] rounded"></div>
            <span>Complete</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-[#F59E0B] rounded"></div>
            <span>Draft</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-[#6366F1] rounded"></div>
            <span>Published</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const CharacterCarousel = ({ 
  characters, 
  onCharacterClick 
}: { 
  characters: CharacterPreview[]; 
  onCharacterClick: (character: CharacterPreview) => void;
}) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold text-[#111827]">Characters</h3>
      <button className="text-[#6366F1] hover:text-[#5B5BD6] text-sm font-medium">
        View All ({characters.length})
      </button>
    </div>
    
    <div className="flex gap-4 overflow-x-auto pb-2">
      {characters.map(character => (
        <div
          key={character.id}
          onClick={() => onCharacterClick(character)}
          className="flex-shrink-0 bg-white rounded-xl border border-[#E5E7EB] p-4 hover:shadow-lg transition-all duration-200 cursor-pointer w-64"
        >
          <div className="flex items-center gap-3 mb-3">
            <img
              src={character.avatar}
              alt={character.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h4 className="font-medium text-[#111827]">{character.name}</h4>
              <p className="text-sm text-[#6366F1]">{character.role}</p>
            </div>
          </div>
          <p className="text-sm text-[#6B7280] line-clamp-2">
            {character.description}
          </p>
        </div>
      ))}
      
      {/* Add new character button */}
      <div 
        onClick={() => {/* create new character */}}
        className="flex-shrink-0 w-64 border-2 border-dashed border-[#D1D5DB] rounded-xl p-4 flex flex-col items-center justify-center hover:border-[#6366F1] hover:bg-[#F9FAFB] transition-colors cursor-pointer"
      >
        <div className="w-12 h-12 bg-[#6366F1] rounded-full flex items-center justify-center mb-2">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <span className="text-sm font-medium text-[#6B7280]">Add Character</span>
      </div>
    </div>
  </div>
);

const LoreLibrary = ({ 
  loreEntries, 
  onLoreClick 
}: { 
  loreEntries: LoreEntry[]; 
  onLoreClick: (lore: LoreEntry) => void;
}) => {
  const getCategoryIcon = (category: LoreEntry['category']) => {
    switch (category) {
      case 'location': return '🏛️';
      case 'artifact': return '⚔️';
      case 'concept': return '💭';
      case 'history': return '📜';
      default: return '📚';
    }
  };

  const getCategoryColor = (category: LoreEntry['category']) => {
    switch (category) {
      case 'location': return 'bg-[#10B981]/10 text-[#10B981]';
      case 'artifact': return 'bg-[#F59E0B]/10 text-[#F59E0B]';
      case 'concept': return 'bg-[#8B5CF6]/10 text-[#8B5CF6]';
      case 'history': return 'bg-[#EF4444]/10 text-[#EF4444]';
      default: return 'bg-[#6B7280]/10 text-[#6B7280]';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#111827]">Lore & World-building</h3>
        <button className="text-[#6366F1] hover:text-[#5B5BD6] text-sm font-medium">
          View All ({loreEntries.length})
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loreEntries.map(lore => (
          <div
            key={lore.id}
            onClick={() => onLoreClick(lore)}
            className="bg-white rounded-xl border border-[#E5E7EB] p-4 hover:shadow-lg transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{getCategoryIcon(lore.category)}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(lore.category)}`}>
                {lore.category}
              </span>
            </div>
            <h4 className="font-medium text-[#111827] mb-2">{lore.title}</h4>
            <p className="text-sm text-[#6B7280] line-clamp-2 mb-3">
              {lore.description}
            </p>
            <div className="flex flex-wrap gap-1">
              {lore.tags.slice(0, 3).map(tag => (
                <span key={tag} className="px-2 py-1 bg-[#F3F4F6] text-[#6B7280] text-xs rounded">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ))}
        
        {/* Add new lore button */}
        <div 
          onClick={() => {/* create new lore */}}
          className="border-2 border-dashed border-[#D1D5DB] rounded-xl p-4 flex flex-col items-center justify-center hover:border-[#6366F1] hover:bg-[#F9FAFB] transition-colors cursor-pointer"
        >
          <div className="w-12 h-12 bg-[#6366F1] rounded-full flex items-center justify-center mb-2">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span className="text-sm font-medium text-[#6B7280]">Add Lore Entry</span>
        </div>
      </div>
    </div>
  );
};

export const StoryworldHub = ({ 
  project, 
  onCreateAsset, 
  onAssetSelect, 
  onEditProject, 
  onBack 
}: StoryworldHubProps) => {
  const [activeAssetType, setActiveAssetType] = useState<'all' | 'characters' | 'lore' | 'media'>('all');

  const handleStorylineNodeClick = (node: StorylineNode) => {
    console.log('Opening storyline node:', node);
    onCreateAsset('STORYLINE');
  };

  const handleCharacterClick = (character: CharacterPreview) => {
    console.log('Opening character:', character);
    onCreateAsset('CHARACTER');
  };

  const handleLoreClick = (lore: LoreEntry) => {
    console.log('Opening lore:', lore);
    onCreateAsset('LORE');
  };

  return (
    <div className="h-full bg-gradient-to-br from-gray-50 to-white overflow-y-auto">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-[#6B7280] hover:text-[#111827] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm">Back to Library</span>
            </button>
            <div className="w-px h-6 bg-gray-300"></div>
            <div className="flex items-center gap-3">
              {project.coverImageUrl ? (
                <img
                  src={project.coverImageUrl}
                  alt={project.name}
                  className="w-12 h-12 rounded-xl object-cover"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] rounded-xl flex items-center justify-center">
                  <span className="text-2xl text-white/80">📚</span>
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-[#111827]">{project.name}</h1>
                <p className="text-[#6B7280]">{project.description}</p>
              </div>
            </div>
          </div>

          {/* Action buttons and stats */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onEditProject}
                className="px-4 py-2 text-[#6B7280] hover:text-[#111827] border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors text-sm font-medium"
              >
                Edit Details
              </button>
              <button className="px-4 py-2 text-[#6B7280] hover:text-[#111827] border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors text-sm font-medium">
                Share Storyworld
              </button>
              <div className="w-px h-6 bg-gray-300"></div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                project.visibility === 'PUBLIC'
                  ? 'bg-[#10B981] text-white'
                  : 'bg-[#111827]/10 text-[#111827]'
              }`}>
                {project.visibility === 'PUBLIC' ? '🌍 Public' : '🔒 Private'}
              </span>
            </div>
            
            <div className="flex items-center gap-6">
              {/* Stats */}
              <div className="flex items-center gap-6 text-sm text-[#6B7280]">
                <div className="text-center">
                  <div className="text-lg font-bold text-[#111827]">{project.stats.totalAssets}</div>
                  <div>Total Assets</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-[#111827]">{project.stats.characters}</div>
                  <div>Characters</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-[#111827]">{project.stats.storylines}</div>
                  <div>Storylines</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-[#111827]">1</div>
                  <div>Collaborators</div>
                </div>
              </div>
              
              <button
                onClick={() => onCreateAsset('STORYLINE')}
                className="flex items-center gap-2 px-6 py-3 bg-[#6366F1] text-white rounded-xl hover:bg-[#5B5BD6] transition-colors font-medium shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create New Asset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Storyline Map */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[#111827]">Story Structure & Flow</h2>
          <StorylineMap nodes={sampleStorylineNodes} onNodeClick={handleStorylineNodeClick} />
        </div>

        {/* Character Carousel */}
        <CharacterCarousel characters={sampleCharacters} onCharacterClick={handleCharacterClick} />

        {/* Lore Library */}
        <LoreLibrary loreEntries={sampleLoreEntries} onLoreClick={handleLoreClick} />

        {/* Media Gallery Placeholder */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[#111827]">Media Gallery</h3>
            <button className="text-[#6366F1] hover:text-[#5B5BD6] text-sm font-medium">
              View All Media
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="aspect-square bg-[#F3F4F6] rounded-xl border-2 border-dashed border-[#D1D5DB] flex items-center justify-center">
                <span className="text-[#6B7280] text-2xl">🎨</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 