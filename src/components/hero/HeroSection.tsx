'use client';
import React from 'react';
import { FontCircle } from './FontCircle';
import { SoftStar } from './SoftStar';
import { HeroContent } from './HeroContent';

export function HeroSection() {
  return (
    <section className="overflow-hidden relative w-full bg-hero-blue-900 min-h-[950px] max-lg:min-h-screen max-sm:min-h-[900px]">
      {/* Dark vibrant blue gradient background */}
      <div className="absolute inset-0 bg-blue-gradient z-0" />
      
      {/* Blue glow effect overlay */}
      <div className="absolute inset-0 bg-blue-glow opacity-20 z-5" />
      
      {/* Video positioned as background element - desktop (larger and more visible) */}
      <div className="absolute top-0 right-0 w-1/2 h-full overflow-hidden max-lg:hidden z-10 rounded-l-3xl">
        <video
          src="/sia.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
            min-w-full min-h-full w-auto h-auto object-cover opacity-85"
          aria-label="SIA Animation"
        />
        {/* Reduced overlay for better video visibility */}
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-hero-blue-700/10 to-hero-blue-900/30 z-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-hero-blue-900/40 via-transparent to-transparent z-25" />
      </div>

      {/* Content area with enhanced positioning */}
      <div className="relative z-30 flex items-center justify-start min-h-[950px] px-8 lg:px-16">
        <div className="max-w-2xl lg:max-w-3xl">
          {/* Star + circle with blue glow effect */}
          <div className="relative mb-8 flex justify-center lg:justify-start">
            <div className="h-[120px] w-[120px] max-lg:h-[100px] max-lg:w-[100px] relative">
              {/* Blue glow behind star */}
              <div className="absolute inset-0 bg-hero-blue-500/30 rounded-full blur-xl scale-150"></div>
              <FontCircle />
              <SoftStar />
            </div>
          </div>
          <HeroContent />
        </div>
      </div>

      {/* Mobile/Tablet Video - positioned as background (larger) */}
      <div className="lg:hidden absolute inset-0 z-5">
        <video
          src="/sia.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
            min-w-full min-h-full w-auto h-auto object-cover opacity-70"
          aria-label="SIA Animation"
        />
        {/* Reduced mobile overlay for better video visibility */}
        <div className="absolute inset-0 bg-blue-gradient opacity-50 z-10" />
      </div>
    </section>
  );
} 