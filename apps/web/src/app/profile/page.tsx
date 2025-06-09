'use client';
import { useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { authUser: user, authLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/join');
    } else if (!authLoading && user) {
      // Redirect to dashboard since profile is now part of dashboard
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-creative-tech-surface via-white to-creative-tech-surface/50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-creative-tech-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return null;
}
