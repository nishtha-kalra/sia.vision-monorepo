"use client";

import * as React from "react";
import { DecorativeShapes, StoryCard } from "./index";

const FLYWHEEL_CARDS = [
  {
    id: 1,
    title: "Create",
    description: "This is where new sagas begin. Creators and communities lay the foundation: crafting core lore, defining unique characters, and envisioning the initial sparks of new storyworlds. Every foundational element is registered as a verifiable creative work on Story Protocol, securing your ownership from the very start.",
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
    description: "Take your co-created and audience-validated storyworlds global. Sia.vision facilitates the transformation of these dynamic creations into diverse formats – from viral short-form content and AI-personalized books to interactive games, XR experiences, and series for major platforms. Fair revenue sharing for all contributors is ensured by the Protocol.",
    imageSrc: "/distribute-flywheel.svg",
    imageAlt: "Story Distribution Network"
  }
];

export const FlywheelSection: React.FC = () => {
  return (
    <section id="flywheel" className="relative mx-auto my-0 -mt-0.5 max-w-none bg-white h-[1200px] w-[1440px] max-xl:box-border max-xl:p-5 max-xl:w-full max-xl:h-auto max-xl:min-h-screen max-xl:max-w-[991px] max-sm:max-w-screen-sm">
      {/* Hero Content */}
      <header className="absolute top-16 left-16 flex flex-col gap-6 items-start h-[400px] w-[637px] xl:inline-flex max-xl:relative max-xl:top-0 max-xl:left-auto max-xl:right-auto max-xl:mx-auto max-xl:mt-0 max-xl:mb-10 max-xl:w-full max-xl:max-w-[600px] max-xl:text-center max-xl:items-center max-xl:justify-center max-xl:flex max-sm:px-5 max-sm:py-0">
        <h1 className="relative text-7xl font-extrabold leading-[88px] text-neutral-800 w-[637px] max-xl:w-auto max-xl:text-5xl max-xl:text-center max-xl:leading-[56px] max-sm:text-4xl max-sm:leading-10">
          Create.
          <br className="-ml-px" />
          Build.
          <br />
          Distribute.
        </h1>
        <p className="relative text-2xl text-neutral-800 text-opacity-80 w-[519px] max-xl:w-auto max-xl:max-w-full max-xl:text-xl max-xl:text-center max-sm:text-lg max-xl:px-4">
          At Sia.vision, the journey of a story is a dynamic, collaborative cycle. Our platform is built around this powerful flywheel, empowering you to bring narratives to life, transform them with cutting-edge tools and community passion, and share them with the world across diverse formats – all while retaining ownership and ensuring fair rewards through Story Protocol.
        </p>
      </header>

      {/* Decorative Shapes - Hidden on mobile and tablet */}
      <div className="max-xl:hidden">
        <DecorativeShapes />
      </div>

      {/* Desktop: Diagonal Card Layout - Only for very large screens */}
      <div className="absolute shrink-0 h-[893px] left-[383px] top-[150px] w-[996px] max-xl:hidden">
        {/* Card 1 - Bottom Left (Create) - Moved down to avoid overlap */}
        <div className="absolute left-0 top-[500px] w-[316px]">
          <StoryCard
            title={FLYWHEEL_CARDS[0].title}
            description={FLYWHEEL_CARDS[0].description}
            imageSrc={FLYWHEEL_CARDS[0].imageSrc}
            imageAlt={FLYWHEEL_CARDS[0].imageAlt}
          />
        </div>
        
        {/* Card 2 - Middle Center (Build) - Moved down */}
        <div className="absolute left-[339px] top-[280px] w-[316px]">
          <StoryCard
            title={FLYWHEEL_CARDS[1].title}
            description={FLYWHEEL_CARDS[1].description}
            imageSrc={FLYWHEEL_CARDS[1].imageSrc}
            imageAlt={FLYWHEEL_CARDS[1].imageAlt}
          />
        </div>
        
        {/* Card 3 - Top Right (Distribute) - Moved down */}
        <div className="absolute top-[60px] left-[680px] w-[316px]">
          <StoryCard
            title={FLYWHEEL_CARDS[2].title}
            description={FLYWHEEL_CARDS[2].description}
            imageSrc={FLYWHEEL_CARDS[2].imageSrc}
            imageAlt={FLYWHEEL_CARDS[2].imageAlt}
          />
        </div>
      </div>

      {/* iPad Pro & iPad Mini: Consistent layout for all tablets */}
      <div className="hidden xl:hidden md:block relative top-[80px] w-full px-8 mt-16">
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

      {/* Mobile: Stacked Card Layout - Fixed positioning to avoid overlap */}
      <div className="hidden md:hidden max-md:flex max-md:relative max-md:top-[120px] max-md:left-0 max-md:flex-col max-md:gap-8 max-md:items-center max-md:w-full max-md:px-4 max-md:mt-8">
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