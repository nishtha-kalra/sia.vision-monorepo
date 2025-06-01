'use client';

import { useState } from 'react';
import { Menu, Search, X } from 'lucide-react';
import { NavigationItem } from '@/types';

const navigationItems: NavigationItem[] = [
  { label: "Home", href: "#", isActive: true },
  { label: "How it works", href: "#how-it-works" },
  { label: "Flywheel", href: "#flywheel" },
  { label: "For You", href: "#for-you" },
  { label: "Genesis IP", href: "#meet-sia" },
  { label: "Contact", href: "#join-ecosystem" },
];

const scrollToSection = (href: string) => {
  if (href === "#") return;
  
  const sectionId = href.replace("#", "");
  const element = document.getElementById(sectionId);
  
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
};

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (href: string) => {
    scrollToSection(href);
    setMobileMenuOpen(false); // Close mobile menu if open
  };

  return (
    <nav className="bg-creative-tech-surface text-creative-tech-on-surface flex justify-between items-center px-6 py-4 mx-auto max-w-7xl lg:px-8 shadow-sm font-sans">
      {/* Logo - Updated to match image */}
      <div className="flex lg:flex-1 items-center">
        <a href="#" className="-m-1.5 p-1.5 flex items-center space-x-2">
          {/* SIA Circular Icon Part */}
          <div className="h-9 w-9 bg-creative-tech-secondary rounded-full flex items-center justify-center text-white font-bold text-[10px] leading-none">
            SIA
          </div>
          {/* SIA Text Part */}
          <h1 className="text-2xl sm:text-3xl font-bold text-creative-tech-on-surface font-serif">SIA</h1>
        </a>
      </div>

      {/* Mobile Menu Toggle Button - Only on small screens */}
      <div className="flex lg:hidden"> {/* Ensures this block is hidden on large screens */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-creative-tech-on-surface/80 hover:text-creative-tech-primary"
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Desktop Navigation Links - Hidden on small screens, visible on large */}
      <div className="hidden lg:flex lg:gap-x-8 items-center"> {/* Ensures this block is hidden on small screens and flex on large screens*/}
        {navigationItems.map((item) => (
          <button
            key={item.label}
            onClick={() => handleNavClick(item.href)}
            className={`text-sm font-medium transition-colors duration-200 cursor-pointer
              ${
                item.isActive
                  ? 'text-creative-tech-primary' // Active link color
                  : 'text-creative-tech-on-surface hover:text-creative-tech-primary'
              }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      
      {/* Search button - Hidden on small screens, part of desktop nav flow */}
      <div className="hidden lg:flex lg:flex-initial lg:justify-end ml-8"> {/* Added ml-8 for spacing */}
        <button className="p-2 text-creative-tech-on-surface/70 hover:text-creative-tech-primary transition-colors" aria-label="Search">
          <Search className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50" aria-modal="true"> {/* Ensures panel is hidden on large screens */}
          {/* Overlay */}
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-creative-tech-surface shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-creative-tech-on-surface/10">
              {/* Mobile Menu Logo */}
              <a href="#" className="-m-1.5 p-1.5 flex items-center space-x-2">
                <div className="h-8 w-8 bg-creative-tech-secondary rounded-full flex items-center justify-center text-white font-bold text-[10px] leading-none">
                  SIA
                </div>
                <h1 className="text-xl font-bold text-creative-tech-on-surface font-serif">SIA</h1>
              </a>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-creative-tech-on-surface/80 hover:text-creative-tech-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-6 flow-root px-6">
              <div className="-my-6 divide-y divide-creative-tech-on-surface/10">
                <div className="space-y-2 py-6">
                  {navigationItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => handleNavClick(item.href)}
                      className={`block w-full text-left rounded-lg px-3 py-2 text-base font-semibold leading-7 transition-colors
                        ${
                          item.isActive
                            ? 'text-creative-tech-primary bg-creative-tech-primary/10'
                            : 'text-creative-tech-on-surface hover:bg-creative-tech-on-surface/5'
                        }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                <div className="py-6">
                  <button className="group flex items-center w-full rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-creative-tech-on-surface hover:bg-creative-tech-on-surface/5 transition-colors">
                    <Search className="h-5 w-5 mr-3 text-creative-tech-on-surface/70 group-hover:text-creative-tech-primary transition-colors" />
                    <span className="">Search</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
} 