"use client";
import React, { useState } from 'react';
import { Asset } from './types';

interface LibraryProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  libraryFilter: string;
  onFilterChange: (filter: string) => void;
  libraryAssets: Asset[];
  onAssetSelect: (asset: Asset) => void;
}

interface Collection {
  id: string;
  name: string;
  description: string;
  type: 'CHARACTER' | 'STORYLINE' | 'LORE' | 'IMAGE' | 'VIDEO' | 'AUDIO' | 'MIXED';
  assetCount: number;
  status: 'DRAFT' | 'PUBLISHED' | 'REGISTERED';
  updatedAt: Date;
  coverUrl?: string;
  assets: Asset[];
  owners?: number;
  verified?: boolean;
}

// Enhanced sample collections with NFT marketplace styling
const sampleCollections: Collection[] = [
  {
    id: 'col1',
    name: 'Cyberpunk Characters',
    description: 'Elite character collection from the Cyberpunk Norse Saga universe with unique traits and storylines.',
    type: 'CHARACTER',
    assetCount: 8,
    status: 'PUBLISHED',
    updatedAt: new Date('2024-06-08'),
    coverUrl: 'https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?w=300&h=300&fit=crop&crop=center',
    assets: [],
    owners: 6,
    verified: true
  },
  {
    id: 'col2',
    name: 'Digital Artifacts',
    description: 'Rare visual concepts and mystical artifacts from multiple storyworlds. Each piece tells a unique story.',
    type: 'IMAGE',
    assetCount: 15,
    status: 'PUBLISHED',
    updatedAt: new Date('2024-06-07'),
    coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&h=300&fit=crop&crop=center',
    assets: [],
    owners: 12,
    verified: true
  },
  {
    id: 'col3',
    name: 'Story Chronicles',
    description: 'Limited edition storylines and narrative chapters. Own a piece of literary history.',
    type: 'STORYLINE',
    assetCount: 12,
    status: 'DRAFT',
    updatedAt: new Date('2024-06-06'),
    coverUrl: 'https://images.unsplash.com/photo-1519681393784-d120c3b166e8?w=300&h=300&fit=crop&crop=center',
    assets: [],
    owners: 8,
    verified: false
  },
  {
    id: 'col4',
    name: 'Sonic Worlds',
    description: 'Immersive audio experiences and soundscapes that bring storyworlds to life.',
    type: 'AUDIO',
    assetCount: 6,
    status: 'PUBLISHED',
    updatedAt: new Date('2024-06-05'),
    coverUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=300&fit=crop',
    assets: [],
    owners: 4,
    verified: true
  },
  {
    id: 'col5',
    name: 'Visual Narratives',
    description: 'Cinematic video content and world-building experiences in high definition.',
    type: 'VIDEO',
    assetCount: 4,
    status: 'PUBLISHED',
    updatedAt: new Date('2024-06-04'),
    coverUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&h=300&fit=crop',
    assets: [],
    owners: 3,
    verified: true
  },
  {
    id: 'col6',
    name: 'Genesis Collection',
    description: 'The original mixed-media collection that started it all. Historic significance meets artistic excellence.',
    type: 'MIXED',
    assetCount: 20,
    status: 'REGISTERED',
    updatedAt: new Date('2024-06-03'),
    coverUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop',
    assets: [],
    owners: 15,
    verified: true
  }
];

const CollectionCard = ({ 
  collection, 
  onPublish, 
  onSelect 
}: { 
  collection: Collection; 
  onPublish: (collection: Collection) => void;
  onSelect: (collection: Collection) => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);

  const getTypeColor = () => {
    switch (collection.type) {
      case 'CHARACTER': return 'from-purple-500 to-pink-500';
      case 'STORYLINE': return 'from-blue-500 to-cyan-500';
      case 'LORE': return 'from-green-500 to-emerald-500';
      case 'IMAGE': return 'from-orange-500 to-red-500';
      case 'VIDEO': return 'from-red-500 to-rose-500';
      case 'AUDIO': return 'from-indigo-500 to-purple-500';
      case 'MIXED': return 'from-violet-500 to-purple-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusBadge = () => {
    switch (collection.status) {
      case 'PUBLISHED': 
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
          Live
        </span>;
      case 'REGISTERED': 
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Verified
        </span>;
      case 'DRAFT': 
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          Draft
        </span>;
      default: return null;
    }
  };

  const handlePublish = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (collection.status === 'DRAFT') {
      setShowPublishModal(true);
    }
  };

  const confirmPublish = () => {
    onPublish(collection);
    setShowPublishModal(false);
  };

  return (
    <>
      <div
        onClick={() => onSelect(collection)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group transform hover:scale-[1.02]"
      >
        {/* Cover Image with Gradient Overlay */}
        <div className="relative h-64 overflow-hidden">
          {collection.coverUrl ? (
            <>
              <img
                src={collection.coverUrl}
                alt={collection.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div className={`w-full h-full bg-gradient-to-br ${getTypeColor()} items-center justify-center hidden`}>
                <div className="text-6xl text-white/80">
                  {collection.type === 'CHARACTER' ? '👤' : 
                   collection.type === 'STORYLINE' ? '📖' : 
                   collection.type === 'LORE' ? '📚' : 
                   collection.type === 'IMAGE' ? '🖼️' : 
                   collection.type === 'VIDEO' ? '🎬' : 
                   collection.type === 'AUDIO' ? '🎵' : '📦'}
                </div>
              </div>
              <div className={`absolute inset-0 bg-gradient-to-t ${getTypeColor()} opacity-20 group-hover:opacity-30 transition-opacity duration-300`}></div>
            </>
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${getTypeColor()} flex items-center justify-center`}>
              <div className="text-6xl text-white/80">
                {collection.type === 'CHARACTER' ? '👤' : 
                 collection.type === 'STORYLINE' ? '📖' : 
                 collection.type === 'LORE' ? '📚' : 
                 collection.type === 'IMAGE' ? '🖼️' : 
                 collection.type === 'VIDEO' ? '🎬' : 
                 collection.type === 'AUDIO' ? '🎵' : '📦'}
              </div>
            </div>
          )}
          
          {/* Top badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            {getStatusBadge()}
            {collection.verified && (
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>

          {/* Type Badge */}
          <div className="absolute bottom-3 left-3">
            <span className="px-3 py-1 bg-black/70 backdrop-blur-sm text-white text-xs font-medium rounded-full">
              {collection.type}
            </span>
          </div>

          {/* Quick Action Button */}
          {collection.status === 'DRAFT' && (
            <div className={`absolute bottom-3 right-3 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
              <button
                onClick={handlePublish}
                className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-medium rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg"
              >
                Publish
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
              {collection.name}
            </h3>
            <div className="text-right ml-2">
              <div className="text-sm font-semibold text-gray-900">{collection.assetCount}</div>
              <div className="text-xs text-gray-500">items</div>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[2.5rem]">
            {collection.description}
          </p>
          
                     {/* Stats Row */}
           <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-3">
             <div className="flex items-center gap-3">
               <div>
                 <span className="text-gray-400">Updated:</span>
                 <span className="ml-1 font-semibold text-gray-900">{collection.updatedAt.toLocaleDateString()}</span>
               </div>
             </div>
             <div className="flex items-center gap-1">
               <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                 <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
               </svg>
               <span>{collection.owners} owners</span>
             </div>
           </div>
        </div>
      </div>

      {/* Publish Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Publish Collection
              </h3>
              <p className="text-gray-600">
                Are you ready to publish "{collection.name}" to the marketplace? This will make it publicly available for discovery and trading.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowPublishModal(false)}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmPublish}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-medium shadow-lg"
              >
                Publish Now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const Library = ({
  searchQuery,
  onSearchChange,
  libraryFilter,
  onFilterChange,
  onAssetSelect
}: LibraryProps) => {
  const [collections, setCollections] = useState(sampleCollections);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'items'>('recent');

  const filteredCollections = collections.filter(collection => {
    const matchesSearch = collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         collection.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = libraryFilter === 'all' || 
                         collection.type.toLowerCase() === libraryFilter ||
                         collection.status.toLowerCase() === libraryFilter;
    return matchesSearch && matchesFilter;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'items':
        return b.assetCount - a.assetCount;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'recent':
      default:
        return b.updatedAt.getTime() - a.updatedAt.getTime();
    }
  });

  const handlePublish = (collection: Collection) => {
    setCollections(prev =>
      prev.map(c =>
        c.id === collection.id
          ? { ...c, status: 'PUBLISHED' as const }
          : c
      )
    );
  };

  const handleCollectionSelect = (collection: Collection) => {
    console.log('Selected collection:', collection);
  };

  const getTotalAssets = () => {
    return collections
      .filter(c => c.status === 'PUBLISHED' || c.status === 'REGISTERED')
      .reduce((sum, c) => sum + c.assetCount, 0);
  };

  const getFilterOptions = () => [
    { value: 'all', label: 'All Collections', count: collections.length },
    { value: 'character', label: 'Characters', count: collections.filter(c => c.type === 'CHARACTER').length },
    { value: 'image', label: 'Art & Images', count: collections.filter(c => c.type === 'IMAGE').length },
    { value: 'video', label: 'Videos', count: collections.filter(c => c.type === 'VIDEO').length },
    { value: 'audio', label: 'Audio', count: collections.filter(c => c.type === 'AUDIO').length },
    { value: 'storyline', label: 'Stories', count: collections.filter(c => c.type === 'STORYLINE').length },
    { value: 'mixed', label: 'Mixed Media', count: collections.filter(c => c.type === 'MIXED').length },
  ];

  return (
    <div className="h-full bg-gradient-to-br from-gray-50 to-white flex flex-col">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Title and Stats */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
                Story Collections
              </h1>
              <p className="text-gray-600 text-lg">Discover, collect, and trade unique digital stories and assets</p>
            </div>
            
                         <div className="flex items-center gap-6">
               <div className="text-center">
                 <div className="text-2xl font-bold text-gray-900">{getTotalAssets()}</div>
                 <div className="text-sm text-gray-500">Total Assets</div>
               </div>
               <div className="text-center">
                 <div className="text-2xl font-bold text-gray-900">{collections.filter(c => c.status === 'PUBLISHED' || c.status === 'REGISTERED').length}</div>
                 <div className="text-sm text-gray-500">Live Collections</div>
               </div>
             </div>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 relative max-w-md">
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search collections..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              />
            </div>
            
            <select
              value={libraryFilter}
              onChange={(e) => onFilterChange(e.target.value)}
              className="px-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[160px] shadow-sm"
            >
              {getFilterOptions().map(option => (
                <option key={option.value} value={option.value}>
                  {option.label} ({option.count})
                </option>
              ))}
            </select>

                         <select
               value={sortBy}
               onChange={(e) => setSortBy(e.target.value as any)}
               className="px-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[140px] shadow-sm"
             >
               <option value="recent">Recently Updated</option>
               <option value="items">Most Assets</option>
               <option value="name">Name A-Z</option>
             </select>
            
            <div className="flex items-center bg-white border border-gray-200 rounded-2xl p-1 shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-xl transition-colors ${
                  viewMode === 'grid' ? 'bg-blue-500 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-xl transition-colors ${
                  viewMode === 'list' ? 'bg-blue-500 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6">
          {filteredCollections.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {searchQuery ? 'No matching collections' : 'No collections yet'}
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {searchQuery ? 'Try adjusting your search or filters to find what you\'re looking for.' : 'Start creating assets to build your first collection and enter the marketplace.'}
              </p>
              {!searchQuery && (
                <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-semibold shadow-lg">
                  Create Your First Collection
                </button>
              )}
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
            }>
              {filteredCollections.map((collection) => (
                <CollectionCard
                  key={collection.id}
                  collection={collection}
                  onPublish={handlePublish}
                  onSelect={handleCollectionSelect}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white/80 backdrop-blur-sm border-t border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm text-gray-600">
          <div>
            Showing {filteredCollections.length} of {collections.length} collections
            {searchQuery && ` for "${searchQuery}"`}
          </div>
          <div className="flex items-center gap-6">
            <span>{collections.filter(c => c.status === 'PUBLISHED').length} published</span>
            <span>{collections.filter(c => c.status === 'REGISTERED').length} verified</span>
            <span>{collections.filter(c => c.verified).length} with blue checkmarks</span>
          </div>
        </div>
      </div>
    </div>
  );
}; 