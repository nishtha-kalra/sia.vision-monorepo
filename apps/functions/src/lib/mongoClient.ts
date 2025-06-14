import { MongoClient, Db } from "mongodb";
import * as functions from "firebase-functions";

// Global variables for connection reuse across function invocations
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

/**
 * Get MongoDB database connection with proper connection reuse
 * This pattern ensures connections are reused across function invocations
 * while handling cold starts efficiently
 */
export async function getDb(): Promise<Db> {
  // Return cached connection if available
  if (cachedDb && cachedClient) {
    try {
      // Test the connection to ensure it's still alive
      await cachedClient.db("admin").admin().ping();
      return cachedDb;
    } catch (error) {
      functions.logger.warn("🔄 Cached MongoDB connection failed ping, reconnecting...");
      cachedClient = null;
      cachedDb = null;
    }
  }

  // Create new connection
  functions.logger.info("🔌 Creating new MongoDB connection...");
  
  const uri = functions.config().mongo?.uri;
  const dbName = functions.config().mongo?.db || "sia";
  
  if (!uri) {
    throw new Error("MongoDB URI not configured. Run: firebase functions:config:set mongo.uri=\"your-connection-string\"");
  }

  // Enhanced connection options for Firebase Functions environment
  const client = new MongoClient(uri, {
    // Connection pool settings optimized for serverless
    maxPoolSize: 10,
    minPoolSize: 1,
    maxIdleTimeMS: 30000,
    
    // Timeout settings - more aggressive for serverless
    serverSelectionTimeoutMS: 10000, // Increased from 5000
    socketTimeoutMS: 45000,
    connectTimeoutMS: 15000, // Increased from 10000
    
    // Retry settings
    retryWrites: true,
    retryReads: true,
    
    // SSL/TLS settings for better compatibility
    tls: true,
    tlsAllowInvalidCertificates: false,
    tlsAllowInvalidHostnames: false,
    
    // Compression
    compressors: ['zlib'],
    
    // App identification
    appName: 'sia-firebase-functions',
    
    // Additional options for better reliability
    heartbeatFrequencyMS: 10000
  });

  try {
    await client.connect();
    functions.logger.info("✅ Connected to MongoDB successfully");
    
    const db = client.db(dbName);
    
    // Test the database connection
    await db.admin().ping();
    functions.logger.info("✅ Database ping successful");
    
    // Cache the connection
    cachedClient = client;
    cachedDb = db;
    
    return db;
  } catch (error) {
    functions.logger.error("❌ Failed to connect to MongoDB:", error);
    
    // Clean up on failure
    try {
      await client.close();
    } catch (closeError) {
      functions.logger.warn("Failed to close failed connection:", closeError);
    }
    
    throw new Error(`MongoDB connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Health check function to test MongoDB connectivity
 */
export async function healthCheck(): Promise<boolean> {
  try {
    const db = await getDb();
    await db.admin().ping();
    functions.logger.info("✅ MongoDB health check passed");
    return true;
  } catch (error) {
    functions.logger.error("❌ MongoDB health check failed:", error);
    return false;
  }
}

/**
 * Gracefully close MongoDB connection (for cleanup)
 */
export async function closeConnection(): Promise<void> {
  if (cachedClient) {
    try {
      await cachedClient.close();
      functions.logger.info("🔌 MongoDB connection closed");
    } catch (error) {
      functions.logger.warn("Failed to close MongoDB connection:", error);
    } finally {
      cachedClient = null;
      cachedDb = null;
    }
  }
}

// Graceful shutdown handlers (though Firebase Functions handle this automatically)
process.on('SIGINT', closeConnection);
process.on('SIGTERM', closeConnection);
process.on('SIGUSR2', closeConnection); // For nodemon restarts 