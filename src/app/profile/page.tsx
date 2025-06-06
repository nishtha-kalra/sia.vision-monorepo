'use client';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navigation/Navbar';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!u) {
        router.replace('/join');
      }
    });
    return unsub;
  }, [router]);

  if (!user) {
    return null;
  }

  return (
    <main className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <div className="flex flex-1 items-center justify-center p-4">
        <div className="space-y-4 text-center">
          {user.photoURL && (
            <img
              src={user.photoURL}
              alt="Profile"
              className="w-24 h-24 rounded-full mx-auto"
            />
          )}
          <p className="text-lg font-medium">
            {user.displayName || user.email}
          </p>
          <button
            onClick={() => signOut(auth)}
            className="px-6 py-3 bg-gray-800 text-white rounded-lg"
          >
            Sign out
          </button>
        </div>
      </div>
    </main>
  );
}
