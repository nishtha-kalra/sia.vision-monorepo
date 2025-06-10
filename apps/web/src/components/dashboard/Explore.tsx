"use client";
import React, { useState } from 'react';
import { Asset } from './types';

interface ExploreProps {
  onAssetSelect: (asset: Asset) => void;
  onLicenseAsset: (asset: Asset) => void;
}

interface PublicAsset extends Asset {
  creator: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  licensing: {
    type: 'free' | 'royalty' | 'fixed';
    terms: string;
    price?: string;
    royaltyPercentage?: number;
  };
  stats: {
    views: number;
    uses: number;
    likes: number;
  };
  tags: string[];
}

interface Bounty {
  id: string;
  title: string;
  description: string;
  creator: {
    name: string;
    avatar: string;
  };
  reward: {
    type: 'fixed' | 'royalty';
    amount: string;
  };
  deadline: Date;
  skills: string[];
  applicants: number;
  status: 'open' | 'in-progress' | 'completed';
}

// Sample public assets for demonstration
const samplePublicAssets: PublicAsset[] = [
  {
    id: 'pub1',
    ownerId: 'creator1',
    name: 'Zara the Cosmic Wanderer',
    parentId: null,
    projectId: 'space_odyssey',
    type: 'CHARACTER',
    content: {
      type: 'CHARACTER',
      description: 'A star-traveling merchant with ancient knowledge and mystical abilities.',
      traits: ['Wise', 'Mysterious', 'Resourceful'],
      tiptapJSON: {}
    },
    visibility: 'PUBLIC',
    ipStatus: 'REGISTERED',
    createdAt: new Date('2024-05-15'),
    updatedAt: new Date('2024-06-01'),
    creator: {
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1d0?w=64&h=64&fit=crop&crop=face',
      verified: true
    },
    licensing: {
      type: 'royalty',
      terms: 'Can be used in any non-commercial story. Commercial use requires 5% royalty.',
      royaltyPercentage: 5
    },
    stats: {
      views: 1240,
      uses: 23,
      likes: 156
    },
    tags: ['sci-fi', 'character', 'mysterious', 'space-travel']
  },
  {
    id: 'pub2',
    ownerId: 'creator2',
    name: 'The Crystal Archives',
    parentId: null,
    projectId: 'fantasy_realm',
    type: 'LORE',
    content: {
      type: 'LORE',
      description: 'Ancient magical library where knowledge is stored in living crystals.',
      significance: 'Central location for magical research and forbidden knowledge.',
      tiptapJSON: {}
    },
    visibility: 'PUBLIC',
    ipStatus: 'REGISTERED',
    createdAt: new Date('2024-04-20'),
    updatedAt: new Date('2024-05-28'),
    creator: {
      name: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face',
      verified: false
    },
    licensing: {
      type: 'fixed',
      terms: 'One-time license fee for unlimited use in your storyworld.',
      price: '0.05 ETH'
    },
    stats: {
      views: 890,
      uses: 12,
      likes: 78
    },
    tags: ['fantasy', 'lore', 'magic', 'library', 'crystals']
  },
  {
    id: 'pub3',
    ownerId: 'creator3',
    name: 'Neon Samurai Concept',
    parentId: null,
    projectId: 'cyberpunk_tales',
    type: 'IMAGE',
    content: {
      type: 'IMAGE',
      url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      altText: 'Futuristic samurai in neon-lit cityscape',
      caption: 'Cyberpunk warrior blending traditional honor with high-tech combat'
    },
    visibility: 'PUBLIC',
    ipStatus: 'REGISTERED',
    createdAt: new Date('2024-06-05'),
    updatedAt: new Date('2024-06-07'),
    creator: {
      name: 'Kenji Tanaka',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face',
      verified: true
    },
    licensing: {
      type: 'free',
      terms: 'Free to use with attribution. Commercial use allowed.'
    },
    stats: {
      views: 2100,
      uses: 45,
      likes: 312
    },
    tags: ['cyberpunk', 'art', 'samurai', 'concept-art', 'sci-fi']
  }
];

// Sample bounties
const sampleBounties: Bounty[] = [
  {
    id: 'bounty1',
    title: 'Character Art for Space Opera',
    description: 'Need professional character artwork for three alien species in my galactic empire series. Looking for realistic style with attention to cultural details.',
    creator: {
      name: 'Maria Santos',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face'
    },
    reward: {
      type: 'fixed',
      amount: '0.2 ETH'
    },
    deadline: new Date('2024-07-15'),
    skills: ['Digital Art', 'Character Design', 'Sci-Fi'],
    applicants: 7,
    status: 'open'
  },
  {
    id: 'bounty2',
    title: 'World-building Lore Writer',
    description: 'Seeking a writer to develop detailed lore for a steampunk fantasy world. Must include economic systems, political structures, and cultural traditions.',
    creator: {
      name: 'Thomas Wright',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face'
    },
    reward: {
      type: 'royalty',
      amount: '10% of story revenues'
    },
    deadline: new Date('2024-08-01'),
    skills: ['Creative Writing', 'World-building', 'Fantasy'],
    applicants: 12,
    status: 'open'
  }
];

const AssetCard = ({ 
  asset, 
  onSelect, 
  onLicense 
}: { 
  asset: PublicAsset; 
  onSelect: (asset: Asset) => void;
  onLicense: (asset: Asset) => void;
}) => {
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

  const getLicenseColor = () => {
    switch (asset.licensing.type) {
      case 'free': return 'bg-[#10B981]/10 text-[#10B981]';
      case 'fixed': return 'bg-[#6366F1]/10 text-[#6366F1]';
      case 'royalty': return 'bg-[#F59E0B]/10 text-[#F59E0B]';
      default: return 'bg-[#6B7280]/10 text-[#6B7280]';
    }
  };

  const getLicenseText = () => {
    switch (asset.licensing.type) {
      case 'free': return 'Free to Use';
      case 'fixed': return `${asset.licensing.price}`;
      case 'royalty': return `${asset.licensing.royaltyPercentage}% Royalty`;
      default: return 'Licensed';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden hover:shadow-lg transition-all duration-200 group">
      {/* Asset Preview */}
      {asset.type === 'IMAGE' && asset.content.type === 'IMAGE' && (
        <div className="h-48 bg-gray-100 overflow-hidden">
          <img
            src={asset.content.url}
            alt={asset.content.altText}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      {asset.type !== 'IMAGE' && (
        <div className="h-48 bg-gradient-to-br from-[#F8FAFC] to-[#E2E8F0] flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-2">{getAssetIcon()}</div>
            <div className="text-sm font-medium text-[#6B7280]">{asset.type}</div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-[#111827] mb-1">{asset.name}</h3>
            <p className="text-sm text-[#6B7280] line-clamp-2">
              {asset.content.type === 'CHARACTER' ? asset.content.description :
               asset.content.type === 'LORE' ? asset.content.description :
               asset.content.type === 'IMAGE' ? asset.content.caption : 'Asset description'}
            </p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLicenseColor()}`}>
            {getLicenseText()}
          </span>
        </div>

        {/* Creator info */}
        <div className="flex items-center gap-2 mb-3">
          <img
            src={asset.creator.avatar}
            alt={asset.creator.name}
            className="w-6 h-6 rounded-full"
          />
          <span className="text-sm text-[#6B7280]">{asset.creator.name}</span>
          {asset.creator.verified && (
            <svg className="w-4 h-4 text-[#6366F1]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {asset.tags.slice(0, 3).map(tag => (
            <span key={tag} className="px-2 py-1 bg-[#F3F4F6] text-[#6B7280] text-xs rounded">
              #{tag}
            </span>
          ))}
          {asset.tags.length > 3 && (
            <span className="px-2 py-1 bg-[#F3F4F6] text-[#6B7280] text-xs rounded">
              +{asset.tags.length - 3} more
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-[#6B7280] mb-3">
          <div className="flex items-center gap-3">
            <span>{asset.stats.views} views</span>
            <span>{asset.stats.uses} uses</span>
            <span>{asset.stats.likes} likes</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onSelect(asset)}
            className="flex-1 px-3 py-2 text-[#6366F1] hover:bg-[#6366F1]/10 rounded-lg text-sm font-medium transition-colors"
          >
            View Details
          </button>
          <button
            onClick={() => onLicense(asset)}
            className="px-4 py-2 bg-[#6366F1] text-white hover:bg-[#5B5BD6] rounded-lg text-sm font-medium transition-colors"
          >
            {asset.licensing.type === 'free' ? 'Use Asset' : 'License'}
          </button>
        </div>
      </div>
    </div>
  );
};

const BountyCard = ({ bounty }: { bounty: Bounty }) => {
  const getStatusColor = () => {
    switch (bounty.status) {
      case 'open': return 'bg-[#10B981]/10 text-[#10B981]';
      case 'in-progress': return 'bg-[#F59E0B]/10 text-[#F59E0B]';
      case 'completed': return 'bg-[#6B7280]/10 text-[#6B7280]';
      default: return 'bg-[#6B7280]/10 text-[#6B7280]';
    }
  };

  const daysLeft = Math.ceil((bounty.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-[#111827] mb-2">{bounty.title}</h3>
          <p className="text-sm text-[#6B7280] line-clamp-3">{bounty.description}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
          {bounty.status.replace('-', ' ').toUpperCase()}
        </span>
      </div>

      {/* Creator and reward */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <img
            src={bounty.creator.avatar}
            alt={bounty.creator.name}
            className="w-8 h-8 rounded-full"
          />
          <span className="text-sm text-[#6B7280]">{bounty.creator.name}</span>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-[#111827]">{bounty.reward.amount}</div>
          <div className="text-xs text-[#6B7280]">{bounty.reward.type} reward</div>
        </div>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-1 mb-4">
        {bounty.skills.map(skill => (
          <span key={skill} className="px-2 py-1 bg-[#6366F1]/10 text-[#6366F1] text-xs rounded font-medium">
            {skill}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-sm text-[#6B7280]">
        <span>{bounty.applicants} applicants</span>
        <span>{daysLeft > 0 ? `${daysLeft} days left` : 'Deadline passed'}</span>
      </div>
    </div>
  );
};

export const Explore = ({ onAssetSelect, onLicenseAsset }: ExploreProps) => {
  const [activeTab, setActiveTab] = useState<'discover' | 'bounties'>('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'trending' | 'recent' | 'popular'>('trending');

  const filteredAssets = samplePublicAssets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         asset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = selectedFilter === 'all' || asset.type.toLowerCase() === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const filterOptions = [
    { value: 'all', label: 'All Assets', count: samplePublicAssets.length },
    { value: 'character', label: 'Characters', count: samplePublicAssets.filter(a => a.type === 'CHARACTER').length },
    { value: 'lore', label: 'Lore', count: samplePublicAssets.filter(a => a.type === 'LORE').length },
    { value: 'image', label: 'Art', count: samplePublicAssets.filter(a => a.type === 'IMAGE').length },
    { value: 'storyline', label: 'Stories', count: samplePublicAssets.filter(a => a.type === 'STORYLINE').length },
  ];

  return (
    <div className="h-full bg-gradient-to-br from-gray-50 to-white flex flex-col">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
                Explore Community
              </h1>
              <p className="text-gray-600 text-lg">Discover, license, and collaborate on amazing creative assets</p>
            </div>
            
            {/* Tab Toggle */}
            <div className="flex items-center bg-white border border-gray-200 rounded-2xl p-1 shadow-sm">
              <button
                onClick={() => setActiveTab('discover')}
                className={`px-6 py-2 rounded-xl transition-colors text-sm font-medium ${
                  activeTab === 'discover' 
                    ? 'bg-blue-500 text-white shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                🌍 Discover Assets
              </button>
              <button
                onClick={() => setActiveTab('bounties')}
                className={`px-6 py-2 rounded-xl transition-colors text-sm font-medium ${
                  activeTab === 'bounties' 
                    ? 'bg-blue-500 text-white shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                💰 Bounties ({sampleBounties.length})
              </button>
            </div>
          </div>

          {/* Controls */}
          {activeTab === 'discover' && (
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="flex-1 relative max-w-md">
                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search assets, creators, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                />
              </div>

              {/* Filters */}
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[140px] shadow-sm"
              >
                {filterOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label} ({option.count})
                  </option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[140px] shadow-sm"
              >
                <option value="trending">Trending</option>
                <option value="recent">Most Recent</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6">
          {activeTab === 'discover' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAssets.map((asset) => (
                <AssetCard
                  key={asset.id}
                  asset={asset}
                  onSelect={onAssetSelect}
                  onLicense={onLicenseAsset}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {sampleBounties.map((bounty) => (
                  <BountyCard key={bounty.id} bounty={bounty} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 