"use client";
import React from 'react';
import { Asset } from './types';

interface ExploreProps {
  onAssetSelect: (asset: Asset) => void;
  onLicenseAsset: (asset: Asset) => void;
}

export const Explore = ({ onAssetSelect, onLicenseAsset }: ExploreProps) => {
  return (
    <div className="h-full flex flex-col bg-[#FAFBFC]">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E7EB] px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-[#111827]">Explore</h1>
            <p className="text-[#6B7280] mt-1">
              Discover and license IP assets from the Story Protocol ecosystem
            </p>
          </div>
        </div>
      </div>

      {/* Content - Simple placeholder for Story Protocol integration */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center py-16 max-w-md">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center text-4xl">
            🛡️
          </div>
          <h3 className="text-xl font-semibold text-[#111827] mb-2">
            Story Protocol Integration
          </h3>
          <p className="text-[#6B7280] mb-6">
            This section will showcase IP assets registered on Story Protocol. 
            Integration coming soon with full marketplace functionality.
          </p>
          <div className="space-y-3 text-sm text-[#6B7280]">
            <div className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
              <span>Browse registered IP assets</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
              <span>License assets with PIL templates</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              <span>Track IP ownership and derivatives</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 