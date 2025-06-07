"use client";
import * as React from "react";
import { useState } from "react";

interface TeamMemberCardProps {
  imageUrl?: string;
  name: string;
  title: string;
  bio: string;
  linkedinUrl?: string;
}

export const TeamMemberCard: React.FC<TeamMemberCardProps> = ({
  imageUrl,
  name,
  title,
  bio,
  linkedinUrl,
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
      <div className="h-[380px] rounded-lg w-full bg-gradient-to-br from-creative-tech-primary to-creative-tech-accent flex items-center justify-center overflow-hidden mb-6">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`${name} profile`}
            className="h-full w-full object-cover" style={{ objectPosition: 'center 30%' }}
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
          <h3 className="text-2xl font-semibold text-creative-tech-primary mb-2 leading-tight">
            {name}
          </h3>
          <h4 className="text-lg font-medium text-creative-tech-on-surface mb-2">
            {title}
          </h4>
          {linkedinUrl && (
            <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-1" aria-label={`LinkedIn profile of ${name}`}>
              {/* Inline LinkedIn SVG icon */}
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" rx="4" fill="#0077B5"/>
                <path d="M7.75 8.5C8.44036 8.5 9 7.94036 9 7.25C9 6.55964 8.44036 6 7.75 6C7.05964 6 6.5 6.55964 6.5 7.25C6.5 7.94036 7.05964 8.5 7.75 8.5Z" fill="white"/>
                <path d="M8.5 10H7V18H8.5V10Z" fill="white"/>
                <path d="M12.75 10C10.6789 10 10 11.1192 10 12.5V18H11.5V12.75C11.5 12.0596 12.0596 11.5 12.75 11.5C13.4404 11.5 14 12.0596 14 12.75V18H15.5V12.5C15.5 11.1192 14.8211 10 12.75 10Z" fill="white"/>
              </svg>
            </a>
          )}
        </div>
        
        <p className="text-gray-700 leading-relaxed flex-grow text-base">
          {bio}
        </p>
      </div>
    </article>
  );
}; 