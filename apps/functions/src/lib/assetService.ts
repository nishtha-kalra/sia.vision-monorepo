import { ObjectId } from "mongodb";
import { getDb } from "./mongoClient";
import { MongoAsset, AssetType } from "../types";
import { StoryworldService } from "./storyworldService";
import * as functions from "firebase-functions";

const COLLECTION_NAME = "assets";

export class AssetService {
  
  /**
   * Create a new asset
   */
  static async create(asset: Omit<MongoAsset, '_id' | 'createdAt' | 'updatedAt'>): Promise<MongoAsset> {
    const db = await getDb();
    const collection = db.collection<MongoAsset>(COLLECTION_NAME);
    
    const now = new Date();
    const newAsset: MongoAsset = {
      _id: new ObjectId().toHexString(),
      ...asset,
      status: asset.status || 'DRAFT',
      ipStatus: asset.ipStatus || 'UNREGISTERED',
      views: 0,
      likes: 0,
      createdAt: now,
      updatedAt: now,
    };
    
    try {
      await collection.insertOne(newAsset);
      
      // Update storyworld stats
      await this.updateStoryworldStats(asset.storyworldIds);
      
      functions.logger.info(`📄 Created asset: ${newAsset._id}`);
      return newAsset;
    } catch (error) {
      functions.logger.error("❌ Failed to create asset:", error);
      throw new Error("Failed to create asset");
    }
  }
  
  /**
   * Get an asset by ID with ownership verification
   */
  static async getAssetById(id: string, ownerId: string): Promise<MongoAsset | null> {
    const db = await getDb();
    const collection = db.collection<MongoAsset>(COLLECTION_NAME);
    
    try {
      const asset = await collection.findOne({ 
        _id: id, 
        ownerId 
      });
      return asset;
    } catch (error) {
      functions.logger.error("❌ Failed to get asset by ID:", error);
      return null;
    }
  }
  
  /**
   * Get an asset by ID (without ownership check)
   */
  static async getById(id: string): Promise<MongoAsset | null> {
    const db = await getDb();
    const collection = db.collection<MongoAsset>(COLLECTION_NAME);
    
    try {
      const asset = await collection.findOne({ _id: id });
      return asset;
    } catch (error) {
      functions.logger.error("❌ Failed to get asset:", error);
      return null;
    }
  }
  
  /**
   * Get all assets for a storyworld
   */
  static async getByStoryworldId(storyworldId: string): Promise<MongoAsset[]> {
    const db = await getDb();
    const collection = db.collection<MongoAsset>(COLLECTION_NAME);
    
    try {
      const assets = await collection
        .find({ storyworldIds: storyworldId })
        .sort({ updatedAt: -1 })
        .toArray();
      return assets;
    } catch (error) {
      functions.logger.error("❌ Failed to get storyworld assets:", error);
      throw new Error("Failed to get assets");
    }
  }
  
  /**
   * Get all assets for a user
   */
  static async getByOwnerId(ownerId: string): Promise<MongoAsset[]> {
    const db = await getDb();
    const collection = db.collection<MongoAsset>(COLLECTION_NAME);
    
    try {
      const assets = await collection
        .find({ ownerId })
        .sort({ updatedAt: -1 })
        .toArray();
      return assets;
    } catch (error) {
      functions.logger.error("❌ Failed to get user assets:", error);
      throw new Error("Failed to get assets");
    }
  }
  
  /**
   * Get assets by type and storyworld
   */
  static async getByTypeAndStoryworld(
    type: AssetType, 
    storyworldId: string
  ): Promise<MongoAsset[]> {
    const db = await getDb();
    const collection = db.collection<MongoAsset>(COLLECTION_NAME);
    
    try {
      const assets = await collection
        .find({ 
          type,
          storyworldIds: storyworldId 
        })
        .sort({ updatedAt: -1 })
        .toArray();
      return assets;
    } catch (error) {
      functions.logger.error("❌ Failed to get assets by type:", error);
      throw new Error("Failed to get assets");
    }
  }
  
  /**
   * Update an asset
   */
  static async update(
    id: string, 
    updates: Partial<Omit<MongoAsset, '_id' | 'createdAt' | 'updatedAt'>>
  ): Promise<MongoAsset | null> {
    const db = await getDb();
    const collection = db.collection<MongoAsset>(COLLECTION_NAME);
    
    try {
      const result = await collection.findOneAndUpdate(
        { _id: id },
        { 
          $set: { 
            ...updates, 
            updatedAt: new Date() 
          } 
        },
        { returnDocument: 'after' }
      );
      
      if (result) {
        functions.logger.info(`📄 Updated asset: ${id}`);
        
        // Update storyworld stats if storyworld changed
        if (updates.storyworldIds) {
          await this.updateStoryworldStats(updates.storyworldIds);
        }
      }
      
      return result;
    } catch (error) {
      functions.logger.error("❌ Failed to update asset:", error);
      throw new Error("Failed to update asset");
    }
  }
  
  /**
   * Delete an asset
   */
  static async delete(id: string, ownerId: string): Promise<boolean> {
    const db = await getDb();
    const collection = db.collection<MongoAsset>(COLLECTION_NAME);
    
    try {
      // Get asset first to know which storyworlds to update
      const asset = await collection.findOne({ _id: id, ownerId });
      if (!asset) return false;
      
      const result = await collection.deleteOne({ 
        _id: id, 
        ownerId 
      });
      
      if (result.deletedCount > 0) {
        // Update storyworld stats
        await this.updateStoryworldStats(asset.storyworldIds);
        
        functions.logger.info(`🗑️ Deleted asset: ${id}`);
        return true;
      }
      
      return false;
    } catch (error) {
      functions.logger.error("❌ Failed to delete asset:", error);
      throw new Error("Failed to delete asset");
    }
  }
  
  /**
   * Search assets by name or tags
   */
  static async search(
    query: string,
    storyworldId?: string,
    type?: AssetType,
    limit: number = 20
  ): Promise<MongoAsset[]> {
    const db = await getDb();
    const collection = db.collection<MongoAsset>(COLLECTION_NAME);
    
    try {
      const searchFilter: any = {
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { tags: { $in: [new RegExp(query, 'i')] } }
        ]
      };
      
      if (storyworldId) {
        searchFilter.storyworldIds = storyworldId;
      }
      
      if (type) {
        searchFilter.type = type;
      }
      
      const assets = await collection
        .find(searchFilter)
        .limit(limit)
        .toArray();
        
      return assets;
    } catch (error) {
      functions.logger.error("❌ Failed to search assets:", error);
      throw new Error("Failed to search assets");
    }
  }
  
  /**
   * Get assets with Story Protocol IP registration
   */
  static async getRegisteredIPs(ownerId?: string): Promise<MongoAsset[]> {
    const db = await getDb();
    const collection = db.collection<MongoAsset>(COLLECTION_NAME);
    
    try {
      const filter: any = {
        ipStatus: 'REGISTERED',
        'storyProtocol.ipId': { $exists: true }
      };
      
      if (ownerId) {
        filter.ownerId = ownerId;
      }
      
      const assets = await collection
        .find(filter)
        .sort({ 'storyProtocol.registeredAt': -1 })
        .toArray();
        
      return assets;
    } catch (error) {
      functions.logger.error("❌ Failed to get registered IPs:", error);
      throw new Error("Failed to get registered IPs");
    }
  }
  
  /**
   * Update storyworld stats after asset changes
   */
  private static async updateStoryworldStats(storyworldIds: string[]): Promise<void> {
    for (const storyworldId of storyworldIds) {
      try {
        const assets = await this.getByStoryworldId(storyworldId);
        
        const stats = {
          totalAssets: assets.length,
          characters: assets.filter(a => a.type === 'CHARACTER').length,
          storylines: assets.filter(a => a.type === 'STORYLINE').length,
          loreEntries: assets.filter(a => a.type === 'LORE').length,
        };
        
        await StoryworldService.updateStats(storyworldId, stats);
      } catch (error) {
        functions.logger.error(`❌ Failed to update stats for storyworld ${storyworldId}:`, error);
        // Don't throw - stats updates are non-critical
      }
    }
  }
  
  /**
   * Increment view count
   */
  static async incrementViews(id: string): Promise<void> {
    const db = await getDb();
    const collection = db.collection<MongoAsset>(COLLECTION_NAME);
    
    try {
      await collection.updateOne(
        { _id: id },
        { 
          $inc: { views: 1 },
          $set: { updatedAt: new Date() }
        }
      );
    } catch (error) {
      functions.logger.error("❌ Failed to increment views:", error);
      // Don't throw - view tracking is non-critical
    }
  }
  
  /**
   * Toggle like status
   */
  static async toggleLike(id: string, increment: boolean): Promise<void> {
    const db = await getDb();
    const collection = db.collection<MongoAsset>(COLLECTION_NAME);
    
    try {
      await collection.updateOne(
        { _id: id },
        { 
          $inc: { likes: increment ? 1 : -1 },
          $set: { updatedAt: new Date() }
        }
      );
    } catch (error) {
      functions.logger.error("❌ Failed to toggle like:", error);
      // Don't throw - like tracking is non-critical
    }
  }
} 