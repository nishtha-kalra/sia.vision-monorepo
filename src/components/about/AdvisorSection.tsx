"use client";
import * as React from "react";
import { TeamMemberCard } from "./TeamMemberCard";

export const AdvisorSection: React.FC = () => {
  return (
    <section className="flex justify-center items-center py-32 px-4 w-full bg-creative-tech-surface">
      <div className="w-full max-w-5xl">
        {/* Main Headline */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-creative-tech-on-surface mb-4">
            Our Advisors
          </h2>
          <p className="text-lg text-creative-tech-on-surface opacity-80">
            Strategic guidance from industry leaders
          </p>
        </div>

        {/* Two-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          <TeamMemberCard
            name="Akshay Kant"
            title="Strategic Advisor – Web3 & IP Economy"
            bio="Akshay is a product-minded blockchain engineer with over a decade of experience building payment and blockchain solutions for tier-1 financial institutions like Visa and Chainalysis, developing production-grade Web3 solutions. As a former startup CEO who developed an NFT ticketing marketplace and has advised on the architecture for the UK 'Digital Pound' at the Bank of England, he guides Sia.vision's decentralised IP economy and programmable ownership strategy."
          />
          
          <TeamMemberCard
            name="Janu Verma"
            title="Technology Advisor – AI & Narrative Intelligence"
            bio="Janu is a Principal Applied Scientist at Microsoft, leading efforts in building Microsoft Copilot and LLMs, and leveraging graph neural networks and transformer models for contextual content recommendation. With over a decade of experience in applied ML research and building scalable AI products for personalisation and NLP at global tech firms like Mastercard and IBM, Janu advises Sia.vision on ethically integrating cutting-edge AI for narrative generation, content personalisation, and platform intelligence."
          />
        </div>
      </div>
    </section>
  );
}; 