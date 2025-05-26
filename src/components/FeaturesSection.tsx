"use client";
import * as React from "react";
import { useState } from "react";
import FeatureCard from "./FeatureCard";

const FEATURE_CARDS = [
  {
    id: 1,
    title: "Beyond Isolated Narratives",
    description: (
      <>
        The old way often meant creators working in isolation. Sia.vision champions a
        <strong className="text-white"> new paradigm of open collaboration</strong>, where diverse talents unite to build vast, interconnected storyworlds that grow richer with every contribution.
      </>
    ),
    iconPath: "M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z",
  },
  {
    id: 2,
    title: "Empowering Creators with True Ownership",
    description: (
      <>
        Navigating IP rights in collaborations can be complex and unfair. Powered by
        <strong className="text-white"> Story Protocol</strong>, Sia.vision brings
        <strong className="text-white"> verifiable on-chain ownership</strong> and transparent licensing to every story element, ensuring creators are recognized and rewarded.
      </>
    ),
    iconPath: "M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM12 7C13.1 7 14 7.9 14 9S13.1 11 12 11 10 10.1 10 9 10.9 7 12 7ZM18 15H6V13.5C6 11.84 9.33 11 12 11S18 11.84 18 13.5V15Z",
  },
  {
    id: 3,
    title: "Stories That Breathe and Adapt",
    description: (
      <>
        Narratives shouldn't be set in stone. Sia.vision enables
        <strong className="text-white"> 'Living Storyworlds' </strong>
        that dynamically evolve through community co-creation and AI-assisted development, responding to audiences and exploring endless possibilities.
      </>
    ),
    iconPath: "M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1L13.5 2.5L16.17 5.17L10.5 10.84L11.92 12.25L15.92 8.25L18.5 10.84L21 9ZM3.5 5.75L9.25 11.5L8.11 12.64C7.35 13.39 7.35 14.6 8.11 15.36L10.64 17.89C11.4 18.65 12.6 18.65 13.36 17.89L14.5 16.75L20.25 22.5L21.75 21L2 1.25L3.5 5.75Z",
  },
  {
    id: 4,
    title: "Narratives Reimagined for Any Media",
    description: (
      <>
        Great stories deserve limitless expression. The modular nature of creations on Sia.vision allows them to be seamlessly
        <strong className="text-white"> transformed and distributed </strong>
        across any format – from interactive games and AI-personalized books to global film and series.
      </>
    ),
    iconPath: "M4 6H2V20C2 21.1 2.9 22 4 22H18V20H4V6ZM20 2H8C6.9 2 6 2.9 6 4V16C6 17.1 6.9 18 8 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H8V4H20V16ZM12 5.5V13.5L18 9.5L12 5.5Z",
  },
];

const FeaturesSection: React.FC = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <section className="flex justify-center items-center py-20 px-4 w-full bg-neutral-900">
      <div className="w-full max-w-5xl">
        <div className="grid grid-cols-2 gap-8 max-md:gap-6 max-sm:grid-cols-1 max-sm:gap-4">
          {FEATURE_CARDS.map((card) => (
            <FeatureCard
              key={card.id}
              title={card.title}
              description={card.description}
              iconPath={card.iconPath}
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

export default FeaturesSection; 