import { useState, useCallback } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/lib/firebase';
import { StoryProtocolData } from '@/components/story-protocol';
import { useFirebaseFunctions } from './useFirebaseFunctions';

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

export interface StoryProtocolResult {
  success: boolean;
  data?: any;
  error?: string;
  txHash?: string;
  ipId?: string;
  licenseId?: string;
  metadata?: any;
  registrationId?: string;
  status?: string;
  registration?: any;
}

export const useStoryProtocol = (options: UseStoryProtocolOptions = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [templates, setTemplates] = useState<PILTemplate[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  
  const { onSuccess, onError } = options;
  const { callFunction } = useFirebaseFunctions();

  const handleCall = async (functionName: string, data: any): Promise<StoryProtocolResult> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await callFunction(functionName, data);
      
      if (result.success) {
        return result;
      } else {
        setError(result.error || 'Unknown error occurred');
        return { success: false, error: result.error };
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to call Story Protocol function';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

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

  // NEW STREAMLINED FUNCTIONS

  // Create IP registration record
  const createIPRegistration = useCallback(async (params: {
    assetId: string;
    pilTemplate: string;
    customMetadata?: any;
    aiPrompt?: string;
  }) => {
    return handleCall('createIPRegistration', params);
  }, [handleCall]);

  // Process IP registration
  const processIPRegistration = useCallback(async (params: {
    registrationId: string;
  }) => {
    return handleCall('processIPRegistration', params);
  }, [handleCall]);

  // Get IP registration status
  const getIPRegistrationStatus = useCallback(async (params: {
    registrationId?: string;
    assetId?: string;
  }) => {
    return handleCall('getIPRegistrationStatus', params);
  }, [handleCall]);

  // Generate IP metadata with AI
  const generateIPMetadata = useCallback(async (params: {
    assetId: string;
    aiPrompt: string;
    customAttributes?: Array<{ trait_type: string; value: string }>;
  }) => {
    return handleCall('generateIPMetadata', params);
  }, [handleCall]);

  // Get user's IP registrations
  const getUserIPRegistrations = useCallback(async (params?: {
    status?: string;
    limit?: number;
    offset?: number;
    storyworldId?: string;
  }) => {
    return handleCall('getUserIPRegistrations', params || {});
  }, [handleCall]);

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
    
    // NEW STREAMLINED ACTIONS
    createIPRegistration,
    processIPRegistration,
    getIPRegistrationStatus,
    generateIPMetadata,
    getUserIPRegistrations,
    
    // Helpers
    isAssetRegistered,
    getRegistrationStatus,
    formatLicenseInfo,
    
    // Clear error
    clearError: () => setError(null)
  };
}; 