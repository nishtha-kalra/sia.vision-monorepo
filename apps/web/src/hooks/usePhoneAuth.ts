'use client';
import { useState } from 'react';
import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  linkWithPhoneNumber,
  PhoneAuthProvider,
  linkWithCredential,
  signInWithCredential,
  User
} from 'firebase/auth';
import { auth, db, functions } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';

interface PhoneAuthState {
  step: 'phone' | 'verification' | 'completed';
  loading: boolean;
  error: string | null;
  phoneNumber: string;
  verificationId: string | null;
}

export const usePhoneAuth = () => {
  const [state, setState] = useState<PhoneAuthState>({
    step: 'phone',
    loading: false,
    error: null,
    phoneNumber: '',
    verificationId: null
  });

  // Initialize reCAPTCHA
  const initializeRecaptcha = () => {
    if (!auth) return null;
    
    try {
      // Clear any existing verifier
      if ((window as any).recaptchaVerifier) {
        try {
          (window as any).recaptchaVerifier.clear();
        } catch (error) {
          console.log('Error clearing existing reCAPTCHA:', error);
        }
        (window as any).recaptchaVerifier = null;
      }

      // Ensure container exists and is completely hidden
      let container = document.getElementById('recaptcha-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'recaptcha-container';
        document.body.appendChild(container);
      }
      
      // Make container completely invisible and out of flow
      container.style.cssText = `
        position: fixed !important;
        top: -10000px !important;
        left: -10000px !important;
        width: 1px !important;
        height: 1px !important;
        opacity: 0 !important;
        pointer-events: none !important;
        z-index: -9999 !important;
        visibility: hidden !important;
        overflow: hidden !important;
      `;

      // Create invisible reCAPTCHA verifier
      const recaptchaVerifier = new RecaptchaVerifier(auth as any, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
          console.log('reCAPTCHA solved');
        },
        'expired-callback': () => {
          console.log('reCAPTCHA expired');
          // Clear the verifier on expiration
          if ((window as any).recaptchaVerifier) {
            (window as any).recaptchaVerifier.clear();
            (window as any).recaptchaVerifier = null;
          }
        }
      });

      (window as any).recaptchaVerifier = recaptchaVerifier;
      return recaptchaVerifier;
    } catch (error) {
      console.error('Error initializing reCAPTCHA:', error);
      return null;
    }
  };

  // Send OTP to phone number
  const sendOTP = async (phoneNumber: string) => {
    if (!auth) throw new Error('Firebase not initialized');

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const recaptchaVerifier = initializeRecaptcha();
      if (!recaptchaVerifier) {
        throw new Error('Failed to initialize reCAPTCHA');
      }

      // Format phone number (ensure it starts with country code)
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+1${phoneNumber}`;

      const confirmationResult = await signInWithPhoneNumber(auth as any, formattedPhone, recaptchaVerifier);
      
      setState(prev => ({
        ...prev,
        step: 'verification',
        phoneNumber: formattedPhone,
        verificationId: confirmationResult.verificationId,
        loading: false
      }));

      return confirmationResult;
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to send OTP'
      }));
      throw error;
    }
  };

  // Verify OTP code
  const verifyOTP = async (code: string) => {
    if (!auth || !state.verificationId) {
      throw new Error('No verification ID available');
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const credential = PhoneAuthProvider.credential(state.verificationId, code);
      const result = await signInWithCredential(auth as any, credential);
      
      setState(prev => ({ ...prev, step: 'completed', loading: false }));
      return result;
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Invalid verification code'
      }));
      throw error;
    }
  };

  // Link phone number to existing user
  const linkPhoneToUser = async (user: User, phoneNumber: string, verificationCode: string) => {
    if (!auth || !state.verificationId) {
      throw new Error('No verification ID available');
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const credential = PhoneAuthProvider.credential(state.verificationId, verificationCode);
      await linkWithCredential(user, credential);
      
      // Call backend function to update user (without blocking for wallet creation)
      if (functions) {
        const onPhoneVerified = httpsCallable(functions, 'onPhoneVerified');
        await onPhoneVerified({ phoneNumber });
      }

      setState(prev => ({ ...prev, step: 'completed', loading: false }));
      return true;
    } catch (error: any) {
      console.error('Error linking phone to user:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to link phone number'
      }));
      throw error;
    }
  };

  // Check if phone number is already registered
  const checkPhoneRegistration = async (phoneNumber: string) => {
    if (!db) return null;

    try {
      // Query users collection for this phone number
      // Note: This is a simplified approach. In production, you might want to use a more secure method
      // or index phone numbers in a separate collection for faster lookups
      
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+1${phoneNumber}`;
      
      // For now, we'll return null and handle the logic in the auth flow
      // In a real implementation, you'd query your users collection
      return null;
    } catch (error) {
      console.error('Error checking phone registration:', error);
      return null;
    }
  };

  // Merge accounts by phone number
  const mergeAccountsByPhone = async (currentUser: User, phoneNumber: string) => {
    if (!db) throw new Error('Firestore not initialized');

    try {
      // Check if there's an existing user with this phone number
      // In a real implementation, you'd have a phone number index
      
      // For now, just update the current user's phone number
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        'phoneNumber.number': phoneNumber,
        'phoneNumber.isVerified': true,
        updatedAt: new Date()
      });

      return true;
    } catch (error) {
      console.error('Error merging accounts:', error);
      throw error;
    }
  };

  // Reset state
  const reset = () => {
    setState({
      step: 'phone',
      loading: false,
      error: null,
      phoneNumber: '',
      verificationId: null
    });
  };

  return {
    ...state,
    sendOTP,
    verifyOTP,
    linkPhoneToUser,
    checkPhoneRegistration,
    mergeAccountsByPhone,
    reset
  };
}; 