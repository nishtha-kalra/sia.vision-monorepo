"use client";

import * as React from "react";
import { useState } from "react";
import { StoryCardImage } from "./StoryCardImage";
import { StoryCardContent } from "./StoryCardContent";

interface StoryCardProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
}

export const StoryCard: React.FC<StoryCardProps> = ({
  title,
  description,
  imageSrc,
  imageAlt,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section
      className="overflow-hidden w-full bg-white rounded-3xl transition-all duration-300 ease-in-out max-w-[400px] shadow-[0_8px_32px_rgba(0,0,0,0.08)]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: isHovered ? "translateY(-4px)" : "translateY(0px)",
        boxShadow: isHovered
          ? "0 16px 48px rgba(0,0,0,0.12)"
          : "0 8px 32px rgba(0,0,0,0.08)",
      }}
    >
      <StoryCardImage
        isHovered={isHovered}
        src={imageSrc}
        alt={imageAlt}
      />
      <StoryCardContent
        title={title}
        description={description}
      />
    </section>
  );
};

export default StoryCard; 