"use client";
import * as React from "react";
import { useState } from "react";
import { StakeholderCard } from "./StakeholderCard";

const STAKEHOLDER_CARDS = [
  {
    id: 1,
    title: "For Visionaries & IP Originators",
    description: "Launch your unique stories, ancient lore, or cultural narratives onto a global stage. Secure your foundational creative work with on-chain verification (via Story Protocol), invite worldwide collaboration for its expansion, and earn transparently as your 'Living Storyworld' grows across multiple formats.",
    ctaText: "Seed Your Universe (Learn More)",
    imageAlt: "Metallic crystalline structure",
    imageSrc: "/for-you-1.svg",
  },
  {
    id: 2,
    title: "For Co-Creators & Builders",
    description: "Lend your creative spark or technical expertise. Whether you're writing new sagas, designing characters, creating unique patterns & fashion for lore, composing scores, or developing with AI tools, your contributions become verifiable and ownable components of a larger narrative, earning you recognition and a share in its success.",
    ctaText: "Join the Creative Collective",
    imageAlt: "Hand with golden ring and glowing elements",
    imageSrc: "/for-you-2.svg",
  },
  {
    id: 3,
    title: "For Developers & Distributors",
    description: "Access a dynamic library of modular, evolving 'Living Storyworlds' – many with early audience validation from social-first launches. License unique creative components via Story Protocol to develop groundbreaking games, AI-personalized content, series, films, and immersive XR experiences for a global market.",
    ctaText: "Explore the Library",
    imageAlt: "Abstract dynamic shard forms",
    imageSrc: "/for-you-3.svg",
  },
];

const StakeholderBenefitsSection: React.FC = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <section id="for-you" className="flex justify-center items-center py-32 px-4 w-full bg-neutral-900 mt-48">
      <div className="w-full max-w-5xl">
        {/* Main Headline */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Built for the Next Generation of
          </h2>
          <h2 className="text-4xl md:text-5xl font-bold text-creative-tech-primary">
            Storytellers & Innovators
          </h2>
        </div>

        {/* Three-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {STAKEHOLDER_CARDS.map((card) => (
            <StakeholderCard
              key={card.id}
              title={card.title}
              description={card.description}
              ctaText={card.ctaText}
              imageAlt={card.imageAlt}
              imageSrc={card.imageSrc}
              isHovered={hoveredCard === card.id}
              onMouseEnter={() => setHoveredCard(card.id)}
              onMouseLeave={() => setHoveredCard(null)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StakeholderBenefitsSection; 