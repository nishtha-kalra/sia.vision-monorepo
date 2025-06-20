import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getFunctions, Functions, connectFunctionsEmulator } from 'firebase/functions';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Validate that we have Firebase config
const isFirebaseConfigValid = 
  firebaseConfig.apiKey && 
  firebaseConfig.authDomain && 
  firebaseConfig.projectId &&
  firebaseConfig.storageBucket &&
  firebaseConfig.messagingSenderId &&
  firebaseConfig.appId;

// Initialize Firebase only on client side and with valid config
let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;
let functionsInstance: Functions | null = null;

if (typeof window !== 'undefined' && isFirebaseConfigValid) {
  // Only initialize Firebase in the browser with real config
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  db = getFirestore(app);
  auth = getAuth(app);
  functionsInstance = getFunctions(app);
  
  // Use production Firebase Functions (no emulator)
  console.log('🔥 Firebase initialized successfully');
  console.log('🔧 Functions instance:', functionsInstance);
  console.log('🌍 Functions region:', functionsInstance.region);
  console.log('🔗 Functions URL:', functionsInstance.customDomain || `https://${functionsInstance.region}-${firebaseConfig.projectId}.cloudfunctions.net`);
}

export { db, auth, functionsInstance as functions };
export default app;
