'use client';

import { Navbar } from './navigation/Navbar';
import { HeroSection } from './hero/HeroSection';
import HowItWorksSection from './how-it-works/HowItWorksSection';
import { FlywheelSection } from './flywheel/FlywheelSection';
import StakeholderBenefitsSection from './stakeholder-benefits/StakeholderBenefitsSection';
import MeetSiaSection from './meet-sia/MeetSiaSection';
import ContactFormSection from './contact-form/ContactFormSection';
import Footer from './Footer';

export function LandingPage() {
  // Placeholder functions removed as they were unused

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <FlywheelSection />
        <StakeholderBenefitsSection />
        <MeetSiaSection />
        <ContactFormSection />
      </main>
      <Footer />
    </div>
  );
} 