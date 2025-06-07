// Common utility functions

// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Format date
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Sanitize string for display
export const sanitizeString = (str: string): string => {
  return str.trim().replace(/[<>]/g, '');
};

// Generate unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
}; 