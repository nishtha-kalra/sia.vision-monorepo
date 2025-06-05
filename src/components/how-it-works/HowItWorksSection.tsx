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
        The traditional way often meant creators working in isolation. Sia.vision champions a
        <strong className="text-stone-900"> new paradigm of open collaboration</strong>, where diverse talents unite to build vast, interconnected storyworlds that grow richer with every contribution.
      </>
    ),
    imageSrc: "/beyond-islolated-narratives.svg",
  },
  {
    id: 2,
    title: "Empowering Creators with True Ownership",
    description: (
      <>
        Navigating IP rights in collaborations can be complex and unfair. Powered by
        <strong className="text-stone-900"> Story Protocol</strong>, Sia.vision brings
        <strong className="text-stone-900"> verifiable ownership</strong> and transparent licensing to every story element, ensuring creators are recognised and rewarded.
      </>
    ),
    imageSrc: "/empowering-creators.svg",
  },
  {
    id: 3,
    title: "Stories That Breathe and Adapt",
    description: (
      <>
        Narratives shouldn&#39;t be set in stone. Sia.vision enables
        <strong className="text-stone-900"> &#39;Living Storyworlds&#39; </strong>
        that dynamically evolve through community co-creation and AI-assisted development, responding to audiences and exploring endless possibilities.
      </>
    ),
    imageSrc: "/adapt.svg",
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
    imageSrc: "/reimagined-narratives.svg",
  },
];

const HowItWorksSection: React.FC = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <section id="how-it-works" className="relative flex flex-col items-center py-24 px-4 w-full bg-white overflow-hidden max-w-[1440px] mx-auto">
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

export default HowItWorksSection; 