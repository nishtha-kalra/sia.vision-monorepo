"use client";
import * as React from "react";

export const MissionVisionSection: React.FC = () => {
  return (
    <section className="relative px-28 pt-16 pb-32 max-md:px-5 max-md:py-16 bg-creative-tech-surface">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32">
          {/* Vision Section */}
          <div>
            <h2 className="mb-8 text-2xl font-medium leading-10 text-creative-tech-on-surface max-sm:text-xl">
              Vision
            </h2>
            <div>
              <h3 className="mb-8 text-3xl font-semibold leading-[51px] text-creative-tech-on-surface max-sm:text-2xl font-serif">
                <span className="text-creative-tech-primary">Our Vision</span>
                <span> for Storytelling</span>
              </h3>
              <p className="text-base leading-7 text-neutral-600">
                To cultivate a globally accessible, equitable, and infinitely creative ecosystem where collaborative storytelling transcends boundaries, building interconnected narrative universes that entertain, educate, inspire, and endure for generations to come.
              </p>
            </div>
          </div>

          {/* Mission Section */}
          <div>
            <h2 className="mb-8 text-2xl font-medium leading-10 text-creative-tech-on-surface max-sm:text-xl">
              Mission
            </h2>
            <div>
              <h3 className="mb-8 text-3xl font-semibold leading-[51px] text-creative-tech-on-surface max-sm:text-2xl font-serif">
                <span className="text-creative-tech-primary">Our Mission</span>
                <span> in Action</span>
              </h3>
              <div className="text-base leading-7 text-neutral-600 space-y-4">
                <p>
                  Sia.vision empowers creators, builders, and distributors by providing a decentralized platform for modular storytelling. We achieve this by:
                </p>
                <ul className="space-y-3 ml-4">
                  <li className="flex items-start">
                    <span className="text-creative-tech-primary mr-2">•</span>
                    Fostering a vibrant global community for co-creation and shared learning.
                  </li>
                  <li className="flex items-start">
                    <span className="text-creative-tech-primary mr-2">•</span>
                    Leveraging cutting-edge AI tools to augment and accelerate the creative process ethically.
                  </li>
                  <li className="flex items-start">
                    <span className="text-creative-tech-primary mr-2">•</span>
                    Integrating robust frameworks for programmable IP and verifiable ownership to ensure transparent and fair value distribution.
                  </li>
                  <li className="flex items-start">
                    <span className="text-creative-tech-primary mr-2">•</span>
                    Enabling the seamless transformation of &#39;Living Storyworlds&#39; into diverse media formats, reaching audiences worldwide.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}; 