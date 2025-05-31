'use client';

import { Navbar } from './navigation/Navbar';
import { HeroSection } from './hero/HeroSection';
import HowItWorksSection from './how-it-works/HowItWorksSection';
import { FlywheelSection } from './flywheel/FlywheelSection';

export function LandingPage() {
  // Placeholder functions removed as they were unused

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <FlywheelSection />
        {/* Additional sections will be added here */}
      </main>
    </div>
  );
} 