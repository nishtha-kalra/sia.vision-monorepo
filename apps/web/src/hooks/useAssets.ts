import { useState, useEffect } from 'react';
import { functions } from '@/lib/firebase';
import { httpsCallable } from 'firebase/functions';
import { useUser } from './useUser';

// Basic asset interface for user's own assets
export interface UserAsset {
  id: string;
  ownerId: string;
  name: string;
  type: string;
  content?: any;
  status: string;
  ipStatus: string;
  createdAt: { seconds: number };
  updatedAt: { seconds: number };
  mediaUrl?: string;
  views: number;
  likes: number;
  tags: string[];
  description?: string;
  projectId?: string; // For compatibility with Library component
}

// Hook for user's own assets (used in Library section)
export const useUserAssets = (filterByType?: string, limit: number = 20) => {
  const [assets, setAssets] = useState<UserAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const { authUser } = useUser();

  const fetchAssets = async () => {
    if (!authUser || !functions) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const getUserAssetsFunction = httpsCallable(functions, 'getUserAssets');
      const result = await getUserAssetsFunction({
        type: filterByType,
        limit,
        skip: 0
      });

      const data = result.data as any;
      if (data.success) {
        setAssets(data.assets || []);
        setTotal(data.total || data.assets?.length || 0);
      } else {
        throw new Error(data.error || 'Failed to fetch assets');
      }
    } catch (err: any) {
      console.error('Error fetching user assets:', err);
      setError(err.message || 'Failed to fetch assets');
      setAssets([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [authUser, filterByType, limit]);

  return {
    assets,
    loading,
    error,
    total,
    refetch: fetchAssets
  };
}; 