"use client";
import * as React from "react";

export const HeroSection: React.FC = () => {
  return (
    <section className="flex relative justify-center items-center w-full bg-creative-tech-primary bg-opacity-10 h-[743px] max-md:px-5 max-md:py-16 max-md:h-auto">
      <div className="relative h-[318px] w-[565px] z-[2] max-md:w-full max-md:max-w-[565px]">
        <article>
          <h2 className="mb-5 text-2xl text-creative-tech-primary font-medium">About us</h2>
          <h3 className="mb-9 text-4xl font-semibold leading-[68px] text-creative-tech-on-surface max-md:text-3xl max-sm:text-3xl font-serif">
            From Timeless Narratives to Tomorrow&#39;s Universes
          </h3>
          <p className="text-lg leading-8 text-zinc-500 w-[463px] max-md:w-full max-sm:text-base">
            Empowering creators worldwide to build collaborative storytelling universes that transcend boundaries and endure for generations.
          </p>
        </article>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute right-56 w-28 h-28 rotate-[15.068deg] top-[138px] max-md:top-5 max-md:right-5 max-md:w-20 max-md:h-20 bg-creative-tech-secondary rounded-full opacity-20"></div>
      <div className="absolute left-44 bottom-[147px] h-[103px] w-[103px] max-md:bottom-5 max-md:left-5 max-md:h-[70px] max-md:w-[70px] bg-creative-tech-accent rounded-full opacity-20"></div>
    </section>
  );
}; 