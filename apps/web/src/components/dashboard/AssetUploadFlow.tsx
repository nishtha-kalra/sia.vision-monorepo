"use client";
import React, { useState, useCallback, useRef } from 'react';
import { Asset, AssetType, AssetStatus, IPStatus, Storyworld } from '@/types';
import { useFirebaseFunctions } from '@/hooks/useFirebaseFunctions';
import { useUser } from '@/hooks/useUser';

interface AssetUploadFlowProps {
  storyworld: Storyworld;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (assets: Asset[]) => void;
  onUploadStart?: (assets: { id: string; name: string; type: AssetType; file: File }[]) => void;
}

interface FileWithPreview {
  file: File;
  preview: string;
  id: string;
  name: string;
  description: string;
  tags: string[];
  assetType: AssetType;
}

// Story Protocol supported formats based on their documentation
const STORY_SUPPORTED_FORMATS = {
  image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/avif', 'image/apng'],
  video: ['video/mp4', 'video/webm', 'video/quicktime'],
  audio: ['audio/mpeg', 'audio/wav', 'audio/flac', 'audio/aac', 'audio/ogg', 'audio/mp4', 'audio/x-aiff', 'audio/x-ms-wma', 'audio/opus']
};

const AssetUploadFlow: React.FC<AssetUploadFlowProps> = ({
  storyworld,
  isOpen,
  onClose,
  onSuccess,
  onUploadStart
}) => {
  const { uploadMediaAsset, uploading } = useFirebaseFunctions();
  const { authUser } = useUser();
  
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Enhanced file type detection based on Story Protocol supported formats
  const getAssetTypeFromFile = (file: File): AssetType => {
    const mimeType = file.type.toLowerCase();
    
    if (STORY_SUPPORTED_FORMATS.image.includes(mimeType)) return 'IMAGE';
    if (STORY_SUPPORTED_FORMATS.video.includes(mimeType)) return 'VIDEO';
    if (STORY_SUPPORTED_FORMATS.audio.includes(mimeType)) return 'AUDIO';
    
    // Fallback based on file extension if MIME type detection fails
    const extension = file.name.toLowerCase().split('.').pop();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'avif'].includes(extension || '')) return 'IMAGE';
    if (['mp4', 'webm', 'mov', 'quicktime'].includes(extension || '')) return 'VIDEO';
    if (['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a', 'aiff', 'wma', 'opus'].includes(extension || '')) return 'AUDIO';
    
    return 'IMAGE'; // Default fallback
  };

  // Check if file format is supported by Story Protocol
  const isFileSupported = (file: File): boolean => {
    const mimeType = file.type.toLowerCase();
    return [
      ...STORY_SUPPORTED_FORMATS.image,
      ...STORY_SUPPORTED_FORMATS.video,
      ...STORY_SUPPORTED_FORMATS.audio
    ].includes(mimeType);
  };

  // Create preview URL
  const createPreview = (file: File): string => {
    if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
      return URL.createObjectURL(file);
    }
    return ''; // No preview for audio files
  };

  // Generate smart asset name from filename
  const generateAssetName = (filename: string): string => {
    return filename
      .split('.')[0] // Remove extension
      .replace(/[-_]/g, ' ') // Replace hyphens and underscores with spaces
      .replace(/\b\w/g, l => l.toUpperCase()); // Capitalize first letter of each word
  };

  // Generate smart description based on asset type
  const generateDescription = (file: File, assetType: AssetType): string => {
    const name = generateAssetName(file.name);
    switch (assetType) {
      case 'IMAGE':
        return `${name} - A visual asset for the ${storyworld.name} storyworld`;
      case 'VIDEO':
        return `${name} - A video asset for the ${storyworld.name} storyworld`;
      case 'AUDIO':
        return `${name} - An audio asset for the ${storyworld.name} storyworld`;
      default:
        return `${name} - A media asset for the ${storyworld.name} storyworld`;
    }
  };

  // Handle file selection with smart defaults
  const handleFileSelect = useCallback((selectedFiles: FileList | File[]) => {
    const fileArray = Array.from(selectedFiles);
    const supportedFiles = fileArray.filter(isFileSupported);
    
    if (supportedFiles.length !== fileArray.length) {
      const unsupportedCount = fileArray.length - supportedFiles.length;
      alert(`${unsupportedCount} file(s) were skipped as they are not supported by Story Protocol. Please use supported formats: JPG, PNG, GIF, WebP, SVG, MP4, WebM, MOV, MP3, WAV, FLAC, AAC, OGG.`);
    }

    const newFiles: FileWithPreview[] = supportedFiles.map(file => {
      const assetType = getAssetTypeFromFile(file);
      return {
        file,
        preview: createPreview(file),
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        name: generateAssetName(file.name),
        description: generateDescription(file, assetType),
        tags: [assetType.toLowerCase()],
        assetType
      };
    });

    setFiles(prev => [...prev, ...newFiles]);
  }, [storyworld.name]);

  // Handle drag and drop
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files);
    }
  }, [handleFileSelect]);

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files);
    }
  };

  // Update file metadata
  const updateFileMetadata = (fileId: string, field: keyof FileWithPreview, value: any) => {
    setFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, [field]: value } : f
    ));
  };

  // Remove file
  const removeFile = (fileId: string) => {
    setFiles(prev => {
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(f => f.id !== fileId);
    });
  };

  // Add tag
  const addTag = (fileId: string, tag: string) => {
    if (!tag.trim()) return;
    const file = files.find(f => f.id === fileId);
    if (file && !file.tags.includes(tag.trim())) {
      updateFileMetadata(fileId, 'tags', [...file.tags, tag.trim()]);
    }
  };

  // Remove tag
  const removeTag = (fileId: string, tagIndex: number) => {
    const file = files.find(f => f.id === fileId);
    if (file) {
      const newTags = file.tags.filter((_, index) => index !== tagIndex);
      updateFileMetadata(fileId, 'tags', newTags);
    }
  };

  // Handle upload with async progress
  const handleUpload = async () => {
    if (!authUser || files.length === 0) return;

    // Notify parent component about upload start for async progress tracking
    const uploadingAssets = files.map(f => ({
      id: f.id,
      name: f.name,
      type: f.assetType,
      file: f.file
    }));
    onUploadStart?.(uploadingAssets);

    // Close modal immediately and move to assets view
    handleClose();

    // Start uploads in background
    try {
      // Upload files in parallel for better performance
      const uploadPromises = files.map(async (fileWithPreview) => {
        try {
          const result = await uploadMediaAsset(
            fileWithPreview.file,
            storyworld.id,
            fileWithPreview.assetType,
            (fileName, progress) => {
              // Progress tracking handled by the hook
            }
          );

          if (result.success && result.assetId) {
            return {
              id: result.assetId,
              ownerId: authUser.uid,
              storyworldId: storyworld.id,
              name: fileWithPreview.name,
              type: fileWithPreview.assetType,
              status: 'PUBLISHED' as AssetStatus,
              ipStatus: 'UNREGISTERED' as IPStatus,
              createdAt: new Date(),
              updatedAt: new Date(),
              mediaUrl: result.mediaUrl,
              description: fileWithPreview.description,
              tags: fileWithPreview.tags,
              mimeType: fileWithPreview.file.type,
              fileSize: fileWithPreview.file.size
            } as Asset;
          }
          return null;
        } catch (error) {
          console.error(`Failed to upload ${fileWithPreview.name}:`, error);
          return null;
        }
      });

      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter(Boolean) as Asset[];

      // Notify success after uploads complete
      onSuccess(successfulUploads);

    } catch (error) {
      console.error('Upload failed:', error);
      // Could show a toast notification here instead of alert
    }
  };

  // Handle close
  const handleClose = () => {
    // Clean up preview URLs
    files.forEach(file => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
    setFiles([]);
    onClose();
  };

  // Validate if we can upload
  const canUpload = () => {
    return files.length > 0 && files.every(f => f.name.trim() && f.description.trim());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#E5E7EB]">
          <div>
            <h2 className="text-2xl font-bold text-[#111827]">Upload Media</h2>
            <p className="text-[#6B7280]">to {storyworld.name}</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {files.length === 0 ? (
            /* File Selection */
            <div className="space-y-6">
              <div
                className={`relative border-2 border-dashed rounded-2xl p-12 transition-all duration-200 ${
                  dragActive 
                    ? 'border-[#6366F1] bg-[#6366F1]/5' 
                    : 'border-[#CBD5E1] bg-[#F8FAFC] hover:border-[#6366F1] hover:bg-[#6366F1]/5'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="text-center">
                  <div className="text-6xl mb-4">
                    {dragActive ? '📥' : '📤'}
                  </div>
                  <h3 className="text-xl font-semibold text-[#111827] mb-2">
                    Upload Media Files
                  </h3>
                  <p className="text-[#6B7280] mb-6">
                    Drag and drop your files here, or click to browse
                  </p>
                  
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center px-6 py-3 bg-[#6366F1] text-white rounded-xl hover:bg-[#5B5BD6] transition-colors font-medium"
                  >
                    <span className="mr-2">📁</span>
                    Choose Files
                  </button>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept={[...STORY_SUPPORTED_FORMATS.image, ...STORY_SUPPORTED_FORMATS.video, ...STORY_SUPPORTED_FORMATS.audio].join(',')}
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                  
                  <div className="mt-6 text-xs text-[#6B7280] space-y-2">
                    <p className="font-medium">Story Protocol Supported Formats:</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-left max-w-2xl mx-auto">
                      <div>
                        <p className="font-medium text-[#111827]">Images:</p>
                        <p>JPG, PNG, GIF, WebP, SVG, AVIF</p>
                      </div>
                      <div>
                        <p className="font-medium text-[#111827]">Videos:</p>
                        <p>MP4, WebM, MOV</p>
                      </div>
                      <div>
                        <p className="font-medium text-[#111827]">Audio:</p>
                        <p>MP3, WAV, FLAC, AAC, OGG</p>
                      </div>
                    </div>
                    <p className="mt-4">Max size: 50MB for videos, 10MB for images/audio</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* File Details & Upload */
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-[#111827] mb-2">Review & Upload Assets</h3>
                <p className="text-[#6B7280]">Review the auto-generated details and upload your assets</p>
              </div>

              <div className="space-y-4">
                {files.map((file) => (
                  <div key={file.id} className="bg-[#F8FAFC] rounded-xl p-6 border border-[#E5E7EB]">
                    <div className="flex gap-6">
                      {/* Preview */}
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 bg-[#F3F4F6] rounded-lg overflow-hidden">
                          {file.preview ? (
                            file.assetType === 'VIDEO' ? (
                              <video
                                src={file.preview}
                                className="w-full h-full object-cover"
                                muted
                                preload="metadata"
                              />
                            ) : (
                              <img
                                src={file.preview}
                                alt={file.name}
                                className="w-full h-full object-cover"
                              />
                            )
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xl">
                              🎵
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Form Fields */}
                      <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-[#111827] mb-2">
                              Asset Name *
                            </label>
                            <input
                              type="text"
                              value={file.name}
                              onChange={(e) => updateFileMetadata(file.id, 'name', e.target.value)}
                              placeholder="Enter asset name..."
                              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-[#111827] mb-2">
                              Type (Auto-detected)
                            </label>
                            <div className="px-3 py-2 bg-[#F3F4F6] border border-[#E5E7EB] rounded-lg text-[#6B7280]">
                              {file.assetType}
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-[#111827] mb-2">
                            Description *
                          </label>
                          <textarea
                            value={file.description}
                            onChange={(e) => updateFileMetadata(file.id, 'description', e.target.value)}
                            placeholder="Describe this asset and its role in your storyworld..."
                            rows={3}
                            className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent resize-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-[#111827] mb-2">
                            Tags
                          </label>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {file.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-3 py-1 bg-[#6366F1] text-white text-sm rounded-full"
                              >
                                {tag}
                                <button
                                  onClick={() => removeTag(file.id, index)}
                                  className="ml-2 text-white/80 hover:text-white"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                          <input
                            type="text"
                            placeholder="Add tags (press Enter)"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addTag(file.id, e.currentTarget.value);
                                e.currentTarget.value = '';
                              }
                            }}
                            className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent text-sm"
                          />
                        </div>
                      </div>

                      {/* Remove Button */}
                      <div className="flex-shrink-0">
                        <button
                          onClick={() => removeFile(file.id)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-[#E5E7EB] bg-[#F8FAFC]">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-[#6B7280] hover:text-[#111827] border border-[#E5E7EB] rounded-lg hover:bg-white transition-colors"
          >
            Cancel
          </button>
          
          {files.length > 0 && (
            <button
              onClick={handleUpload}
              disabled={!canUpload()}
              className="px-6 py-2 bg-[#6366F1] text-white rounded-lg hover:bg-[#5B5BD6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <span>📤</span>
              Upload {files.length} Asset{files.length > 1 ? 's' : ''}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssetUploadFlow; 