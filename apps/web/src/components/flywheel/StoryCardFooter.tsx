import * as React from "react";

interface StoryCardFooterProps {
  label: string;
  attribution: string;
}

export const StoryCardFooter: React.FC<StoryCardFooterProps> = ({
  label,
  attribution,
}) => {
  return (
    <footer className="flex justify-between items-center mt-8">
      <div className="flex gap-3 items-center">
        <button
          aria-label={label}
          className="flex justify-center items-center w-8 h-8 bg-primary rounded-full hover:bg-primary/90 transition-colors duration-200"
        >
          <svg
            fill="currentColor"
            viewBox="0 0 20 20"
            className="w-4 h-4 text-white"
          >
            <path d="M10 12l-2-2m0 0l2-2m-2 2h8m-8 0H2" />
          </svg>
        </button>
        <span className="text-sm font-semibold text-primary">{label}</span>
      </div>
      <div className="text-xs font-medium text-gray-400">{attribution}</div>
    </footer>
  );
}; 