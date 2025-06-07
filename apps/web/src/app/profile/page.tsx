'use client';
import { useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuthState } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [user, loading] = useAuthState();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/join');
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    if (!auth) return;
    try {
      await signOut(auth as any);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-creative-tech-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const memberSince = user.metadata.creationTime ? 
    new Date(user.metadata.creationTime).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    }) : 'Unknown';

  return (
    <div className="min-h-screen bg-gradient-to-br from-creative-tech-surface via-white to-creative-tech-surface/50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-creative-tech-primary to-blue-600 px-8 py-12 text-center">
              <div className="relative inline-block">
                <img
                  src={user.photoURL || '/default-avatar.png'}
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg mx-auto"
                />
              </div>
              <h1 className="text-3xl font-bold text-white mt-4">
                {user.displayName || 'SIA Member'}
              </h1>
              <p className="text-blue-100 mt-2">
                Member since {memberSince}
              </p>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* User Information */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-creative-tech-on-surface mb-4">
                  Account Information
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-creative-tech-on-surface">Email</p>
                      <p className="text-gray-600">{user.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="text-sm text-green-600">Verified</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-creative-tech-on-surface">Authentication Provider</p>
                      <p className="text-gray-600">Google</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span className="text-sm text-gray-600">Google Account</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t pt-8">
                <button
                  onClick={handleSignOut}
                  className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
