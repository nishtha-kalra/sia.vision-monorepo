import * as admin from "firebase-admin";

// Asset Types
export type AssetType = 'CHARACTER' | 'STORYLINE' | 'LORE' | 'IMAGE' | 'VIDEO' | 'AUDIO';
export type AssetStatus = 'DRAFT' | 'PUBLISHED' | 'REGISTERED';
export type IPStatus = 'UNREGISTERED' | 'PENDING' | 'REGISTERED' | 'FAILED';

// Story Protocol specific types
export type LicenseType = 'PIL' | 'SPECIFIC' | 'DERIVATIVE';
export type LicenseStatus = 'ACTIVE' | 'EXPIRED' | 'REVOKED';
export type RevenueSource = 'TIKTOK' | 'YOUTUBE' | 'INSTAGRAM' | 'CUSTOM' | 'NFT_SALE';

// Story Protocol data structure
export interface StoryProtocolData {
  // Core Story Protocol identifiers
  ipId: string; // Story Protocol IP Asset ID
  licenseId?: string; // Default PIL license ID
  txHash: string; // Registration transaction hash
  registeredAt: Date;
  
  // Metadata storage (Firebase Storage URLs)
  metadataUrl?: string; // Firebase Storage URL for IP metadata
  nftMetadataUrl?: string; // Firebase Storage URL for NFT metadata
  metadataIpfsHash?: string; // Legacy IPFS hash for metadata (optional)
  mediaIpfsHash?: string; // IPFS hash for media file (optional)
  pilTemplate?: string; // PIL template used for registration
  
  // License terms (from PIL)
  licenseTerms: {
    allowDerivatives: boolean;
    commercialUse: boolean;
    royaltyPercentage: number; // 0-100
    territory: string; // 'GLOBAL' or country codes
    attribution: boolean;
  };
  
  // Parent/derivative relationships
  parentIpId?: string; // If this is a derivative
  derivativeIds: string[]; // Child derivatives
  
  // Revenue tracking
  totalRevenue: number; // USD
  totalRoyaltiesPaid: number; // USD
  totalRoyaltiesEarned: number; // USD
}

// MongoDB-compatible Asset interface
export interface MongoAsset {
  _id: string; // MongoDB ObjectId as string
  ownerId: string;
  storyworldIds: string[]; // Support multiple storyworlds
  name: string;
  type: AssetType;
  content?: any;
  status: AssetStatus;
  ipStatus: IPStatus;
  
  // Media-specific fields
  media?: {
    url: string;
    mimeType: string;
    size: number;
    duration?: number; // For video/audio
  };
  
  // Story Protocol fields (optional until registered)
  storyProtocol?: StoryProtocolData;
  
  // Analytics
  views?: number;
  likes?: number;
  
  // Tags and categorization
  tags?: string[];
  description?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

// MongoDB-compatible Storyworld interface  
export interface MongoStoryworld {
  _id: string;
  ownerId: string;
  name: string;
  description: string;
  coverImageUrl?: string | null;
  visibility: 'PRIVATE' | 'PUBLIC';
  tags?: string[];
  stats?: {
    totalAssets: number;
    characters: number;
    storylines: number;
    loreEntries: number;
  };
  aiGenerated?: any; // Keep existing AI context
  createdAt: Date;
  updatedAt: Date;
}

// Legacy Asset Interface for backward compatibility
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

// Legacy Storyworld Interface for backward compatibility
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

// License management interfaces
export interface SpecificLicense {
  _id: string;
  ipId: string;
  assetId: string;
  licenseeAddress: string;
  licenseType: 'PHYSICAL_GOODS' | 'DIGITAL_CONTENT' | 'MEDIA_ADAPTATION';
  terms: {
    quantity?: number; // For physical goods
    territory: string;
    validUntil?: Date;
    price: number; // USD
    royaltyPercentage: number;
  };
  status: LicenseStatus;
  createdAt: Date;
  txHash: string;
}

// Revenue reporting interfaces
export interface RevenueReport {
  _id: string;
  assetId: string;
  ipId: string;
  reportedBy: string; // User ID
  source: RevenueSource;
  amount: number; // USD
  reportedAt: Date;
  period: {
    startDate: Date;
    endDate: Date;
  };
  royaltiesOwed: Array<{
    recipientAddress: string;
    amount: number;
    percentage: number;
  }>;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
  evidence?: {
    screenshots: string[]; // URLs
    apiData?: any; // Platform API responses
  };
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