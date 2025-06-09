"use client";

interface TypingIndicatorProps {
  isVisible: boolean;
}

export const TypingIndicator = ({ isVisible }: TypingIndicatorProps) => {
  if (!isVisible) return null;

  return (
    <div className="flex gap-1 items-center text-sm leading-5 text-[#6B7280]">
      <div className="animate-pulse w-1 h-1 rounded-full bg-[#6B7280]" />
      <div
        className="animate-pulse w-1 h-1 rounded-full bg-[#6B7280]"
        style={{ animationDelay: '0.2s' }}
      />
      <div
        className="animate-pulse w-1 h-1 rounded-full bg-[#6B7280]"
        style={{ animationDelay: '0.4s' }}
      />
    </div>
  );
}; 