'use client';

import React, { useState } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/lib/firebase';
import { useUser } from '@/hooks/useUser';

interface SimpleIPProtectionButtonProps {
  assetId: string;
  assetTitle: string;
  onSuccess?: (result: any) => void;
  onError?: (error: string) => void;
}

export const SimpleIPProtectionButton: React.FC<SimpleIPProtectionButtonProps> = ({
  assetId,
  assetTitle,
  onSuccess,
  onError
}) => {
  const { authUser, profile } = useUser();
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Check if user has an Ethereum wallet (Story Protocol uses Ethereum)
  const hasWallet = profile?.wallets?.ethereum;
  const walletAddress = profile?.wallets?.ethereum;

  const executeIPProtection = async () => {
    if (!authUser || !hasWallet || !functions) {
      onError?.('Wallet not available. Please verify your phone number first.');
      return;
    }

    setIsProcessing(true);
    setResult(null);

    try {
      console.log('🚀 Starting IP protection with custody wallet...');
      console.log('Asset:', assetTitle);
      console.log('Wallet:', walletAddress?.substring(0, 8) + '...');

      // Call the backend function that handles everything server-side
      const protectIP = httpsCallable(functions, 'startIPProtectionWithPrivy');
      
      const response = await protectIP({
        registrationId: assetId,
        walletInfo: {
          address: walletAddress,
          type: 'custody_wallet',
          privyUserId: authUser.uid
        }
      });

      const data = response.data as any;

      if (data.success) {
        console.log('✅ IP protection completed successfully');
        
        const successResult = {
          success: true,
          txHash: data.transactions?.[0]?.txHash || 'pending',
          ipId: data.ipId,
          tokenId: data.tokenId,
          explorerUrl: data.transactions?.[0]?.txHash ? 
            `https://aeneid.storyscan.io/tx/${data.transactions[0].txHash}` : null,
          message: 'IP protection completed successfully'
        };

        setResult(successResult);
        onSuccess?.(successResult);
      } else {
        throw new Error(data.error || 'IP protection failed');
      }

    } catch (error: any) {
      console.error('❌ IP protection failed:', error);
      const errorMessage = error.message || 'Failed to protect IP';
      setResult({ success: false, error: errorMessage });
      onError?.(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!authUser) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg border">
        <p className="text-sm text-gray-600">Please sign in to protect your IP</p>
      </div>
    );
  }

  if (!hasWallet) {
    return (
      <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-sm font-medium text-yellow-800">Wallet Required</p>
            <p className="text-sm text-yellow-700 mt-1">
              Please verify your phone number to create a custody wallet for IP protection.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* IP Protection Button */}
      <div className="p-4 bg-white rounded-lg border">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-medium text-gray-900">Story Protocol IP Protection</h3>
            <p className="text-sm text-gray-600">
              Protect "{assetTitle}" as intellectual property on Story Protocol
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Custody Wallet</p>
            <p className="text-xs font-mono text-gray-700">
              {walletAddress?.substring(0, 8)}...{walletAddress?.substring(36)}
            </p>
          </div>
        </div>

        <button
          onClick={executeIPProtection}
          disabled={true}
          className="w-full px-4 py-2 rounded-lg font-medium transition-colors bg-gray-100 text-gray-400 cursor-not-allowed"
        >
          Protect as IP (Disabled)
        </button>

        <div className="mt-2 text-xs text-gray-500 text-center">
          🚫 IP Protection temporarily disabled
        </div>
      </div>

      {/* Result Display */}
      {result && (
        <div className={`p-4 rounded-lg border ${
          result.success 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-start gap-3">
            {result.success ? (
              <svg className="w-5 h-5 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-red-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
            <div className="flex-1">
              <p className={`text-sm font-medium ${
                result.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {result.success ? 'IP Protection Successful!' : 'IP Protection Failed'}
              </p>
              
              {result.success ? (
                <div className="mt-2 space-y-1">
                  {result.ipId && (
                    <p className="text-xs text-green-700">
                      <span className="font-medium">IP ID:</span> {result.ipId.substring(0, 10)}...
                    </p>
                  )}
                  {result.tokenId && (
                    <p className="text-xs text-green-700">
                      <span className="font-medium">Token ID:</span> {result.tokenId}
                    </p>
                  )}
                  {result.txHash && result.txHash !== 'pending' && (
                    <p className="text-xs text-green-700">
                      <span className="font-medium">Transaction:</span> 
                      <a 
                        href={result.explorerUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="ml-1 underline hover:text-green-800"
                      >
                        {result.txHash.substring(0, 10)}...{result.txHash.substring(56)}
                      </a>
                    </p>
                  )}
                  <p className="text-xs text-green-600 mt-2">
                    Your asset is now protected as intellectual property on Story Protocol!
                  </p>
                </div>
              ) : (
                <p className="text-xs text-red-700 mt-1">{result.error}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 