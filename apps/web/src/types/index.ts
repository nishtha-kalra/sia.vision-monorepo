export interface NavigationItem {
  label: string;
  href: string;
}

export interface SectionProps {
  className?: string;
}

export interface HeroProps extends SectionProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  onCtaClick?: () => void;
}

export interface NavbarProps {
  navigationItems?: NavigationItem[];
  logoText?: string;
  onSearch?: () => void;
}

export interface ImageProps {
  image: string;
  altText: string;
  className?: string;
}

// Asset and Storyworld Types
export type AssetType = 'CHARACTER' | 'STORYLINE' | 'LORE' | 'IMAGE' | 'VIDEO' | 'AUDIO';
export type AssetStatus = 'DRAFT' | 'PUBLISHED' | 'REGISTERED';
export type IPStatus = 'UNREGISTERED' | 'PENDING' | 'REGISTERED' | 'FAILED';

export interface Asset {
  id: string;
  ownerId: string;
  storyworldId: string;
  name: string;
  type: AssetType;
  content?: any;
  status: AssetStatus;
  ipStatus: IPStatus;
  onChainId?: string | null;
  createdAt: any; // Firebase Timestamp
  updatedAt: any; // Firebase Timestamp
  
  // Media-specific fields
  mediaUrl?: string;
  thumbnailUrl?: string;
  mimeType?: string;
  fileSize?: number;
  duration?: number;
  
  // Story Protocol fields
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

export interface Storyworld {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  coverImageUrl?: string | null;
  createdAt: any; // Firebase Timestamp
  updatedAt: any; // Firebase Timestamp
  
  // Additional fields
  isPublic?: boolean;
  assetCount?: number;
  views?: number;
  tags?: string[];
}

// Frontend-specific interfaces
export interface AssetContentData {
  // For CHARACTER assets
  characterData?: {
    appearance?: string;
    personality?: string;
    background?: string;
    relationships?: string[];
    abilities?: string[];
  };
  
  // For STORYLINE assets
  storylineData?: {
    summary?: string;
    chapters?: Array<{
      title: string;
      content: string;
      order: number;
    }>;
    themes?: string[];
    genre?: string;
  };
  
  // For LORE assets
  loreData?: {
    category?: 'LOCATION' | 'ARTIFACT' | 'CONCEPT' | 'HISTORY';
    content?: string;
    connections?: string[]; // References to other assets
    timeline?: string;
  };
  
  // For media assets
  mediaData?: {
    caption?: string;
    altText?: string;
    credits?: string;
  };
}

export interface CreateAssetRequest {
  storyworldId: string;
  name: string;
  type: AssetType;
  description?: string;
  tags?: string[];
  content?: AssetContentData;
}

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
  filePath: string;
}

// UI State Management
export interface DashboardState {
  activeTab: 'dashboard' | 'library' | 'explore';
  selectedStoryworld?: Storyworld;
  selectedAsset?: Asset;
  isLoading: boolean;
  error?: string;
}

export interface LibraryState {
  storyworlds: Storyworld[];
  assets: Asset[];
  searchQuery: string;
  filterType?: AssetType;
  filterStatus?: AssetStatus;
  sortBy: 'name' | 'createdAt' | 'updatedAt';
  sortOrder: 'asc' | 'desc';
  isLoading: boolean;
  error?: string;
}

// Firebase callable function interfaces
export interface FirebaseFunctions {
  createStoryworld: (data: {
    name: string;
    description: string;
    coverImageUrl?: string;
  }) => Promise<{ storyworldId: string }>;
  
  getUserStoryworlds: () => Promise<{ storyworlds: Storyworld[] }>;
  
  deleteStoryworld: (data: { storyworldId: string }) => Promise<{ success: boolean }>;
  
  uploadMediaDirect: (data: {
    fileName: string;
    contentType: string;
    fileData: string; // base64 encoded file
    storyworldId: string;
    assetType: AssetType;
  }) => Promise<{
    success: boolean;
    assetId: string;
    mediaUrl: string;
  }>;
  
  createTextAsset: (data: CreateAssetRequest & { content: any }) => Promise<{
    assetId: string;
    success: boolean;
  }>;
  
  saveAsset: (data: {
    assetId?: string;
    storyworldId: string;
    name: string;
    type: string;
    content: any;
  }) => Promise<{ assetId: string }>;
  
  getStoryworldAssets: (data: {
    storyworldId: string;
    filterByType?: string;
    filterByIpStatus?: string;
    sortBy?: string;
  }) => Promise<{ assets: Asset[] }>;
  
  deleteAsset: (data: { assetId: string }) => Promise<{ success: boolean }>;
}

// Component Props
export interface AssetCardProps {
  asset: Asset;
  onEdit?: (asset: Asset) => void;
  onDelete?: (asset: Asset) => void;
  onView?: (asset: Asset) => void;
  showActions?: boolean;
}

export interface StoryworldCardProps {
  storyworld: Storyworld;
  onSelect?: (storyworld: Storyworld) => void;
  onEdit?: (storyworld: Storyworld) => void;
  onDelete?: (storyworld: Storyworld) => void;
  showActions?: boolean;
}

export interface MediaUploadProps {
  storyworldId: string;
  allowedTypes: AssetType[];
  onUploadComplete?: (asset: Asset) => void;
  onUploadError?: (error: string) => void;
}

export interface AssetEditorProps {
  asset?: Asset;
  storyworldId: string;
  assetType: AssetType;
  onSave?: (asset: Asset) => void;
  onCancel?: () => void;
} 