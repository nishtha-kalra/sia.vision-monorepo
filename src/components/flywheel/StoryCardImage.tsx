"use client";

import * as React from "react";

interface StoryCardImageProps {
  isHovered: boolean;
  src: string;
  alt: string;
}

export const StoryCardImage: React.FC<StoryCardImageProps> = ({
  isHovered,
  src,
  alt,
}) => {
  return (
    <figure className="overflow-hidden relative h-[300px]">
      <img
        alt={alt}
        src={src}
        className="object-cover overflow-hidden transition-all ease-in-out aspect-square duration-[600ms] size-full will-change-transform"
        style={{
          transform: isHovered ? "scale(1.08)" : "scale(1)",
        }}
      />
      <div
        className="absolute inset-0 transition-opacity duration-300 pointer-events-none ease-[ease]"
        style={{
          opacity: isHovered ? 1 : 0,
        }}
      />
    </figure>
  );
}; 