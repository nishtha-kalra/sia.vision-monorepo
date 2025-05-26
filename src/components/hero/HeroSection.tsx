'use client';
import React from 'react';
import { HeroShape } from './HeroShape';
import { FontCircle } from './FontCircle';
import { SoftStar } from './SoftStar';
import { HeroContent } from './HeroContent';

export function HeroSection() {
  return (
    <section className="overflow-hidden relative w-full bg-creative-tech-surface min-h-[950px] max-lg:min-h-screen max-sm:min-h-[900px]">
      {/* Orange background left half */}
      <div className="absolute top-0 left-0 w-full bg-creative-tech-secondary h-full z-0" />
      {/* Curved white shape on right - hide on tablet and mobile */}
      <div className="max-lg:hidden">
        <HeroShape />
      </div>
      {/* Content area with absolute star */}
      <div className="absolute h-[600px] left-[150px] top-[123px] w-[663px]
        max-xl:left-[100px] max-xl:w-[600px]
        max-lg:left-[50%] max-lg:transform max-lg:-translate-x-1/2 max-lg:top-[80px] max-lg:w-[90%] max-lg:text-center
        max-sm:h-auto max-sm:left-[50%] max-sm:top-[60px] max-sm:w-[90%] max-sm:text-center 
        z-20">
        {/* Star + circle absolutely positioned above headline - responsive */}
        <div className="absolute top-0 h-[165px] w-[165px] 
          left-[50%] transform -translate-x-1/2
          max-xl:h-[140px] max-xl:w-[140px]
          max-lg:h-[120px] max-lg:w-[120px]
          max-sm:relative max-sm:left-0 max-sm:mx-auto max-sm:mt-0 max-sm:mb-10 max-sm:transform-none max-sm:h-[100px] max-sm:w-[100px]">
          <FontCircle />
          <SoftStar />
        </div>
        <HeroContent />
      </div>
      {/* Hero Illustration - desktop only */}
      <img
        src="/hero.svg"
        alt="SIA Character Illustration"
        className="absolute 
          h-[825px] w-[651px] left-[850px] top-[135px]
          max-xl:h-[750px] max-xl:w-[590px] max-xl:left-[800px]
          max-lg:hidden
          z-30"
      />
      {/* Mobile/Tablet Illustration - below content, positioned after content */}
      <div className="hidden max-lg:flex max-lg:flex-col max-lg:items-center max-lg:justify-start relative z-30 pt-[600px] max-md:pt-[550px] max-sm:pt-[520px] pb-1 max-sm:pb-0">
        <img
          src="/hero.svg"
          alt="SIA Character Illustration"
          className="mx-auto block
            h-[150px] w-[120px]
            max-md:h-[140px] max-md:w-[115px]
            max-sm:h-[130px] max-sm:w-[105px]"
        />
      </div>
    </section>
  );
} 