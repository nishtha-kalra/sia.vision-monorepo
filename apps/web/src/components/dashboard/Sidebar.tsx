"use client";
import React from 'react';
import { useUser } from '@/hooks/useUser';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLibraryOpen: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, onLibraryOpen }) => {
  const { authUser: user } = useUser();
  const router = useRouter();

  const handleSignOut = async () => {
    if (!auth) return;
    try {
      await signOut(auth as any);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="w-64 bg-white border-r border-[#E5E7EB] flex flex-col shadow-sm">
      <div className="p-6 border-b border-[#E5E7EB]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">S</span>
          </div>
          <span className="text-[#111827] font-semibold text-lg">
            Sia.vision
          </span>
        </div>
      </div>
      <div className="flex-1 p-4">
        <div className="space-y-2">
          <button
            onClick={() => onTabChange('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              activeTab === 'dashboard'
                ? 'bg-[#6366F1] text-white shadow-sm'
                : 'text-[#6B7280] hover:text-[#111827] hover:bg-[#F9FAFB]'
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
            <span>Dashboard</span>
          </button>
          <button
            onClick={onLibraryOpen}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              activeTab === 'library'
                ? 'bg-[#6366F1] text-white shadow-sm'
                : 'text-[#6B7280] hover:text-[#111827] hover:bg-[#F9FAFB]'
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
            </svg>
            <span>Library</span>
          </button>

          <button
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              activeTab === 'canvas'
                ? 'bg-[#6366F1] text-white shadow-sm'
                : 'text-[#6B7280] hover:text-[#111827] hover:bg-[#F9FAFB]'
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            <span>Canvas</span>
          </button>
        </div>
      </div>
      <div className="p-4 border-t border-[#E5E7EB]">
        <button
          onClick={() => onTabChange('profile')}
          className={`w-full flex items-center gap-3 p-3 rounded-lg mb-3 transition-all duration-200 ${
            activeTab === 'profile'
              ? 'bg-[#6366F1] text-white shadow-sm'
              : 'bg-[#F9FAFB] hover:bg-[#E5E7EB] text-[#111827]'
          }`}
        >
          <img
            src={user?.photoURL || "https://placehold.co/32x32/6366F1/ffffff?text=U"}
            alt="User"
            className="w-8 h-8 rounded-full"
          />
          <div className="flex-1 min-w-0 text-left">
            <p className={`text-sm font-medium truncate ${
              activeTab === 'profile' ? 'text-white' : 'text-[#111827]'
            }`}>
              {user?.displayName || 'Creator'}
            </p>
            <p className={`text-xs truncate ${
              activeTab === 'profile' ? 'text-blue-100' : 'text-[#6B7280]'
            }`}>
              {user?.email}
            </p>
          </div>
        </button>
        <button
          onClick={handleSignOut}
          className="w-full px-3 py-2 text-sm text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] rounded-lg transition-colors duration-200"
        >
          Sign Out
        </button>
      </div>
    </nav>
  );
}; 