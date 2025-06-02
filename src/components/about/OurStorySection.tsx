"use client";
import * as React from "react";

export const OurStorySection: React.FC = () => {
  return (
    <section className="px-28 pt-32 pb-16 max-md:px-5 max-md:py-16">
      <div className="max-w-4xl mx-auto">
        <h2 className="mb-16 text-4xl font-medium tracking-wide text-creative-tech-on-surface leading-[64px] max-sm:text-3xl font-serif">
          Our Story: The Spark of Sia.vision
        </h2>
        
        <div className="space-y-8">
          <h3 className="text-3xl font-semibold leading-[51px] text-creative-tech-primary max-sm:text-2xl font-serif">
            &#34;From Timeless Narratives to Tomorrow&#39;s Universes&#34;
          </h3>
          
          <div className="text-lg leading-8 text-creative-tech-on-surface space-y-6">
            <p>
              Sia.vision was born from a deep-seated belief: that the most powerful stories are not static relics, but living entities that grow and evolve with us. We saw a world teeming with rich cultural heritage, timeless lore, and brilliant new ideas, yet often constrained by traditional models of creation and ownership.
            </p>
            
            <p>
              Inspired by the profound narrative depth of global traditions, particularly the &#39;Create in India&#39; ethos of using ancient wisdom as a springboard for universal stories, we asked: How can we empower a new generation of storytelling? How can diverse voices from around the world collaboratively build upon these inspirations, amplified by new technologies like AI, while ensuring every contributor is recognized and rewarded?
            </p>
            
            <p className="text-creative-tech-primary font-medium">
              Sia.vision is our answer – a platform to collectively imagine, build, and own the next era of &#39;Living Storyworlds.&#39;
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}; 