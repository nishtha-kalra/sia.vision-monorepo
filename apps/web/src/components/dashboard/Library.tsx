"use client";
import React, { useState } from 'react';
import { CollectionCard, Collection } from './CollectionCard';

interface LibraryProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  libraryFilter: string;
  onFilterChange: (filter: string) => void;
  libraryAssets: any[]; // Keep for compatibility
}

export const Library: React.FC<LibraryProps> = ({
  searchQuery,
  onSearchChange,
  libraryFilter,
  onFilterChange,
}) => {
  const [collections, setCollections] = useState<Collection[]>([
    {
      id: 1,
      title: 'Cyberpunk Norse Saga',
      description: 'A complete universe blending Norse mythology with cyberpunk aesthetics. Features gods as AI entities and Asgard as a digital realm.',
      type: 'Storyworld',
      status: 'Published',
      thumbnail: 'https://placehold.co/400x300/6366F1/ffffff?text=Norse+Cyber',
      assetCount: 23,
      lastModified: '2 hours ago',
      publishedDate: '3 days ago',
      views: 1247,
      connections: 8
    },
    {
      id: 2,
      title: 'The Quantum Thieves',
      description: 'Elite characters who steal quantum states and probability outcomes. Each member has unique quantum manipulation abilities.',
      type: 'Character',
      status: 'Draft',
      thumbnail: 'https://placehold.co/400x300/8B5CF6/ffffff?text=Quantum+Team',
      assetCount: 15,
      lastModified: '1 day ago',
      views: 892,
      connections: 5
    },
    {
      id: 3,
      title: 'Mystic Artifacts Collection',
      description: 'Ancient relics with modern twists. Each artifact bridges the gap between magic and technology.',
      type: 'Artifact',
      status: 'Published',
      thumbnail: 'https://placehold.co/400x300/10B981/ffffff?text=Artifacts',
      assetCount: 8,
      lastModified: '3 days ago',
      publishedDate: '1 week ago',
      views: 634,
      connections: 12
    },
    {
      id: 4,
      title: 'The Great Convergence Lore',
      description: 'Historical events that shaped the multiverse. Chronicles of how different realities began intersecting.',
      type: 'Lore',
      status: 'Draft',
      thumbnail: 'https://placehold.co/400x300/F59E0B/ffffff?text=Convergence',
      assetCount: 31,
      lastModified: '5 hours ago',
      views: 445,
      connections: 7
    },
    {
      id: 5,
      title: 'Steampunk Academia',
      description: 'Victorian-era educational institution with mechanical marvels and steam-powered innovations.',
      type: 'Storyworld',
      status: 'Registered',
      thumbnail: 'https://placehold.co/400x300/8B5CF6/ffffff?text=Academy',
      assetCount: 19,
      lastModified: '1 week ago',
      views: 756,
      connections: 4
    },
    {
      id: 6,
      title: 'Digital Spirits Anthology',
      description: 'Ghost stories for the digital age. Spirits that inhabit networks, apps, and smart devices.',
      type: 'Mixed',
      status: 'Published',
      thumbnail: 'https://placehold.co/400x300/06B6D4/ffffff?text=Spirits',
      assetCount: 27,
      lastModified: '4 days ago',
      publishedDate: '2 weeks ago',
      views: 1893,
      connections: 15
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);

  const getFilteredCollections = () => {
    let filtered = collections;
    
    // Filter by type
    if (libraryFilter !== 'all') {
      filtered = filtered.filter(collection => 
        collection.type.toLowerCase() === libraryFilter.toLowerCase()
      );
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(collection =>
        collection.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        collection.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  };

  const handlePublish = (collection: Collection) => {
    setCollections(prev => prev.map(c => 
      c.id === collection.id 
        ? { ...c, status: 'Published' as const, publishedDate: 'Just now' }
        : c
    ));
    console.log('Published collection:', collection.title);
  };

  const handleEdit = (collection: Collection) => {
    console.log('Edit collection:', collection.title);
    // Here you would open an edit modal or navigate to editor
  };

  const handleView = (collection: Collection) => {
    console.log('View collection:', collection.title);
    // Here you would open detailed view or canvas
  };

  const handleCreateNew = () => {
    setShowCreateModal(true);
  };

  const getStatusCounts = () => {
    const all = collections.length;
    const published = collections.filter(c => c.status === 'Published').length;
    const drafts = collections.filter(c => c.status === 'Draft').length;
    return { all, published, drafts };
  };

  const statusCounts = getStatusCounts();
  const filteredCollections = getFilteredCollections();

  return (
    <>
      <div className="h-full overflow-y-auto bg-[#FAFBFC]">
        <div className="max-w-7xl mx-auto p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[#111827] mb-2">
                Collections Library
              </h1>
              <p className="text-[#6B7280]">
                Manage your story collections and publish them to the community
              </p>
            </div>
            <button
              onClick={handleCreateNew}
              className="flex items-center gap-2 px-6 py-3 bg-[#6366F1] hover:bg-[#5B5BD6] text-white rounded-xl font-medium transition-colors shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Collection
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 border border-[#E5E7EB]">
              <div className="text-2xl font-bold text-[#111827]">{statusCounts.all}</div>
              <div className="text-sm text-[#6B7280]">Total Collections</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-[#E5E7EB]">
              <div className="text-2xl font-bold text-[#10B981]">{statusCounts.published}</div>
              <div className="text-sm text-[#6B7280]">Published</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-[#E5E7EB]">
              <div className="text-2xl font-bold text-[#F59E0B]">{statusCounts.drafts}</div>
              <div className="text-sm text-[#6B7280]">Drafts</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-[#E5E7EB]">
              <div className="text-2xl font-bold text-[#6366F1]">
                {collections.reduce((sum, c) => sum + c.views, 0)}
              </div>
              <div className="text-sm text-[#6B7280]">Total Views</div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 mb-8">
            <div className="relative flex-1 max-w-md">
              <input
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                type="text"
                placeholder="Search collections..."
                className="w-full px-4 py-3 bg-white border border-[#E5E7EB] rounded-xl text-[#111827] placeholder-[#6B7280] focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1] focus:ring-opacity-20 shadow-sm"
              />
              <svg
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6B7280]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <select
              value={libraryFilter}
              onChange={(e) => onFilterChange(e.target.value)}
              className="px-4 py-3 bg-white border border-[#E5E7EB] rounded-xl text-[#111827] focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1] focus:ring-opacity-20 shadow-sm"
            >
              <option value="all">All Types</option>
              <option value="character">Characters</option>
              <option value="lore">Lore</option>
              <option value="artifact">Artifacts</option>
              <option value="storyworld">Storyworlds</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>

          {/* Collections Grid */}
          {filteredCollections.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCollections.map((collection) => (
                <CollectionCard
                  key={collection.id}
                  collection={collection}
                  onPublish={handlePublish}
                  onEdit={handleEdit}
                  onView={handleView}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-[#F3F4F6] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#9CA3AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-[#111827] mb-2">No collections found</h3>
              <p className="text-[#6B7280] mb-6">
                {searchQuery ? 'Try adjusting your search or filters' : 'Start creating your first collection'}
              </p>
              <button
                onClick={handleCreateNew}
                className="px-6 py-3 bg-[#6366F1] hover:bg-[#5B5BD6] text-white rounded-xl font-medium transition-colors"
              >
                Create Your First Collection
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create Collection Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-[#111827] mb-3">
              Create New Collection
            </h3>
            <p className="text-[#6B7280] mb-6">
              Collection creation wizard would be implemented here with forms for title, description, type, and initial assets.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#374151] rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 bg-[#6366F1] hover:bg-[#5B5BD6] text-white rounded-lg transition-colors"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}; 