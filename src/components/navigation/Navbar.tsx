'use client';

import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { NavigationItem } from '@/types';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const navigationItems: NavigationItem[] = [
  { label: 'Home', href: '/' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Flywheel', href: '#flywheel' },
  { label: 'Genesis IP', href: '#meet-sia' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '#join-ecosystem' },
];

const scrollToSection = (href: string) => {
  if (href === '#' || href === '/' || href.startsWith('/')) return;

  const sectionId = href.replace('#', '');
  const element = document.getElementById(sectionId);

  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
};

const handleNavClick = (
  href: string,
  pathname: string,
  router: ReturnType<typeof useRouter>,
  setMobileMenuOpen: (open: boolean) => void
) => {
  // Close mobile menu if open
  setMobileMenuOpen(false);

  // Handle home navigation
  if (href === '/') {
    router.push('/');
    return;
  }

  // Handle external page routes (like /about)
  if (href.startsWith('/') && href !== '/') {
    router.push(href);
    return;
  }

  // Handle hash/section links
  if (href.startsWith('#')) {
    // If we're on the home page, scroll to section
    if (pathname === '/') {
      scrollToSection(href);
    } else {
      // If we're on another page, navigate to home with hash
      router.push(`/${href}`);
    }
  }
};

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
  }, []);

  const isActiveItem = (item: NavigationItem) => {
    // For external page routes like /about
    if (item.href.startsWith('/') && item.href !== '/') {
      return pathname === item.href;
    }
    // For home route
    else if (item.href === '/') {
      return pathname === '/';
    }
    // For section links (#how-it-works, etc.), they are never marked as active
    // The user can click them to scroll, but they don't show as "active"
    return false;
  };

  return (
    <nav className="bg-gray-50/95 backdrop-blur-md text-gray-900 shadow-lg border-b border-gray-200 font-sans fixed top-0 left-0 right-0 w-full z-[1000]">
      <div className="flex justify-between items-center px-5 py-6 mx-auto max-w-7xl lg:px-6">
        {/* Logo - Off-white theme with blue accents */}
        <div className="flex lg:flex-1 items-center">
          <Link
            href="/"
            className="-m-1.5 p-1.5 flex items-center space-x-2 group"
          >
            {/* SIA Circular Icon Part - Keep blue gradient */}
            <div className="h-9 w-9 bg-gradient-to-br from-hero-blue-500 to-hero-blue-600 rounded-full flex items-center justify-center text-white font-bold text-[10px] leading-none shadow-lg shadow-hero-blue-500/30 group-hover:shadow-hero-blue-500/50 transition-all duration-300">
              SIA
            </div>
            {/* SIA Text Part */}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-serif group-hover:text-hero-blue-600 transition-colors duration-300">
              SIA
            </h1>
          </Link>
        </div>

        {/* Mobile Menu Toggle Button - Only on small screens */}
        <div className="flex lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-600 hover:text-hero-blue-600 transition-colors duration-300"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Desktop Navigation Links - Hidden on small screens, visible on large */}
        <div className="hidden lg:flex lg:gap-x-8 items-center">
          {navigationItems.map((item) => {
            const isExternalLink =
              item.href.startsWith('/') && item.href !== '/';
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
                onClick={() =>
                  handleNavClick(item.href, pathname, router, setMobileMenuOpen)
                }
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

          {/* Authentication Button/Profile */}
          {user ? (
            <Link
              href="/profile"
              className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="w-8 h-8 rounded-full border-2 border-hero-blue-600/20"
                />
              ) : (
                <div className="w-8 h-8 bg-gradient-to-br from-hero-blue-500 to-hero-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                  {user.displayName
                    ? user.displayName.charAt(0).toUpperCase()
                    : user.email?.charAt(0).toUpperCase()}
                </div>
              )}
            </Link>
          ) : (
            <Link
              href="/join"
              className="px-6 py-2 bg-gradient-to-r from-hero-blue-500 to-hero-blue-600 text-white font-medium rounded-lg hover:from-hero-blue-600 hover:to-hero-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Join
            </Link>
          )}
        </div>

        {/* Mobile Menu Panel */}
        {mobileMenuOpen && (
          <div className="lg:hidden">
            {/* Background Overlay */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999998]"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Menu Panel */}
            <div className="fixed top-0 right-0 h-screen w-80 max-w-[85vw] bg-white shadow-2xl z-[999999] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
                <Link
                  href="/"
                  className="flex items-center space-x-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="h-8 w-8 bg-gradient-to-br from-hero-blue-500 to-hero-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                    SIA
                  </div>
                  <h1 className="text-xl font-bold text-gray-900 font-serif">
                    SIA
                  </h1>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-gray-600 hover:text-hero-blue-600 transition-colors rounded-lg"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Navigation Items */}
              <div className="p-6 bg-white">
                <div className="space-y-3">
                  {navigationItems.map((item, index) => {
                    const isExternalLink =
                      item.href.startsWith('/') && item.href !== '/';
                    const isActive = isActiveItem(item);

                    if (isExternalLink) {
                      return (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center w-full text-left rounded-xl px-5 py-4 text-base font-semibold transition-all duration-200 border ${
                            isActive
                              ? 'text-hero-blue-600 bg-hero-blue-50 border-hero-blue-200'
                              : 'text-gray-800 bg-gray-50 border-gray-200 hover:bg-hero-blue-50 hover:text-hero-blue-600 hover:border-hero-blue-300'
                          }`}
                          style={{ zIndex: 1000000 + index }}
                        >
                          <span className="block">{item.label}</span>
                        </Link>
                      );
                    }

                    return (
                      <button
                        key={item.label}
                        onClick={() =>
                          handleNavClick(
                            item.href,
                            pathname,
                            router,
                            setMobileMenuOpen
                          )
                        }
                        className={`flex items-center w-full text-left rounded-xl px-5 py-4 text-base font-semibold transition-all duration-200 border ${
                          isActive
                            ? 'text-hero-blue-600 bg-hero-blue-50 border-hero-blue-200'
                            : 'text-gray-800 bg-gray-50 border-gray-200 hover:bg-hero-blue-50 hover:text-hero-blue-600 hover:border-hero-blue-300'
                        }`}
                        style={{ zIndex: 1000000 + index }}
                      >
                        <span className="block">{item.label}</span>
                      </button>
                    );
                  })}

                  {/* Mobile Authentication Button/Profile */}
                  {user ? (
                    <Link
                      href="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center w-full text-left rounded-xl px-5 py-4 text-base font-semibold transition-all duration-200 border bg-hero-blue-50 border-hero-blue-200 text-hero-blue-600"
                    >
                      <div className="flex items-center gap-3">
                        {user.photoURL ? (
                          <img
                            src={user.photoURL}
                            alt="Profile"
                            className="w-6 h-6 rounded-full border border-hero-blue-600/20"
                          />
                        ) : (
                          <div className="w-6 h-6 bg-gradient-to-br from-hero-blue-500 to-hero-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                            {user.displayName
                              ? user.displayName.charAt(0).toUpperCase()
                              : user.email?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="block">Profile</span>
                      </div>
                    </Link>
                  ) : (
                    <Link
                      href="/join"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center w-full text-left rounded-xl px-5 py-4 text-base font-semibold transition-all duration-200 border bg-gradient-to-r from-hero-blue-500 to-hero-blue-600 text-white border-hero-blue-600"
                    >
                      <span className="block">Join</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}