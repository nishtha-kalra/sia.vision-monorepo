"use client";
import * as React from "react";
import { TeamMemberCard } from "./TeamMemberCard";

export const TeamSection: React.FC = () => {
  return (
    <section className="flex justify-center items-center py-32 px-4 w-full bg-white">
      <div className="w-full max-w-5xl">
        {/* Main Headline */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-creative-tech-on-surface mb-4">
            The Team
          </h2>
          <p className="text-lg text-creative-tech-on-surface opacity-80">
            Stewards of the Vision
          </p>
        </div>

        {/* Single centered card */}
        <div className="flex justify-center">
          <div className="w-full max-w-[440px]">
            <TeamMemberCard
              name="Nishtha Kalra"
              title="Founder & Chief Visionary"
              bio="Nishtha is a product leader and software engineer driven to fuse storytelling with technology and community. Leveraging her experience in building innovative products and generative AI applications at HubSpot and Harry's Inc., alongside a master's degree in Machine Learning, she founded Sia.vision to empower global, collaborative IP creation rooted in fairness and inspired by diverse narrative traditions."
              imageUrl="/Nishtha-Kalra.png"
              linkedinUrl="https://www.linkedin.com/in/nishtha-kalra/"
            />
          </div>
        </div>
      </div>
    </section>
  );
}; 