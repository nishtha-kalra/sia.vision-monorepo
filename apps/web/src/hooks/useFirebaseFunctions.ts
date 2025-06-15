import { useState, useCallback } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/lib/firebase';
import type { 
  Storyworld, 
  Asset, 
  UploadRequest, 
  UploadResponse, 
  AssetContentData,
  AssetType
} from '@/types';

// AI Assistant Types
interface AIPromptRequest {
  prompt: string;
  userId: string;
  context?: {
    existingStoryworlds?: string[];
    currentStoryworldId?: string;
    lastActivity?: string;
  };
}

interface AIPromptResponse {
  success: boolean;
  analysis: {
    intent: 'CREATE_STORYWORLD' | 'CREATE_ASSET' | 'ENHANCE_EXISTING' | 'GENERAL_HELP';
    confidence: number;
    extractedEntities: {
      storyworldName?: string;
      assetType?: AssetType;
      assetName?: string;
      genre?: string;
      themes?: string[];
      characters?: string[];
      concepts?: string[];
    };
  };
  suggestions: {
    type: 'create_storyworld' | 'create_asset' | 'enhance_asset' | 'general_advice';
    title: string;
    description: string;
    action?: {
      function: string;
      parameters: any;
    };
    alternatives?: Array<{
      type?: 'create_storyworld' | 'create_asset' | 'enhance_asset' | 'general_advice';
      title: string;
      description: string;
      action?: {
        function: string;
        parameters: any;
      };
    }>;
  };
  generatedContent?: {
    storyworld?: {
      name: string;
      description: string;
      genre: string;
      themes: string[];
    };
    asset?: {
      name: string;
      type: AssetType;
      content: any;
      description: string;
    };
  };
}

interface StoryworldEnhancementRequest {
  storyworldId: string;
  userId: string;
  enhancementType: 'expand_lore' | 'create_characters' | 'develop_storylines' | 'add_themes';
  context?: string;
}

interface StoryworldEnhancementResponse {
  success: boolean;
  suggestions: Array<{
    type: AssetType;
    name: string;
    description: string;
    content: any;
    reasoning: string;
  }>;
}

interface UploadProgress {
  fileName: string;
  progress: number;
  status: 'uploading' | 'processing' | 'complete' | 'error';
}

export const useFirebaseFunctions = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: UploadProgress }>({});
  const [activeUploads, setActiveUploads] = useState(new Set<string>());

  const validateFunctions = () => {
    if (!functions) {
      throw new Error('Firebase Functions not initialized');
    }
    return functions;
  };

  // Generic function caller
  const callFunction = useCallback(async (functionName: string, data: any): Promise<any> => {
    const fn = httpsCallable(validateFunctions(), functionName);
    const result = await fn(data);
    return result.data as any;
  }, []);

  // Storyworld Functions
  const createStoryworld = useCallback(async (data: {
    name: string;
    description: string;
    genre?: string;
    themes?: string[];
    coverImageUrl?: string;
    aiContext?: {
      originalPrompt: string;
      aiResponse: any;
      confidence: number;
      analysis?: any;
      generatedContent?: any;
    };
  }): Promise<{ storyworldId: string }> => {
    const fn = httpsCallable(validateFunctions(), 'createStoryworld');
    const result = await fn(data);
    return result.data as { storyworldId: string };
  }, []);

  const getUserStoryworlds = useCallback(async (): Promise<{ storyworlds: Storyworld[] }> => {
    const fn = httpsCallable(validateFunctions(), 'getUserStoryworlds');
    const result = await fn();
    return result.data as { storyworlds: Storyworld[] };
  }, []);

  const deleteStoryworld = useCallback(async (data: { 
    storyworldId: string 
  }): Promise<{ success: boolean }> => {
    const fn = httpsCallable(validateFunctions(), 'deleteStoryworld');
    const result = await fn(data);
    return result.data as { success: boolean };
  }, []);

  // Asset Functions
  const createTextAsset = useCallback(async (data: {
    storyworldId: string;
    name: string;
    type: string;
    description?: string;
    tags?: string[];
    content: AssetContentData;
  }): Promise<{ assetId: string; success: boolean }> => {
    const fn = httpsCallable(validateFunctions(), 'createTextAsset');
    const result = await fn(data);
    return result.data as { assetId: string; success: boolean };
  }, []);

  const saveAsset = useCallback(async (data: {
    assetId?: string;
    storyworldId: string;
    name: string;
    type: string;
    content: any;
  }): Promise<{ assetId: string }> => {
    const fn = httpsCallable(validateFunctions(), 'saveAsset');
    const result = await fn(data);
    return result.data as { assetId: string };
  }, []);

  const getStoryworldAssets = useCallback(async (data: {
    storyworldId: string;
    filterByType?: string;
    filterByIpStatus?: string;
    sortBy?: string;
  }): Promise<{ assets: Asset[] }> => {
    const fn = httpsCallable(validateFunctions(), 'getStoryworldAssets');
    const result = await fn(data);
    return result.data as { assets: Asset[] };
  }, []);

  const getAssetById = useCallback(async (data: {
    assetId: string;
  }): Promise<{ asset: Asset }> => {
    const fn = httpsCallable(validateFunctions(), 'getAssetById');
    const result = await fn(data);
    return result.data as { asset: Asset };
  }, []);

  const deleteAsset = useCallback(async (data: { 
    assetId: string 
  }): Promise<{ success: boolean }> => {
    const fn = httpsCallable(validateFunctions(), 'deleteAsset');
    const result = await fn(data);
    return result.data as { success: boolean };
  }, []);

  const updateAsset = useCallback(async (data: {
    assetId: string;
    name?: string;
    description?: string;
    content?: any;
    tags?: string[];
  }): Promise<{ success: boolean; asset?: Asset }> => {
    const fn = httpsCallable(validateFunctions(), 'updateAsset');
    
    // Extract assetId and create updates object
    const { assetId, ...updates } = data;
    const result = await fn({ assetId, updates });
    
    return result.data as { success: boolean; asset?: Asset };
  }, []);

  // Media Upload Functions
  const getSecureUploadUrl = useCallback(async (data: UploadRequest): Promise<UploadResponse> => {
    const fn = httpsCallable(validateFunctions(), 'getSecureUploadUrl');
    const result = await fn(data);
    return result.data as UploadResponse;
  }, []);

  const processUploadedMedia = useCallback(async (data: { 
    assetId: string 
  }): Promise<{
    success: boolean;
    assetId: string;
    mediaUrl: string;
    thumbnailUrl?: string;
    metadata?: {
      duration?: number;
      dimensions?: { width: number; height: number };
      fileSize: number;
      mimeType: string;
    };
  }> => {
    const fn = httpsCallable(validateFunctions(), 'processUploadedMedia');
    const result = await fn(data);
    return result.data as {
      success: boolean;
      assetId: string;
      mediaUrl: string;
      thumbnailUrl?: string;
      metadata?: {
        duration?: number;
        dimensions?: { width: number; height: number };
        fileSize: number;
        mimeType: string;
      };
    };
  }, []);

  // Server-side media upload - secure and controlled
  const uploadMediaDirect = useCallback(async (data: {
    fileName: string;
    contentType: string;
    fileData: string; // base64 encoded file
    storyworldId: string;
    assetType: AssetType;
  }) => {
    const fn = httpsCallable(validateFunctions(), 'uploadMediaDirect');
    const result = await fn(data);
    return result.data as {
      success: boolean;
      assetId: string;
      mediaUrl: string;
    };
  }, []);

  // Enhanced media upload with progress tracking - now using server-side upload
  const uploadMediaAsset = useCallback(async (
    file: File,
    storyworldId: string,
    assetType: AssetType,
    onProgress?: (fileName: string, progress: number, status: string) => void
  ): Promise<{
    success: boolean;
    assetId: string;
    mediaUrl: string;
    error?: string;
  }> => {
    const uploadId = `${file.name}-${Date.now()}`;
    
    try {
      // Track this upload as active and manage uploading state atomically
      setActiveUploads(prev => {
        const newSet = new Set(prev);
        newSet.add(uploadId);
        // Set uploading to true when we have active uploads
        if (newSet.size === 1) {
          setUploading(true);
        }
        return newSet;
      });
      
      // Initialize progress tracking
      const initialProgress: UploadProgress = {
        fileName: file.name,
        progress: 0,
        status: 'uploading'
      };
      
      setUploadProgress(prev => ({ ...prev, [file.name]: initialProgress }));
      onProgress?.(file.name, 0, 'uploading');

      console.log('📤 Starting server-side upload via Firebase Functions...');
      
      // Convert file to base64
      const fileData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          // Remove the data:mime/type;base64, prefix
          const base64Data = result.split(',')[1];
          resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      setUploadProgress(prev => ({ 
        ...prev, 
        [file.name]: { ...prev[file.name], progress: 20 } 
      }));
      onProgress?.(file.name, 20, 'uploading');

      console.log('📦 File converted to base64, uploading via function...');

      // Upload via Firebase Function (server-side)
      const uploadResult = await uploadMediaDirect({
        fileName: file.name,
        contentType: file.type,
        fileData,
        storyworldId,
        assetType,
      });

      console.log('✅ Server-side upload complete:', uploadResult);

      setUploadProgress(prev => ({ 
        ...prev, 
        [file.name]: { ...prev[file.name], progress: 100, status: 'complete' } 
      }));
      onProgress?.(file.name, 100, 'complete');

      // Clean up progress after delay
      setTimeout(() => {
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[file.name];
          return newProgress;
        });
      }, 3000);

      return {
        success: true,
        assetId: uploadResult.assetId,
        mediaUrl: uploadResult.mediaUrl,
      };
    } catch (error) {
      console.error('Server-side upload error:', error);
      
      // Update progress to show error
      setUploadProgress(prev => ({ 
        ...prev, 
        [file.name]: { ...prev[file.name], progress: 0, status: 'error' } 
      }));
      onProgress?.(file.name, 0, 'error');

      // Clean up error state after delay
      setTimeout(() => {
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[file.name];
          return newProgress;
        });
      }, 5000);

      return {
        success: false,
        assetId: '',
        mediaUrl: '',
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    } finally {
      // Remove this upload from active uploads and manage uploading state atomically
      setActiveUploads(prev => {
        const newSet = new Set(prev);
        newSet.delete(uploadId);
        
        // Set uploading to false only when no more active uploads
        if (newSet.size === 0) {
          setUploading(false);
        }
        
        return newSet;
      });
    }
  }, [uploadMediaDirect]);

  // Batch upload multiple files
  const uploadMultipleAssets = useCallback(async (
    files: File[],
    storyworldId: string,
    onProgress?: (fileName: string, progress: number, status: string) => void,
    onComplete?: (results: any[]) => void
  ) => {
    const results = [];
    
    for (const file of files) {
      try {
        let assetType: AssetType = 'IMAGE';
        if (file.type.startsWith('video/')) assetType = 'VIDEO';
        else if (file.type.startsWith('audio/')) assetType = 'AUDIO';

        const result = await uploadMediaAsset(file, storyworldId, assetType, onProgress);
        results.push({ file: file.name, success: true, result });
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
        results.push({ file: file.name, success: false, error });
      }
    }

    onComplete?.(results);
    return results;
  }, [uploadMediaAsset]);

  // Utility function to clear all upload progress
  const clearUploadProgress = useCallback(() => {
    setUploadProgress({});
  }, []);

  // AI Assistant Functions
  const processCreativePrompt = useCallback(async (data: AIPromptRequest): Promise<AIPromptResponse> => {
    const fn = httpsCallable(validateFunctions(), 'processCreativePrompt');
    const result = await fn(data);
    return result.data as AIPromptResponse;
  }, []);

  const enhanceStoryworld = useCallback(async (data: StoryworldEnhancementRequest): Promise<StoryworldEnhancementResponse> => {
    const fn = httpsCallable(validateFunctions(), 'enhanceStoryworld');
    const result = await fn(data);
    return result.data as StoryworldEnhancementResponse;
  }, []);

  // Story Protocol Functions
  const getPILTemplates = useCallback(async (): Promise<{
    success: boolean;
    templates: Array<{
      id: string;
      name: string;
      description: string;
      mintingFee: string;
      currency: string;
      features: string[];
    }>;
    error?: string;
  }> => {
    const fn = httpsCallable(validateFunctions(), 'getPILTemplates');
    const result = await fn({});
    return result.data as any;
  }, []);

  const registerAssetAsIP = useCallback(async (data: {
    assetId: string;
    pilTemplate: string;
    customMetadata?: {
      title: string;
      description: string;
      creatorName: string;
      attributes: Array<{ trait_type: string; value: string }>;
    };
  }): Promise<{
    success: boolean;
    ipId?: string;
    tokenId?: string;
    txHash?: string;
    pilTemplate?: string;
    asset?: any;
    error?: string;
  }> => {
    const fn = httpsCallable(validateFunctions(), 'registerAssetAsIP');
    const result = await fn(data);
    return result.data as any;
  }, []);

  const generateIPMetadata = useCallback(async (data: {
    assetId: string;
    prompt?: string;
    context?: string;
  }): Promise<{
    success: boolean;
    metadata?: {
      title: string;
      description: string;
      attributes: Array<{ trait_type: string; value: string }>;
      suggestedPIL: string;
      pilReasoning: string;
      confidence: number;
    };
    error?: string;
  }> => {
    const fn = httpsCallable(validateFunctions(), 'generateIPMetadata');
    const result = await fn(data);
    return result.data as any;
  }, []);

  return {
    // Generic function caller
    callFunction,
    
    // Storyworld functions
    createStoryworld,
    getUserStoryworlds,
    deleteStoryworld,
    
    // Asset functions
    createTextAsset,
    saveAsset,
    getStoryworldAssets,
    getAssetById,
    deleteAsset,
    updateAsset,
    
    // Media functions - server-side controlled
    uploadMediaDirect,
    uploadMediaAsset,
    uploadMultipleAssets,
    
    // AI Assistant functions
    processCreativePrompt,
    enhanceStoryworld,
    
    // Story Protocol functions
    getPILTemplates,
    registerAssetAsIP,
    generateIPMetadata,
    
    // State
    uploading,
    uploadProgress,
    activeUploads,
    clearUploadProgress,
  };
}; 