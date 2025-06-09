"use client";
import React, { useEffect, useState } from 'react';
import { useUser } from '@/hooks/useUser';
import { TokenETH, TokenSOL } from '@web3icons/react';
import { PhoneVerification } from '@/components/auth/PhoneVerification';

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

const WalletDisplay = ({
  name, 
  icon, 
  address, 
  isLoading = false,
  isPhoneVerified = false
}: { 
  name: string; 
  icon: React.ReactNode; 
  address?: string | null; 
  isLoading?: boolean;
  isPhoneVerified?: boolean;
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const truncateAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="flex items-center justify-between p-4 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 flex items-center justify-center">
          {icon}
        </div>
        <div>
          <h3 className="font-medium text-[#111827]">{name}</h3>
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin h-3 w-3 border border-[#D1D5DB] border-t-[#6366F1] rounded-full"></div>
              <span className="text-sm text-[#6B7280]">Creating...</span>
            </div>
          ) : address ? (
            <p className="text-sm text-[#6B7280] font-mono">{truncateAddress(address)}</p>
          ) : !isPhoneVerified ? (
            <p className="text-sm text-[#F59E0B]">Phone verification required</p>
          ) : (
            <p className="text-sm text-[#6B7280]">Wallet will be created</p>
          )}
        </div>
      </div>
      
      {address && !isLoading && (
        <button
          onClick={handleCopy}
          className="px-3 py-1 text-sm bg-white border border-[#D1D5DB] rounded-lg hover:bg-[#F9FAFB] transition-colors"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      )}
    </div>
  );
};

export const Profile: React.FC = () => {
  const { authUser: user, profile, loading } = useUser();
  const [walletsLoading, setWalletsLoading] = useState(false);
  const [showPhoneVerification, setShowPhoneVerification] = useState(false);

  useEffect(() => {
    // Check if wallets are being created (walletsStatus is 'creating')
    if (profile?.walletsStatus === 'creating') {
      setWalletsLoading(true);
    } else {
      setWalletsLoading(false);
    }
  }, [profile?.walletsStatus]);

  const handleStartPhoneVerification = () => {
    setShowPhoneVerification(true);
  };

  const handlePhoneVerificationSuccess = () => {
    setShowPhoneVerification(false);
    // Profile will automatically update via the useUser hook
  };

  // Check phone verification from multiple sources for reliability
  const isPhoneVerified = Boolean(
    profile?.phoneNumber?.isVerified === true || 
    !!(user?.phoneNumber && user.phoneNumber.length > 0) ||
    (profile?.walletsStatus && ['creating', 'completed'].includes(profile.walletsStatus))
  );

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6366F1] mx-auto"></div>
          <p className="mt-4 text-[#6B7280]">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Show phone verification modal if user chose to verify
  if (showPhoneVerification) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <PhoneVerification
          user={user}
          isLinking={true}
          onSuccess={handlePhoneVerificationSuccess}
          onCancel={() => setShowPhoneVerification(false)}
        />
      </div>
    );
  }

  const memberSince = user?.metadata.creationTime ?
    new Date(user.metadata.creationTime).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    }) : 'Unknown';

  // Define displayed wallets - Only show Ethereum, Solana, and Story Protocol
  // (All other wallets are created in backend but hidden from UI)
  const displayedWallets = [
    {
      key: 'ethereum' as const,
      name: 'Ethereum',
      icon: <TokenETH size={32} variant="branded" />,
      address: profile?.wallets?.ethereum
    },
    {
      key: 'solana' as const,
      name: 'Solana',
      icon: <TokenSOL size={32} variant="branded" />,
      address: profile?.wallets?.solana
    },
    {
      key: 'story' as const,
      name: 'Story Protocol',
      icon: <StoryProtocolIcon size={32} />,
      address: profile?.wallets?.ethereum // Story Protocol uses Ethereum address
    }
  ];

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold text-[#111827] mb-8">Profile</h1>
        
        <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] overflow-hidden">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] px-8 py-12 text-center">
            <div className="relative inline-block">
              <img
                src={user.photoURL || '/default-avatar.png'}
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg mx-auto"
              />
            </div>
            <h2 className="text-3xl font-bold text-white mt-4">
              {user.displayName || 'SIA Creator'}
            </h2>
            <p className="text-blue-100 mt-2">
              Member since {memberSince}
            </p>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* User Information */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-[#111827] mb-4">
                Account Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
                  <div>
                    <p className="font-medium text-[#111827]">Email</p>
                    <p className="text-[#6B7280]">{user.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#10B981] rounded-full"></span>
                    <span className="text-sm text-[#10B981]">Verified</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
                  <div>
                    <p className="font-medium text-[#111827]">Phone Number</p>
                    {isPhoneVerified ? (
                      <p className="text-[#6B7280]">{profile?.phoneNumber?.number}</p>
                    ) : (
                      <p className="text-[#6B7280]">Not verified</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {isPhoneVerified ? (
                      <>
                        <span className="w-2 h-2 bg-[#10B981] rounded-full"></span>
                        <span className="text-sm text-[#10B981]">Verified</span>
                      </>
                    ) : (
                      <button
                        onClick={handleStartPhoneVerification}
                        className="px-3 py-1 bg-[#6366F1] text-white rounded text-sm hover:bg-[#5B5BD6] transition-colors"
                      >
                        Verify Now
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
                  <div>
                    <p className="font-medium text-[#111827]">Authentication Provider</p>
                    <p className="text-[#6B7280]">Google</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#3B82F6]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="text-sm text-[#6B7280]">Connected</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Wallets Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-[#111827]">My Wallets</h3>
                {walletsLoading && (
                  <div className="flex items-center text-sm text-[#6366F1]">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#6366F1] mr-2"></div>
                    Auto-creating wallets...
                  </div>
                )}
              </div>
              
              {!isPhoneVerified && (
                <div className="mb-6 p-4 bg-[#FEF3C7] border border-[#F59E0B] rounded-xl">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#F59E0B] mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-[#92400E]">Phone verification required</p>
                      <p className="text-sm text-[#92400E] mt-1">
                        Verify your phone number to create secure crypto wallets for Ethereum and Solana.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="space-y-4 mb-6">
                {displayedWallets.map((wallet) => (
                  <WalletDisplay
                    key={wallet.key}
                    name={wallet.name}
                    icon={wallet.icon}
                    address={wallet.address}
                    isLoading={walletsLoading && isPhoneVerified && !wallet.address}
                    isPhoneVerified={isPhoneVerified}
                  />
                ))}
              </div>

              {profile?.walletsStatus === 'failed' && (
                <div className="mb-4 p-4 bg-[#FEE2E2] border border-[#EF4444] rounded-xl">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#EF4444] mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-[#991B1B]">Wallet creation failed</p>
                      <p className="text-sm text-[#991B1B] mt-1">
                        There was an issue creating your wallets. Please contact support if this persists.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 