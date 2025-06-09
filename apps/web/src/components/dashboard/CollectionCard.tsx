"use client";
import React, { useState } from 'react';

export interface Collection {
  id: number;
  title: string;
  description: string;
  type: 'Character' | 'Lore' | 'Artifact' | 'Storyworld' | 'Mixed';
  status: 'Draft' | 'Published' | 'Registered';
  thumbnail: string;
  assetCount: number;
  lastModified: string;
  views: number;
  connections: number;
  publishedDate?: string;
}

interface CollectionCardProps {
  collection: Collection;
  onPublish: (collection: Collection) => void;
  onEdit: (collection: Collection) => void;
  onView: (collection: Collection) => void;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({
  collection,
  onPublish,
  onEdit,
  onView,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);

  const getStatusConfig = (status: string) => {
    switch(status) {
      case 'Draft':
        return {
          color: 'bg-[#FEF3C7] text-[#92400E]',
          icon: '📝',
          action: 'Publish'
        };
      case 'Published':
        return {
          color: 'bg-[#D1FAE5] text-[#065F46]',
          icon: '✅',
          action: 'Update'
        };
      case 'Registered':
        return {
          color: 'bg-[#DBEAFE] text-[#1E40AF]',
          icon: '🔗',
          action: 'View'
        };
      default:
        return {
          color: 'bg-[#F3F4F6] text-[#374151]',
          icon: '📄',
          action: 'Edit'
        };
    }
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'Character': return '👤';
      case 'Lore': return '📚';
      case 'Artifact': return '⚔️';
      case 'Storyworld': return '🌍';
      default: return '📦';
    }
  };

  const statusConfig = getStatusConfig(collection.status);

  const handlePublish = () => {
    setShowPublishModal(true);
  };

  const confirmPublish = () => {
    onPublish(collection);
    setShowPublishModal(false);
  };

  return (
    <>
      <article 
        className="relative bg-white rounded-2xl border border-[#E5E7EB] hover:border-[#D1D5DB] transition-all duration-300 hover:shadow-lg overflow-hidden cursor-pointer group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => onView(collection)}
      >
        {/* Header Navigation */}
        <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getTypeIcon(collection.type)}</span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
              {statusConfig.icon} {collection.status}
            </span>
          </div>
          {isHovered && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(collection);
              }}
              className="bg-white/90 backdrop-blur-sm border border-[#E5E7EB] rounded-full p-2 hover:bg-white transition-all duration-200"
            >
              <svg className="w-4 h-4 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          )}
        </div>

        {/* Image Preview */}
        <div className="relative h-48 bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] overflow-hidden">
          <img
            src={collection.thumbnail}
            alt={collection.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title and Description */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-[#111827] mb-2 line-clamp-2">
              {collection.title}
            </h3>
            <p className="text-sm text-[#6B7280] line-clamp-2 leading-relaxed">
              {collection.description}
            </p>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 mb-4 text-xs text-[#6B7280]">
            <div className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span>{collection.assetCount} assets</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>{collection.views} views</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <span>{collection.connections} links</span>
            </div>
          </div>

          {/* Metadata */}
          <div className="flex items-center justify-between text-xs text-[#9CA3AF] mb-4">
            <span>Modified {collection.lastModified}</span>
            {collection.publishedDate && (
              <span>Published {collection.publishedDate}</span>
            )}
          </div>

          {/* Action Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (collection.status === 'Draft') {
                handlePublish();
              } else {
                onView(collection);
              }
            }}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
              collection.status === 'Draft'
                ? 'bg-[#6366F1] hover:bg-[#5B5BD6] text-white shadow-sm'
                : collection.status === 'Published'
                ? 'bg-[#10B981] hover:bg-[#059669] text-white shadow-sm'
                : 'bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#6B7280] border border-[#E5E7EB]'
            }`}
          >
            {collection.status === 'Draft' && (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            )}
            {collection.status === 'Published' && (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
            <span>{statusConfig.action}</span>
          </button>
        </div>
      </article>

      {/* Publish Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-[#111827] mb-3">
              Publish Collection
            </h3>
            <p className="text-[#6B7280] mb-6">
              Are you ready to publish &#34;{collection.title}&#34;? This will make it available to the community.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowPublishModal(false)}
                className="flex-1 px-4 py-2 bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#374151] rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmPublish}
                className="flex-1 px-4 py-2 bg-[#6366F1] hover:bg-[#5B5BD6] text-white rounded-lg transition-colors"
              >
                Publish
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}; 