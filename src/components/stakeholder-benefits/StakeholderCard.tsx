import * as React from "react";
import Image from "next/image";

interface StakeholderCardProps {
  title: string;
  description: string;
  ctaText: string;
  imageAlt: string;
  imageSrc: string;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export const StakeholderCard: React.FC<StakeholderCardProps> = ({
  title,
  description,
  ctaText,
  imageAlt,
  imageSrc,
  isHovered,
  onMouseEnter,
  onMouseLeave,
}) => {
  return (
    <article
      className="flex flex-col p-6 rounded-xl transition-all duration-300 ease-in-out bg-white cursor-pointer h-full shadow-lg"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        transform: isHovered ? "translateY(-4px)" : "translateY(0px)",
        boxShadow: isHovered
          ? "0 12px 40px rgba(0,0,0,0.15)"
          : "0 4px 20px rgba(0,0,0,0.08)",
      }}
    >
      {/* Image */}
      <div className="h-56 w-full rounded-lg bg-gray-100 mb-6 overflow-hidden relative">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      
      {/* Title */}
      <h3 className="text-2xl font-semibold text-creative-tech-primary mb-4 leading-tight">
        {title}
      </h3>
      
      {/* Description */}
      <p className="text-gray-700 leading-relaxed flex-grow mb-4 text-sm">
        {description}
      </p>
      
      {/* CTA */}
      <div className="mt-auto">
        <span className="text-creative-tech-primary font-semibold hover:underline transition-all duration-200 cursor-pointer">
          {ctaText}
        </span>
      </div>
    </article>
  );
}; 