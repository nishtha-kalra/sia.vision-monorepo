import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from '@/lib/firebase';
import { useAuthState } from './useAuth';

interface UserProfile {
  displayName?: string | null;
  email?: string | null;
  photoURL?: string | null;
  phoneNumber?: {
    number: string;
    isVerified: boolean;
  } | null;
  authProviders?: string[];
  walletsStatus?: 'creating' | 'completed' | 'failed';
  walletsError?: string;
  wallets?: {
    ethereum?: string | null;
    solana?: string | null;
    stellar?: string | null;
    cosmos?: string | null;
    sui?: string | null;
    tron?: string | null;
    story?: string | null;
    linkedWallets?: string[];
  };
}

export function useUser() {
  const [authUser, authLoading] = useAuthState();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authUser || !db) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const ref = doc(db as any, 'users', authUser.uid);
    const unsub = onSnapshot(ref, async (snap) => {
      const data = snap.data() as UserProfile;
      setProfile(data);
      setLoading(false);

      // Wallets are now auto-created on user creation, no need to provision here
    });

    return unsub;
  }, [authUser]);

  const provisionWallet = async (chainType: string) => {
    if (!authUser || !functions) return null;
    
    try {
      const provision = httpsCallable(functions as any, 'provisionUserWallet');
      const result = await provision({ uid: authUser.uid, chainType });
      return result.data;
    } catch (err) {
      console.error(`Failed to provision ${chainType} wallet:`, err);
      throw err;
    }
  };

  const provisionAllWallets = async () => {
    if (!authUser || !functions) return null;
    
    try {
      const provision = httpsCallable(functions as any, 'provisionAllWallets');
      const result = await provision({ uid: authUser.uid });
      return result.data;
    } catch (err) {
      console.error('Failed to provision all wallets:', err);
      throw err;
    }
  };

  return { 
    authUser, 
    authLoading, 
    profile, 
    loading,
    provisionWallet,
    provisionAllWallets
  } as const;
}
