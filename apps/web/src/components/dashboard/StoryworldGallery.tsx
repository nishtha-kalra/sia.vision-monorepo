"use client";
import React, { useState } from 'react';
import { Project } from './types';

interface StoryworldGalleryProps {
  onProjectSelect: (project: Project) => void;
  onCreateNew: () => void;
}

// Sample storyworld data (in real app, this would come from backend)
const sampleStoryworlds: Project[] = [
  {
    id: 'sw1',
    ownerId: 'user1',
    name: 'Cyberpunk Norse Saga',
    description: 'A futuristic reimagining of Norse mythology where gods exist as AI entities in a cyberpunk world.',
    coverImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=240&fit=crop',
    visibility: 'PRIVATE',
    createdAt: new Date('2024-06-01'),
    updatedAt: new Date('2024-06-08'),
    stats: {
      totalAssets: 23,
      characters: 8,
      storylines: 5,
      loreEntries: 10
    }
  },
  {
    id: 'sw2', 
    ownerId: 'user1',
    name: 'The Last Archive',
    description: 'In a post-apocalyptic world, librarians are the guardians of the last remaining knowledge.',
    coverImageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=240&fit=crop',
    visibility: 'PUBLIC',
    createdAt: new Date('2024-05-15'),
    updatedAt: new Date('2024-06-07'),
    stats: {
      totalAssets: 18,
      characters: 6,
      storylines: 7,
      loreEntries: 5
    }
  },
  {
    id: 'sw3',
    ownerId: 'user1', 
    name: 'Stellar Academy',
    description: 'Young cadets train at a space academy while uncovering an ancient alien conspiracy.',
    coverImageUrl: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=240&fit=crop',
    visibility: 'PRIVATE',
    createdAt: new Date('2024-04-20'),
    updatedAt: new Date('2024-06-05'),
    stats: {
      totalAssets: 15,
      characters: 4,
      storylines: 8,
      loreEntries: 3
    }
  }
];

export const StoryworldGallery = ({ onProjectSelect, onCreateNew }: StoryworldGalleryProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisibility, setFilterVisibility] = useState<'ALL' | 'PRIVATE' | 'PUBLIC'>('ALL');

  const filteredStoryworlds = sampleStoryworlds.filter(sw => {
    const matchesSearch = sw.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         sw.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterVisibility === 'ALL' || sw.visibility === filterVisibility;
    return matchesSearch && matchesFilter;
  });

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Updated today';
    if (diffDays <= 7) return `Updated ${diffDays} days ago`;
    return `Updated ${date.toLocaleDateString()}`;
  };

  return (
    <div className="h-full bg-[#FAFBFC] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E7EB] px-6 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[#111827] mb-2">Your Storyworlds</h1>
              <p className="text-[#6B7280] text-lg">Creative universes where your stories come to life</p>
            </div>
            <button
              onClick={onCreateNew}
              className="flex items-center gap-2 px-6 py-3 bg-[#6366F1] text-white rounded-lg hover:bg-[#5B5BD6] transition-colors font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Storyworld
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280] w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search storyworlds..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#6B7280]">Filter:</span>
              <select
                value={filterVisibility}
                onChange={(e) => setFilterVisibility(e.target.value as any)}
                className="px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
              >
                <option value="ALL">All</option>
                <option value="PRIVATE">Private</option>
                <option value="PUBLIC">Public</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Storyworld Grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-6">
          {filteredStoryworlds.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-[#F3F4F6] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#9CA3AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-[#111827] mb-2">
                {searchQuery ? 'No matching storyworlds' : 'No storyworlds yet'}
              </h3>
              <p className="text-[#6B7280] mb-4">
                {searchQuery ? 'Try adjusting your search or filters' : 'Create your first storyworld to get started'}
              </p>
              {!searchQuery && (
                <button
                  onClick={onCreateNew}
                  className="px-6 py-3 bg-[#6366F1] text-white rounded-lg hover:bg-[#5B5BD6] transition-colors"
                >
                  Create Your First Storyworld
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStoryworlds.map((storyworld) => (
                <div
                  key={storyworld.id}
                  onClick={() => onProjectSelect(storyworld)}
                  className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group"
                >
                  {/* Cover Image */}
                  <div className="relative h-48 bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] overflow-hidden">
                    {storyworld.coverImageUrl ? (
                      <img
                        src={storyworld.coverImageUrl}
                        alt={storyworld.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-4xl">
                        📚
                      </div>
                    )}
                    
                    {/* Visibility Badge */}
                    <div className="absolute top-3 right-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        storyworld.visibility === 'PUBLIC'
                          ? 'bg-[#10B981] text-white'
                          : 'bg-[#111827] text-white'
                      }`}>
                        {storyworld.visibility === 'PUBLIC' ? '🌍 Public' : '🔒 Private'}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-[#111827] mb-2 group-hover:text-[#6366F1] transition-colors">
                      {storyworld.name}
                    </h3>
                    <p className="text-[#6B7280] text-sm mb-4 line-clamp-2">
                      {storyworld.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-[#6B7280]">
                      <span>{formatDate(storyworld.updatedAt)}</span>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-[#10B981] rounded-full"></div>
                        <span>Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stats Footer */}
      <div className="bg-white border-t border-[#E5E7EB] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-[#6B7280]">
          <div>
            {filteredStoryworlds.length} storyworld{filteredStoryworlds.length !== 1 ? 's' : ''}
            {searchQuery && ` matching "${searchQuery}"`}
          </div>
          <div className="flex items-center gap-4">
            <span>Last updated: {sampleStoryworlds[0]?.updatedAt.toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}; 