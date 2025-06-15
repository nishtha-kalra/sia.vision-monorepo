/**
 * Story Protocol Functions - Production Implementation
 * 
 * These functions provide comprehensive Story Protocol integration for IP protection,
 * licensing, and revenue management of assets in storyworlds.
 */

import * as functions from 'firebase-functions';
import { StoryProtocolService } from './lib/storyProtocolService';
import { AssetService } from './lib/assetService';
import { StoryworldService } from './lib/storyworldService';
import { getIPRegistrationService } from './lib/ipRegistrationService';

// Initialize Story Protocol service
const storyProtocolService = new StoryProtocolService();

/**
 * Register an asset as IP on Story Protocol with enhanced metadata
 */
export const registerAssetAsIP = functions.https.onCall(
  async (data, context) => {
    // Ensure user is authenticated
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Authentication required'
      );
    }

    const { assetId, pilTemplate = 'non-commercial-social-remixing', customMetadata, aiPrompt } = data;
    const uid = context.auth.uid;

    if (!assetId) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Asset ID is required'
      );
    }

    functions.logger.info('Story Protocol IP registration requested', {
      assetId,
      uid,
      pilTemplate,
      hasCustomMetadata: !!customMetadata,
      hasAiPrompt: !!aiPrompt
    });

    try {
      // Step 1: Get and validate asset
      const asset = await AssetService.getById(assetId);
      if (!asset) {
        throw new functions.https.HttpsError(
          'not-found',
          'Asset not found'
        );
      }

      if (asset.ownerId !== uid) {
        throw new functions.https.HttpsError(
          'permission-denied',
          'You do not own this asset'
        );
      }

      if (asset.ipStatus === 'REGISTERED') {
        throw new functions.https.HttpsError(
          'already-exists',
          'Asset is already registered as IP'
        );
      }

      // Step 2: Update asset status to pending
      await AssetService.update(assetId, {
        ipStatus: 'PENDING'
      });

      // Step 3: Get storyworld context for enhanced metadata
      let storyworldContext = null;
      if (asset.storyworldIds?.length > 0) {
        const storyworld = await StoryworldService.getById(asset.storyworldIds[0]);
        if (storyworld) {
          storyworldContext = {
            name: storyworld.name,
            description: storyworld.description,
            genre: storyworld.genre,
            themes: storyworld.themes
          };
        }
      }

      // Step 4: Generate enhanced metadata
      const metadata = await storyProtocolService.generateEnhancedMetadata(
        asset,
        storyworldContext,
        aiPrompt
      );

      // Step 5: Apply custom metadata if provided
      if (customMetadata) {
        Object.assign(metadata, customMetadata);
      }

      // Step 6: Validate metadata
      const validation = storyProtocolService.validateMetadata(metadata);
      if (!validation.valid) {
        throw new functions.https.HttpsError(
          'invalid-argument',
          `Invalid metadata: ${validation.errors.join(', ')}`
        );
      }

      // Step 7: Register IP asset
      const result = await storyProtocolService.registerIPAsset(asset, metadata, pilTemplate);

      if (!result.success) {
        // Update asset status back to unregistered on failure
        await AssetService.update(assetId, {
          ipStatus: 'UNREGISTERED'
        });

        throw new functions.https.HttpsError(
          'internal',
          result.error || 'Failed to register asset as IP'
        );
      }

      functions.logger.info('Story Protocol IP registration completed', {
        assetId,
        uid,
        ipId: result.ipId,
        txHash: result.txHash,
        gasSponsored: result.gasSponsored
      });

      return {
        success: true,
        ipId: result.ipId,
        txHash: result.txHash,
        metadataUri: result.metadataUri,
        pilTemplate,
        gasSponsored: result.gasSponsored,
        explorerUrl: `https://aeneid.storyscan.io/tx/${result.txHash}`
      };
    } catch (error) {
      functions.logger.error('Story Protocol IP registration failed', {
        assetId,
        uid,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      // Ensure asset status is reset on any error
      try {
        await AssetService.update(assetId, {
          ipStatus: 'UNREGISTERED'
        });
      } catch (updateError) {
        functions.logger.error('Failed to reset asset status', { assetId, updateError });
      }

      // Re-throw the original error if it's already an HttpsError
      if (error instanceof functions.https.HttpsError) {
        throw error;
      }

      throw new functions.https.HttpsError(
        'internal',
        'Failed to register asset as IP on Story Protocol'
      );
    }
  }
);

/**
 * Generate enhanced IP metadata for an asset
 */
export const generateIPMetadata = functions.https.onCall(
  async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Authentication required'
      );
    }

    const { assetId, aiPrompt, customAttributes } = data;
    const uid = context.auth.uid;

    if (!assetId) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Asset ID is required'
      );
    }

    functions.logger.info('IP metadata generation requested', {
      assetId,
      uid,
      hasAiPrompt: !!aiPrompt,
      hasCustomAttributes: !!customAttributes
    });

    try {
      // Get and validate asset
      const asset = await AssetService.getById(assetId);
      if (!asset) {
        throw new functions.https.HttpsError(
          'not-found',
          'Asset not found'
        );
      }

      if (asset.ownerId !== uid) {
        throw new functions.https.HttpsError(
          'permission-denied',
          'You do not own this asset'
        );
      }

      // Get storyworld context
      let storyworldContext = null;
      if (asset.storyworldIds?.length > 0) {
        const storyworld = await StoryworldService.getById(asset.storyworldIds[0]);
        if (storyworld) {
          storyworldContext = {
            name: storyworld.name,
            description: storyworld.description,
            genre: storyworld.genre,
            themes: storyworld.themes
          };
        }
      }

      // Generate metadata
      const metadata = await storyProtocolService.generateEnhancedMetadata(
        asset,
        storyworldContext,
        aiPrompt
      );

      // Add custom attributes if provided
      if (customAttributes && Array.isArray(customAttributes)) {
        metadata.attributes = [...(metadata.attributes || []), ...customAttributes];
      }

      functions.logger.info('IP metadata generated successfully', {
        assetId,
        uid,
        metadataSize: JSON.stringify(metadata).length
      });

      return {
        success: true,
        metadata,
        preview: {
          title: metadata.title,
          description: metadata.description,
          attributeCount: metadata.attributes?.length || 0,
          hasImage: !!metadata.image,
          hasAnimation: !!metadata.animation_url
        }
      };
    } catch (error) {
      functions.logger.error('IP metadata generation failed', {
        assetId,
        uid,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      if (error instanceof functions.https.HttpsError) {
        throw error;
      }

      throw new functions.https.HttpsError(
        'internal',
        'Failed to generate IP metadata'
      );
    }
  }
);

/**
 * Get information about an IP asset
 */
export const getIPAssetInfo = functions.https.onCall(
  async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Authentication required'
      );
    }

    const { assetId, ipId } = data;
    const uid = context.auth.uid;

    if (!assetId && !ipId) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Either assetId or ipId is required'
      );
    }

    functions.logger.info('IP asset info requested', {
      assetId,
      ipId,
      uid
    });

    try {
      let asset = null;
      let targetIpId = ipId;

      // If assetId is provided, get the asset and its IP ID
      if (assetId) {
        asset = await AssetService.getById(assetId);
        if (!asset) {
          throw new functions.https.HttpsError(
            'not-found',
            'Asset not found'
          );
        }

        if (asset.ownerId !== uid) {
          throw new functions.https.HttpsError(
            'permission-denied',
            'You do not own this asset'
          );
        }

        if (asset.ipStatus !== 'REGISTERED' || !asset.storyProtocol?.ipId) {
          throw new functions.https.HttpsError(
            'failed-precondition',
            'Asset is not registered as IP'
          );
        }

        targetIpId = asset.storyProtocol.ipId;
      }

      // Get IP asset information from Story Protocol
      const ipInfo = await storyProtocolService.getIPAssetInfo(targetIpId);

      // Combine with local asset data if available
      const response: any = {
        success: true,
        ipInfo,
        explorerUrl: `https://aeneid.storyscan.io/address/${targetIpId}`
      };

      if (asset) {
        response.assetInfo = {
          id: asset._id,
          name: asset.name,
          type: asset.type,
          description: asset.description,
          createdAt: asset.createdAt,
          storyProtocol: asset.storyProtocol
        };
      }

      functions.logger.info('IP asset info retrieved successfully', {
        assetId,
        ipId: targetIpId,
        uid
      });

      return response;
    } catch (error) {
      functions.logger.error('Failed to get IP asset info', {
        assetId,
        ipId,
        uid,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      if (error instanceof functions.https.HttpsError) {
        throw error;
      }

      throw new functions.https.HttpsError(
        'internal',
        'Failed to retrieve IP asset information'
      );
    }
  }
);

/**
 * Get available PIL (Programmable IP License) templates
 */
export const getPILTemplates = functions.https.onCall(
  async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Authentication required'
      );
    }

    const uid = context.auth.uid;

    functions.logger.info('PIL templates requested', { uid });

    try {
      const templates = await storyProtocolService.getPILTemplates();

      functions.logger.info('PIL templates retrieved successfully', {
        uid,
        templateCount: templates.length
      });

      return {
        success: true,
        templates
      };
    } catch (error) {
      functions.logger.error('Failed to get PIL templates', {
        uid,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      throw new functions.https.HttpsError(
        'internal',
        'Failed to retrieve PIL templates'
      );
    }
  }
);

/**
 * Batch register multiple assets as IP
 */
export const batchRegisterAssetsAsIP = functions.https.onCall(
  async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Authentication required'
      );
    }

    const { assetIds, pilTemplate = 'non-commercial-social-remixing', aiPrompt } = data;
    const uid = context.auth.uid;

    if (!Array.isArray(assetIds) || assetIds.length === 0) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'assetIds must be a non-empty array'
      );
    }

    if (assetIds.length > 10) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Cannot register more than 10 assets at once'
      );
    }

    functions.logger.info('Batch IP registration requested', {
      uid,
      assetCount: assetIds.length,
      pilTemplate,
      hasAiPrompt: !!aiPrompt
    });

    const results = [];
    let successCount = 0;
    let failureCount = 0;

    // Process each asset individually
    for (const assetId of assetIds) {
      try {
        // Call the individual registration function
        const result = await registerAssetAsIP.run(
          { assetId, pilTemplate, aiPrompt },
          { auth: context.auth, rawRequest: context.rawRequest } as any
        );

        results.push({
          assetId,
          success: true,
          ...result
        });
        successCount++;
      } catch (error) {
        results.push({
          assetId,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        failureCount++;

        functions.logger.error('Batch registration failed for asset', {
          assetId,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    functions.logger.info('Batch IP registration completed', {
      uid,
      totalAssets: assetIds.length,
      successCount,
      failureCount
    });

    return {
      success: successCount > 0,
      results,
      summary: {
        total: assetIds.length,
        successful: successCount,
        failed: failureCount,
        successRate: Math.round((successCount / assetIds.length) * 100)
      }
    };
  }
);

/**
 * Get user's registered IP assets with revenue and licensing information
 */
export const getUserIPAssets = functions.https.onCall(
  async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Authentication required'
      );
    }

    const { storyworldId, limit = 50, offset = 0 } = data;
    const uid = context.auth.uid;

    functions.logger.info('User IP assets requested', {
      uid,
      storyworldId,
      limit,
      offset
    });

    try {
      // Get registered IP assets for the user
      const assets = await AssetService.getRegisteredIPs(uid);

      // Filter by storyworld if specified
      let filteredAssets = assets;
      if (storyworldId) {
        filteredAssets = assets.filter(asset => 
          asset.storyworldIds.includes(storyworldId)
        );
      }

      // Apply pagination
      const paginatedAssets = filteredAssets.slice(offset, offset + limit);

      // Calculate summary statistics
      const totalRevenue = filteredAssets.reduce((sum, asset) => 
        sum + (asset.storyProtocol?.totalRevenue || 0), 0
      );

      const totalRoyalties = filteredAssets.reduce((sum, asset) => 
        sum + (asset.storyProtocol?.totalRoyaltiesEarned || 0), 0
      );

      const assetsByType = filteredAssets.reduce((acc, asset) => {
        acc[asset.type] = (acc[asset.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      functions.logger.info('User IP assets retrieved successfully', {
        uid,
        totalAssets: filteredAssets.length,
        returnedAssets: paginatedAssets.length,
        totalRevenue,
        totalRoyalties
      });

      return {
        success: true,
        assets: paginatedAssets.map(asset => ({
          id: asset._id,
          name: asset.name,
          type: asset.type,
          description: asset.description,
          ipStatus: asset.ipStatus,
          storyProtocol: asset.storyProtocol,
          createdAt: asset.createdAt,
          updatedAt: asset.updatedAt
        })),
        pagination: {
          total: filteredAssets.length,
          limit,
          offset,
          hasMore: offset + limit < filteredAssets.length
        },
        summary: {
          totalAssets: filteredAssets.length,
          totalRevenue,
          totalRoyalties,
          assetsByType
        }
      };
    } catch (error) {
      functions.logger.error('Failed to get user IP assets', {
        uid,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      throw new functions.https.HttpsError(
        'internal',
        'Failed to retrieve IP assets'
      );
    }
  }
);

/**
 * Create IP registration record - Step 1 of streamlined process
 */
export const createIPRegistration = functions.https.onCall(
  async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Authentication required'
      );
    }

    const { assetId, pilTemplate = 'non-commercial-social-remixing', customMetadata, aiPrompt } = data;
    const uid = context.auth.uid;

    if (!assetId) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Asset ID is required'
      );
    }

    functions.logger.info('Creating IP registration record', {
      assetId,
      uid,
      pilTemplate,
      hasCustomMetadata: !!customMetadata,
      hasAiPrompt: !!aiPrompt
    });

    try {
      // Get and validate asset
      const asset = await AssetService.getById(assetId);
      if (!asset) {
        throw new functions.https.HttpsError(
          'not-found',
          'Asset not found'
        );
      }

      if (asset.ownerId !== uid) {
        throw new functions.https.HttpsError(
          'permission-denied',
          'You do not own this asset'
        );
      }

      // Check if already registered or in progress
      const ipService = await getIPRegistrationService();
      const existingRegistration = await ipService.getRegistrationByAsset(assetId);
      
      if (existingRegistration && ['COMPLETED', 'PENDING', 'GENERATING_METADATA', 'UPLOADING_METADATA', 'REGISTERING_IP'].includes(existingRegistration.status)) {
        return {
          success: true,
          registrationId: existingRegistration._id,
          status: existingRegistration.status,
          message: 'Registration already exists',
          existing: true
        };
      }

      // Get storyworld context
      let storyworldId = undefined;
      if (asset.storyworldIds?.length > 0) {
        storyworldId = asset.storyworldIds[0];
      }

      // Create registration record
      const registration = await ipService.createRegistration({
        assetId,
        userId: uid,
        storyworldId,
        pilTemplate,
        customMetadata,
        aiPrompt
      });

      // Update asset's IP status to indicate registration is in progress
      await AssetService.update(assetId, {
        ipStatus: 'PENDING'
      });

      functions.logger.info('IP registration record created', {
        registrationId: registration._id,
        assetId,
        uid
      });

      return {
        success: true,
        registrationId: registration._id,
        status: registration.status,
        message: 'Registration record created successfully'
      };

    } catch (error) {
      functions.logger.error('Failed to create IP registration record', {
        assetId,
        uid,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      if (error instanceof functions.https.HttpsError) {
        throw error;
      }

      throw new functions.https.HttpsError(
        'internal',
        'Failed to create IP registration record'
      );
    }
  }
);

/**
 * Process IP registration - Async background processing
 */
export const processIPRegistration = functions.https.onCall(
  async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Authentication required'
      );
    }

    const { registrationId } = data;
    const uid = context.auth.uid;

    if (!registrationId) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Registration ID is required'
      );
    }

    functions.logger.info('Processing IP registration', {
      registrationId,
      uid
    });

    try {
      const ipService = await getIPRegistrationService();
      const registration = await ipService.getRegistration(registrationId);

      if (!registration) {
        throw new functions.https.HttpsError(
          'not-found',
          'Registration not found'
        );
      }

      if (registration.userId !== uid) {
        throw new functions.https.HttpsError(
          'permission-denied',
          'You do not own this registration'
        );
      }

      // Update status to pending
      await ipService.updateStatus(registrationId, 'PENDING', {
        message: 'Registration submitted for processing'
      });

      // Start async processing (this will continue in background)
      processRegistrationAsync(registrationId).catch(error => {
        functions.logger.error('Async processing failed', {
          registrationId,
          error: error.message
        });
      });

      return {
        success: true,
        registrationId,
        status: 'PENDING',
        message: 'Registration submitted for processing'
      };

    } catch (error) {
      functions.logger.error('Failed to process IP registration', {
        registrationId,
        uid,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      if (error instanceof functions.https.HttpsError) {
        throw error;
      }

      throw new functions.https.HttpsError(
        'internal',
        'Failed to process IP registration'
      );
    }
  }
);

/**
 * Get IP registration status
 */
export const getIPRegistrationStatus = functions.https.onCall(
  async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Authentication required'
      );
    }

    const { registrationId, assetId } = data;
    const uid = context.auth.uid;

    if (!registrationId && !assetId) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Either registrationId or assetId is required'
      );
    }

    try {
      const ipService = await getIPRegistrationService();
      let registration = null;

      if (registrationId) {
        registration = await ipService.getRegistration(registrationId);
      } else if (assetId) {
        registration = await ipService.getRegistrationByAsset(assetId);
      }

      if (!registration) {
        throw new functions.https.HttpsError(
          'not-found',
          'Registration not found'
        );
      }

      if (registration.userId !== uid) {
        throw new functions.https.HttpsError(
          'permission-denied',
          'You do not own this registration'
        );
      }

      return {
        success: true,
        registration: {
          id: registration._id,
          assetId: registration.assetId,
          status: registration.status,
          pilTemplate: registration.pilTemplate,
          statusHistory: registration.statusHistory,
          createdAt: registration.createdAt,
          updatedAt: registration.updatedAt,
          completedAt: registration.completedAt,
          ipId: registration.ipId,
          txHash: registration.txHash,
          metadataUri: registration.metadataUri,
          gasSponsored: registration.gasSponsored,
          lastError: registration.lastError,
          retryCount: registration.retryCount
        }
      };

    } catch (error) {
      functions.logger.error('Failed to get IP registration status', {
        registrationId,
        assetId,
        uid,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      if (error instanceof functions.https.HttpsError) {
        throw error;
      }

      throw new functions.https.HttpsError(
        'internal',
        'Failed to get registration status'
      );
    }
  }
);

/**
 * Get user's IP registrations with stats
 */
export const getUserIPRegistrations = functions.https.onCall(
  async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Authentication required'
      );
    }

    const { status, limit = 20, offset = 0, storyworldId } = data;
    const uid = context.auth.uid;

    try {
      const ipService = await getIPRegistrationService();
      
      const [result, stats] = await Promise.all([
        ipService.getUserRegistrations(uid, { status, limit, offset, storyworldId }),
        ipService.getUserStats(uid)
      ]);

      return {
        success: true,
        registrations: result.registrations.map(reg => ({
          id: reg._id,
          assetId: reg.assetId,
          status: reg.status,
          pilTemplate: reg.pilTemplate,
          createdAt: reg.createdAt,
          updatedAt: reg.updatedAt,
          completedAt: reg.completedAt,
          ipId: reg.ipId,
          txHash: reg.txHash,
          lastError: reg.lastError
        })),
        pagination: {
          total: result.total,
          limit,
          offset,
          hasMore: result.hasMore
        },
        stats
      };

    } catch (error) {
      functions.logger.error('Failed to get user IP registrations', {
        uid,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      throw new functions.https.HttpsError(
        'internal',
        'Failed to get user registrations'
      );
    }
  }
);

/**
 * Async processing function (runs in background)
 */
async function processRegistrationAsync(registrationId: string): Promise<void> {
  const ipService = await getIPRegistrationService();
  
  try {
    const registration = await ipService.getRegistration(registrationId);
    if (!registration) {
      throw new Error('Registration not found');
    }

    // Step 1: Generate metadata
    await ipService.updateStatus(registrationId, 'GENERATING_METADATA', {
      message: 'Generating enhanced metadata with AI'
    });

    const asset = await AssetService.getById(registration.assetId);
    if (!asset) {
      throw new Error('Asset not found');
    }

    // Get storyworld context
    let storyworldContext = null;
    if (registration.storyworldId) {
      const storyworld = await StoryworldService.getById(registration.storyworldId);
      if (storyworld) {
        storyworldContext = {
          name: storyworld.name,
          description: storyworld.description,
          genre: storyworld.genre,
          themes: storyworld.themes
        };
      }
    }

    // Generate enhanced metadata
    const metadata = await storyProtocolService.generateEnhancedMetadata(
      asset,
      storyworldContext,
      registration.aiPrompt
    );

    // Apply custom metadata if provided
    if (registration.customMetadata) {
      Object.assign(metadata, registration.customMetadata);
    }

    // Step 2: Upload metadata
    await ipService.updateStatus(registrationId, 'UPLOADING_METADATA', {
      message: 'Uploading metadata to IPFS',
      enhancedMetadata: metadata
    });

    // TODO: Upload to IPFS (mock for now)
    const metadataUri = `ipfs://Qm${Math.random().toString(36).substr(2, 44)}`;
    const ipfsHash = metadataUri.replace('ipfs://', '');

    // Step 3: Register IP
    await ipService.updateStatus(registrationId, 'REGISTERING_IP', {
      message: 'Registering IP on Story Protocol',
      metadataUri,
      ipfsHash
    });

    // Register IP asset
    const result = await storyProtocolService.registerIPAsset(
      asset, 
      metadata, 
      registration.pilTemplate
    );

    if (!result.success) {
      throw new Error(result.error || 'Failed to register IP');
    }

    // Step 4: Complete registration
    await ipService.updateStatus(registrationId, 'COMPLETED', {
      message: 'IP registration completed successfully',
      ipId: result.ipId,
      txHash: result.txHash,
      gasSponsored: result.gasSponsored
    });

    // Update asset status
    await AssetService.update(registration.assetId, {
      ipStatus: 'REGISTERED',
      storyProtocol: {
        ipId: result.ipId || '',
        txHash: result.txHash || '',
        metadataUrl: metadataUri,
        pilTemplate: registration.pilTemplate,
        registeredAt: new Date(),
        licenseTerms: {
          allowDerivatives: true,
          commercialUse: registration.pilTemplate.includes('commercial'),
          royaltyPercentage: 0,
          territory: 'GLOBAL',
          attribution: true
        },
        derivativeIds: [],
        totalRevenue: 0,
        totalRoyaltiesPaid: 0,
        totalRoyaltiesEarned: 0
      }
    });

    functions.logger.info('IP registration completed successfully', {
      registrationId,
      assetId: registration.assetId,
      ipId: result.ipId,
      txHash: result.txHash
    });

  } catch (error) {
    await ipService.updateStatus(registrationId, 'FAILED', {
      message: 'Registration failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    await ipService.incrementRetryCount(registrationId);

    // Update asset status to failed
    try {
      const registration = await ipService.getRegistration(registrationId);
      if (registration) {
        await AssetService.update(registration.assetId, {
          ipStatus: 'FAILED'
        });
      }
    } catch (updateError) {
      functions.logger.error('Failed to update asset status to FAILED', {
        registrationId,
        error: updateError instanceof Error ? updateError.message : 'Unknown error'
      });
    }

    functions.logger.error('IP registration failed', {
      registrationId,
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    throw error;
  }
}

/**
 * Start IP Protection with Privy Integration
 * This function initiates the IP protection process and returns transaction data for Privy to execute
 */
export const startIPProtectionWithPrivy = functions.https.onCall(async (data, context) => {
  try {
    // Verify authentication
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

    const { registrationId, walletInfo } = data;
    const uid = context.auth.uid;

    // Validate input
    if (!registrationId || !walletInfo?.address) {
      throw new functions.https.HttpsError('invalid-argument', 'Registration ID and wallet info are required');
    }

    functions.logger.info('Starting IP protection with Privy', {
      registrationId,
      walletAddress: walletInfo.address,
      uid
    });

    // Get Story Protocol service
    const storyService = new StoryProtocolService();
    await storyService.initialize();

    // Start the protection process
    const result = await storyService.protectIPWithPrivy(registrationId, {
      address: walletInfo.address,
      type: walletInfo.type || 'smart_wallet',
      privyUserId: walletInfo.privyUserId || uid
    });

    if (!result.success) {
      throw new functions.https.HttpsError('internal', result.error || 'IP protection failed');
    }

    functions.logger.info('IP protection started successfully', {
      registrationId,
      ipId: result.ipId,
      transactionCount: result.transactions.length
    });

    return {
      success: true,
      ipId: result.ipId,
      tokenId: result.tokenId,
      transactions: result.transactions,
      message: 'IP protection completed successfully'
    };

  } catch (error) {
    functions.logger.error('Failed to start IP protection with Privy', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    if (error instanceof functions.https.HttpsError) {
      throw error;
    }

    throw new functions.https.HttpsError('internal', 'Failed to start IP protection');
  }
});

/**
 * Get Transaction Data for Privy Execution
 * This function returns the encoded transaction data that Privy can execute
 */
export const getTransactionDataForPrivy = functions.https.onCall(async (data, context) => {
  try {
    // Verify authentication
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

    const { registrationId } = data;
    const uid = context.auth.uid;

    // Validate input
    if (!registrationId) {
      throw new functions.https.HttpsError('invalid-argument', 'Registration ID is required');
    }

    functions.logger.info('Getting transaction data for Privy', {
      registrationId,
      uid
    });

    // Get Story Protocol service
    const storyService = new StoryProtocolService();
    await storyService.initialize();

    // Get transaction data
    const result = await storyService.getTransactionDataForPrivy(registrationId);

    if (!result.success) {
      throw new functions.https.HttpsError('internal', result.error || 'Failed to get transaction data');
    }

    functions.logger.info('Transaction data retrieved successfully', {
      registrationId,
      hasTransactionData: !!result.transactionData
    });

    return {
      success: true,
      transactionData: result.transactionData,
      message: 'Transaction data retrieved successfully'
    };

  } catch (error) {
    functions.logger.error('Failed to get transaction data for Privy', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    if (error instanceof functions.https.HttpsError) {
      throw error;
    }

    throw new functions.https.HttpsError('internal', 'Failed to get transaction data');
  }
});

/**
 * Update Transaction Status
 * This function is called after Privy executes a transaction to update the registration status
 */
export const updateTransactionStatus = functions.https.onCall(async (data, context) => {
  try {
    // Verify authentication
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

    const { registrationId, txHash, blockNumber, success, error } = data;
    const uid = context.auth.uid;

    // Validate input
    if (!registrationId || !txHash) {
      throw new functions.https.HttpsError('invalid-argument', 'Registration ID and transaction hash are required');
    }

    functions.logger.info('Updating transaction status', {
      registrationId,
      txHash,
      success,
      uid
    });

    const ipService = await getIPRegistrationService();

    if (success) {
      // Update status to completed
      await ipService.updateStatus(registrationId, 'COMPLETED', {
        message: 'Transaction confirmed on blockchain',
        txHash,
        blockNumber,
        gasSponsored: true,
        paymasterUsed: true
      });

      // Update asset status
      const registration = await ipService.getRegistration(registrationId);
      if (registration) {
        await AssetService.update(registration.assetId, {
          ipStatus: 'REGISTERED'
        });
      }
    } else {
      // Update status to failed
      await ipService.updateStatus(registrationId, 'FAILED', {
        message: 'Transaction failed on blockchain',
        txHash,
        error: error || 'Transaction failed'
      });

      // Update asset status
      const registration = await ipService.getRegistration(registrationId);
      if (registration) {
        await AssetService.update(registration.assetId, {
          ipStatus: 'FAILED'
        });
      }
    }

    functions.logger.info('Transaction status updated successfully', {
      registrationId,
      txHash,
      success
    });

    return {
      success: true,
      message: 'Transaction status updated successfully'
    };

  } catch (error) {
    functions.logger.error('Failed to update transaction status', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    if (error instanceof functions.https.HttpsError) {
      throw error;
    }

    throw new functions.https.HttpsError('internal', 'Failed to update transaction status');
  }
});

/**
 * Get IP Registration Lifecycle
 * This function returns the complete lifecycle and transaction history of an IP registration
 */
export const getIPRegistrationLifecycle = functions.https.onCall(async (data, context) => {
  try {
    // Verify authentication
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

    const { registrationId } = data;
    const uid = context.auth.uid;

    // Validate input
    if (!registrationId) {
      throw new functions.https.HttpsError('invalid-argument', 'Registration ID is required');
    }

    functions.logger.info('Getting IP registration lifecycle', {
      registrationId,
      uid
    });

    const ipService = await getIPRegistrationService();
    const registration = await ipService.getRegistration(registrationId);

    if (!registration) {
      throw new functions.https.HttpsError('not-found', 'Registration not found');
    }

    // Verify user owns this registration
    if (registration.userId !== uid) {
      throw new functions.https.HttpsError('permission-denied', 'Access denied');
    }

    // Get asset information
    const asset = await AssetService.getById(registration.assetId);

    functions.logger.info('IP registration lifecycle retrieved successfully', {
      registrationId,
      status: registration.status,
      transactionCount: registration.transactions?.length || 0
    });

    return {
      success: true,
      registration: {
        ...registration,
        asset: asset ? {
          id: asset._id,
          name: asset.name,
          type: asset.type,
          ipStatus: asset.ipStatus
        } : null
      },
      message: 'Registration lifecycle retrieved successfully'
    };

  } catch (error) {
    functions.logger.error('Failed to get IP registration lifecycle', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    if (error instanceof functions.https.HttpsError) {
      throw error;
    }

    throw new functions.https.HttpsError('internal', 'Failed to get registration lifecycle');
  }
}); 