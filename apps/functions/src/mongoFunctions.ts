import * as functions from "firebase-functions";
import { StoryworldService } from "./lib/storyworldService";
import { AssetService } from "./lib/assetService";
import { healthCheck } from "./lib/mongoClient";
import { 
  CreateAssetRequest, 
  CreateAssetResponse
} from "./types";

// Removed cors import since we no longer have HTTP functions

/**
 * Health check function to test MongoDB connectivity
 */
export const mongoHealthCheck = functions.https.onCall(
  async (data, context) => {
    try {
      const isHealthy = await healthCheck();
      
      if (isHealthy) {
        functions.logger.info('✅ MongoDB health check passed');
        return {
          success: true,
          status: 'healthy',
          message: 'MongoDB connection is working properly',
          timestamp: new Date().toISOString()
        };
      } else {
        functions.logger.error('❌ MongoDB health check failed');
        return {
          success: false,
          status: 'unhealthy',
          message: 'MongoDB connection failed',
          timestamp: new Date().toISOString()
        };
      }
    } catch (error) {
      functions.logger.error('❌ MongoDB health check error:', error);
      return {
        success: false,
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      };
    }
  }
);

/**
 * Create a new storyworld - MongoDB version
 */
export const createStoryworldMongo = functions.https.onCall(
  async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Authentication required'
      );
    }

    const { 
      name, 
      description, 
      genre,
      themes = [],
      visibility = 'PRIVATE', 
      tags = [], 
      aiContext 
    } = data;
    const uid = context.auth.uid;

    if (!name || !description) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Name and description are required'
      );
    }

    try {
      // Prepare enhanced AI context with genre and themes
      const enhancedAiGenerated = aiContext ? {
        ...aiContext,
        genre,
        themes,
        enhancedAt: new Date()
      } : (genre || themes.length > 0 ? {
        genre,
        themes,
        manuallyEnhanced: true,
        enhancedAt: new Date()
      } : undefined);

      const storyworld = await StoryworldService.create({
        ownerId: uid,
        name: name.trim(),
        description: description.trim(),
        visibility,
        tags: [...tags, ...(genre ? [genre] : []), ...themes], // Include genre and themes in tags
        aiGenerated: enhancedAiGenerated,
      });

      functions.logger.info('📝 Created storyworld via MongoDB', {
        storyworldId: storyworld._id,
        ownerId: uid,
        name: storyworld.name,
        genre,
        themes: themes.length,
        hasAiContext: !!aiContext
      });

      return {
        success: true,
        storyworldId: storyworld._id,
        storyworld: {
          id: storyworld._id,
          ...storyworld
        }
      };
    } catch (error) {
      functions.logger.error('❌ Failed to create storyworld:', error);
      throw new functions.https.HttpsError(
        'internal',
        'Failed to create storyworld'
      );
    }
  }
);

/**
 * Get user's storyworlds - MongoDB version
 */
export const getUserStoryworldsMongo = functions.https.onCall(
  async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Authentication required'
      );
    }

    const uid = context.auth.uid;

    try {
      const storyworlds = await StoryworldService.getByOwnerId(uid);
      
      // Convert to legacy format for frontend compatibility
      const legacyFormat = storyworlds.map(sw => ({
        id: sw._id,
        ownerId: sw.ownerId,
        name: sw.name,
        description: sw.description,
        coverImageUrl: sw.coverImageUrl,
        createdAt: { seconds: Math.floor(sw.createdAt.getTime() / 1000) },
        updatedAt: { seconds: Math.floor(sw.updatedAt.getTime() / 1000) },
        isPublic: sw.visibility === 'PUBLIC',
        assetCount: sw.stats?.totalAssets || 0,
        tags: sw.tags,
        aiGenerated: sw.aiGenerated
      }));

      functions.logger.info('📚 Retrieved user storyworlds via MongoDB', {
        ownerId: uid,
        count: storyworlds.length
      });

      return { 
        success: true, 
        storyworlds: legacyFormat 
      };
    } catch (error) {
      functions.logger.error('❌ Failed to get user storyworlds:', error);
      throw new functions.https.HttpsError(
        'internal',
        'Failed to get storyworlds'
      );
    }
  }
);

/**
 * Get public storyworlds for explore page - MongoDB version
 */
export const getPublicStoryworldsMongo = functions.https.onCall(
  async (data, context) => {
    const { limit = 20, skip = 0 } = data;

    try {
      const storyworlds = await StoryworldService.getPublic(limit, skip);
      
      // Convert to legacy format
      const legacyFormat = storyworlds.map(sw => ({
        id: sw._id,
        ownerId: sw.ownerId,
        name: sw.name,
        description: sw.description,
        coverImageUrl: sw.coverImageUrl,
        createdAt: { seconds: Math.floor(sw.createdAt.getTime() / 1000) },
        updatedAt: { seconds: Math.floor(sw.updatedAt.getTime() / 1000) },
        isPublic: true,
        assetCount: sw.stats?.totalAssets || 0,
        tags: sw.tags
      }));

      functions.logger.info('🌍 Retrieved public storyworlds via MongoDB', {
        count: storyworlds.length,
        limit,
        skip
      });

      return { 
        success: true, 
        storyworlds: legacyFormat 
      };
    } catch (error) {
      functions.logger.error('❌ Failed to get public storyworlds:', error);
      throw new functions.https.HttpsError(
        'internal',
        'Failed to get public storyworlds'
      );
    }
  }
);

/**
 * Create a new asset - MongoDB version
 */
export const createAssetMongo = functions.https.onCall(
  async (data: CreateAssetRequest, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Authentication required'
      );
    }

    const { storyworldId, name, type, description, tags = [] } = data;
    const uid = context.auth.uid;

    if (!storyworldId || !name || !type) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Storyworld ID, name, and type are required'
      );
    }

    try {
      // Verify storyworld exists and user has access
      const storyworld = await StoryworldService.getById(storyworldId);
      if (!storyworld || storyworld.ownerId !== uid) {
        throw new functions.https.HttpsError(
          'permission-denied',
          'Invalid storyworld or insufficient permissions'
        );
      }

      // Create default content based on asset type
      let content: any = {};
      if (type === 'CHARACTER') {
        content = {
          description: description || '',
          traits: [],
          relationships: [],
          backstory: ''
        };
      } else if (type === 'STORYLINE') {
        content = {
          tiptapJSON: {},
          plainText: description || ''
        };
      } else if (type === 'LORE') {
        content = {
          description: description || '',
          category: 'general'
        };
      }

      const asset = await AssetService.create({
        ownerId: uid,
        storyworldIds: [storyworldId],
        name: name.trim(),
        type,
        content,
        status: 'DRAFT',
        ipStatus: 'UNREGISTERED',
        description,
        tags
      });

      functions.logger.info('📄 Created asset via MongoDB', {
        assetId: asset._id,
        storyworldId,
        ownerId: uid,
        type,
        name: asset.name
      });

      const response: CreateAssetResponse = {
        success: true,
        assetId: asset._id
      };

      return response;
    } catch (error) {
      functions.logger.error('❌ Failed to create asset:', error);
      if (error instanceof functions.https.HttpsError) {
        throw error;
      }
      throw new functions.https.HttpsError(
        'internal',
        'Failed to create asset'
      );
    }
  }
);

/**
 * Get assets for a storyworld - MongoDB version
 */
export const getStoryworldAssetsMongo = functions.https.onCall(
  async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Authentication required'
      );
    }

    const { storyworldId } = data;
    const uid = context.auth.uid;

    if (!storyworldId) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Storyworld ID is required'
      );
    }

    try {
      // Verify storyworld access
      const storyworld = await StoryworldService.getById(storyworldId);
      if (!storyworld) {
        throw new functions.https.HttpsError(
          'not-found',
          'Storyworld not found'
        );
      }

      // Allow access to public storyworlds or owned storyworlds
      if (storyworld.visibility !== 'PUBLIC' && storyworld.ownerId !== uid) {
        throw new functions.https.HttpsError(
          'permission-denied',
          'Insufficient permissions'
        );
      }

      const assets = await AssetService.getByStoryworldId(storyworldId);

      // Convert to legacy format
      const legacyFormat = assets.map(asset => ({
        id: asset._id,
        ownerId: asset.ownerId,
        storyworldId: storyworldId, // Use single ID for backward compatibility
        name: asset.name,
        type: asset.type,
        content: asset.content,
        status: asset.status,
        ipStatus: asset.ipStatus,
        createdAt: { seconds: Math.floor(asset.createdAt.getTime() / 1000) },
        updatedAt: { seconds: Math.floor(asset.updatedAt.getTime() / 1000) },
        mediaUrl: asset.media?.url,
        thumbnailUrl: asset.media?.url, // Use same for now
        mimeType: asset.media?.mimeType,
        fileSize: asset.media?.size,
        duration: asset.media?.duration,
        views: asset.views,
        likes: asset.likes,
        tags: asset.tags,
        description: asset.description
      }));

      functions.logger.info('📄 Retrieved storyworld assets via MongoDB', {
        storyworldId,
        count: assets.length,
        requesterId: uid
      });

      return { 
        success: true, 
        assets: legacyFormat 
      };
    } catch (error) {
      functions.logger.error('❌ Failed to get storyworld assets:', error);
      if (error instanceof functions.https.HttpsError) {
        throw error;
      }
      throw new functions.https.HttpsError(
        'internal',
        'Failed to get assets'
      );
    }
  }
);

/**
 * Update an asset - MongoDB version
 */
export const updateAssetMongo = functions.https.onCall(
  async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Authentication required'
      );
    }

    const { assetId, updates } = data;
    const uid = context.auth.uid;

    if (!assetId || !updates) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Asset ID and updates are required'
      );
    }

    try {
      // Verify asset exists and user has access
      const asset = await AssetService.getById(assetId);
      if (!asset || asset.ownerId !== uid) {
        throw new functions.https.HttpsError(
          'permission-denied',
          'Invalid asset or insufficient permissions'
        );
      }

      const updatedAsset = await AssetService.update(assetId, updates);
      
      if (!updatedAsset) {
        throw new functions.https.HttpsError(
          'not-found',
          'Asset not found or update failed'
        );
      }

      functions.logger.info('📄 Updated asset via MongoDB', {
        assetId,
        ownerId: uid,
        updates: Object.keys(updates)
      });

      return { 
        success: true, 
        asset: {
          id: updatedAsset._id,
          ...updatedAsset
        }
      };
    } catch (error) {
      functions.logger.error('❌ Failed to update asset:', error);
      if (error instanceof functions.https.HttpsError) {
        throw error;
      }
      throw new functions.https.HttpsError(
        'internal',
        'Failed to update asset'
      );
    }
  }
);

/**
 * Delete an asset - MongoDB version
 */
export const deleteAssetMongo = functions.https.onCall(
  async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Authentication required'
      );
    }

    const { assetId } = data;
    const uid = context.auth.uid;

    if (!assetId) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Asset ID is required'
      );
    }

    try {
      const deleted = await AssetService.delete(assetId, uid);
      
      if (!deleted) {
        throw new functions.https.HttpsError(
          'not-found',
          'Asset not found or insufficient permissions'
        );
      }

      functions.logger.info('🗑️ Deleted asset via MongoDB', {
        assetId,
        ownerId: uid
      });

      return { success: true };
    } catch (error) {
      functions.logger.error('❌ Failed to delete asset:', error);
      if (error instanceof functions.https.HttpsError) {
        throw error;
      }
      throw new functions.https.HttpsError(
        'internal',
        'Failed to delete asset'
      );
    }
  }
);

/**
 * Search storyworlds and assets - MongoDB version
 */
export const searchContentMongo = functions.https.onCall(
  async (data, context) => {
    const { query, type = 'both', limit = 20 } = data;

    if (!query || query.trim().length < 2) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Search query must be at least 2 characters'
      );
    }

    try {
      let storyworlds: any[] = [];
      let assets: any[] = [];

      if (type === 'storyworlds' || type === 'both') {
        const rawStoryworlds = await StoryworldService.search(query, true, limit);
        storyworlds = rawStoryworlds.map(sw => ({
          id: sw._id,
          ownerId: sw.ownerId,
          name: sw.name,
          description: sw.description,
          coverImageUrl: sw.coverImageUrl,
          createdAt: { seconds: Math.floor(sw.createdAt.getTime() / 1000) },
          updatedAt: { seconds: Math.floor(sw.updatedAt.getTime() / 1000) },
          isPublic: true,
          assetCount: sw.stats?.totalAssets || 0,
          tags: sw.tags
        }));
      }

      if (type === 'assets' || type === 'both') {
        const rawAssets = await AssetService.search(query, undefined, undefined, limit);
        assets = rawAssets.map(asset => ({
          id: asset._id,
          ownerId: asset.ownerId,
          storyworldId: asset.storyworldIds[0], // Use first for compatibility
          name: asset.name,
          type: asset.type,
          description: asset.description,
          tags: asset.tags,
          views: asset.views,
          likes: asset.likes,
          createdAt: { seconds: Math.floor(asset.createdAt.getTime() / 1000) }
        }));
      }

      functions.logger.info('🔍 Search completed via MongoDB', {
        query,
        type,
        storyworldCount: storyworlds.length,
        assetCount: assets.length
      });

      return {
        success: true,
        results: {
          storyworlds,
          assets
        }
      };
    } catch (error) {
      functions.logger.error('❌ Failed to search content:', error);
      throw new functions.https.HttpsError(
        'internal',
        'Failed to search content'
      );
    }
  }
);

/**
 * Get a specific asset by ID
 */
export const getAssetByIdMongo = functions.https.onCall(
  async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Authentication required'
      );
    }

    const assetId = data.assetId as string;
    if (!assetId) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'assetId is required'
      );
    }

    try {
      const asset = await AssetService.getAssetById(assetId, context.auth.uid);

      if (!asset) {
        throw new functions.https.HttpsError(
          'not-found',
          'Asset not found or access denied'
        );
      }

      return { asset };
    } catch (error) {
      functions.logger.error('❌ Error fetching asset by ID:', error);
      
      if (error instanceof functions.https.HttpsError) {
        throw error;
      }
      
      throw new functions.https.HttpsError(
        'internal',
        'Failed to fetch asset'
      );
    }
  }
);

/**
 * Get user's own assets - MongoDB version (used by Library section)
 */
export const getUserAssetsMongo = functions.https.onCall(
  async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Authentication required'
      );
    }

    const uid = context.auth.uid;
    const { limit = 20, skip = 0, type } = data;

    try {
      const assets = await AssetService.getByOwnerId(uid);
      
      let filteredAssets = assets;
      if (type && type !== 'all') {
        filteredAssets = assets.filter(asset => asset.type === type.toUpperCase());
      }
      
      const paginatedAssets = filteredAssets
        .slice(skip, skip + limit)
        .map(asset => ({
          id: asset._id,
          ownerId: asset.ownerId,
          name: asset.name,
          type: asset.type,
          content: asset.content,
          status: asset.status,
          ipStatus: asset.ipStatus,
          createdAt: { seconds: Math.floor(asset.createdAt.getTime() / 1000) },
          updatedAt: { seconds: Math.floor(asset.updatedAt.getTime() / 1000) },
          mediaUrl: asset.media?.url,
          views: asset.views || 0,
          likes: asset.likes || 0,
          tags: asset.tags || [],
          description: asset.description
        }));
      
      functions.logger.info('👤 Retrieved user assets', {
        userId: uid,
        count: paginatedAssets.length,
        total: filteredAssets.length,
      });

      return {
        success: true,
        assets: paginatedAssets,
        total: filteredAssets.length
      };
    } catch (error) {
      functions.logger.error('❌ Failed to get user assets:', error);
      throw new functions.https.HttpsError(
        'internal',
        'Failed to get user assets'
      );
    }
  }
);



 