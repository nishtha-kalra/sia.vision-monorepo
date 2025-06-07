"use client";

import * as React from "react";
import { DecorativeShapes, StoryCard } from "./index";

const FLYWHEEL_CARDS = [
  {
    id: 1,
    title: "Create",
    description: "This is where new sagas begin. Creators lay the foundation: crafting core lore, defining unique characters, and envisioning the initial sparks of new storyworlds. Every foundational element is registered as a verifiable creative through programmable IP, securing your ownership from the very start.",
    imageSrc: "/create-flywheel.svg",
    imageAlt: "Story Creation Platform"
  },
  {
    id: 2,
    title: "Build",
    description: "Transform foundational concepts into rich, production-ready assets. Builders, artists, and developers collaborate, co-piloting with advanced AI tools, to expand narratives, design stunning visuals, compose immersive soundscapes, and develop interactive components. This is where storyworlds gain depth and multifaceted life.",
    imageSrc: "/build-flywheel.svg",
    imageAlt: "Story Building Tools"
  },
  {
    id: 3,
    title: "Distribute",
    description: "Take your co-created and audience-validated storyworlds global. Sia.vision facilitates the transformation of these dynamic creations into diverse formats – from viral short-form content and AI-personalised books to interactive games, XR experiences, series and films for major platforms. Fair revenue sharing for all contributors is ensured by the Platform.",
    imageSrc: "/distribute-flywheel.svg",
    imageAlt: "Story Distribution Network"
  }
];

// DistributeDecorator component
const DistributeDecorator: React.FC = () => (
  <svg width="140" height="90" viewBox="0 0 140 90" fill="none" className="absolute">
    <path d="M70 45L90 25L110 45L90 65L70 45ZM70 45L50 25L30 45L50 65L70 45Z" 
      stroke="#8B5CF6" strokeWidth="2" fill="none" opacity="0.4"/>
    <path d="M10 20C20 20 20 30 30 30C40 30 40 20 50 20" 
      stroke="#EC4899" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
    <circle cx="120" cy="15" r="3" fill="#06B6D4" opacity="0.6"/>
    <circle cx="15" cy="70" r="2" fill="#F97316" opacity="0.5"/>
  </svg>
);

export const FlywheelSection: React.FC = () => {
  return (
    <section id="flywheel" className="relative mx-auto my-0 -mt-0.5 max-w-none bg-white h-[1600px] w-[1440px] pb-20 max-xl:box-border max-xl:p-5 max-xl:w-full max-xl:h-auto max-xl:min-h-[1400px] max-xl:max-w-[991px] max-xl:pb-32 max-sm:max-w-screen-sm max-sm:min-h-[1600px] max-sm:pb-40">
      
      {/* Split Header: Title LEFT, Description RIGHT (FURTHER LOWERED) */}
      <div className="absolute top-16 left-16 right-16 h-[280px] flex gap-12 xl:flex max-xl:relative max-xl:top-0 max-xl:left-auto max-xl:right-auto max-xl:mx-auto max-xl:mt-0 max-xl:mb-10 max-xl:w-full max-xl:flex-col max-xl:text-center max-xl:items-center max-xl:gap-6 max-sm:px-5 max-sm:py-0">
        
        {/* Title Section - LEFT */}
        <div className="flex-1 flex flex-col justify-start max-xl:items-center">
          <h1 className="text-7xl font-extrabold leading-[88px] text-neutral-800 max-xl:text-5xl max-xl:text-center max-xl:leading-[56px] max-sm:text-4xl max-sm:leading-10">
            Create.
            <br className="-ml-px" />
            Build.
            <br />
            Distribute.
          </h1>
        </div>
        
        {/* Description Section - RIGHT (POSITIONED LOWER) */}
        <div className="flex-1 flex flex-col justify-start pt-24 max-xl:items-center max-xl:justify-center max-xl:pt-0">
          <h2 className="text-xl font-bold text-neutral-800 mb-4 max-xl:text-center max-sm:text-lg">
            Powering the Next Generation of Storytelling
          </h2>
          <p className="text-2xl text-neutral-800 text-opacity-80 leading-relaxed max-xl:text-xl max-xl:text-center max-sm:text-lg max-xl:px-4">
            At Sia.vision, the journey of a story is a dynamic, collaborative cycle. Our platform is built around this powerful flywheel, empowering you to bring narratives to life, transform them with cutting-edge tools and community passion, and share them with the world across diverse formats – all built on a foundation of clear ownership through programmable IP.
          </p>
        </div>
      </div>

      {/* Decorative Shapes - Better positioned to integrate with cards */}
      <div className="max-xl:hidden relative z-0">
        <DecorativeShapes />
      </div>

      {/* Desktop: Diagonal Card Layout with Decorators */}
      <div className="absolute shrink-0 h-[800px] left-[80px] top-[320px] w-[1280px] max-xl:hidden relative z-10">
        
        {/* Card 1 - Top Left (Create) - INCREASED WIDTH */}
        <div className="absolute left-0 top-[80px] w-[380px]">
          <StoryCard
            title={FLYWHEEL_CARDS[0].title}
            description={FLYWHEEL_CARDS[0].description}
            imageSrc={FLYWHEEL_CARDS[0].imageSrc}
            imageAlt={FLYWHEEL_CARDS[0].imageAlt}
          />
        </div>
        
        {/* DistributeDecorator - REPOSITIONED next to Create card */}
        <div className="absolute left-[360px] top-[40px]">
          <DistributeDecorator />
        </div>
        
        {/* Card 2 - Middle Center (Build) - INCREASED WIDTH */}
        <div className="absolute left-[440px] top-[240px] w-[380px]">
          <StoryCard
            title={FLYWHEEL_CARDS[1].title}
            description={FLYWHEEL_CARDS[1].description}
            imageSrc={FLYWHEEL_CARDS[1].imageSrc}
            imageAlt={FLYWHEEL_CARDS[1].imageAlt}
          />
        </div>
        
        {/* Card 3 - Bottom Right (Distribute) - INCREASED WIDTH */}
        <div className="absolute top-[400px] left-[880px] w-[380px]">
          <StoryCard
            title={FLYWHEEL_CARDS[2].title}
            description={FLYWHEEL_CARDS[2].description}
            imageSrc={FLYWHEEL_CARDS[2].imageSrc}
            imageAlt={FLYWHEEL_CARDS[2].imageAlt}
          />
        </div>
        
        {/* DistributeDecorator - REPOSITIONED above Distribute card */}
        <div className="absolute left-[820px] top-[360px]">
          <DistributeDecorator />
        </div>
      </div>

      {/* iPad Pro & iPad Mini: Consistent layout for all tablets */}
      <div className="hidden xl:hidden md:block relative top-[200px] w-full px-8 mt-16 mb-32">
        <div className="grid grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="col-span-2 flex justify-center mb-6">
            <div className="w-full max-w-[380px]">
              <StoryCard
                title={FLYWHEEL_CARDS[0].title}
                description={FLYWHEEL_CARDS[0].description}
                imageSrc={FLYWHEEL_CARDS[0].imageSrc}
                imageAlt={FLYWHEEL_CARDS[0].imageAlt}
              />
            </div>
          </div>
          <div className="flex justify-center">
            <div className="w-full max-w-[380px]">
              <StoryCard
                title={FLYWHEEL_CARDS[1].title}
                description={FLYWHEEL_CARDS[1].description}
                imageSrc={FLYWHEEL_CARDS[1].imageSrc}
                imageAlt={FLYWHEEL_CARDS[1].imageAlt}
              />
            </div>
          </div>
          <div className="flex justify-center">
            <div className="w-full max-w-[380px]">
              <StoryCard
                title={FLYWHEEL_CARDS[2].title}
                description={FLYWHEEL_CARDS[2].description}
                imageSrc={FLYWHEEL_CARDS[2].imageSrc}
                imageAlt={FLYWHEEL_CARDS[2].imageAlt}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: Stacked Card Layout - Adjusted positioning */}
      <div className="hidden md:hidden max-md:flex max-md:relative max-md:top-[240px] max-md:left-0 max-md:flex-col max-md:gap-8 max-md:items-center max-md:w-full max-md:px-4 max-md:mt-8 max-md:mb-40">
        {FLYWHEEL_CARDS.map((card) => (
          <div key={card.id} className="w-full max-w-[400px]">
            <StoryCard
              title={card.title}
              description={card.description}
              imageSrc={card.imageSrc}
              imageAlt={card.imageAlt}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default FlywheelSection; 