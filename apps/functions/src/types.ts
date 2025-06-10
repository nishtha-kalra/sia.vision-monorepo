import * as admin from "firebase-admin";

// Asset Types
export type AssetType = 'CHARACTER' | 'STORYLINE' | 'LORE' | 'IMAGE' | 'VIDEO' | 'AUDIO';
export type AssetStatus = 'DRAFT' | 'PUBLISHED' | 'REGISTERED';
export type IPStatus = 'UNREGISTERED' | 'PENDING' | 'REGISTERED' | 'FAILED';

// Core Asset Interface - extends existing structure
export interface Asset {
  id: string;
  ownerId: string; // Matches existing backend
  storyworldId: string; // Matches existing backend  
  name: string; // Matches existing backend
  type: AssetType; // Matches existing backend
  content?: any; // Matches existing backend
  status: AssetStatus; // Matches existing backend
  ipStatus: IPStatus; // Matches existing backend
  onChainId?: string | null; // Matches existing backend
  createdAt: admin.firestore.Timestamp;
  updatedAt: admin.firestore.Timestamp;
  
  // Media-specific fields (new)
  mediaUrl?: string; // Firebase Storage URL for original file
  thumbnailUrl?: string; // Generated thumbnail
  mimeType?: string;
  fileSize?: number;
  duration?: number; // For video/audio assets
  
  // Story Protocol fields (future)
  ipId?: string;
  metadataIpfsUrl?: string;
  mediaIpfsUrl?: string;
  
  // Analytics
  views?: number;
  likes?: number;
  
  // Tags and categorization
  tags?: string[];
  description?: string;
}

// Project/Storyworld Interface - extends existing structure
export interface Storyworld {
  id: string;
  ownerId: string; // Matches existing backend
  name: string; // Matches existing backend
  description: string; // Matches existing backend
  coverImageUrl?: string | null; // Matches existing backend
  createdAt: admin.firestore.Timestamp;
  updatedAt: admin.firestore.Timestamp;
  
  // Additional fields
  isPublic?: boolean;
  assetCount?: number;
  views?: number;
  tags?: string[];
}

// Media Upload Interfaces
export interface UploadRequest {
  fileName: string;
  contentType: string;
  fileSize: number;
  storyworldId: string;
  assetType: AssetType;
}

export interface UploadResponse {
  uploadUrl: string;
  assetId: string;
  filePath: string; // Storage path for later reference
}

// Asset Creation Request
export interface CreateAssetRequest {
  storyworldId: string;
  name: string;
  type: AssetType;
  description?: string;
  tags?: string[];
}

export interface CreateAssetResponse {
  assetId: string;
  success: boolean;
}

// Media Processing Result
export interface MediaProcessingResult {
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
}

// AI Assistant Interfaces
export interface AIPromptRequest {
  prompt: string;
  userId: string;
  context?: {
    existingStoryworlds?: string[];
    currentStoryworldId?: string;
    lastActivity?: string;
  };
}

export interface AIPromptResponse {
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

export interface StoryworldEnhancementRequest {
  storyworldId: string;
  userId: string;
  enhancementType: 'expand_lore' | 'create_characters' | 'develop_storylines' | 'add_themes';
  context?: string;
}

export interface StoryworldEnhancementResponse {
  success: boolean;
  suggestions: Array<{
    type: AssetType;
    name: string;
    description: string;
    content: any;
    reasoning: string;
  }>;
} 