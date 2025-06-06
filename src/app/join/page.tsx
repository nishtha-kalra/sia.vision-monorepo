'use client';
import { useEffect } from 'react';
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navigation/Navbar';

export default function JoinPage() {
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        router.replace('/profile');
      }
    });
    return unsub;
  }, [router]);

  const signInWithProvider = async (provider: GoogleAuthProvider | FacebookAuthProvider | OAuthProvider) => {
    try {
      await signInWithPopup(auth, provider);
      router.replace('/profile');
    } catch (err) {
      console.error('Authentication error', err);
    }
  };

  return (
    <main className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <div className="flex flex-1 items-center justify-center p-4">
        <div className="space-y-4 w-full max-w-sm">
          <h1 className="text-3xl font-bold text-center">Join SIA</h1>
          <button
            onClick={() => signInWithProvider(new GoogleAuthProvider())}
            className="w-full px-6 py-3 border rounded-lg bg-gray-100 hover:bg-gray-200"
          >
            Continue with Google
          </button>
          <button
            onClick={() => signInWithProvider(new FacebookAuthProvider())}
            className="w-full px-6 py-3 border rounded-lg bg-gray-100 hover:bg-gray-200"
          >
            Continue with Facebook
          </button>
          <button
            onClick={() => signInWithProvider(new OAuthProvider('apple.com'))}
            className="w-full px-6 py-3 border rounded-lg bg-gray-100 hover:bg-gray-200"
          >
            Continue with Apple
          </button>
        </div>
      </div>
    </main>
  );
}
