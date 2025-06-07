// Shared Firebase configuration and constants

// Firebase collections
export const COLLECTIONS = {
  USERS: 'users',
  CONTACTS: 'contacts',
  ANALYTICS: 'analytics',
} as const;

// Firebase Auth provider IDs
export const AUTH_PROVIDERS = {
  GOOGLE: 'google.com',
  EMAIL: 'password',
} as const;

// Environment configuration
export const getFirebaseConfig = () => ({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
});

// Validate Firebase configuration
export const validateFirebaseConfig = (config: ReturnType<typeof getFirebaseConfig>): boolean => {
  return !!(
    config.apiKey &&
    config.authDomain &&
    config.projectId &&
    config.storageBucket &&
    config.messagingSenderId &&
    config.appId
  );
}; 