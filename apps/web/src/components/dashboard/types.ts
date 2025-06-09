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

export interface QuickAction {
  title: string;
  description: string;
  icon: string;
  color: string;
} 