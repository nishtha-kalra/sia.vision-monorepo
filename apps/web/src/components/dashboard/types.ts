// Core Data Models matching Firestore schema

export interface Project {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  coverImageUrl?: string;
  visibility: 'PRIVATE' | 'PUBLIC';
  createdAt: Date;
  updatedAt: Date;
  stats: {
    totalAssets: number;
    characters: number;
    storylines: number;
    loreEntries: number;
  };
}

export interface Asset {
  id: string;
  ownerId: string;
  name: string;
  parentId: string | null; // For hierarchy system
  projectId: string; // The project this asset belongs to
  type: 'CHARACTER' | 'STORYLINE' | 'LORE' | 'IMAGE' | 'VIDEO' | 'AUDIO' | 'FOLDER';
  content: AssetContent;
  visibility: 'PRIVATE' | 'PUBLIC';
  ipStatus: 'UNREGISTERED' | 'REGISTERED';
  onChainId?: string | null; // Story Protocol or other registry ID
  createdAt: Date;
  updatedAt: Date;
}

export type AssetContent = 
  | CharacterContent
  | StorylineContent
  | LoreContent
  | ImageContent
  | VideoContent
  | AudioContent
  | FolderContent;

export interface CharacterContent {
  type: 'CHARACTER';
  description: string;
  traits: string[];
  tiptapJSON: any; // TipTap JSON format
}

export interface StorylineContent {
  type: 'STORYLINE';
  tiptapJSON: any; // TipTap JSON format
  plainText: string;
}

export interface LoreContent {
  type: 'LORE';
  description: string;
  significance: string;
  tiptapJSON: any; // TipTap JSON format
}

export interface ImageContent {
  type: 'IMAGE';
  url: string;
  altText: string;
  caption: string;
  metadata?: {
    width?: number;
    height?: number;
    fileSize?: number;
    format?: string;
  };
}

export interface VideoContent {
  type: 'VIDEO';
  url: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  metadata?: {
    duration?: number;
    fileSize?: number;
    format?: string;
    resolution?: string;
  };
}

export interface AudioContent {
  type: 'AUDIO';
  url: string;
  title: string;
  description: string;
  metadata?: {
    duration?: number;
    fileSize?: number;
    format?: string;
    bitrate?: number;
  };
}

export interface FolderContent {
  type: 'FOLDER';
}

// UI-specific interfaces
export interface StoryWorld extends Project {
  assetCount?: number;
  lastModified?: string;
}

export interface AssetTreeNode extends Asset {
  children?: AssetTreeNode[];
  level?: number;
}

export interface QuickAction {
  title: string;
  description: string;
  icon: string;
  color: string;
  assetType: Asset['type'];
}

// Legacy interface for backward compatibility (will be removed)
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