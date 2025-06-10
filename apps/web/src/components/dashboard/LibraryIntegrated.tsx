"use client";
import React, { useState, useEffect } from 'react';
import { Asset, Storyworld, AssetType } from '@/types';
import { useFirebaseFunctions } from '@/hooks/useFirebaseFunctions';
import { useUser } from '@/hooks/useUser';

interface LibraryIntegratedProps {
  onAssetSelect: (asset: Asset) => void;
  onStoryworldSelect: (storyworld: Storyworld) => void;
  onCreateStoryline?: (storyworldId: string) => void;
}

// StoryworldHub Integrated Component
const StoryworldHubIntegrated = ({
  storyworld,
  assets,
  onBack,
  onCreateAsset,
  onAssetSelect,
  onViewAssets,
  handleAssetClick
}: {
  storyworld: Storyworld;
  assets: Asset[];
  onBack: () => void;
  onCreateAsset: (assetType: AssetType) => void;
  onAssetSelect: (asset: Asset) => void;
  onViewAssets: () => void;
  handleAssetClick: (asset: Asset) => void;
}) => {
  const getAssetsByType = (type: AssetType) => {
    return assets.filter(asset => asset.type === type);
  };

  const characterAssets = getAssetsByType('CHARACTER');
  const loreAssets = getAssetsByType('LORE');
  const storylineAssets = getAssetsByType('STORYLINE');
  const mediaAssets = assets.filter(asset => ['IMAGE', 'VIDEO', 'AUDIO'].includes(asset.type));

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
              {storyworld.coverImageUrl ? (
                <img
                  src={storyworld.coverImageUrl}
                  alt={storyworld.name}
                  className="w-12 h-12 rounded-xl object-cover"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] rounded-xl flex items-center justify-center">
                  <span className="text-2xl text-white/80">📚</span>
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-[#111827]">{storyworld.name}</h1>
                <p className="text-[#6B7280]">{storyworld.description}</p>
              </div>
            </div>
          </div>

          {/* Action buttons and stats */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onViewAssets}
                className="px-4 py-2 text-[#6B7280] hover:text-[#111827] border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors text-sm font-medium"
              >
                View All Assets
              </button>
              <button className="px-4 py-2 text-[#6B7280] hover:text-[#111827] border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors text-sm font-medium">
                Share Storyworld
              </button>
            </div>
            
            <div className="flex items-center gap-6">
              {/* Stats */}
              <div className="flex items-center gap-6 text-sm text-[#6B7280]">
                <div className="text-center">
                  <div className="text-lg font-bold text-[#111827]">{assets.length}</div>
                  <div>Total Assets</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-[#111827]">{characterAssets.length}</div>
                  <div>Characters</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-[#111827]">{storylineAssets.length}</div>
                  <div>Storylines</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-[#111827]">{mediaAssets.length}</div>
                  <div>Media</div>
                </div>
              </div>
              
              <button
                onClick={() => onCreateAsset('STORYLINE')}
                className="flex items-center gap-2 px-6 py-3 bg-[#6366F1] text-white rounded-xl hover:bg-[#5B5BD6] transition-colors font-medium shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Storyline
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => onCreateAsset('STORYLINE')}
            className="p-6 bg-white rounded-xl border border-[#E5E7EB] hover:shadow-lg transition-all duration-200 text-left group"
          >
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">📖</div>
            <h3 className="font-semibold text-[#111827] mb-1">Create Storyline</h3>
            <p className="text-sm text-[#6B7280]">Write and structure your narrative</p>
          </button>
          
          <button
            onClick={() => onCreateAsset('CHARACTER')}
            className="p-6 bg-white rounded-xl border border-[#E5E7EB] hover:shadow-lg transition-all duration-200 text-left group"
          >
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">👤</div>
            <h3 className="font-semibold text-[#111827] mb-1">Create Character</h3>
            <p className="text-sm text-[#6B7280]">Design memorable personas</p>
          </button>
          
          <button
            onClick={() => onCreateAsset('LORE')}
            className="p-6 bg-white rounded-xl border border-[#E5E7EB] hover:shadow-lg transition-all duration-200 text-left group"
          >
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">📜</div>
            <h3 className="font-semibold text-[#111827] mb-1">Add Lore</h3>
            <p className="text-sm text-[#6B7280]">Build your world's history</p>
          </button>
          
          <button
            onClick={onViewAssets}
            className="p-6 bg-white rounded-xl border border-[#E5E7EB] hover:shadow-lg transition-all duration-200 text-left group"
          >
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">🎨</div>
            <h3 className="font-semibold text-[#111827] mb-1">Upload Media</h3>
            <p className="text-sm text-[#6B7280]">Add images, videos & audio</p>
          </button>
        </div>

        {/* Characters Section */}
        {characterAssets.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#111827]">Characters</h3>
              <button 
                onClick={() => onCreateAsset('CHARACTER')}
                className="text-[#6366F1] hover:text-[#5B5BD6] text-sm font-medium"
              >
                Create New
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {characterAssets.map((character) => (
                <div
                  key={character.id}
                  onClick={() => handleAssetClick(character)}
                  className="bg-white rounded-xl border border-[#E5E7EB] p-4 hover:shadow-lg transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-[#6366F1] rounded-full flex items-center justify-center text-white font-bold">
                      {character.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-medium text-[#111827]">{character.name}</h4>
                      <p className="text-sm text-[#6B7280]">Character</p>
                    </div>
                  </div>
                  {character.description && (
                    <p className="text-sm text-[#6B7280] line-clamp-2">{character.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Storylines Section */}
        {storylineAssets.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#111827]">Storylines</h3>
              <button 
                onClick={() => onCreateAsset('STORYLINE')}
                className="text-[#6366F1] hover:text-[#5B5BD6] text-sm font-medium"
              >
                Create New
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {storylineAssets.map((storyline) => (
                <div
                  key={storyline.id}
                  onClick={() => handleAssetClick(storyline)}
                  className="bg-white rounded-xl border border-[#E5E7EB] p-4 hover:shadow-lg transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">📖</span>
                    <h4 className="font-medium text-[#111827]">{storyline.name}</h4>
                  </div>
                  {storyline.description && (
                    <p className="text-sm text-[#6B7280] line-clamp-2 mb-3">{storyline.description}</p>
                  )}
                  <div className="flex justify-between text-xs text-[#6B7280]">
                    <span>{storyline.status}</span>
                    <span>{storyline.ipStatus}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lore Section */}
        {loreAssets.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#111827]">Lore & World-building</h3>
              <button 
                onClick={() => onCreateAsset('LORE')}
                className="text-[#6366F1] hover:text-[#5B5BD6] text-sm font-medium"
              >
                Add Entry
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {loreAssets.map((lore) => (
                <div
                  key={lore.id}
                  onClick={() => handleAssetClick(lore)}
                  className="bg-white rounded-xl border border-[#E5E7EB] p-4 hover:shadow-lg transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">📜</span>
                    <h4 className="font-medium text-[#111827]">{lore.name}</h4>
                  </div>
                  {lore.description && (
                    <p className="text-sm text-[#6B7280] line-clamp-2">{lore.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Media Gallery */}
        {mediaAssets.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#111827]">Media Gallery</h3>
              <button 
                onClick={onViewAssets}
                className="text-[#6366F1] hover:text-[#5B5BD6] text-sm font-medium"
              >
                View All Media
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {mediaAssets.slice(0, 6).map((media) => (
                <div
                  key={media.id}
                  onClick={() => handleAssetClick(media)}
                  className="aspect-square bg-[#F3F4F6] rounded-xl border border-[#E5E7EB] overflow-hidden hover:shadow-md transition-all cursor-pointer"
                >
                  {media.mediaUrl ? (
                    media.type === 'IMAGE' ? (
                      <img
                        src={media.mediaUrl}
                        alt={media.name}
                        className="w-full h-full object-cover"
                      />
                    ) : media.type === 'VIDEO' ? (
                      <video
                        src={media.mediaUrl}
                        className="w-full h-full object-cover"
                        muted
                        preload="metadata"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">
                        🎵
                      </div>
                    )
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl text-[#6B7280]">
                      🎨
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State for New Storyworlds */}
        {assets.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🌟</div>
            <h3 className="text-xl font-semibold text-[#111827] mb-2">
              Ready to bring {storyworld.name} to life?
            </h3>
            <p className="text-[#6B7280] mb-6 max-w-md mx-auto">
              Start by creating your first storyline, character, or uploading media to build your creative universe.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => onCreateAsset('STORYLINE')}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white rounded-xl hover:from-[#5B5BD6] hover:to-[#7C3AED] transition-all duration-200 font-medium shadow-lg"
              >
                📖 Create Storyline
              </button>
              <button
                onClick={onViewAssets}
                className="inline-flex items-center px-6 py-3 bg-white text-[#6366F1] border border-[#6366F1] rounded-xl hover:bg-[#6366F1] hover:text-white transition-all duration-200 font-medium"
              >
                🎨 Upload Media
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Create Storyworld Modal Component
const CreateStoryworldModal = ({ 
  isOpen, 
  onClose, 
  onSubmit 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSubmit: (data: { name: string; description: string }) => void; 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Storyworld name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        name: formData.name.trim(),
        description: formData.description.trim()
      });
      
      // Reset form
      setFormData({ name: '', description: '' });
      setErrors({});
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-white">📚</span>
          </div>
          <h2 className="text-2xl font-bold text-[#111827] mb-2">Create New Storyworld</h2>
          <p className="text-[#6B7280]">Start building your creative universe. You can add a cover image and assets later.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-[#111827] mb-2">
              Storyworld Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="e.g., Cyberpunk Chronicles, Fantasy Realm..."
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent transition-all ${
                errors.name ? 'border-red-500' : 'border-[#E5E7EB]'
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-sm font-medium text-[#111827] mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe your world, its themes, and what makes it unique..."
              rows={4}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent transition-all resize-none ${
                errors.description ? 'border-red-500' : 'border-[#E5E7EB]'
              }`}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
            <p className="text-xs text-[#6B7280] mt-1">
              {formData.description.length}/500 characters
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-[#F3F4F6] text-[#6B7280] rounded-xl hover:bg-[#E5E7EB] transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white rounded-xl hover:from-[#5B5BD6] hover:to-[#7C3AED] transition-all duration-200 font-medium shadow-lg"
            >
              Create Storyworld
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Enhanced File Upload Component
const MediaUploadZone = ({ 
  onFileUpload, 
  uploading, 
  storyworldName 
}: { 
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  uploading: boolean;
  storyworldName: string;
}) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Create a synthetic event to match the expected interface
      const syntheticEvent = {
        target: {
          files: e.dataTransfer.files,
          value: ''
        }
      } as React.ChangeEvent<HTMLInputElement>;
      onFileUpload(syntheticEvent);
    }
  };

  return (
    <div 
      className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-200 ${
        dragActive 
          ? 'border-[#6366F1] bg-[#6366F1]/5' 
          : 'border-[#CBD5E1] bg-[#F8FAFC]'
      } ${uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-[#6366F1] hover:bg-[#6366F1]/5'}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <div className="text-center">
        <div className="text-6xl mb-4">
          {uploading ? '⏳' : dragActive ? '📥' : '📤'}
        </div>
        <h3 className="text-xl font-semibold text-[#111827] mb-2">
          {uploading ? 'Uploading Media...' : 'Upload Media Files'}
        </h3>
        <p className="text-[#6B7280] mb-4">
          {uploading 
            ? 'Processing your files and adding them to Firebase Storage'
            : `Add videos, images, and audio files to "${storyworldName}"`
          }
        </p>
        
        {!uploading && (
          <>
            <label className="inline-flex items-center px-6 py-3 bg-[#6366F1] text-white rounded-xl hover:bg-[#5B5BD6] transition-colors cursor-pointer font-medium mb-4">
              <span className="mr-2">📁</span>
              Choose Files
              <input
                type="file"
                multiple
                accept="image/*,video/*,audio/*"
                onChange={onFileUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
            
            <div className="text-xs text-[#6B7280] space-y-1">
              <p>Or drag and drop files here</p>
              <p>Supports: JPG, PNG, GIF, MP4, MOV, WAV, MP3</p>
              <p>Max size: 50MB for videos, 10MB for images/audio</p>
            </div>
          </>
        )}

        {uploading && (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6366F1]"></div>
          </div>
        )}
      </div>
    </div>
  );
};

const LibraryIntegrated: React.FC<LibraryIntegratedProps> = ({
  onAssetSelect,
  onStoryworldSelect,
  onCreateStoryline
}) => {
  const { authUser } = useUser();
  const {
    getUserStoryworlds,
    createStoryworld,
    getStoryworldAssets,
    uploadMultipleAssets,
    uploadMediaAsset,
    createTextAsset,
    uploading,
    uploadProgress,
    clearUploadProgress
  } = useFirebaseFunctions();

  const [storyworlds, setStoryworlds] = useState<Storyworld[]>([]);
  const [selectedStoryworld, setSelectedStoryworld] = useState<Storyworld | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'storyworlds' | 'hub' | 'assets' | 'preview'>('storyworlds');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [previewAsset, setPreviewAsset] = useState<Asset | null>(null);

  // Load user's storyworlds on mount
  useEffect(() => {
    if (authUser) {
      loadStoryworlds();
    }
  }, [authUser]);

  // Load assets when storyworld is selected
  useEffect(() => {
    if (selectedStoryworld) {
      loadAssets(selectedStoryworld.id);
    }
  }, [selectedStoryworld]);

  const loadStoryworlds = async () => {
    try {
      setLoading(true);
      const result = await getUserStoryworlds();
      setStoryworlds(result.storyworlds);
    } catch (error) {
      console.error('Error loading storyworlds:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAssets = async (storyworldId: string) => {
    try {
      setLoading(true);
      const result = await getStoryworldAssets({ storyworldId });
      setAssets(result.assets);
    } catch (error) {
      console.error('Error loading assets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStoryworld = async (data: { name: string; description: string }) => {
    try {
      setLoading(true);
      const result = await createStoryworld(data);
      
      // Reload storyworlds to include the new one
      await loadStoryworlds();
      
      // Find and select the new storyworld
      const newStoryworld = storyworlds.find(sw => sw.name === data.name) || 
        { id: result.storyworldId, name: data.name, description: data.description } as Storyworld;
      
      setSelectedStoryworld(newStoryworld);
      setViewMode('hub');
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating storyworld:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !selectedStoryworld) return;

    const fileArray = Array.from(files);
    
    try {
      await uploadMultipleAssets(
        fileArray,
        selectedStoryworld.id,
        (fileName, progress, status) => {
          console.log(`${fileName}: ${progress}% (${status})`);
        },
        (results) => {
          console.log('Upload batch complete:', results);
          // Reload assets to show the new uploads
          loadAssets(selectedStoryworld.id);
        }
      );
    } catch (error) {
      console.error('Error uploading files:', error);
    }
    
    // Clear the input
    event.target.value = '';
  };

  const getAssetTypeIcon = (type: AssetType) => {
    switch (type) {
      case 'CHARACTER': return '👤';
      case 'STORYLINE': return '📖';
      case 'LORE': return '📜';
      case 'IMAGE': return '🖼️';
      case 'VIDEO': return '🎬';
      case 'AUDIO': return '🎵';
      default: return '📄';
    }
  };

  const getStoryworldIcon = (name: string) => {
    // Generate an icon based on storyworld name/theme
    const lowerName = name.toLowerCase();
    
    if (lowerName.includes('space') || lowerName.includes('star') || lowerName.includes('cosmic')) {
      return '🌌';
    } else if (lowerName.includes('fantasy') || lowerName.includes('magic') || lowerName.includes('dragon')) {
      return '🐉';
    } else if (lowerName.includes('cyber') || lowerName.includes('tech') || lowerName.includes('future')) {
      return '🤖';
    } else if (lowerName.includes('ocean') || lowerName.includes('sea') || lowerName.includes('water')) {
      return '🌊';
    } else if (lowerName.includes('forest') || lowerName.includes('nature') || lowerName.includes('wild')) {
      return '🌲';
    } else if (lowerName.includes('desert') || lowerName.includes('sand') || lowerName.includes('dune')) {
      return '🏜️';
    } else if (lowerName.includes('city') || lowerName.includes('urban') || lowerName.includes('metro')) {
      return '🌆';
    } else if (lowerName.includes('war') || lowerName.includes('battle') || lowerName.includes('conflict')) {
      return '⚔️';
    } else if (lowerName.includes('mystery') || lowerName.includes('secret') || lowerName.includes('hidden')) {
      return '🔍';
    } else if (lowerName.includes('love') || lowerName.includes('romance') || lowerName.includes('heart')) {
      return '💝';
    } else {
      // Default icons based on first letter
      const firstLetter = name.charAt(0).toUpperCase();
      const iconMap: { [key: string]: string } = {
        'A': '🌟', 'B': '📚', 'C': '🎭', 'D': '🎲', 'E': '🌍', 'F': '🔥',
        'G': '💎', 'H': '🏰', 'I': '🗡️', 'J': '🃏', 'K': '👑', 'L': '🌙',
        'M': '🎪', 'N': '🌙', 'O': '🔮', 'P': '🎨', 'Q': '👸', 'R': '🚀',
        'S': '⭐', 'T': '🎯', 'U': '🦄', 'V': '🌋', 'W': '🌎', 'X': '❌',
        'Y': '🌟', 'Z': '⚡'
      };
      return iconMap[firstLetter] || '📖';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Handle asset click - differentiate between media and text assets
  const handleAssetClick = (asset: Asset) => {
    const isMediaAsset = ['IMAGE', 'VIDEO', 'AUDIO'].includes(asset.type);
    
    if (isMediaAsset) {
      // Show media preview modal
      setPreviewAsset(asset);
      setViewMode('preview');
    } else {
      // Open text assets in Canvas
      onAssetSelect(asset);
    }
  };

  // Media Preview Modal Component (inside main component for scope)
  const MediaPreviewModal = ({ 
    asset, 
    isOpen, 
    onClose 
  }: { 
    asset: Asset | null; 
    isOpen: boolean; 
    onClose: () => void; 
  }) => {
    if (!isOpen || !asset) return null;

    const isMediaAsset = ['IMAGE', 'VIDEO', 'AUDIO'].includes(asset.type);
    
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-4xl max-h-[90vh] w-full overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#E5E7EB]">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{getAssetTypeIcon(asset.type)}</span>
              <div>
                <h3 className="text-xl font-bold text-[#111827]">{asset.name}</h3>
                <p className="text-sm text-[#6B7280]">{asset.type} • {asset.status}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {isMediaAsset && asset.mediaUrl ? (
              <div className="space-y-4">
                {/* Media Display */}
                <div className="flex justify-center bg-[#F8FAFC] rounded-xl p-6">
                  {asset.type === 'IMAGE' && (
                    <img
                      src={asset.mediaUrl}
                      alt={asset.name}
                      className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-lg"
                    />
                  )}
                  {asset.type === 'VIDEO' && (
                    <video
                      src={asset.mediaUrl}
                      controls
                      className="max-w-full max-h-[60vh] rounded-lg shadow-lg"
                    >
                      Your browser does not support the video tag.
                    </video>
                  )}
                  {asset.type === 'AUDIO' && (
                    <div className="w-full max-w-md">
                      <div className="text-center mb-4">
                        <div className="text-6xl mb-2">🎵</div>
                        <h4 className="text-lg font-medium text-[#111827]">{asset.name}</h4>
                      </div>
                      <audio
                        src={asset.mediaUrl}
                        controls
                        className="w-full"
                      >
                        Your browser does not support the audio tag.
                      </audio>
                    </div>
                  )}
                </div>
                
                {/* Asset Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="bg-[#F8FAFC] rounded-lg p-4">
                    <h4 className="font-medium text-[#111827] mb-2">File Details</h4>
                    <div className="space-y-1 text-sm text-[#6B7280]">
                      <div>Size: {asset.fileSize && formatFileSize(asset.fileSize)}</div>
                      <div>Type: {asset.mimeType}</div>
                      <div>Created: {asset.createdAt && new Date(asset.createdAt.seconds * 1000).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="bg-[#F8FAFC] rounded-lg p-4">
                    <h4 className="font-medium text-[#111827] mb-2">IP Status</h4>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs rounded-md ${
                        asset.ipStatus === 'REGISTERED' ? 'bg-green-100 text-green-800' :
                        asset.ipStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {asset.ipStatus === 'REGISTERED' ? '✅ Registered' : 
                         asset.ipStatus === 'PENDING' ? '⏳ Pending' : '📝 Unregistered'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">{getAssetTypeIcon(asset.type)}</div>
                <p className="text-[#6B7280]">No media preview available</p>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between p-6 border-t border-[#E5E7EB] bg-[#F8FAFC]">
            <div className="flex items-center gap-2 text-sm text-[#6B7280]">
              {asset.mediaUrl && (
                <a
                  href={asset.mediaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#6366F1] hover:text-[#5B5BD6] transition-colors"
                >
                  Open in New Tab
                </a>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-[#6B7280] hover:text-[#111827] border border-[#E5E7EB] rounded-lg hover:bg-white transition-colors"
              >
                Close
              </button>
              {!isMediaAsset && (
                <button
                  onClick={() => {
                    onClose();
                    onAssetSelect(asset);
                  }}
                  className="px-4 py-2 bg-[#6366F1] text-white rounded-lg hover:bg-[#5B5BD6] transition-colors"
                >
                  Edit in Canvas
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading && storyworlds.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6366F1] mx-auto mb-4"></div>
          <p className="text-[#6B7280]">Loading your storyworlds...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#111827]">Library</h2>
          <p className="text-[#6B7280] mt-1">
            {viewMode === 'storyworlds' 
              ? 'Your creative universes' 
              : selectedStoryworld 
                ? `Assets in ${selectedStoryworld.name}` 
                : 'Select a storyworld to view assets'
            }
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex bg-[#F3F4F6] rounded-lg p-1">
            <button
              onClick={() => setViewMode('storyworlds')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === 'storyworlds'
                  ? 'bg-white text-[#6366F1] shadow-sm'
                  : 'text-[#6B7280] hover:text-[#374151]'
              }`}
            >
              Storyworlds
            </button>
            <button
              onClick={() => setViewMode('hub')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === 'hub'
                  ? 'bg-white text-[#6366F1] shadow-sm'
                  : 'text-[#6B7280] hover:text-[#374151]'
              }`}
            >
              Hub
            </button>
            <button
              onClick={() => setViewMode('assets')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === 'assets'
                  ? 'bg-white text-[#6366F1] shadow-sm'
                  : 'text-[#6B7280] hover:text-[#374151]'
              }`}
            >
              All Assets
            </button>
          </div>

          {/* Create Button */}
          {viewMode === 'storyworlds' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 bg-[#6366F1] text-white rounded-lg hover:bg-[#5B5BD6] transition-colors font-medium"
            >
              <span className="mr-2">+</span>
              New Storyworld
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {viewMode === 'storyworlds' ? (
        <div className="space-y-4">
          {/* Empty State */}
          {storyworlds.length === 0 && (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="text-6xl mb-4">🌟</div>
                <h3 className="text-xl font-semibold text-[#111827] mb-2">
                  Welcome to Your Creative Library
                </h3>
                <p className="text-[#6B7280] mb-6">
                  Create your first storyworld to start building characters, stories, and protecting your intellectual property.
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white rounded-xl hover:from-[#5B5BD6] hover:to-[#7C3AED] transition-all duration-200 font-medium shadow-lg"
                >
                  <span className="mr-2">✨</span>
                  Create Your First Storyworld
                </button>
              </div>
            </div>
          )}

          {/* Storyworlds Grid */}
          {storyworlds.length > 0 && (
            <>
              {/* Add New Storyworld Card */}
              <div className="mb-6">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="w-full max-w-sm group bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] border-2 border-dashed border-[#CBD5E1] rounded-2xl p-8 hover:border-[#6366F1] hover:from-[#6366F1]/5 hover:to-[#8B5CF6]/5 transition-all duration-300"
                >
                  <div className="text-center">
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">✨</div>
                    <h3 className="text-lg font-semibold text-[#374151] group-hover:text-[#6366F1] transition-colors mb-1">
                      Create New Storyworld
                    </h3>
                    <p className="text-sm text-[#6B7280]">
                      Start building another creative universe
                    </p>
                  </div>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {storyworlds.map((storyworld) => (
                <div
                  key={storyworld.id}
                  onClick={() => {
                    setSelectedStoryworld(storyworld);
                    setViewMode('hub');
                    onStoryworldSelect(storyworld);
                  }}
                  className="group bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  {/* Cover Image */}
                  <div className="relative h-32 overflow-hidden bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9]">
                    {storyworld.coverImageUrl ? (
                      <img
                        src={storyworld.coverImageUrl}
                        alt={storyworld.name}
                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105 opacity-75 group-hover:opacity-90"
                        onError={(e) => {
                          // Fallback to placeholder if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    
                    {/* Placeholder - shown when no image or image fails to load */}
                    <div className={`w-full h-full bg-gradient-to-br from-[#F8FAFC] to-[#E2E8F0] flex flex-col items-center justify-center ${
                      storyworld.coverImageUrl ? 'hidden' : ''
                    }`}>
                      <div className="text-2xl mb-1 text-[#64748B]">
                        {getStoryworldIcon(storyworld.name)}
                      </div>
                      <div className="text-xs font-medium text-center px-3 leading-tight text-[#64748B]">
                        {storyworld.name.length > 15 
                          ? storyworld.name.substring(0, 15) + '...' 
                          : storyworld.name
                        }
                      </div>
                    </div>
                    
                    {/* Subtle overlay for better text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-[#111827] group-hover:text-[#6366F1] transition-colors flex-1">
                        {storyworld.name}
                      </h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // TODO: Add edit functionality
                          console.log('Edit storyworld:', storyworld.id);
                        }}
                        className="p-1 text-[#6B7280] hover:text-[#6366F1] transition-colors opacity-0 group-hover:opacity-100"
                        title="Edit storyworld"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zM12 13a1 1 0 110-2 1 1 0 010 2zM12 20a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-[#6B7280] text-sm mb-4 line-clamp-2">
                      {storyworld.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-[#6B7280]">
                      <span>{storyworld.assetCount || 0} assets</span>
                      <span>
                        {storyworld.createdAt && 
                          new Date(storyworld.createdAt.seconds * 1000).toLocaleDateString()
                        }
                      </span>
                    </div>
                  </div>
                </div>
                              ))}
              </div>
            </>
          )}
        </div>
      ) : viewMode === 'hub' && selectedStoryworld ? (
        /* StoryworldHub View */
        <StoryworldHubIntegrated 
          storyworld={selectedStoryworld}
          assets={assets}
          onBack={() => setViewMode('storyworlds')}
          onCreateAsset={(assetType) => {
            if (assetType === 'STORYLINE') {
              // Open Canvas for storyline creation
              console.log('Opening Canvas for storyline creation');
              if (onCreateStoryline) {
                onCreateStoryline(selectedStoryworld.id);
              }
            } else {
              console.log('Creating asset:', assetType);
            }
          }}
          onAssetSelect={onAssetSelect}
          onViewAssets={() => setViewMode('assets')}
          handleAssetClick={handleAssetClick}
        />
      ) : (
        /* Assets View */
        <div className="space-y-6">
          {selectedStoryworld && (
            <>
              {/* Breadcrumb */}
              <div className="flex items-center text-sm text-[#6B7280]">
                <button
                  onClick={() => setViewMode('storyworlds')}
                  className="hover:text-[#6366F1] transition-colors"
                >
                  Storyworlds
                </button>
                <span className="mx-2">›</span>
                <span className="text-[#111827] font-medium">{selectedStoryworld.name}</span>
              </div>

              {/* Enhanced Upload Section */}
              <MediaUploadZone
                onFileUpload={handleFileUpload}
                uploading={uploading}
                storyworldName={selectedStoryworld.name}
              />

              {/* Upload Progress */}
              {Object.keys(uploadProgress).length > 0 && (
                <div className="bg-white rounded-xl border border-[#E5E7EB] p-4">
                  <h4 className="font-medium text-[#111827] mb-3">Upload Progress</h4>
                  <div className="space-y-2">
                    {Object.entries(uploadProgress).map(([fileName, progressData]) => (
                      <div key={fileName} className="flex items-center gap-3">
                        <span className="text-sm text-[#6B7280] flex-1 truncate">{fileName}</span>
                        <div className="flex-1 max-w-xs">
                          <div className="w-full bg-[#E5E7EB] rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${
                                progressData.status === 'error' ? 'bg-red-500' : 
                                progressData.status === 'complete' ? 'bg-green-500' : 'bg-[#6366F1]'
                              }`}
                              style={{ width: `${Math.max(0, progressData.progress)}%` }}
                            ></div>
                          </div>
                        </div>
                        <span className="text-xs text-[#6B7280] w-12">
                          {progressData.status === 'error' ? 'Error' : 
                           progressData.status === 'complete' ? 'Done' : `${progressData.progress}%`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Assets Grid */}
              {assets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {assets.map((asset) => (
                    <div
                      key={asset.id}
                      onClick={() => handleAssetClick(asset)}
                      className="group bg-white rounded-xl border border-[#E5E7EB] overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
                    >
                      {/* Media Preview */}
                      <div className="relative h-40 bg-[#F3F4F6] flex items-center justify-center">
                        {asset.mediaUrl ? (
                          asset.type === 'VIDEO' ? (
                            <video
                              src={asset.mediaUrl}
                              className="w-full h-full object-cover"
                              muted
                              preload="metadata"
                            />
                          ) : asset.type === 'IMAGE' ? (
                            <img
                              src={asset.mediaUrl}
                              alt={asset.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-4xl">{getAssetTypeIcon(asset.type)}</div>
                          )
                        ) : (
                          <div className="text-4xl">{getAssetTypeIcon(asset.type)}</div>
                        )}
                        
                        {/* Type Badge */}
                        <div className="absolute top-2 left-2">
                          <span className="px-2 py-1 bg-black/70 text-white text-xs rounded-md backdrop-blur-sm">
                            {asset.type}
                          </span>
                        </div>

                        {/* Status Badge */}
                        <div className="absolute top-2 right-2">
                          <span className={`px-2 py-1 text-xs rounded-md ${
                            asset.ipStatus === 'REGISTERED'
                              ? 'bg-green-100 text-green-800'
                              : asset.ipStatus === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {asset.ipStatus === 'REGISTERED' ? '✅' : 
                             asset.ipStatus === 'PENDING' ? '⏳' : '📝'}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h4 className="font-semibold text-[#111827] mb-1 group-hover:text-[#6366F1] transition-colors">
                          {asset.name}
                        </h4>
                        <div className="flex items-center justify-between text-sm text-[#6B7280]">
                          <span>
                            {asset.fileSize && formatFileSize(asset.fileSize)}
                          </span>
                          <span>
                            {asset.createdAt && 
                              new Date(asset.createdAt.seconds * 1000).toLocaleDateString()
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">📁</div>
                  <h3 className="text-lg font-semibold text-[#111827] mb-2">
                    No assets yet
                  </h3>
                  <p className="text-[#6B7280]">
                    Upload your first media files to start building your storyworld
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Create Storyworld Modal */}
      <CreateStoryworldModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateStoryworld}
      />

      {/* Media Preview Modal */}
      <MediaPreviewModal
        asset={previewAsset}
        isOpen={viewMode === 'preview'}
        onClose={() => setViewMode('assets')}
      />
    </div>
  );
};

export default LibraryIntegrated; 