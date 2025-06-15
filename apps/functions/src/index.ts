import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { PrivyClient } from "@privy-io/server-auth";
import cors from "cors";
import sgMail from "@sendgrid/mail";
// Import Genkit and Google AI plugin libraries
import { generate } from '@genkit-ai/ai';
import { configureGenkit } from '@genkit-ai/core';
import { googleAI, gemini15Flash } from '@genkit-ai/googleai';

import { 
  UploadRequest, 
  UploadResponse, 
  CreateAssetRequest, 
  CreateAssetResponse,
  MediaProcessingResult,
  AssetType,
  AIPromptRequest,
  StoryworldEnhancementRequest,
  StoryworldEnhancementResponse
} from "./types";

// Import MongoDB functions and services
import {
  mongoHealthCheck,
  createStoryworldMongo,
  getUserStoryworldsMongo,
  getPublicStoryworldsMongo,
  createAssetMongo,
  getStoryworldAssetsMongo,
  getAssetByIdMongo,
  updateAssetMongo,
  deleteAssetMongo,
  searchContentMongo,
  getUserAssetsMongo,
} from "./mongoFunctions";
import { StoryworldService } from "./lib/storyworldService";
import { AssetService } from "./lib/assetService";

// Re-export MongoDB functions as primary functions (removing Mongo suffix)
export const healthCheck = mongoHealthCheck;
export const createStoryworld = createStoryworldMongo;
export const getUserStoryworlds = getUserStoryworldsMongo;
export const getPublicStoryworlds = getPublicStoryworldsMongo;
export const createAsset = createAssetMongo;
export const saveAsset = createAssetMongo; // Alias for backward compatibility
export const getAssetById = getAssetByIdMongo;
export const getStoryworldAssets = getStoryworldAssetsMongo;
export const updateAsset = updateAssetMongo;
export const deleteAsset = deleteAssetMongo;
export const searchContent = searchContentMongo;
// Use existing working functions for Explorer section
export const getUserAssets = getUserAssetsMongo;

// Note: HTTP functions (getPublicAssetsHttp, getUserAssetsHttp) are available but not exported
// since we're using callable functions for better authentication and error handling



// Initialize Firebase Admin
admin.initializeApp();

// Configure Genkit with enhanced settings
configureGenkit({
  plugins: [googleAI({
    apiKey: functions.config().google?.ai_api_key,
  })],
  enableTracingAndMetrics: true, // Enable for better debugging
});

// Initialize CORS
const corsHandler = cors({origin: true});

// Configure SendGrid
const SENDGRID_API_KEY = functions.config().sendgrid?.api_key;
if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

// Interface for enquiry data
interface EnquiryData {
  name: string;
  email: string;
  inquiryType: string;
  message: string;
  timestamp?: admin.firestore.Timestamp;
  status?: string;
  metadata?: {
    ipAddress?: string;
    userAgent?: string;
    referrer?: string;
    origin?: string;
    acceptLanguage?: string;
    country?: string;
    region?: string;
    city?: string;
  };
}

// HTTP Function: Submit Contact Form with rate limiting
export const submitContactForm = functions
  .runWith({
    timeoutSeconds: 30,
    memory: "256MB",
  })
  .https.onRequest((req, res) => {
  return corsHandler(req, res, async () => {
    // Only allow POST requests
    if (req.method !== "POST") {
      return res.status(405).json({error: "Method not allowed"});
    }

    // Basic rate limiting: Check if IP has submitted recently
    const clientIP = extractRequestMetadata(req).ipAddress;
    if (await isRateLimited(clientIP)) {
      return res.status(429).json({
        error: "Too many requests. Please wait before submitting again.",
      });
    }

    try {
      const {name, email, inquiryType, message} = req.body;

      // Validate required fields
      if (!name || !email || !inquiryType || !message) {
        return res.status(400).json({
          error: "Missing required fields: name, email, inquiryType, message",
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({error: "Invalid email format"});
      }

      // Extract metadata from request
      const metadata = extractRequestMetadata(req);

      // Prepare enquiry data
      const enquiryData: EnquiryData = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        inquiryType,
        message: message.trim(),
        timestamp: admin.firestore.Timestamp.now(),
        status: "new",
        metadata,
      };

      // Save to Firestore
      const enquiryRef = await admin
        .firestore()
        .collection("enquiries")
        .add(enquiryData);

      functions.logger.info("New enquiry submitted", {
        enquiryId: enquiryRef.id,
        email: enquiryData.email,
        inquiryType: enquiryData.inquiryType,
        ipAddress: enquiryData.metadata?.ipAddress,
        userAgent: enquiryData.metadata?.userAgent,
        origin: enquiryData.metadata?.origin,
      });

      return res.status(200).json({
        success: true,
        message: "Enquiry submitted successfully",
        enquiryId: enquiryRef.id,
      });
    } catch (error) {
      functions.logger.error("Error submitting contact form:", error);
      return res.status(500).json({
        error: "Internal server error",
        details: process.env.NODE_ENV === "development" ? error : undefined,
      });
    }
  });
});

// Firestore Trigger: Send Email on New Enquiry
export const sendEnquiryEmail = functions.firestore
  .document("enquiries/{enquiryId}")
  .onCreate(async (snap, context) => {
    try {
      const enquiryData = snap.data() as EnquiryData;
      const enquiryId = context.params.enquiryId;

      if (!SENDGRID_API_KEY) {
        functions.logger.warn("SendGrid API key not configured");
        return;
      }

      // Email to admin/team
      const adminEmailMsg = {
        to: "akshaykant1708@gmail.com", // Replace with your admin email
        from: "connect@sia.vision", // Replace with your verified sender
        subject: `New Contact Form Submission - ${enquiryData.inquiryType}`,
        html: generateAdminEmailHtml(enquiryData, enquiryId),
      };

      // Email to user (confirmation)
      const userEmailMsg = {
        to: enquiryData.email,
        from: "connect@sia.vision", // Replace with your verified sender
        subject: "Thank you for contacting Sia.vision",
        html: generateUserEmailHtml(enquiryData),
      };

      // Send both emails
      await Promise.all([
        sgMail.send(adminEmailMsg),
        sgMail.send(userEmailMsg),
      ]);

      // Update enquiry status
      await snap.ref.update({status: "email_sent"});

      functions.logger.info("Emails sent successfully", {
        enquiryId,
        userEmail: enquiryData.email,
      });
    } catch (error) {
      functions.logger.error("Error sending enquiry emails:", error);
      
      // Update enquiry status to indicate email failure
      await snap.ref.update({status: "email_failed"});
    }
  });

// Helper function for basic rate limiting
async function isRateLimited(ipAddress: string): Promise<boolean> {
  try {
    // Check submissions from this IP in the last 5 minutes
    const fiveMinutesAgo = admin.firestore.Timestamp.fromDate(
      new Date(Date.now() - 5 * 60 * 1000)
    );
    
    const recentSubmissions = await admin
      .firestore()
      .collection("enquiries")
      .where("metadata.ipAddress", "==", ipAddress)
      .where("timestamp", ">=", fiveMinutesAgo)
      .get();
    
    // Allow max 5 submissions per IP per 5 minutes
    return recentSubmissions.size >= 5;
  } catch (error) {
    functions.logger.warn("Rate limiting check failed:", error);
    return false; // Allow submission if check fails
  }
}

// Helper function to extract request metadata
function extractRequestMetadata(req: any) {
  const ipAddress = req.ip || 
                   req.connection?.remoteAddress || 
                   req.socket?.remoteAddress ||
                   (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
                   req.headers["x-real-ip"] as string ||
                   "unknown";

  return {
    ipAddress,
    userAgent: req.headers["user-agent"] || "unknown",
    referrer: req.headers["referer"] || req.headers["referrer"] || "direct",
    origin: req.headers["origin"] || "unknown",
    acceptLanguage: req.headers["accept-language"] || "unknown",
    // Geographic data could be added here with a service like MaxMind
    country: "unknown", // Could be determined from IP
    region: "unknown",  // Could be determined from IP
    city: "unknown",    // Could be determined from IP
  };
}

// Helper function to generate admin email HTML
function generateAdminEmailHtml(data: EnquiryData, enquiryId: string): string {
  return `
    <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
      <div style="background: linear-gradient(135deg, #3A86FF 0%, #48D8D0 100%); padding: 20px; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">New Contact Form Submission</h1>
      </div>
      
      <div style="background-color: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <h2 style="color: #1c1b1f; margin-bottom: 20px;">Contact Details</h2>
        
        <div style="margin-bottom: 15px;">
          <strong style="color: #3A86FF;">Name:</strong> ${data.name}
        </div>
        
        <div style="margin-bottom: 15px;">
          <strong style="color: #3A86FF;">Email:</strong>
          <a href="mailto:${data.email}" style="color: #48D8D0;">${data.email}</a>
        </div>
        
        <div style="margin-bottom: 15px;">
          <strong style="color: #3A86FF;">Area of Interest:</strong> ${data.inquiryType}
        </div>
        
        <div style="margin-bottom: 20px;">
          <strong style="color: #3A86FF;">Message:</strong>
        </div>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #3A86FF; margin-bottom: 20px;">
          <p style="margin: 0; color: #1c1b1f; line-height: 1.6;">${data.message}</p>
        </div>
        
        <div style="font-size: 12px; color: #6B7280; border-top: 1px solid #e5e7eb; padding-top: 15px; margin-top: 20px;">
          <strong>Enquiry ID:</strong> ${enquiryId}<br>
          <strong>Timestamp:</strong> ${data.timestamp?.toDate().toLocaleString()}<br>
          <strong>IP Address:</strong> ${data.metadata?.ipAddress || 'N/A'}<br>
          <strong>User Agent:</strong> ${data.metadata?.userAgent || 'N/A'}<br>
          <strong>Referrer:</strong> ${data.metadata?.referrer || 'N/A'}<br>
          <strong>Origin:</strong> ${data.metadata?.origin || 'N/A'}<br>
          <strong>Language:</strong> ${data.metadata?.acceptLanguage || 'N/A'}<br>
          <strong>Auto-generated by:</strong> Sia.vision Contact Form System
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #6B7280; font-size: 14px;">
          <p>Please respond to this enquiry via email: <a href="mailto:${data.email}" style="color: #3A86FF;">${data.email}</a></p>
        </div>
      </div>
    </div>
  `;
}

// ----------------------
// User Management
// ----------------------

export const onUserCreate = functions.auth.user().onCreate(async (user) => {
  const db = admin.firestore();
  const userRef = db.collection("users").doc(user.uid);
  
  // Determine auth providers from user data
  const authProviders = user.providerData.map(provider => provider.providerId);
  
  // Check if this is a Google sign-in (or other OAuth provider)
  const isOAuthProvider = authProviders.some(provider => 
    provider === 'google.com' || provider === 'apple.com' || provider === 'facebook.com'
  );

  // Initialize profile with empty wallets - wallets will be created ONLY after phone verification
  const profile = {
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    authProviders: authProviders,
    wallets: { 
      ethereum: null,
      solana: null,
      linkedWallets: []
    },
    phoneNumber: { number: null, isVerified: false },
    // Don't set walletsStatus initially - only set when phone verification triggers wallet creation
  };

  try {
    // Create user profile first
    await userRef.set(profile, { merge: true });
    functions.logger.info("User document created", { 
      uid: user.uid, 
      providers: authProviders,
      isOAuth: isOAuthProvider
    });

    functions.logger.info("User created - wallets will ONLY be created after phone verification", { 
      uid: user.uid,
      isOAuth: isOAuthProvider
    });
    
  } catch (error) {
    functions.logger.error("Error creating user document", error);
    throw new functions.https.HttpsError(
      "internal",
      "Failed to create user document"
    );
  }
});

// Triggered when phone number is verified - creates wallets
export const onPhoneVerified = functions.https.onCall(
  async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated", 
        "Authentication required"
      );
    }

    const uid = data.uid || context.auth.uid;
    const phoneNumber = data.phoneNumber as string;

    if (!phoneNumber) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Phone number is required"
      );
    }

    const db = admin.firestore();

    try {
      functions.logger.info("Phone verification started", { 
        uid, 
        phoneNumber: phoneNumber.substring(0, 6) + "***" 
      });

      // Update user document with phone verification
      const userRef = db.collection("users").doc(uid);
      await userRef.set({
        phoneNumber: {
          number: phoneNumber,
          isVerified: true,
          verifiedAt: admin.firestore.FieldValue.serverTimestamp()
        },
        walletsStatus: 'creating',
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });

      // Index phone number for lookups
      const phoneIndexRef = db.collection("phoneIndex").doc(phoneNumber);
      await phoneIndexRef.set({
        uid: uid,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

      functions.logger.info("Phone verification completed", { 
        uid, 
        phoneNumber: phoneNumber.substring(0, 6) + "***" 
      });

      // Start wallet creation asynchronously (don't await)
      createWalletsAsync(uid, phoneNumber);

      return { success: true, message: "Phone verified and wallet creation started" };

    } catch (error) {
      functions.logger.error("Phone verification failed", { 
        uid, 
        error: error instanceof Error ? error.message : String(error) 
      });
      
      throw new functions.https.HttpsError(
        "internal",
        "Phone verification failed"
      );
    }
  }
);

// Helper function to create a single wallet with idempotency
async function createSingleWallet(client: PrivyClient, chainType: string, uid: string, phoneNumber: string): Promise<{address: string, id: string} | null> {
  try {
    functions.logger.info(`Creating ${chainType} wallet`, { uid, chainType });
    
    // Use phone number + chain type as idempotency key to prevent duplicates
    const idempotencyKey = `${phoneNumber}-${chainType}`;
    
    const result = await client.walletApi.create({
      chainType: chainType as any,
      idempotencyKey: idempotencyKey
    });
    
    if (result?.address && result?.id) {
      functions.logger.info(`Successfully created ${chainType} wallet`, { 
        uid, 
        chainType, 
        walletId: result.id,
        address: result.address.substring(0, 8) + "..."
      });
      return { address: result.address, id: result.id };
    }
    
    throw new Error(`No address returned for ${chainType}`);
  } catch (error) {
    functions.logger.error(`Failed to create ${chainType} wallet`, {
      uid,
      chainType,
      error: error instanceof Error ? error.message : String(error)
    });
    return null;
  }
}

// Simplified async function to create wallets - idempotent and robust
async function createWalletsAsync(uid: string, phoneNumber: string) {
  const db = admin.firestore();
  const userRef = db.collection("users").doc(uid);
  const walletsRef = db.collection("wallets").doc(uid);

  try {
    functions.logger.info("Starting wallet creation", { uid, phoneNumber: phoneNumber.substring(0, 6) + "***" });

    // Check if we already have wallets for this user (idempotent check)
    const [userDoc, walletDoc] = await Promise.all([
      userRef.get(),
      walletsRef.get()
    ]);

    const userData = userDoc.data();
    const existingWallets = userData?.wallets || {};
    const walletData = walletDoc.data();

    // All supported Privy wallet types - create them all
    const allSupportedChains = ['ethereum', 'solana', 'stellar', 'cosmos', 'sui', 'tron'];
    const missingChains = allSupportedChains.filter(chain => !existingWallets[chain] && !walletData?.[chain]);

    if (missingChains.length === 0) {
      functions.logger.info("All wallets already exist", { uid });
      await userRef.update({
        'walletsStatus': 'completed',
        'walletsCreatedAt': admin.firestore.FieldValue.serverTimestamp()
      });
      return;
    }

    // Set status to creating
    await userRef.update({ 'walletsStatus': 'creating' });

    // Initialize Privy client
    const appId = functions.config().privy.app_id;
    const appSecret = functions.config().privy.app_secret;
    const client = new PrivyClient(appId, appSecret);

    const newWallets: Record<string, any> = {};
    const userUpdates: Record<string, any> = {};
    const results: Array<{chain: string, success: boolean}> = [];

    // Create all missing wallets in parallel for better performance
    const creationPromises = missingChains.map(async (chainType) => {
      const result = await createSingleWallet(client, chainType, uid, phoneNumber);
      
      if (result) {
        // Prepare wallet data
        newWallets[chainType] = {
          address: result.address,
          walletId: result.id,
          chainType,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          linkedPhoneNumber: phoneNumber,
          userId: uid
        };

        // Prepare user updates
        userUpdates[`wallets.${chainType}`] = result.address;
        
        results.push({ chain: chainType, success: true });
      } else {
        results.push({ chain: chainType, success: false });
      }
    });

    // Wait for all wallet creations to complete
    await Promise.all(creationPromises);

    functions.logger.info("Wallet creation completed", {
      uid,
      successfulWallets: Object.keys(newWallets),
      totalRequested: missingChains.length,
      totalCreated: Object.keys(newWallets).length,
      results: results
    });

    // Update both collections atomically
    const batch = db.batch();

    if (Object.keys(newWallets).length > 0) {
      try {
        // Update or create wallets document
        if (walletDoc.exists) {
          batch.update(walletsRef, {
            ...newWallets,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          });
          functions.logger.info("Updating existing wallets document", { uid });
        } else {
          batch.set(walletsRef, {
            ...newWallets,
            userId: uid,
            phoneNumber: phoneNumber,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
          });
          functions.logger.info("Creating new wallets document", { uid });
        }

        // Update user document
        batch.update(userRef, {
          ...userUpdates,
          walletsStatus: 'completed',
          walletsCreatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        
        functions.logger.info("Prepared batch update", {
          uid,
          walletsToUpdate: Object.keys(newWallets),
          userUpdates: Object.keys(userUpdates)
        });

        await batch.commit();
        
        functions.logger.info("Database update successful", {
          uid,
          createdWallets: Object.keys(newWallets),
          totalCreated: Object.keys(newWallets).length
        });
        
      } catch (batchError) {
        functions.logger.error("Batch commit failed", {
          uid,
          error: batchError instanceof Error ? batchError.message : String(batchError),
          walletsToUpdate: Object.keys(newWallets)
        });
        throw batchError;
      }
    } else {
      // No wallets created - mark as failed
      batch.update(userRef, {
        walletsStatus: 'failed',
        walletsError: 'Failed to create any wallets'
      });
      
      try {
        await batch.commit();
        functions.logger.error("No wallets created - marked as failed", { uid });
      } catch (batchError) {
        functions.logger.error("Failed to update failure status", {
          uid,
          error: batchError instanceof Error ? batchError.message : String(batchError)
        });
      }
    }

    functions.logger.info("Wallet creation process completed", { 
      uid,
      finalSuccessCount: Object.keys(newWallets).length,
      finalFailureCount: missingChains.length - Object.keys(newWallets).length,
      phoneNumber: phoneNumber.substring(0, 6) + "***"
    });

  } catch (error) {
    functions.logger.error("Wallet creation failed", {
      uid,
      error: error instanceof Error ? error.message : String(error)
    });

    await userRef.update({
      walletsStatus: 'failed',
      walletsError: error instanceof Error ? error.message : String(error)
    }).catch(e => functions.logger.error("Failed to update error status", e));
  }
}

// Helper function to check if phone number exists
export const checkPhoneNumber = functions.https.onCall(
  async (data, context) => {
    const phoneNumber = data.phoneNumber as string;

    if (!phoneNumber) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Phone number is required"
      );
    }

    const db = admin.firestore();
    const phoneIndexRef = db.collection("phoneIndex").doc(phoneNumber);

    try {
      const phoneDoc = await phoneIndexRef.get();
      
      return {
        exists: phoneDoc.exists,
        canMerge: phoneDoc.exists && context.auth?.uid !== phoneDoc.data()?.uid
      };
    } catch (error) {
      functions.logger.error("Error checking phone number", error);
      throw new functions.https.HttpsError(
        "internal",
        "Failed to check phone number"
      );
    }
  }
);

export const provisionUserWallet = functions.https.onCall(
  async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "Authentication required"
      );
    }

    const uid = data.uid as string;
    const chainType = (data.chainType as string) || 'ethereum';
    
    if (!uid) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "UID is required"
      );
    }

    // Validate chain type
    const supportedChains = [
      'ethereum', 'solana'
    ];
    if (!supportedChains.includes(chainType)) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        `Unsupported chain type: ${chainType}. Supported: ${supportedChains.join(', ')}`
      );
    }

    const db = admin.firestore();
    const userRef = db.collection("users").doc(uid);

    try {
      const snapshot = await userRef.get();
      const userData = snapshot.data() || {};
      
      // Check if wallet already exists for this chain type
      const walletField = `wallets.${chainType}`;
      if (userData.wallets?.[chainType]) {
        return { 
          address: userData.wallets[chainType],
          chainType,
          exists: true 
        };
      }

      const appId = functions.config().privy.app_id;
      const appSecret = functions.config().privy.app_secret;
      const client = new PrivyClient(appId, appSecret);

      const {address} = await client.walletApi.create({
        chainType: chainType as any
      });

      // Update the specific wallet field
      await userRef.update({
        [walletField]: address,
      });

      return { 
        address: address,
        chainType,
        exists: false 
      };
    } catch (error) {
      functions.logger.error("Error provisioning wallet", error);
      throw new functions.https.HttpsError(
        "internal",
        "Failed to provision wallet",
        typeof error === "object" ? (error as any).message : String(error)
      );
    }
  }
);

export const provisionAllWallets = functions.https.onCall(
  async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "Authentication required"
      );
    }

    const uid = data.uid as string;
    if (!uid) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "UID is required"
      );
    }

    const chainsToCreate = [
      'ethereum', 'solana'
    ];
    const results = [];

    const appId = functions.config().privy.app_id;
    const appSecret = functions.config().privy.app_secret;
    const client = new PrivyClient(appId, appSecret);

    const db = admin.firestore();
    const userRef = db.collection("users").doc(uid);

    try {
      const snapshot = await userRef.get();
      const userData = snapshot.data() || {};
      const updates: Record<string, string> = {};

      for (const chainType of chainsToCreate) {
        try {
          // Skip if wallet already exists
          if (userData.wallets?.[chainType]) {
            results.push({
              chainType,
              address: userData.wallets[chainType],
              status: 'exists'
            });
            continue;
          }

          const {address} = await client.walletApi.create({
            chainType: chainType as any
          });

          updates[`wallets.${chainType}`] = address;
          
          results.push({
            chainType,
            address: address,
            status: 'created'
          });

          // Add delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 1000));

        } catch (error) {
          functions.logger.error(`Error creating ${chainType} wallet`, error);
          results.push({
            chainType,
            error: typeof error === "object" ? (error as any).message : String(error),
            status: 'failed'
          });
        }
      }

      // Update all created wallets at once
      if (Object.keys(updates).length > 0) {
        await userRef.update(updates);
      }

      return { results };

    } catch (error) {
      functions.logger.error("Error provisioning wallets", error);
      throw new functions.https.HttpsError(
        "internal",
        "Failed to provision wallets",
        typeof error === "object" ? (error as any).message : String(error)
      );
    }
  }
);

// ----------------------
// Storyworld & Asset Management
// ----------------------

// Old Firestore functions removed - using MongoDB equivalents

export const confirmAssetRegistration = functions.https.onCall(
  async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Authentication required'
      );
    }

    const assetId = data.assetId as string;
    const onChainId = data.onChainId as string;

    if (!assetId || !onChainId) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'assetId and onChainId are required'
      );
    }

    const uid = context.auth.uid;

    try {
      // Get asset from MongoDB
      const asset = await AssetService.getById(assetId);
      if (!asset || asset.ownerId !== uid) {
        throw new functions.https.HttpsError(
          'permission-denied',
          'Invalid asset or insufficient permissions'
        );
      }

      // Update asset with registration info
      await AssetService.update(assetId, {
        ipStatus: 'REGISTERED',
        storyProtocol: {
          ipId: onChainId,
          txHash: onChainId, // Assuming onChainId is the transaction hash
          registeredAt: new Date(),
          metadataIpfsHash: asset.storyProtocol?.metadataIpfsHash || '',
          licenseTerms: asset.storyProtocol?.licenseTerms || {
            allowDerivatives: true,
            commercialUse: false,
            royaltyPercentage: 0,
            territory: 'GLOBAL',
            attribution: true
          },
          derivativeIds: asset.storyProtocol?.derivativeIds || [],
          totalRevenue: asset.storyProtocol?.totalRevenue || 0,
          totalRoyaltiesPaid: asset.storyProtocol?.totalRoyaltiesPaid || 0,
          totalRoyaltiesEarned: asset.storyProtocol?.totalRoyaltiesEarned || 0
        }
      });

      functions.logger.info('Asset registration confirmed via MongoDB', {
        assetId,
        onChainId,
        ownerId: uid
      });

      return { success: true };
    } catch (error) {
      functions.logger.error('Error confirming registration', error);
      throw new functions.https.HttpsError(
        'internal',
        'Failed to confirm registration'
      );
    }
  }
);

// ----------------------
// Media Upload & Processing
// ----------------------

// Create a secure upload URL for media files
export const getSecureUploadUrl = functions.https.onCall(
  async (data: UploadRequest, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Authentication required'
      );
    }

    const { fileName, contentType, fileSize, storyworldId, assetType } = data;
    const uid = context.auth.uid;

    // Validate input
    if (!fileName || !contentType || !storyworldId || !assetType) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'fileName, contentType, storyworldId, and assetType are required'
      );
    }

    // File size limits (50MB for videos, 10MB for images)
    const maxSize = assetType === 'VIDEO' ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (fileSize > maxSize) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        `File size exceeds limit of ${maxSize / (1024 * 1024)}MB`
      );
    }

    // Validate file type
    const allowedTypes = {
      IMAGE: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      VIDEO: ['video/mp4', 'video/webm', 'video/quicktime'],
      AUDIO: ['audio/mpeg', 'audio/wav', 'audio/ogg']
    };

    if (assetType in allowedTypes && !allowedTypes[assetType as keyof typeof allowedTypes].includes(contentType)) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        `Invalid file type for ${assetType}`
      );
    }

    const bucket = admin.storage().bucket();

    try {
      // Verify storyworld ownership using MongoDB
      functions.logger.info('🔍 Verifying storyworld ownership', { storyworldId, uid });
      const storyworld = await StoryworldService.getById(storyworldId);
      
      if (!storyworld) {
        functions.logger.error('❌ Storyworld not found', { storyworldId, uid });
        throw new functions.https.HttpsError(
          'not-found',
          'Storyworld not found'
        );
      }
      
      functions.logger.info('✅ Storyworld found', { 
        storyworldId, 
        storyworldOwnerId: storyworld.ownerId, 
        requestingUid: uid,
        ownershipMatch: storyworld.ownerId === uid
      });
      
      if (storyworld.ownerId !== uid) {
        functions.logger.error('❌ Ownership verification failed', { 
          storyworldId, 
          storyworldOwnerId: storyworld.ownerId, 
          requestingUid: uid 
        });
        throw new functions.https.HttpsError(
          'permission-denied',
          'Invalid storyworld or insufficient permissions'
        );
      }

      // Create asset document in MongoDB
      const asset = await AssetService.create({
        ownerId: uid,
        storyworldIds: [storyworldId],
        name: fileName.split('.')[0], // Remove extension for default name
        type: assetType,
        status: 'DRAFT',
        ipStatus: 'UNREGISTERED',
        media: {
          url: '', // Will be updated after upload
          mimeType: contentType,
          size: fileSize
        },
        description: `Uploaded ${assetType.toLowerCase()}: ${fileName}`
      });

      // Generate unique file path
      const fileExtension = fileName.split('.').pop();
      const filePath = `assets/${asset._id}/original.${fileExtension}`;
      const file = bucket.file(filePath);

      // Generate signed URL for direct upload (expires in 15 minutes)
      const [uploadUrl] = await file.getSignedUrl({
        version: 'v4',
        action: 'write',
        expires: Date.now() + 15 * 60 * 1000,
        contentType,
      });

      functions.logger.info('Generated secure upload URL via MongoDB', {
        assetId: asset._id,
        storyworldId,
        fileName,
        ownerId: uid
      });

      const response: UploadResponse = {
        uploadUrl,
        assetId: asset._id,
        filePath,
      };

      return response;
    } catch (error) {
      functions.logger.error('Error generating upload URL', { uid, error });
      throw new functions.https.HttpsError(
        'internal',
        'Failed to generate upload URL'
      );
    }
  }
);

// Process uploaded media file
export const processUploadedMedia = functions.https.onCall(
  async (data: { assetId: string }, context) => {
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
        'assetId is required'
      );
    }

    const bucket = admin.storage().bucket();

    try {
      // Get asset document from MongoDB
      const asset = await AssetService.getById(assetId);
      if (!asset || asset.ownerId !== uid) {
        throw new functions.https.HttpsError(
          'permission-denied',
          'Asset not found or insufficient permissions'
        );
      }

      // Construct file path based on asset ID
      const filePath = `assets/${assetId}/original.${asset.media?.mimeType?.split('/')[1] || 'bin'}`;

      // Check if file exists in storage
      const file = bucket.file(filePath);
      const [exists] = await file.exists();

      if (!exists) {
        throw new functions.https.HttpsError(
          'not-found',
          'Uploaded file not found in storage'
        );
      }

      // Generate public download URL using Firebase Storage download URL format
      const mediaUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(filePath)}?alt=media`;

      // Update asset with media URL and processing status
      const updateData: any = {
        status: 'PUBLISHED',
        media: {
          ...asset.media,
          url: mediaUrl
        }
      };

      // For images, could generate thumbnail here
      if (asset.type === 'IMAGE') {
        // TODO: Add thumbnail generation
        updateData.thumbnailUrl = mediaUrl; // Use original for now
      }

      await AssetService.update(assetId, updateData);

      const result: MediaProcessingResult = {
        success: true,
        assetId,
        mediaUrl,
        thumbnailUrl: updateData.thumbnailUrl,
        metadata: {
          fileSize: asset.media?.size || 0,
          mimeType: asset.media?.mimeType || '',
        },
      };

      functions.logger.info('Media processing completed via MongoDB', { assetId, uid });
      return result;
    } catch (error) {
      functions.logger.error('Error processing media', { assetId, uid, error });
      throw new functions.https.HttpsError(
        'internal',
        'Failed to process uploaded media'
      );
    }
  }
);

// Create asset without media (for text-based assets)
export const createTextAsset = functions.https.onCall(
  async (data: CreateAssetRequest & { content: any }, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Authentication required'
      );
    }

    const { storyworldId, name, type, description, tags, content } = data;
    const uid = context.auth.uid;

    if (!storyworldId || !name || !type || !content) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'storyworldId, name, type, and content are required'
      );
    }

    try {
      // Verify storyworld ownership using MongoDB
      const storyworld = await StoryworldService.getById(storyworldId);
      if (!storyworld || storyworld.ownerId !== uid) {
        throw new functions.https.HttpsError(
          'permission-denied',
          'Invalid storyworld or insufficient permissions'
        );
      }

      // Create asset in MongoDB
      const asset = await AssetService.create({
        ownerId: uid,
        storyworldIds: [storyworldId],
        name: name.trim(),
        type,
        content,
        description: description?.trim() || '',
        tags: tags || [],
        status: 'DRAFT',
        ipStatus: 'UNREGISTERED'
      });

      const response: CreateAssetResponse = {
        assetId: asset._id,
        success: true,
      };

      functions.logger.info('Text asset created via MongoDB', { 
        assetId: asset._id, 
        uid, 
        type,
        storyworldId 
      });
      return response;
    } catch (error) {
      functions.logger.error('Error creating text asset', { uid, error });
      throw new functions.https.HttpsError(
        'internal',
        'Failed to create asset'
      );
    }
  }
);

// Helper function to generate user confirmation email HTML
function generateUserEmailHtml(data: EnquiryData): string {
  return `
    <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
      <div style="background: linear-gradient(135deg, #3A86FF 0%, #48D8D0 100%); padding: 20px; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Thank You, ${data.name}!</h1>
      </div>
      
      <div style="background-color: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <h2 style="color: #1c1b1f; margin-bottom: 20px;">We're delighted to hear from you!</h2>
        
        <p style="color: #6B7280; line-height: 1.6; margin-bottom: 20px;">
          Thank you for reaching out to us about <strong style="color: #3A86FF;">${data.inquiryType.toLowerCase()}</strong>.
          Your interest in Sia.vision and the future of collaborative storytelling truly means the world to us.
        </p>
        
        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #48D8D0; margin: 20px 0;">
          <h3 style="color: #3A86FF; margin: 0 0 10px 0;">What happens next?</h3>
          <ul style="color: #6B7280; margin: 0; padding-left: 20px;">
            <li>Our team will personally review your message and get back soon!</li>
          </ul>
        </div>
        
        <p style="color: #6B7280; line-height: 1.6;">
          In the meantime, feel free to explore our vision for the future of storytelling 
          at <a href="https://sia.vision" style="color: #3A86FF;">sia.vision</a>.
        </p>
        
        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #48D8D0; font-weight: 600; margin: 0;">
            Building Tomorrow's Universes, Together
          </p>
          <p style="color: #6B7280; margin: 5px 0 0 0;">The Sia.vision Team</p>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 20px; color: #6B7280; font-size: 12px;">
        <p>Made with ❤️ for creators worldwide 🌍</p>
      </div>
    </div>
  `;
}

// Alternative upload method - server-side file handling
export const uploadMediaDirect = functions.https.onCall(
  async (data: { 
    fileName: string; 
    contentType: string; 
    fileData: string; // base64 encoded file
    storyworldId: string; 
    assetType: AssetType 
  }, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Authentication required'
      );
    }

    const { fileName, contentType, fileData, storyworldId, assetType } = data;
    const uid = context.auth.uid;

    // Calculate accurate original file size from base64
    // Base64 encoding: 3 bytes -> 4 characters, plus padding
    const paddingChars = (fileData.match(/=/g) || []).length;
    const actualFileSize = Math.floor((fileData.length * 3) / 4) - paddingChars;
    
    const maxSize = assetType === 'VIDEO' ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (actualFileSize > maxSize) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        `File size (${Math.round(actualFileSize / (1024 * 1024) * 100) / 100}MB) exceeds limit of ${maxSize / (1024 * 1024)}MB`
      );
    }

    const bucket = admin.storage().bucket();

    try {
      // Verify storyworld ownership using MongoDB
      functions.logger.info('🔍 Verifying storyworld ownership', { storyworldId, uid });
      const storyworld = await StoryworldService.getById(storyworldId);
      
      if (!storyworld) {
        functions.logger.error('❌ Storyworld not found', { storyworldId, uid });
        throw new functions.https.HttpsError(
          'not-found',
          'Storyworld not found'
        );
      }
      
      functions.logger.info('✅ Storyworld found', { 
        storyworldId, 
        storyworldOwnerId: storyworld.ownerId, 
        requestingUid: uid,
        ownershipMatch: storyworld.ownerId === uid
      });
      
      if (storyworld.ownerId !== uid) {
        functions.logger.error('❌ Ownership verification failed', { 
          storyworldId, 
          storyworldOwnerId: storyworld.ownerId, 
          requestingUid: uid 
        });
        throw new functions.https.HttpsError(
          'permission-denied',
          'Invalid storyworld or insufficient permissions'
        );
      }

      // Create asset document using MongoDB
      const assetData = {
        ownerId: uid,
        name: fileName.split('.')[0],
        type: assetType,
        status: 'DRAFT' as const,
        ipStatus: 'UNREGISTERED' as const,
        storyworldIds: [storyworldId],
        description: `Uploaded ${assetType.toLowerCase()} asset: ${fileName}`,
        tags: [assetType.toLowerCase(), 'uploaded'],
        content: {
          originalFileName: fileName,
          uploadedAt: new Date().toISOString(),
          fileExtension: fileName.split('.').pop()?.toLowerCase()
        },
        media: {
          url: '', // Will be updated after upload
          mimeType: contentType,
          size: actualFileSize
        }
      };
      
      const createdAsset = await AssetService.create(assetData);
      const assetId = createdAsset._id;

      // Upload file directly from server
      const fileExtension = fileName.split('.').pop();
      const filePath = `assets/${assetId}/original.${fileExtension}`;
      const file = bucket.file(filePath);

      // Convert base64 to buffer
      const fileBuffer = Buffer.from(fileData, 'base64');

      // Upload file
      await file.save(fileBuffer, {
        metadata: {
          contentType,
          // Add custom metadata to make file accessible
          cacheControl: 'public, max-age=31536000',
        },
      });

      // Use Firebase Storage download URL (works with authentication)
      const mediaUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(filePath)}?alt=media`;

      // Update asset with media URL using MongoDB
      await AssetService.update(assetId, {
        media: {
          url: mediaUrl,
          mimeType: contentType,
          size: actualFileSize
        },
        status: 'PUBLISHED',
        content: {
          originalFileName: fileName,
          uploadedAt: new Date().toISOString(),
          fileExtension: fileName.split('.').pop()?.toLowerCase(),
          storagePath: filePath,
          uploadMethod: 'direct'
        }
      });

      functions.logger.info('Direct upload completed', { assetId, uid });
      
      return {
        success: true,
        assetId,
        mediaUrl,
      };
    } catch (error) {
      functions.logger.error('Error in direct upload', { uid, error });
      throw new functions.https.HttpsError(
        'internal',
        'Failed to upload file'
      );
    }
  }
); 

// Helper function for basic prompt analysis (will be enhanced with AI later)
function analyzePromptKeywords(prompt: string) {
  const lowerPrompt = prompt.toLowerCase();
  let intent = 'GENERAL_HELP';
  let confidence = 0.6;
  const extractedEntities: any = {};

  // Detect storyworld creation intent - broader detection
  if (lowerPrompt.includes('create') || lowerPrompt.includes('story') || lowerPrompt.includes('world') || lowerPrompt.includes('universe') || lowerPrompt.includes('setting') || lowerPrompt.includes('cyberpunk') || lowerPrompt.includes('fantasy')) {
    intent = 'CREATE_STORYWORLD';
    confidence = 0.9;
    
    // Extract potential names and genres
    const genreKeywords = ['fantasy', 'sci-fi', 'science fiction', 'cyberpunk', 'steampunk', 'horror', 'mystery', 'romance', 'adventure'];
    const foundGenre = genreKeywords.find(genre => lowerPrompt.includes(genre));
    if (foundGenre) extractedEntities.genre = foundGenre;
    
    const themeKeywords = ['magic', 'technology', 'gods', 'mythology', 'space', 'future', 'ancient', 'medieval'];
    extractedEntities.themes = themeKeywords.filter(theme => lowerPrompt.includes(theme));
  }
  
  // Detect asset creation intent
  else if (lowerPrompt.includes('character') || lowerPrompt.includes('story') || lowerPrompt.includes('plot') || lowerPrompt.includes('lore')) {
    intent = 'CREATE_ASSET';
    confidence = 0.7;
    
    if (lowerPrompt.includes('character')) extractedEntities.assetType = 'CHARACTER';
    else if (lowerPrompt.includes('story') || lowerPrompt.includes('plot')) extractedEntities.assetType = 'STORYLINE';
    else if (lowerPrompt.includes('lore') || lowerPrompt.includes('background')) extractedEntities.assetType = 'LORE';
  }
  
  // Detect enhancement intent
  else if (lowerPrompt.includes('expand') || lowerPrompt.includes('add to') || lowerPrompt.includes('enhance')) {
    intent = 'ENHANCE_EXISTING';
    confidence = 0.7;
  }

  return { 
    intent: intent as 'CREATE_STORYWORLD' | 'CREATE_ASSET' | 'ENHANCE_EXISTING' | 'GENERAL_HELP', 
    confidence, 
    extractedEntities 
  };
}

// Helper function to generate storyworld from prompt
function generateStoryworldFromPrompt(prompt: string, entities: any) {
  const defaultGenre = entities.genre ? entities.genre.charAt(0).toUpperCase() + entities.genre.slice(1) : 'Fantasy';
  
  // Generate name based on prompt keywords
  let name = 'New Creative Universe';
  if (entities.themes && entities.themes.length > 0) {
    const theme = entities.themes[0];
    name = `Realm of ${theme.charAt(0).toUpperCase() + theme.slice(1)}`;
  }
  
  const descriptions = [
    'A unique universe where stories come to life and creativity knows no bounds.',
    'An immersive world filled with endless possibilities for storytelling.',
    'A creative realm where imagination meets structured narrative.',
    'A dynamic universe waiting to be shaped by your storytelling vision.'
  ];
  
  return {
    name,
    description: descriptions[Math.floor(Math.random() * descriptions.length)],
    genre: defaultGenre,
    themes: entities.themes || ['Adventure', 'Discovery', 'Creativity']
  };
}

// AI Assistant Functions - Enhanced with better prompting and error handling
export const processCreativePrompt = functions.https.onCall(
  async (data: AIPromptRequest, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Authentication required'
      );
    }

    const { prompt, userId, context: userContext } = data;
    const uid = context.auth.uid;

    if (uid !== userId) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'User ID mismatch'
      );
    }

    try {
      // Enhanced prompt for AI analysis with better structure
      const analysisPrompt = `
You are an AI assistant for a creative storytelling platform. Analyze this user prompt and respond with ONLY a JSON object.

User prompt: "${prompt}"

Analyze the intent and extract relevant information. Respond with this exact JSON structure:

{
  "intent": "CREATE_STORYWORLD" | "CREATE_ASSET" | "ENHANCE_EXISTING" | "GENERAL_HELP",
  "confidence": number between 0 and 1,
  "extractedEntities": {
    "storyworldName": "string or null",
    "genre": "string or null", 
    "themes": ["array", "of", "strings"],
    "assetType": "CHARACTER" | "STORYLINE" | "LORE" | "IMAGE" | null,
    "concepts": ["key", "concepts", "from", "prompt"]
  }
}

Rules:
- Use CREATE_STORYWORLD for world-building, universe creation, or setting establishment
- Use CREATE_ASSET for specific character, story, or lore creation
- Set confidence high (0.8+) only if intent is very clear
- Extract genre from context (fantasy, sci-fi, cyberpunk, etc.)
- Include relevant themes and concepts

Respond with ONLY the JSON object, no other text.
      `;

      // Use AI to analyze the prompt with better error handling
      let analysis;
      try {
        const aiResponse = await generate({
          model: gemini15Flash,
          prompt: analysisPrompt,
          config: {
            temperature: 0.3, // Lower temperature for more consistent JSON
            maxOutputTokens: 500,
          }
        });

        let aiText = aiResponse.text().trim();
        functions.logger.info('AI Analysis Response:', { rawResponse: aiText });
        
        // More robust JSON extraction
        const jsonMatch = aiText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          aiText = jsonMatch[0];
        }
        
        analysis = JSON.parse(aiText);
        functions.logger.info('Parsed AI Analysis:', analysis);
        
        // Validate the analysis structure
        if (!analysis.intent || !analysis.confidence || !analysis.extractedEntities) {
          throw new Error('Invalid analysis structure');
        }
        
      } catch (parseError) {
        functions.logger.warn('AI analysis failed, using fallback:', parseError);
        analysis = analyzePromptKeywords(prompt);
      }

      // Generate specific suggestions based on intent
      let suggestions;
      let generatedContent;

      if (analysis.intent === 'CREATE_STORYWORLD') {
        const storyworldPrompt = `
You are a creative world-building AI. Create a compelling storyworld based on this user prompt.

User prompt: "${prompt}"

Context from analysis:
- Genre: ${analysis.extractedEntities.genre || 'fantasy'}
- Themes: ${analysis.extractedEntities.themes?.join(', ') || 'adventure, discovery'}
- Key concepts: ${analysis.extractedEntities.concepts?.join(', ') || 'creativity, storytelling'}

Create a storyworld that captures the essence of the user's vision. Respond with this exact JSON structure:

{
  "name": "Compelling World Name",
  "description": "Rich, detailed description that brings the world to life (2-3 sentences)",
  "genre": "primary genre",
  "themes": ["theme1", "theme2", "theme3", "theme4"]
}

Guidelines:
- Name should be evocative and memorable
- Description should paint a vivid picture and hook the reader
- Include 3-4 relevant themes that match the prompt
- Make it feel unique and inspiring

Respond with ONLY the JSON object.
        `;

        try {
          const storyworldResponse = await generate({
            model: gemini15Flash,
            prompt: storyworldPrompt,
            config: {
              temperature: 0.7, // Higher creativity for world generation
              maxOutputTokens: 400,
            }
          });

          let storyworldText = storyworldResponse.text().trim();
          functions.logger.info('AI Storyworld Response:', { rawResponse: storyworldText });
          
          // Extract JSON from response
          const jsonMatch = storyworldText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            storyworldText = jsonMatch[0];
          }
          
          const storyworld = JSON.parse(storyworldText);
          
          // Validate storyworld structure
          if (!storyworld.name || !storyworld.description || !storyworld.genre) {
            throw new Error('Invalid storyworld structure');
          }
          
          generatedContent = { storyworld };
          functions.logger.info('Generated Storyworld:', storyworld);
          
        } catch (parseError) {
          functions.logger.warn('Storyworld generation failed, using fallback:', parseError);
          generatedContent = {
            storyworld: generateStoryworldFromPrompt(prompt, analysis.extractedEntities)
          };
        }

        suggestions = {
          type: 'create_storyworld' as const,
          title: 'Create Your Storyworld',
          description: `I can help you create "${generatedContent.storyworld.name}" - a ${generatedContent.storyworld.genre.toLowerCase()} universe.`,
          action: {
            function: 'createStoryworld',
            parameters: {
              name: generatedContent.storyworld.name,
              description: generatedContent.storyworld.description,
            }
          },
          alternatives: [
            {
              title: 'Start with a Character',
              description: 'Begin by creating a compelling main character for your story.',
              action: {
                function: 'createAsset',
                parameters: { type: 'CHARACTER' }
              }
            },
            {
              title: 'Write the Opening Scene',
              description: 'Start with a captivating storyline to set the tone.',
              action: {
                function: 'createAsset',
                parameters: { type: 'STORYLINE' }
              }
            }
          ]
        };
      } else if (analysis.intent === 'CREATE_ASSET') {
        const assetType = analysis.extractedEntities?.assetType || 'CHARACTER';
        
        suggestions = {
          type: 'create_asset' as const,
          title: `Create Your ${assetType}`,
          description: `Let's bring your ${assetType.toLowerCase()} concept to life with structured details.`,
          action: {
            function: 'createAsset',
            parameters: { 
              type: assetType,
              name: analysis.extractedEntities?.assetName || `New ${assetType}`
            }
          }
        };
      } else if (analysis.intent === 'ENHANCE_EXISTING') {
        suggestions = {
          type: 'enhance_asset' as const,
          title: 'Enhance Your Storyworld',
          description: 'I can help expand your existing storyworld with new characters, lore, or storylines.',
          action: {
            function: 'enhanceStoryworld',
            parameters: {
              storyworldId: userContext?.currentStoryworldId,
              enhancementType: 'expand_lore'
            }
          }
        };
      } else {
        suggestions = {
          type: 'general_advice' as const,
          title: 'Creative Guidance',
          description: 'Here are some ways I can help with your storytelling journey.',
        };
      }

      const response = {
        success: true,
        analysis: {
          intent: analysis.intent || 'GENERAL_HELP',
          confidence: analysis.confidence || 0.5,
          extractedEntities: analysis.extractedEntities || {}
        },
        suggestions,
        generatedContent
      };

      // Log for analytics
      functions.logger.info('Creative prompt processed', {
        userId,
        intent: analysis.intent,
        confidence: analysis.confidence,
        hasGeneratedContent: !!generatedContent
      });

      return response;
    } catch (error) {
      functions.logger.error('Error processing creative prompt', { 
        userId, 
        prompt: prompt.substring(0, 100), // Log first 100 chars for debugging
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      
      // Return a graceful fallback response instead of throwing
      const fallbackResponse = {
        success: false,
        analysis: {
          intent: 'GENERAL_HELP' as const,
          confidence: 0.5,
          extractedEntities: {}
        },
        suggestions: {
          type: 'general_advice' as const,
          title: 'Creative Assistance',
          description: 'I can help you create storyworlds, characters, and storylines. Try being more specific about what you\'d like to create.',
        }
      };
      
      return fallbackResponse;
    }
  }
);

export const enhanceStoryworld = functions.https.onCall(
  async (data: StoryworldEnhancementRequest, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Authentication required'
      );
    }

    const { storyworldId, userId, enhancementType } = data;
    const uid = context.auth.uid;

    if (uid !== userId) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'User ID mismatch'
      );
    }

    try {
      const db = admin.firestore();
      
      // Get storyworld details
      const storyworldDoc = await db.collection('storyworlds').doc(storyworldId).get();
      if (!storyworldDoc.exists || storyworldDoc.data()?.ownerId !== uid) {
        throw new functions.https.HttpsError(
          'permission-denied',
          'Invalid storyworld or insufficient permissions'
        );
      }

      const storyworld = storyworldDoc.data();
      if (!storyworld) {
        throw new functions.https.HttpsError(
          'not-found',
          'Storyworld not found'
        );
      }
      
      // Future: Get existing assets for AI context when implementing full AI enhancement
      // const assetsSnapshot = await db
      //   .collection('assets')
      //   .where('storyworldId', '==', storyworldId)
      //   .limit(20)
      //   .get();

      // const existingAssets = assetsSnapshot.docs.map(doc => ({
      //   type: doc.data().type,
      //   name: doc.data().name,
      //   description: doc.data().description || ''
      // }));

      // Generate basic enhancement suggestions (will be enhanced with AI later)
      let suggestions: Array<{
        type: AssetType;
        name: string;
        description: string;
        content: any;
        reasoning: string;
      }> = [];
      
      if (enhancementType === 'expand_lore') {
        suggestions = [
          {
            type: 'LORE' as const,
            name: 'Ancient History',
            description: 'Explore the foundational events that shaped your storyworld.',
            content: { description: 'Add details about the origins and early history of your world.' },
            reasoning: 'Rich backstory adds depth and authenticity to your universe.'
          },
          {
            type: 'LORE' as const,
            name: 'Cultural Traditions',
            description: 'Define the customs and beliefs of your world\'s inhabitants.',
            content: { description: 'Detail the cultural practices and social structures.' },
            reasoning: 'Cultural depth makes your world feel lived-in and authentic.'
          }
        ];
      } else if (enhancementType === 'create_characters') {
        suggestions = [
          {
            type: 'CHARACTER' as const,
            name: 'Mysterious Mentor',
            description: 'An wise figure who guides others through their journey.',
            content: { description: 'A character with deep knowledge and hidden motivations.' },
            reasoning: 'Mentors create opportunities for character growth and plot development.'
          }
        ];
      } else if (enhancementType === 'develop_storylines') {
        suggestions = [
          {
            type: 'STORYLINE' as const,
            name: 'The Catalyst Event',
            description: 'A pivotal moment that sets everything in motion.',
            content: { tiptapJSON: {}, plainText: 'The event that changes everything...' },
            reasoning: 'Strong opening events hook readers and drive the narrative forward.'
          }
        ];
      }

      // Future AI enhancement will go here

      const response: StoryworldEnhancementResponse = {
        success: true,
        suggestions: suggestions.slice(0, 5) // Limit to 5 suggestions
      };

      functions.logger.info('Storyworld enhancement generated', {
        uid,
        storyworldId,
        enhancementType,
        suggestionCount: suggestions.length
      });

      return response;
    } catch (error) {
      functions.logger.error('Error enhancing storyworld', { uid, storyworldId, error });
      throw new functions.https.HttpsError(
        'internal',
        'Failed to generate enhancements'
      );
    }
  }
);

// MongoDB Functions Import
export * from "./mongoFunctions";

// Story Protocol Functions Import
// Temporarily commented out due to compilation errors
// export * from "./storyProtocolFunctions"; 

// Marketplace uses authenticated getExploreAssets function (same as Library pattern) 