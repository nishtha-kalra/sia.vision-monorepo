"use client";
import * as React from "react";
import { Navbar } from "@/components/navigation/Navbar";
import { HeroSection } from "@/components/about/HeroSection";
import { OurStorySection } from "@/components/about/OurStorySection";
import { MissionVisionSection } from "@/components/about/MissionVisionSection";
import { TeamSection } from "@/components/about/TeamSection";
import { AdvisorSection } from "@/components/about/AdvisorSection";
import ContactFormSection from "@/components/contact-form/ContactFormSection";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <main className="w-full bg-white">
      <Navbar />
      <HeroSection />
      <OurStorySection />
      <MissionVisionSection />
      <TeamSection />
      <AdvisorSection />
      <ContactFormSection />
      <Footer />
    </main>
  );
} 