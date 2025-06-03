'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { NavigationItem } from '@/types';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const navigationItems: NavigationItem[] = [
  { label: "Home", href: "/" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Flywheel", href: "#flywheel" },
  { label: "Genesis IP", href: "#meet-sia" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "#join-ecosystem" },
];

const scrollToSection = (href: string) => {
  if (href === "#" || href === "/" || href.startsWith("/")) return;
  
  const sectionId = href.replace("#", "");
  const element = document.getElementById(sectionId);
  
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
};

const handleNavClick = (href: string, pathname: string, router: ReturnType<typeof useRouter>, setMobileMenuOpen: (open: boolean) => void) => {
  // Close mobile menu if open
  setMobileMenuOpen(false);
  
  // Handle home navigation
  if (href === "/") {
    router.push("/");
    return;
  }
  
  // Handle hash/section links
  if (href.startsWith("#")) {
    // If we're on the home page, scroll to section
    if (pathname === "/") {
      scrollToSection(href);
    } else {
      // If we're on another page, navigate to home with hash
      router.push(`/${href}`);
    }
  }
};

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isActiveItem = (item: NavigationItem) => {
    // For external page routes like /about
    if (item.href.startsWith("/") && item.href !== "/") {
      return pathname === item.href;
    } 
    // For home route
    else if (item.href === "/") {
      return pathname === "/";
    }
    // For section links (#how-it-works, etc.), they are never marked as active
    // The user can click them to scroll, but they don't show as "active"
    return false;
  };

  return (
    <nav className="bg-gray-50/95 backdrop-blur-md text-gray-900 flex justify-between items-center px-6 py-4 mx-auto max-w-7xl lg:px-8 shadow-lg border-b border-gray-200 font-sans">
      {/* Logo - Off-white theme with blue accents */}
      <div className="flex lg:flex-1 items-center">
        <Link href="/" className="-m-1.5 p-1.5 flex items-center space-x-2 group">
          {/* SIA Circular Icon Part - Keep blue gradient */}
          <div className="h-9 w-9 bg-gradient-to-br from-hero-blue-500 to-hero-blue-600 rounded-full flex items-center justify-center text-white font-bold text-[10px] leading-none shadow-lg shadow-hero-blue-500/30 group-hover:shadow-hero-blue-500/50 transition-all duration-300">
            SIA
          </div>
          {/* SIA Text Part */}
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-serif group-hover:text-hero-blue-600 transition-colors duration-300">SIA</h1>
        </Link>
      </div>

      {/* Mobile Menu Toggle Button - Only on small screens */}
      <div className="flex lg:hidden">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-gray-600 hover:text-hero-blue-600 transition-colors duration-300"
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Desktop Navigation Links - Hidden on small screens, visible on large */}
      <div className="hidden lg:flex lg:gap-x-8 items-center">
        {navigationItems.map((item) => {
          const isExternalLink = item.href.startsWith("/") && item.href !== "/";
          const isActive = isActiveItem(item);
          
          if (isExternalLink) {
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`text-sm font-medium transition-all duration-300 cursor-pointer relative group
                  ${
                    isActive
                      ? 'text-hero-blue-600' // Active link color
                      : 'text-gray-700 hover:text-hero-blue-600'
                  }`}
              >
                {item.label}
                <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-hero-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </Link>
            );
          }
          
          return (
            <button
              key={item.label}
              onClick={() => handleNavClick(item.href, pathname, router, setMobileMenuOpen)}
              className={`text-sm font-medium transition-all duration-300 cursor-pointer relative group
                ${
                  isActive
                    ? 'text-hero-blue-600' // Active link color
                    : 'text-gray-700 hover:text-hero-blue-600'
                }`}
            >
              {item.label}
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-hero-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </button>
          );
        })}
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50" aria-modal="true">
          {/* Overlay */}
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-gray-50/95 backdrop-blur-md shadow-2xl border-l border-gray-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              {/* Mobile Menu Logo */}
              <Link href="/" className="-m-1.5 p-1.5 flex items-center space-x-2">
                <div className="h-8 w-8 bg-gradient-to-br from-hero-blue-500 to-hero-blue-600 rounded-full flex items-center justify-center text-white font-bold text-[10px] leading-none shadow-lg shadow-hero-blue-500/30">
                  SIA
                </div>
                <h1 className="text-xl font-bold text-gray-900 font-serif">SIA</h1>
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-600 hover:text-hero-blue-600 transition-colors duration-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-6 flow-root px-6">
              <div className="-my-6 divide-y divide-gray-200">
                <div className="space-y-2 py-6">
                  {navigationItems.map((item) => {
                    const isExternalLink = item.href.startsWith("/") && item.href !== "/";
                    const isActive = isActiveItem(item);
                    
                    if (isExternalLink) {
                      return (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`block w-full text-left rounded-lg px-3 py-2 text-base font-semibold leading-7 transition-all duration-300
                            ${
                              isActive
                                ? 'text-hero-blue-600 bg-hero-blue-50 border border-hero-blue-200'
                                : 'text-gray-700 hover:bg-gray-100 hover:text-hero-blue-600'
                            }`}
                        >
                          {item.label}
                        </Link>
                      );
                    }
                    
                    return (
                      <button
                        key={item.label}
                        onClick={() => handleNavClick(item.href, pathname, router, setMobileMenuOpen)}
                        className={`block w-full text-left rounded-lg px-3 py-2 text-base font-semibold leading-7 transition-all duration-300
                          ${
                            isActive
                              ? 'text-hero-blue-600 bg-hero-blue-50 border border-hero-blue-200'
                              : 'text-gray-700 hover:bg-gray-100 hover:text-hero-blue-600'
                          }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
} 