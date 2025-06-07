// Common types for SIA application

// Contact form types
export interface ContactFormData {
  name: string;
  email: string;
  message: string;
  timestamp?: Date;
}

// User types
export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Firebase Auth types
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
} 