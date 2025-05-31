import * as React from "react";

interface HowItWorksCardProps {
  title: string;
  description: React.ReactNode;
  iconPath?: string;
  imageSrc?: string;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const HowItWorksCard: React.FC<HowItWorksCardProps> = ({
  title,
  description,
  iconPath,
  imageSrc,
  isHovered,
  onMouseEnter,
  onMouseLeave,
}) => {
  return (
    <article
      className="flex flex-col p-6 rounded-xl transition-all duration-300 ease-in-out bg-white border border-stone-200 cursor-pointer shadow-sm"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        transform: isHovered ? "translateY(-4px)" : "translateY(0px)",
        boxShadow: isHovered
          ? "0 8px 32px rgba(0,0,0,0.10)"
          : "0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      <div className="flex justify-center items-center mb-6 rounded-xl bg-stone-100 h-24 w-24">
        {imageSrc ? (
          <img 
            src={imageSrc} 
            alt={title}
            className="w-24 h-24 object-contain"
          />
        ) : (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-stone-900">
            <path d={iconPath} />
          </svg>
        )}
      </div>
      <h3 className="mb-4 text-lg font-semibold leading-none text-stone-900">
        {title}
      </h3>
      <p className="text-sm leading-loose text-stone-600">{description}</p>
    </article>
  );
};

export default HowItWorksCard; 