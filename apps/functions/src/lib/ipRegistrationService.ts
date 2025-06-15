import * as functions from 'firebase-functions';
import { MongoClient, Db, Collection } from 'mongodb';

// IP Registration Status Lifecycle
export type IPRegistrationStatus = 
  | 'DRAFT'           // User is filling out the form
  | 'PENDING'         // Submitted for processing
  | 'GENERATING_METADATA' // AI is generating metadata
  | 'UPLOADING_METADATA'  // Uploading to IPFS
  | 'REGISTERING_IP'      // Registering on Story Protocol
  | 'COMPLETED'           // Successfully registered
  | 'FAILED'              // Registration failed
  | 'CANCELLED';          // User cancelled

export interface IPRegistrationRecord {
  _id?: string;
  assetId: string;
  userId: string;
  storyworldId?: string;
  
  // Registration Details
  pilTemplate: string;
  customMetadata?: {
    title: string;
    description: string;
    attributes: Array<{ trait_type: string; value: string }>;
  };
  aiPrompt?: string;
  
  // Status Tracking
  status: IPRegistrationStatus;
  statusHistory: Array<{
    status: IPRegistrationStatus;
    timestamp: Date;
    message?: string;
    metadata?: any;
    // Transaction tracking
    txHash?: string;
    blockNumber?: number;
    gasUsed?: string;
    gasPrice?: string;
    walletAddress?: string;
    signature?: string;
    // Story Protocol specific
    ipId?: string;
    tokenId?: string;
    metadataUri?: string;
    licenseTermsId?: string;
  }>;
  
  // Story Protocol Results
  ipId?: string;
  tokenId?: string;
  txHash?: string;
  blockNumber?: number;
  metadataUri?: string;
  ipfsHash?: string;
  licenseTermsId?: string;
  
  // Transaction & Wallet Details
  walletAddress?: string;
  walletType?: 'privy' | 'external'; // Track wallet type
  gasSponsored?: boolean;
  paymasterUsed?: boolean;
  totalGasUsed?: string;
  totalGasCost?: string; // In wei
  
  // Privy Integration
  privyUserId?: string;
  smartWalletAddress?: string;
  embeddedWalletAddress?: string;
  
  // Transaction Lifecycle
  transactions?: Array<{
    step: 'MINT_NFT' | 'UPLOAD_METADATA' | 'REGISTER_IP' | 'SET_LICENSE_TERMS';
    txHash?: string;
    blockNumber?: number;
    gasUsed?: string;
    gasPrice?: string;
    signature?: string;
    timestamp: Date;
    status: 'PENDING' | 'CONFIRMED' | 'FAILED';
    error?: string;
    receipt?: any; // Full transaction receipt
  }>;
  
  // Enhanced Metadata
  enhancedMetadata?: {
    aiGenerated: boolean;
    confidence: number;
    originalPrompt?: string;
    generatedAt: Date;
    attributes: Array<{ trait_type: string; value: string }>;
  };
  
  // Error Handling
  lastError?: string;
  retryCount: number;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface IPRegistrationStats {
  total: number;
  completed: number;
  pending: number;
  failed: number;
  gasSponsored: number;
  totalValueProtected: number; // Estimated value in USD
}

class IPRegistrationService {
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private collection: Collection<IPRegistrationRecord> | null = null;

  private async connect(): Promise<void> {
    if (this.client && this.db && this.collection) {
      return;
    }

    const mongoUri = functions.config().mongo?.uri;
    if (!mongoUri) {
      throw new Error('MongoDB URI not configured');
    }

    this.client = new MongoClient(mongoUri);
    await this.client.connect();
    this.db = this.client.db('sia-modern');
    this.collection = this.db.collection<IPRegistrationRecord>('ip_registrations');

    // Create indexes for better performance
    await this.collection.createIndex({ assetId: 1 }, { unique: true });
    await this.collection.createIndex({ userId: 1 });
    await this.collection.createIndex({ status: 1 });
    await this.collection.createIndex({ createdAt: -1 });
    await this.collection.createIndex({ 'statusHistory.timestamp': -1 });
  }

  async createRegistration(data: {
    assetId: string;
    userId: string;
    storyworldId?: string;
    pilTemplate: string;
    customMetadata?: any;
    aiPrompt?: string;
  }): Promise<IPRegistrationRecord> {
    await this.connect();
    
    const now = new Date();
    const registration: IPRegistrationRecord = {
      assetId: data.assetId,
      userId: data.userId,
      storyworldId: data.storyworldId,
      pilTemplate: data.pilTemplate,
      customMetadata: data.customMetadata,
      aiPrompt: data.aiPrompt,
      status: 'DRAFT',
      statusHistory: [{
        status: 'DRAFT',
        timestamp: now,
        message: 'Registration record created'
      }],
      transactions: [],
      retryCount: 0,
      createdAt: now,
      updatedAt: now
    };

    const result = await this.collection!.insertOne(registration);
    return { ...registration, _id: result.insertedId.toString() };
  }

  async getRegistration(registrationId: string): Promise<IPRegistrationRecord | null> {
    await this.connect();
    
    const registration = await this.collection!.findOne({ 
      _id: registrationId as any 
    });
    
    return registration ? { ...registration, _id: registration._id.toString() } : null;
  }

  async getRegistrationByAsset(assetId: string): Promise<IPRegistrationRecord | null> {
    await this.connect();
    
    const registration = await this.collection!.findOne({ assetId });
    return registration ? { ...registration, _id: registration._id.toString() } : null;
  }

  async updateStatus(
    registrationId: string, 
    status: IPRegistrationStatus, 
    metadata?: {
      message?: string;
      ipId?: string;
      tokenId?: string;
      txHash?: string;
      blockNumber?: number;
      metadataUri?: string;
      ipfsHash?: string;
      gasSponsored?: boolean;
      paymasterUsed?: boolean;
      walletAddress?: string;
      privyUserId?: string;
      error?: string;
      enhancedMetadata?: any;
    }
  ): Promise<void> {
    await this.connect();
    
    const now = new Date();
    const setData: any = {
      status,
      updatedAt: now
    };

    // Update specific fields based on status
    if (metadata?.ipId) setData.ipId = metadata.ipId;
    if (metadata?.tokenId) setData.tokenId = metadata.tokenId;
    if (metadata?.txHash) setData.txHash = metadata.txHash;
    if (metadata?.blockNumber) setData.blockNumber = metadata.blockNumber;
    if (metadata?.metadataUri) setData.metadataUri = metadata.metadataUri;
    if (metadata?.ipfsHash) setData.ipfsHash = metadata.ipfsHash;
    if (metadata?.gasSponsored !== undefined) setData.gasSponsored = metadata.gasSponsored;
    if (metadata?.paymasterUsed !== undefined) setData.paymasterUsed = metadata.paymasterUsed;
    if (metadata?.walletAddress) setData.walletAddress = metadata.walletAddress;
    if (metadata?.privyUserId) setData.privyUserId = metadata.privyUserId;
    if (metadata?.error) setData.lastError = metadata.error;
    if (metadata?.enhancedMetadata) setData.enhancedMetadata = metadata.enhancedMetadata;

    if (status === 'COMPLETED') {
      setData.completedAt = now;
    }

    if (status === 'FAILED' && metadata?.error) {
      setData.lastError = metadata.error;
    }

    const updateData: any = {
      $set: setData,
      $push: {
        statusHistory: {
          status,
          timestamp: now,
          message: metadata?.message,
          metadata: metadata ? { ...metadata, message: undefined } : undefined
        }
      }
    };

    await this.collection!.updateOne(
      { _id: registrationId as any },
      updateData
    );
  }

  async incrementRetryCount(registrationId: string): Promise<void> {
    await this.connect();
    
    await this.collection!.updateOne(
      { _id: registrationId as any },
      { 
        $inc: { retryCount: 1 },
        $set: { updatedAt: new Date() }
      }
    );
  }

  async getUserRegistrations(
    userId: string, 
    options: {
      status?: IPRegistrationStatus;
      limit?: number;
      offset?: number;
      storyworldId?: string;
    } = {}
  ): Promise<{
    registrations: IPRegistrationRecord[];
    total: number;
    hasMore: boolean;
  }> {
    await this.connect();
    
    const filter: any = { userId };
    if (options.status) filter.status = options.status;
    if (options.storyworldId) filter.storyworldId = options.storyworldId;

    const limit = options.limit || 20;
    const offset = options.offset || 0;

    const [registrations, total] = await Promise.all([
      this.collection!
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .toArray(),
      this.collection!.countDocuments(filter)
    ]);

    return {
      registrations: registrations.map(reg => ({ ...reg, _id: reg._id.toString() })),
      total,
      hasMore: offset + registrations.length < total
    };
  }

  async getUserStats(userId: string): Promise<IPRegistrationStats> {
    await this.connect();
    
    const pipeline = [
      { $match: { userId } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'COMPLETED'] }, 1, 0] }
          },
          pending: {
            $sum: { 
              $cond: [
                { $in: ['$status', ['PENDING', 'GENERATING_METADATA', 'UPLOADING_METADATA', 'REGISTERING_IP']] }, 
                1, 
                0
              ] 
            }
          },
          failed: {
            $sum: { $cond: [{ $eq: ['$status', 'FAILED'] }, 1, 0] }
          },
          gasSponsored: {
            $sum: { $cond: [{ $eq: ['$gasSponsored', true] }, 1, 0] }
          }
        }
      }
    ];

    const result = await this.collection!.aggregate(pipeline).toArray();
    const stats = result[0] || {
      total: 0,
      completed: 0,
      pending: 0,
      failed: 0,
      gasSponsored: 0
    };

    return {
      total: stats.total || 0,
      completed: stats.completed || 0,
      pending: stats.pending || 0,
      failed: stats.failed || 0,
      gasSponsored: stats.gasSponsored || 0,
      totalValueProtected: (stats.completed || 0) * 3.70 // Estimated $3.70 per registration
    };
  }

  async getRegistrationsByStatus(status: IPRegistrationStatus): Promise<IPRegistrationRecord[]> {
    await this.connect();
    
    const registrations = await this.collection!
      .find({ status })
      .sort({ createdAt: 1 })
      .toArray();

    return registrations.map(reg => ({ ...reg, _id: reg._id.toString() }));
  }

  async cleanup(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
      this.collection = null;
    }
  }
}

// Singleton instance
let ipRegistrationService: IPRegistrationService | null = null;

export async function getIPRegistrationService(): Promise<IPRegistrationService> {
  if (!ipRegistrationService) {
    ipRegistrationService = new IPRegistrationService();
  }
  return ipRegistrationService;
} 