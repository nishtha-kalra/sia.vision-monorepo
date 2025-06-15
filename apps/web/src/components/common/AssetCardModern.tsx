import React from "react";
import { Asset } from "@/types";

interface CreatorInfo {
  name: string;
  avatar: string;
  verified?: boolean;
}

interface LicenseInfo {
  type: "free" | "fixed" | "royalty";
  terms: string;
  price?: string;
  royaltyPercentage?: number;
}

interface StatsInfo {
  views: number;
  uses: number;
  likes: number;
}

interface ModernAssetCardProps {
  asset: Asset & {
    mediaUrl?: string;
    creator?: CreatorInfo;
    licensing?: LicenseInfo;
    stats?: StatsInfo;
  };
  onSelect?: (asset: Asset) => void;
  onAction?: (asset: Asset) => void;
  showActionButton?: boolean;
  actionLabel?: string;
}

const iconForType: Record<string, string> = {
  CHARACTER: "👤",
  STORYLINE: "📖",
  LORE: "📚",
  IMAGE: "🎨",
  VIDEO: "🎬",
  AUDIO: "🎵",
};

export const AssetCardModern: React.FC<ModernAssetCardProps> = ({
  asset,
  onSelect,
  onAction,
  showActionButton = false,
  actionLabel = "Use",
}) => {
  const { creator, licensing, stats } = asset as any;

  const getLicensePill = () => {
    if (!licensing) return null;
    const base =
      "px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ";
    switch (licensing.type) {
      case "free":
        return (
          <span className={base + "bg-emerald-100 text-emerald-700"}>Free to Use</span>
        );
      case "fixed":
        return (
          <span className={base + "bg-indigo-100 text-indigo-700"}>
            {licensing.price}
          </span>
        );
      case "royalty":
        return (
          <span className={base + "bg-amber-100 text-amber-700"}>
            {licensing.royaltyPercentage}% Royalty
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden hover:shadow-xl transition-shadow duration-200 cursor-pointer flex flex-col"
      onClick={() => onSelect?.(asset)}
    >
      {/* Media / Icon */}
      {asset.type === "IMAGE" && asset.mediaUrl ? (
        <img
          src={asset.mediaUrl}
          alt={asset.name}
          className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
        />
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-6xl">
          {iconForType[asset.type] || "📄"}
        </div>
      )}

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-[#111827] text-base leading-tight line-clamp-2 flex-1">
            {asset.name}
          </h3>
          {licensing && getLicensePill()}
        </div>

        {/* Creator */}
        {creator && (
          <div className="flex items-center gap-2 mb-3">
            <img
              src={creator.avatar}
              alt={creator.name}
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="text-xs text-[#6B7280] font-medium whitespace-nowrap">
              {creator.name}
            </span>
            {creator.verified && (
              <svg
                className="w-4 h-4 text-[#6366F1]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
        )}

        {/* Stats */}
        {stats && (
          <div className="flex items-center gap-3 text-xs text-[#6B7280] mb-3">
            <span>{stats.views} views</span>
            <span>{stats.uses} uses</span>
            <span>{stats.likes} likes</span>
          </div>
        )}

        {/* Action Button */}
        {showActionButton && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAction?.(asset);
            }}
            className="mt-auto w-full py-2 bg-[#6366F1] text-white text-sm rounded-lg hover:bg-[#5456d7] transition-colors"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}; 