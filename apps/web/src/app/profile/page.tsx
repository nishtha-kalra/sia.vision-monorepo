'use client';
import { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';
import { TokenETH, TokenSOL } from '@web3icons/react';

// Story Protocol icon using the provided SVG
const StoryProtocolIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <img
    src="/story-protocol.svg"
    alt="Story Protocol"
    width={size}
    height={size}
    className={className}
  />
);



interface WalletDisplayProps {
  name: string;
  icon: React.ReactNode;
  address?: string | null;
  isLoading?: boolean;
  note?: string;
}

const WalletDisplay = ({ name, icon, address, isLoading, note }: WalletDisplayProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          {icon}
        </div>
        <div>
          <p className="font-medium text-gray-900">{name}</p>
          {note && (
            <p className="text-xs text-blue-600 mb-1">{note}</p>
          )}
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-500">Creating wallet...</span>
            </div>
          ) : address ? (
            <p className="text-sm text-gray-600 font-mono">
              {formatAddress(address)}
            </p>
          ) : (
            <p className="text-sm text-gray-400">Not created</p>
          )}
        </div>
      </div>
      
      {address && !isLoading && (
        <button
          onClick={handleCopy}
          className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      )}
    </div>
  );
};

export default function ProfilePage() {
  const { authUser: user, profile, loading, authLoading } = useUser();
  const router = useRouter();
  const [walletsLoading, setWalletsLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/join');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    // Check if wallets are being created (no wallets exist yet)
    if (profile && (!profile.wallets || Object.keys(profile.wallets).length === 0)) {
      setWalletsLoading(true);
      // Set a timeout to stop loading after reasonable time
      const timeout = setTimeout(() => setWalletsLoading(false), 30000);
      return () => clearTimeout(timeout);
    } else {
      setWalletsLoading(false);
    }
  }, [profile]);

  const handleSignOut = async () => {
    if (!auth) return;
    try {
      await signOut(auth as any);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-creative-tech-surface via-white to-creative-tech-surface/50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-creative-tech-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const memberSince = user?.metadata.creationTime ?
    new Date(user.metadata.creationTime).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    }) : 'Unknown';

  // Define supported wallets with icons
  const supportedWallets = [
    {
      key: 'ethereum' as const,
      name: 'Ethereum',
      icon: <TokenETH size={32} variant="branded" />,
      address: profile?.wallets?.ethereum
    },
    {
      key: 'story' as const,
      name: 'Story Protocol',
      icon: <StoryProtocolIcon size={32} className="" />,
      address: profile?.wallets?.ethereum
    },
    {
      key: 'solana' as const,
      name: 'Solana',
      icon: <TokenSOL size={32} variant="branded" />,
      address: profile?.wallets?.solana
    }
  ];

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

              {/* Wallets Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-creative-tech-on-surface">My Wallets</h2>
                  {walletsLoading && (
                    <div className="flex items-center text-sm text-blue-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                      Auto-creating wallets...
                    </div>
                  )}
                </div>
                
                <div className="space-y-4 mb-6">
                  {supportedWallets.map((wallet) => (
                    <WalletDisplay
                      key={wallet.key}
                      name={wallet.name}
                      icon={wallet.icon}
                      address={wallet.address}
                      isLoading={walletsLoading && !wallet.address}
                    />
                  ))}
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
