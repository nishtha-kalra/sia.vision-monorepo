"use client";
import * as React from "react";
import { TeamMemberCard } from "./TeamMemberCard";

export const TeamSection: React.FC = () => {
  return (
    <section className="px-24 pt-32 pb-16 max-md:px-5 max-md:pt-16 max-md:pb-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="mb-16 text-4xl font-medium tracking-wide text-creative-tech-on-surface leading-[64px] max-sm:text-3xl font-serif">
          The Team: Stewards of the Vision
        </h2>
        
        <div className="flex justify-center">
          <div className="w-full max-w-[500px]">
            <TeamMemberCard
              name="Nishtha Kalra"
              title="Founder & Chief Visionary"
              bio="Nishtha is a product leader and software engineer passionate about the convergence of narrative, technology, and community. With a background in building innovative products from the ground up at companies like HubSpot and Harry's Inc., and direct experience developing generative AI applications, she founded Sia.vision to build a new paradigm for IP creation. Her M.Sc. in Machine Learning and engineering expertise fuel her vision to establish an ecosystem rooted in collaboration, fairness, and the timeless power of diverse narrative traditions—like those from India—reimagined through a global, culturally neutral lens for future generations."
            />
          </div>
        </div>
      </div>
    </section>
  );
}; 