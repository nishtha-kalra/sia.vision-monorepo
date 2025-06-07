import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from '@/lib/firebase';
import { useAuthState } from './useAuth';

interface UserProfile {
  displayName?: string | null;
  email?: string | null;
  photoURL?: string | null;
  wallets?: {
    primaryEVM?: string | null;
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

      if (data && data.wallets?.primaryEVM === null && functions) {
        try {
          const provision = httpsCallable(functions as any, 'provisionUserWallet');
          const result = await provision({ uid: authUser.uid });
          if (result && typeof result === 'object' && 'data' in result) {
            // nothing to do - snapshot listener will update
          }
        } catch (err) {
          console.error('Wallet provisioning failed', err);
        }
      }
    });

    return unsub;
  }, [authUser]);

  return { authUser, authLoading, profile, loading } as const;
}
