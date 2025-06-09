'use client';

import { useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';
import { DashboardContainer } from '@/components/dashboard/DashboardContainer';

export default function DashboardPage() {
  const { authUser: user, authLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/join');
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6366F1] mx-auto"></div>
          <p className="mt-4 text-[#6B7280]">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <DashboardContainer />;
} 