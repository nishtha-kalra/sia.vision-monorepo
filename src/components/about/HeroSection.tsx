"use client";
import * as React from "react";

export const HeroSection: React.FC = () => {
  return (
    <section className="relative py-24 md:py-32 bg-gradient-to-br from-creative-tech-surface via-white to-blue-50 overflow-hidden">
      <div className="container mx-auto px-6 md:px-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Main Headline */}
          <h1 className="mb-8 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-creative-tech-on-surface font-serif">
            From Timeless Narratives to 
            <span className="block text-creative-tech-primary">Tomorrow&#39;s Universes</span>
          </h1>
          
          {/* Main Content */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-creative-tech-primary/20 shadow-lg">
              <div className="text-lg md:text-xl leading-relaxed text-creative-tech-on-surface space-y-6">
                <p>
                  Sia.vision was born from a belief: that the most powerful stories are living entities, evolving with us.
                </p>
                
                <p>
                  We saw a world rich with cultural heritage and brilliant ideas, often constrained by traditional creation and ownership models.
                </p>
                
                <p>
                  Inspired by the &#39;Create in India&#39; ethos of using ancient wisdom as a springboard for universal stories, we envision a platform where diverse voices globally, amplified by AI, collaboratively build and own the next era of &#39;Living Storyworlds&#39;.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced Decorative Elements */}
      <div className="absolute right-20 top-20 w-32 h-32 bg-gradient-to-br from-creative-tech-secondary to-creative-tech-accent rounded-full opacity-20 animate-pulse blur-sm"></div>
      <div className="absolute left-20 bottom-20 w-28 h-28 bg-gradient-to-br from-creative-tech-primary to-creative-tech-accent rounded-full opacity-20 animate-pulse delay-1000 blur-sm"></div>
      <div className="absolute right-40 bottom-40 w-20 h-20 bg-gradient-to-br from-creative-tech-accent to-creative-tech-primary rounded-full opacity-15 animate-pulse delay-500 blur-sm"></div>
      
      {/* Background glow effects */}
      <div className="absolute inset-0 bg-creative-glow opacity-50 pointer-events-none"></div>
    </section>
  );
}; 