"use client";
import * as React from "react";
import { TeamMemberCard } from "./TeamMemberCard";

export const AdvisorSection: React.FC = () => {
  return (
    <section className="px-28 pt-16 pb-16 max-md:px-5 max-md:pt-16 max-md:pb-8 bg-creative-tech-surface">
      <div className="max-w-7xl mx-auto">
        <h2 className="mb-16 text-4xl font-medium tracking-wide text-creative-tech-on-surface leading-[64px] max-sm:text-3xl font-serif">
          Advisors
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-28 max-md:gap-10">
          <TeamMemberCard
            name="Akshay Kant"
            title="Strategic Advisor – Web3 & IP Economy"
            bio="Akshay is a product-minded blockchain engineer with over 10 years of experience building payment and blockchain solutions for tier-1 financial institutions like Visa and Chainalysis. He has a proven record of taking ideas from research to production, designing tokenization platforms, and has advised on the architecture for the UK 'Digital Pound' at the Bank of England. With an MSc in Artificial Intelligence & Blockchain and experience as a Co-Founder & CEO of an event-tech platform that pioneered NFT ticketing, Akshay guides Sia.vision's strategy for creating a robust, decentralized IP economy and integrating programmable ownership models."
          />
          
          <TeamMemberCard
            name="Janu Verma"
            title="Technology Advisor – AI & Narrative Intelligence"
            bio="Janu is a distinguished researcher and leader in Artificial Intelligence, currently serving as a Principal AI Researcher at Microsoft. With extensive experience in machine learning, natural language processing, and building AI-driven products (from his time at Microsoft, previous roles like Head of AI Research at other ventures, and his academic background), he advises Sia.vision on ethically leveraging cutting-edge AI to develop innovative tools for narrative generation, content personalization, and fostering a dynamic, intelligent platform architecture."
          />
        </div>
      </div>
    </section>
  );
}; 