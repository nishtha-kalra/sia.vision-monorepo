import { useState, useCallback } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/lib/firebase';
import { StoryProtocolData } from '@/components/story-protocol';

interface UseStoryProtocolOptions {
  onSuccess?: (result: any) => void;
  onError?: (error: Error) => void;
}

interface PILTemplate {
  id: string;
  name: string;
  description: string;
  mintingFee: string;
  currency: string;
}

interface IPRegistrationParams {
  assetId: string;
  pilTemplate: string;
  customMetadata?: {
    title: string;
    description: string;
    creatorName: string;
    attributes: Array<{ trait_type: string; value: string }>;
  };
}

interface MetadataGenerationParams {
  assetId: string;
  prompt?: string;
  context?: string;
}

export const useStoryProtocol = (options: UseStoryProtocolOptions = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [templates, setTemplates] = useState<PILTemplate[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  
  const { onSuccess, onError } = options;

  const callFunction = useCallback(async (functionName: string, data: any): Promise<any> => {
    if (!functions) {
      throw new Error('Firebase Functions not initialized');
    }
    const fn = httpsCallable(functions, functionName);
    const result = await fn(data);
    return result.data as any;
  }, []);

  // Load PIL templates
  const loadTemplates = useCallback(async () => {
    try {
      setTemplatesLoading(true);
      setError(null);
      
      const result = await callFunction('getPILTemplates', {});
      
      if (result.success) {
        setTemplates(result.templates);
        return result.templates;
      } else {
        throw new Error('Failed to load PIL templates');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load templates';
      setError(errorMessage);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
      return [];
    } finally {
      setTemplatesLoading(false);
    }
  }, [callFunction, onError]);

  // Register asset as IP
  const registerAsIP = useCallback(async (params: IPRegistrationParams) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await callFunction('registerAssetAsIP', params);
      
      if (result.success) {
        onSuccess?.(result);
        return result;
      } else {
        throw new Error(result.error || 'Failed to register IP asset');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [callFunction, onSuccess, onError]);

  // Generate metadata with AI
  const generateMetadata = useCallback(async (params: MetadataGenerationParams) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await callFunction('generateIPMetadata', params);
      
      if (result.success) {
        return result.metadata;
      } else {
        throw new Error(result.error || 'Failed to generate metadata');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Metadata generation failed';
      setError(errorMessage);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [callFunction, onError]);

  // Get IP asset information
  const getIPAssetInfo = useCallback(async (assetId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await callFunction('getIPAssetInfo', { assetId });
      
      if (result.success) {
        return result.ipInfo;
      } else {
        throw new Error(result.error || 'Failed to get IP asset info');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get IP info';
      setError(errorMessage);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
      return null;
    } finally {
      setLoading(false);
    }
  }, [callFunction, onError]);

  // Batch register multiple assets
  const batchRegisterAssets = useCallback(async (
    assetIds: string[], 
    pilTemplate: string,
    customMetadata?: Record<string, any>
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await callFunction('batchRegisterAssetsAsIP', {
        assetIds,
        pilTemplate,
        customMetadata
      });
      
      if (result.success) {
        onSuccess?.(result);
        return result;
      } else {
        throw new Error(result.error || 'Failed to batch register assets');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Batch registration failed';
      setError(errorMessage);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [callFunction, onSuccess, onError]);

  // Helper function to check if asset is registered
  const isAssetRegistered = useCallback((storyProtocol?: StoryProtocolData) => {
    return storyProtocol?.status === 'registered' && !!storyProtocol?.ipId;
  }, []);

  // Helper function to get registration status
  const getRegistrationStatus = useCallback((storyProtocol?: StoryProtocolData) => {
    if (!storyProtocol) return 'not_registered';
    return storyProtocol.status || 'not_registered';
  }, []);

  // Helper function to format license info
  const formatLicenseInfo = useCallback((storyProtocol?: StoryProtocolData) => {
    if (!storyProtocol?.licenseTerms) return null;
    
    const { commercial, derivatives, attribution, royaltyPercentage } = storyProtocol.licenseTerms;
    const features = [];
    
    if (commercial) features.push('Commercial');
    if (derivatives) features.push('Derivatives');
    if (attribution) features.push('Attribution');
    if (royaltyPercentage > 0) features.push(`${royaltyPercentage}% Royalty`);
    
    return features.join(' • ');
  }, []);

  return {
    // State
    loading,
    error,
    templates,
    templatesLoading,
    
    // Actions
    loadTemplates,
    registerAsIP,
    generateMetadata,
    getIPAssetInfo,
    batchRegisterAssets,
    
    // Helpers
    isAssetRegistered,
    getRegistrationStatus,
    formatLicenseInfo,
    
    // Clear error
    clearError: () => setError(null)
  };
}; 