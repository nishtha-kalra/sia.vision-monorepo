import React from 'react';

export const HeroContent: React.FC<{
  headlineColor?: string;
  subtextColor?: string;
  buttonColor?: string;
  buttonHoverColor?: string;
}> = ({
  headlineColor = 'text-white',
  subtextColor = 'text-white',
  buttonColor = 'bg-orange-500',
  buttonHoverColor = 'hover:bg-creative-tech-primary',
}) => (
  <div className="flex absolute left-[50%] top-44 transform -translate-x-1/2 flex-col gap-10 items-center text-center h-[449px] w-[663px] 
    max-xl:w-[600px]
    max-lg:w-[90%] max-lg:items-center max-lg:text-center
    max-sm:h-[317px] max-sm:w-[90%] max-sm:items-center max-sm:text-center
    lg:items-start lg:text-left lg:left-0 lg:transform-none">
    <h1 className={`text-9xl leading-[108px] w-full
      max-xl:text-8xl max-xl:leading-[96px]
      max-lg:text-7xl max-lg:leading-[76px] max-lg:text-center
      max-md:text-6xl max-md:leading-[64px]
      max-sm:text-5xl max-sm:leading-10 max-sm:text-center
      lg:text-left
      font-serif ${headlineColor}`}>
      Reimagining Stories for the New World
    </h1>
    <p className={`text-2xl w-[85%] 
      max-xl:text-xl
      max-lg:text-lg max-lg:text-center
      max-sm:text-base max-sm:text-center
      lg:text-left lg:w-[567px]
      ${subtextColor}`}>
      co-built with AI. owned by You.
    </p>
    <button className={`gap-2.5 px-10 py-6 text-xl font-medium leading-5 text-white cursor-pointer rounded-[40px] 
      max-lg:px-8 max-lg:py-5 max-lg:text-lg
      max-sm:px-6 max-sm:py-4 max-sm:text-base
      lg:self-start
      ${buttonColor} ${buttonHoverColor}`}>
      Join Waitlist
    </button>
  </div>
); 