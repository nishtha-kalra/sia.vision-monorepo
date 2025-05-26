"use client";
import * as React from "react";
import { useState } from "react";
import HowItWorksCard from "./HowItWorksCard";
import WavePattern from "./WavePattern";
import CircularText from "./CircularText";

const FEATURE_CARDS = [
  {
    id: 1,
    title: "Beyond Isolated Narratives",
    description: (
      <>
        The old way often meant creators working in isolation. Sia.vision champions a
        <strong className="text-stone-900"> new paradigm of open collaboration</strong>, where diverse talents unite to build vast, interconnected storyworlds that grow richer with every contribution.
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
        <strong className="text-stone-900"> Story Protocol</strong>, Sia.vision brings
        <strong className="text-stone-900"> verifiable on-chain ownership</strong> and transparent licensing to every story element, ensuring creators are recognized and rewarded.
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
        <strong className="text-stone-900"> 'Living Storyworlds' </strong>
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
        <strong className="text-stone-900"> transformed and distributed </strong>
        across any format – from interactive games and AI-personalized books to global film and series.
      </>
    ),
    iconPath: "M4 6H2V20C2 21.1 2.9 22 4 22H18V20H4V6ZM20 2H8C6.9 2 6 2.9 6 4V16C6 17.1 6.9 18 8 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H8V4H20V16ZM12 5.5V13.5L18 9.5L12 5.5Z",
  },
];

const HowItWorksSection: React.FC = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <section className="relative flex flex-col items-center py-24 px-4 w-full bg-white overflow-hidden max-w-[1440px] mx-auto">
      {/* Left Wave Pattern - positioned with equal margin from center */}
      <div className="absolute left-[71px] top-[118px] w-[359px] h-[72px] max-lg:hidden">
        <WavePattern />
      </div>
      
      {/* Left CircularText - responsive positioning under left wave center */}
      <div className="absolute left-[164px] xl:left-[157px] top-[200px] xl:top-[290px] max-lg:hidden lg:hidden xl:block">
        <CircularText className="h-[173px] w-[173px]" text="Co Create • O w n • Evolve •" />
      </div>
      
      {/* Right Wave Pattern - positioned with equal margin from center */}
      <div className="absolute right-[1px] top-[118px] w-[359px] h-[72px] max-lg:hidden">
        <WavePattern />
      </div>
      
      {/* Right CircularText - responsive positioning under right wave center */}
      <div className="absolute right-[94px] xl:right-[87px] top-[200px] xl:top-[290px] max-lg:hidden lg:hidden xl:block">
        <CircularText className="h-[173px] w-[173px]" text="Modular Story telling • AI • " />
      </div>
      
      {/* Headline and subheadline - responsive positioning */}
      <div className="
        absolute top-[110px] max-w-[698px] w-full text-center left-1/2 transform -translate-x-1/2 z-10 px-4
        max-xl:hidden
      ">
        <h2 className="text-5xl md:text-6xl font-serif font-bold mb-4 text-stone-900 leading-tight">The New Storytelling Paradigm</h2>
        <p className="text-xl md:text-2xl text-stone-600 max-w-[433px] mx-auto">Unlock the power of global lore, cultural narratives, and original concepts</p>
      </div>
      
      {/* iPad view - headline under waves */}
      <div className="
        hidden xl:hidden lg:block
        absolute top-[400px] max-w-[698px] w-full text-center left-1/2 transform -translate-x-1/2 z-10 px-4
      ">
        <h2 className="text-4xl lg:text-5xl font-serif font-bold mb-4 text-stone-900 leading-tight">The New Storytelling Paradigm</h2>
        <p className="text-lg lg:text-xl text-stone-600 max-w-[433px] mx-auto">Unlock the power of global lore, cultural narratives, and original concepts</p>
      </div>
      
      {/* Mobile view - headline at top */}
      <div className="
        lg:hidden
        w-full max-w-[698px] text-center mx-auto mb-16 px-4
      ">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-4 text-stone-900 leading-tight">The New Storytelling Paradigm</h2>
        <p className="text-lg sm:text-xl text-stone-600 max-w-[433px] mx-auto">Unlock the power of global lore, cultural narratives, and original concepts</p>
      </div>
      
      {/* Cards - positioned below the header section with responsive margins */}
      <div className="w-full max-w-5xl relative z-10 mt-[500px] xl:mt-[500px] lg:mt-[540px] max-lg:mt-0">
        <div className="grid grid-cols-2 gap-8 max-md:gap-6 max-sm:grid-cols-1 max-sm:gap-4">
          {FEATURE_CARDS.map((card) => (
            <HowItWorksCard
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

export default HowItWorksSection; 