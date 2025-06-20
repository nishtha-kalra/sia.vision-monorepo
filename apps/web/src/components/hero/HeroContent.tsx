import React from 'react';

export const HeroContent: React.FC<{
  headlineColor?: string;
  subtextColor?: string;
  buttonColor?: string;
  buttonHoverColor?: string;
}> = ({
  headlineColor = 'text-white',
  subtextColor = 'text-blue-200',
  buttonColor = 'bg-gradient-to-r from-hero-blue-600 to-hero-blue-500',
  buttonHoverColor = 'hover:from-creative-tech-primary hover:to-hero-blue-600',
}) => {
  const scrollToContact = () => {
    const contactSection = document.getElementById('join-ecosystem');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-8 text-center lg:text-left">
      <h1 className={`text-5xl sm:text-6xl lg:text-7xl xl:text-8xl 
        leading-tight font-sans font-bold ${headlineColor}
        max-w-4xl drop-shadow-2xl`}>
        Reimagining Stories for the New World
      </h1>
      <p className={`text-lg sm:text-xl lg:text-2xl 
        leading-relaxed ${subtextColor}
        max-w-2xl lg:max-w-3xl drop-shadow-lg font-medium`}>
        co-built with AI. owned by you.
      </p>
      <div className="pt-4">
        <button 
          onClick={scrollToContact}
          className={`px-12 py-6 text-xl font-bold text-white 
            rounded-full cursor-pointer transition-all duration-300 
            shadow-2xl hover:shadow-hero-blue-500/50 transform hover:scale-105
            ${buttonColor} ${buttonHoverColor}
            backdrop-blur-sm border border-hero-blue-500/30 hover:border-creative-tech-primary/50
            relative overflow-hidden group`}>
          <span className="relative z-10">Join Waitlist</span>
          {/* Button glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-hero-blue-500/20 to-creative-tech-primary/20 
            opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      </div>
    </div>
  );
}; 