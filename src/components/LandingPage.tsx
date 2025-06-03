'use client';

import React from 'react';
import { Navbar } from './navigation/Navbar';
import { HeroSection } from './hero/HeroSection';
import { FlywheelSection } from './flywheel/FlywheelSection';
import HowItWorksSection from './how-it-works/HowItWorksSection';
import MeetSiaSection from './meet-sia/MeetSiaSection';
import ContactFormSection from './contact-form/ContactFormSection';
import Footer from './Footer';

export const LandingPage: React.FC = () => {
  // Placeholder functions removed as they were unused

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <FlywheelSection />
        <MeetSiaSection />
        <ContactFormSection />
      </main>
      <Footer />
    </div>
  );
}; 