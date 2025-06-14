import { ObjectId } from "mongodb";
import { getDb } from "./mongoClient";
import { MongoStoryworld } from "../types";
import * as functions from "firebase-functions";

const COLLECTION_NAME = "storyworlds";

export class StoryworldService {
  
  /**
   * Create a new storyworld
   */
  static async create(storyworld: Omit<MongoStoryworld, '_id' | 'createdAt' | 'updatedAt'>): Promise<MongoStoryworld> {
    const db = await getDb();
    const collection = db.collection<MongoStoryworld>(COLLECTION_NAME);
    
    const now = new Date();
    const objectId = new ObjectId();
    const newStoryworld: MongoStoryworld = {
      _id: objectId.toHexString(), // Keep as string for interface compatibility
      ...storyworld,
      stats: storyworld.stats || {
        totalAssets: 0,
        characters: 0,
        storylines: 0,
        loreEntries: 0,
      },
      createdAt: now,
      updatedAt: now,
    };
    
    try {
      // Insert with ObjectId for MongoDB (bypassing TypeScript)
      await collection.insertOne({
        ...newStoryworld,
        _id: objectId
      } as any);
      functions.logger.info(`📝 Created storyworld: ${newStoryworld._id}`);
      return newStoryworld;
    } catch (error) {
      functions.logger.error("❌ Failed to create storyworld:", error);
      throw new Error("Failed to create storyworld");
    }
  }
  
  /**
   * Get a storyworld by ID
   */
  static async getById(id: string): Promise<MongoStoryworld | null> {
    const db = await getDb();
    const collection = db.collection<MongoStoryworld>(COLLECTION_NAME);
    
    try {
      const storyworld = await collection.findOne({ _id: new ObjectId(id) } as any);
      
      // Convert ObjectId back to string for interface compatibility
      if (storyworld) {
        return {
          ...storyworld,
          _id: storyworld._id.toString()
        } as MongoStoryworld;
      }
      return null;
    } catch (error) {
      functions.logger.error("❌ Failed to get storyworld:", error);
      return null;
    }
  }
  
  /**
   * Get all storyworlds for a user
   */
  static async getByOwnerId(ownerId: string): Promise<MongoStoryworld[]> {
    const db = await getDb();
    const collection = db.collection<MongoStoryworld>(COLLECTION_NAME);
    
    try {
      const storyworlds = await collection
        .find({ ownerId })
        .sort({ updatedAt: -1 })
        .toArray();
      
      // Convert ObjectId back to string for interface compatibility
      return storyworlds.map(storyworld => ({
        ...storyworld,
        _id: storyworld._id.toString()
      })) as MongoStoryworld[];
    } catch (error) {
      functions.logger.error("❌ Failed to get user storyworlds:", error);
      throw new Error("Failed to get storyworlds");
    }
  }
  
  /**
   * Get public storyworlds for explore page
   */
  static async getPublic(limit: number = 20, skip: number = 0): Promise<MongoStoryworld[]> {
    const db = await getDb();
    const collection = db.collection<MongoStoryworld>(COLLECTION_NAME);
    
    try {
      const storyworlds = await collection
        .find({ visibility: 'PUBLIC' })
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray();
      
      // Convert ObjectId back to string for interface compatibility
      return storyworlds.map(storyworld => ({
        ...storyworld,
        _id: storyworld._id.toString()
      })) as MongoStoryworld[];
    } catch (error) {
      functions.logger.error("❌ Failed to get public storyworlds:", error);
      throw new Error("Failed to get public storyworlds");
    }
  }
  
  /**
   * Update a storyworld
   */
  static async update(
    id: string, 
    updates: Partial<Omit<MongoStoryworld, '_id' | 'createdAt' | 'updatedAt'>>
  ): Promise<MongoStoryworld | null> {
    const db = await getDb();
    const collection = db.collection<MongoStoryworld>(COLLECTION_NAME);
    
    try {
      const result = await collection.findOneAndUpdate(
        { _id: new ObjectId(id) } as any,
        { 
          $set: { 
            ...updates, 
            updatedAt: new Date() 
          } 
        },
        { returnDocument: 'after' }
      );
      
      if (result) {
        functions.logger.info(`📝 Updated storyworld: ${id}`);
        
        // Convert ObjectId back to string for interface compatibility
        return {
          ...result,
          _id: result._id.toString()
        } as MongoStoryworld;
      }
      
      return null;
    } catch (error) {
      functions.logger.error("❌ Failed to update storyworld:", error);
      throw new Error("Failed to update storyworld");
    }
  }
  
  /**
   * Update storyworld stats (asset counts)
   */
  static async updateStats(id: string, stats: MongoStoryworld['stats']): Promise<void> {
    const db = await getDb();
    const collection = db.collection<MongoStoryworld>(COLLECTION_NAME);
    
    try {
      await collection.updateOne(
        { _id: new ObjectId(id) } as any,
        { 
          $set: { 
            stats,
            updatedAt: new Date() 
          } 
        }
      );
      functions.logger.info(`📊 Updated stats for storyworld: ${id}`);
    } catch (error) {
      functions.logger.error("❌ Failed to update storyworld stats:", error);
      // Don't throw - stats updates are non-critical
    }
  }
  
  /**
   * Delete a storyworld
   */
  static async delete(id: string, ownerId: string): Promise<boolean> {
    const db = await getDb();
    const collection = db.collection<MongoStoryworld>(COLLECTION_NAME);
    
    try {
      const result = await collection.deleteOne({ 
        _id: new ObjectId(id), 
        ownerId 
      } as any);
      
      if (result.deletedCount > 0) {
        functions.logger.info(`🗑️ Deleted storyworld: ${id}`);
        return true;
      }
      
      return false;
    } catch (error) {
      functions.logger.error("❌ Failed to delete storyworld:", error);
      throw new Error("Failed to delete storyworld");
    }
  }
  
  /**
   * Search storyworlds by name or tags
   */
  static async search(
    query: string, 
    isPublicOnly: boolean = true,
    limit: number = 20
  ): Promise<MongoStoryworld[]> {
    const db = await getDb();
    const collection = db.collection<MongoStoryworld>(COLLECTION_NAME);
    
    try {
      const searchFilter: any = {
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { tags: { $in: [new RegExp(query, 'i')] } }
        ]
      };
      
      if (isPublicOnly) {
        searchFilter.visibility = 'PUBLIC';
      }
      
      const storyworlds = await collection
        .find(searchFilter)
        .limit(limit)
        .toArray();
      
      // Convert ObjectId back to string for interface compatibility
      return storyworlds.map(storyworld => ({
        ...storyworld,
        _id: storyworld._id.toString()
      })) as MongoStoryworld[];
    } catch (error) {
      functions.logger.error("❌ Failed to search storyworlds:", error);
      throw new Error("Failed to search storyworlds");
    }
  }
} 