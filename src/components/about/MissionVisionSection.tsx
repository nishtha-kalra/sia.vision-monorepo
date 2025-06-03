"use client";
import * as React from "react";

export const MissionVisionSection: React.FC = () => {
  return (
    <section className="relative px-8 md:px-16 lg:px-28 pt-16 pb-32 max-md:px-5 max-md:py-16 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20">
          {/* Vision Section */}
          <div className="space-y-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-creative-tech-primary rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-bold">🌟</span>
              </div>
              <h2 className="text-2xl font-bold text-creative-tech-on-surface">Our Vision</h2>
            </div>
            
            <div className="bg-creative-tech-surface rounded-2xl p-8 border-l-4 border-creative-tech-primary">
              <p className="text-lg leading-8 text-creative-tech-on-surface">
                Unlocking a global ecosystem for boundless, collaborative storytelling – creating interconnected universes that inspire and endure.
              </p>
            </div>
          </div>

          {/* Mission Section */}
          <div className="space-y-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-creative-tech-secondary rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-bold">🌟</span>
              </div>
              <h2 className="text-2xl font-bold text-creative-tech-on-surface">Our Mission</h2>
            </div>
            
            <div className="bg-creative-tech-surface rounded-2xl p-8 border-l-4 border-creative-tech-secondary">
              <p className="text-lg leading-8 text-creative-tech-on-surface">
                To empower creators and communities with a decentralized platform for modular storytelling, leveraging AI and programmable IP to build, own, and share 'Living Storyworlds' across all media.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}; 