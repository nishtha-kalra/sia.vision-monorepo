"use client";
import * as React from "react";

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
  return (
    <article className="w-full max-w-[400px] mx-auto">
      {/* Profile Image */}
      <div className="mb-8 h-[300px] rounded-[45px] w-full bg-gradient-to-br from-creative-tech-primary to-creative-tech-accent flex items-center justify-center overflow-hidden">
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
      <div className="space-y-4">
        <div>
          <h3 className="text-2xl font-semibold tracking-wide leading-8 text-creative-tech-on-surface font-serif">
            {name}
          </h3>
          <h4 className="text-lg font-medium text-creative-tech-primary mt-2">
            {title}
          </h4>
        </div>
        
        <p className="text-base tracking-normal leading-7 text-neutral-700">
          {bio}
        </p>
      </div>
    </article>
  );
}; 