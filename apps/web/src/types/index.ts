export interface NavigationItem {
  label: string;
  href: string;
}

export interface SectionProps {
  className?: string;
}

export interface HeroProps extends SectionProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  onCtaClick?: () => void;
}

export interface NavbarProps {
  navigationItems?: NavigationItem[];
  logoText?: string;
  onSearch?: () => void;
}

export interface ImageProps {
  image: string;
  altText: string;
  className?: string;
} 