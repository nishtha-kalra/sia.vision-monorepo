import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, connectAuthEmulator, type Auth } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator, type Firestore } from "firebase/firestore";
import { getStorage, connectStorageEmulator, type FirebaseStorage } from "firebase/storage";
import { getFunctions, connectFunctionsEmulator, type Functions } from "firebase/functions";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase only once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize services with proper error handling
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;
let functions: Functions | null = null;

try {
  auth = getAuth(app);
  
  // Configure auth settings for better phone auth support
  auth.settings.appVerificationDisabledForTesting = false; // Enable in production
  
  // Set language code for SMS messages (optional)
  auth.languageCode = 'en';
  
  // You can also use the browser's language
  // auth.useDeviceLanguage();
  
} catch (error) {
  console.error("Error initializing Firebase Auth:", error);
}

try {
  db = getFirestore(app);
} catch (error) {
  console.error("Error initializing Firestore:", error);
}

try {
  storage = getStorage(app);
} catch (error) {
  console.error("Error initializing Storage:", error);
}

try {
  functions = getFunctions(app);
} catch (error) {
  console.error("Error initializing Functions:", error);
}

// Connect to emulators in development
if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
  const shouldUseEmulator = localStorage.getItem("useEmulator") === "true";
  
  if (shouldUseEmulator) {
    try {
      if (auth && !(auth as any)._emulatorConfigured) {
        connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
        (auth as any)._emulatorConfigured = true;
      }
      
      if (db && !(db as any)._emulatorConfigured) {
        connectFirestoreEmulator(db, "localhost", 8080);
        (db as any)._emulatorConfigured = true;
      }
      
      if (storage && !(storage as any)._emulatorConfigured) {
        connectStorageEmulator(storage, "localhost", 9199);
        (storage as any)._emulatorConfigured = true;
      }
      
      if (functions && !(functions as any)._emulatorConfigured) {
        connectFunctionsEmulator(functions, "localhost", 5001);
        (functions as any)._emulatorConfigured = true;
      }
    } catch (error) {
      console.error("Error connecting to emulators:", error);
    }
  }
}

export { app, auth, db, storage, functions };
