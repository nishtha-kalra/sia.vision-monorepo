import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { PrivyClient } from "@privy-io/server-auth";
import cors from "cors";
import sgMail from "@sendgrid/mail";

// Initialize Firebase Admin
admin.initializeApp();

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