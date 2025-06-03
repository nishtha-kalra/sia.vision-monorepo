"use client";
import * as React from "react";
import { useState } from "react";

interface TeamMemberCardProps {
  imageUrl?: string;
  name: string;
  title: string;
  bio: string;
}

export const TeamMemberCard: React.FC<TeamMemberCardProps> = ({
  imageUrl,
  name,
  title,
  bio,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <article 
      className="flex flex-col p-6 rounded-xl transition-all duration-300 ease-in-out bg-white cursor-pointer h-full shadow-lg w-full max-w-[400px] mx-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: isHovered ? "translateY(-4px)" : "translateY(0px)",
        boxShadow: isHovered
          ? "0 12px 40px rgba(0,0,0,0.15)"
          : "0 4px 20px rgba(0,0,0,0.08)",
      }}
    >
      {/* Profile Image */}
      <div className="h-[300px] rounded-lg w-full bg-gradient-to-br from-creative-tech-primary to-creative-tech-accent flex items-center justify-center overflow-hidden mb-6">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`${name} profile`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="text-white text-6xl font-bold">
            {name.split(' ').map(n => n[0]).join('')}
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="space-y-4 flex-grow">
        <div>
          <h3 className="text-2xl font-semibold text-creative-tech-primary mb-4 leading-tight">
            {name}
          </h3>
          <h4 className="text-lg font-medium text-creative-tech-on-surface mb-4">
            {title}
          </h4>
        </div>
        
        <p className="text-gray-700 leading-relaxed flex-grow text-sm">
          {bio}
        </p>
      </div>
    </article>
  );
}; 