'use client';
import { useState, useEffect } from 'react';
import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  PhoneAuthProvider,
  linkWithCredential,
  signInWithCredential,
  User,
  ApplicationVerifier
} from 'firebase/auth';
import { auth, db, functions } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';

interface PhoneAuthState {
  step: 'phone' | 'verification' | 'completed';
  loading: boolean;
  error: string | null;
  phoneNumber: string;
  verificationId: string | null;
  confirmationResult: any | null;
}

export const usePhoneAuth = () => {
  const [state, setState] = useState<PhoneAuthState>({
    step: 'phone',
    loading: false,
    error: null,
    phoneNumber: '',
    verificationId: null,
    confirmationResult: null
  });

  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);

  // Clean up reCAPTCHA on unmount
  useEffect(() => {
    return () => {
      if (recaptchaVerifier) {
        try {
          recaptchaVerifier.clear();
        } catch (error) {
          console.log('Error clearing reCAPTCHA:', error);
        }
      }
      // Clean up any global references
      if ((window as any).recaptchaVerifier) {
        try {
          (window as any).recaptchaVerifier.clear();
        } catch (error) {
          console.log('Error clearing global reCAPTCHA:', error);
        }
        (window as any).recaptchaVerifier = null;
      }
    };
  }, [recaptchaVerifier]);

  // Initialize reCAPTCHA - updated for better compatibility
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

      // Ensure container exists
      let container = document.getElementById('recaptcha-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'recaptcha-container';
        container.style.position = 'fixed';
        container.style.top = '-9999px';
        container.style.left = '-9999px';
        document.body.appendChild(container);
      }

      // Create new RecaptchaVerifier with better error handling
      const verifier = new RecaptchaVerifier('recaptcha-container', {
        size: 'invisible',
        callback: (response: any) => {
          // reCAPTCHA solved
          console.log('reCAPTCHA verified successfully');
        },
        'expired-callback': () => {
          // Token expired
          console.log('reCAPTCHA token expired');
          setState(prev => ({
            ...prev,
            error: 'Verification expired. Please try again.'
          }));
        },
        'error-callback': (error: any) => {
          console.error('reCAPTCHA error:', error);
          setState(prev => ({
            ...prev,
            error: 'Verification failed. Please try again.'
          }));
        }
      }, auth);

      // Store references
      (window as any).recaptchaVerifier = verifier;
      setRecaptchaVerifier(verifier);
      
      return verifier;
    } catch (error) {
      console.error('Error initializing reCAPTCHA:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to initialize verification. Please refresh and try again.'
      }));
      return null;
    }
  };

  // Send OTP to phone number with better error handling
  const sendOTP = async (phoneNumber: string) => {
    if (!auth) {
      setState(prev => ({ ...prev, error: 'Authentication not initialized' }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Initialize reCAPTCHA if not already done
      let verifier = recaptchaVerifier;
      if (!verifier) {
        verifier = initializeRecaptcha();
        if (!verifier) {
          throw new Error('Failed to initialize verification');
        }
      }

      // Ensure phone number is in E.164 format
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
      
      console.log('Sending OTP to:', formattedPhone);

      // Send SMS with better error handling
      try {
        const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, verifier);
        
        setState(prev => ({
          ...prev,
          step: 'verification',
          phoneNumber: formattedPhone,
          verificationId: confirmationResult.verificationId,
          confirmationResult: confirmationResult,
          loading: false,
          error: null
        }));

        // Store confirmation result globally for fallback
        (window as any).confirmationResult = confirmationResult;

        return confirmationResult;
      } catch (authError: any) {
        // Handle specific Firebase auth errors
        let errorMessage = 'Failed to send verification code';
        
        if (authError.code === 'auth/invalid-phone-number') {
          errorMessage = 'Invalid phone number format';
        } else if (authError.code === 'auth/missing-phone-number') {
          errorMessage = 'Phone number is required';
        } else if (authError.code === 'auth/quota-exceeded') {
          errorMessage = 'Too many requests. Please try again later';
        } else if (authError.code === 'auth/captcha-check-failed') {
          errorMessage = 'Verification failed. Please refresh and try again';
        } else if (authError.code === 'auth/too-many-requests') {
          errorMessage = 'Too many attempts. Please try again in a few minutes';
        } else if (authError.message) {
          errorMessage = authError.message;
        }

        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      
      // Reset reCAPTCHA for retry
      if (recaptchaVerifier) {
        try {
          recaptchaVerifier.clear();
        } catch (e) {
          console.log('Error clearing reCAPTCHA:', e);
        }
        setRecaptchaVerifier(null);
      }

      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to send verification code'
      }));
      
      throw error;
    }
  };

  // Verify OTP code with better error handling
  const verifyOTP = async (code: string) => {
    if (!auth) {
      throw new Error('Authentication not initialized');
    }

    // Try to use stored confirmation result first
    const confirmationResult = state.confirmationResult || (window as any).confirmationResult;
    
    if (!confirmationResult && !state.verificationId) {
      throw new Error('No verification in progress');
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      let result;
      
      if (confirmationResult && confirmationResult.confirm) {
        // Use confirmation result if available (preferred method)
        result = await confirmationResult.confirm(code);
      } else if (state.verificationId) {
        // Fallback to credential-based verification
        const credential = PhoneAuthProvider.credential(state.verificationId, code);
        result = await signInWithCredential(auth, credential);
      } else {
        throw new Error('Unable to verify code');
      }
      
      // After successful sign-in, trigger wallet creation asynchronously
      if (functions && result.user) {
        const onPhoneVerified = httpsCallable(functions, 'onPhoneVerified');
        // Run in background, don't block UI
        onPhoneVerified({ 
          uid: result.user.uid, 
          phoneNumber: result.user.phoneNumber || state.phoneNumber 
        }).catch(error => {
          console.error('Background wallet creation failed:', error);
        });
      }

      setState(prev => ({ 
        ...prev, 
        step: 'completed', 
        loading: false,
        error: null 
      }));
      
      return result;
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      
      let errorMessage = 'Invalid verification code';
      
      if (error.code === 'auth/invalid-verification-code') {
        errorMessage = 'Invalid verification code. Please check and try again';
      } else if (error.code === 'auth/code-expired') {
        errorMessage = 'Verification code expired. Please request a new one';
      } else if (error.code === 'auth/missing-verification-code') {
        errorMessage = 'Please enter the verification code';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      
      throw new Error(errorMessage);
    }
  };

  // Link phone number to existing user
  const linkPhoneToUser = async (user: User, verificationCode: string) => {
    if (!auth || !state.phoneNumber) {
      throw new Error('No phone number or verification in progress');
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      let credential;
      
      // Try to use confirmation result first
      const confirmationResult = state.confirmationResult || (window as any).confirmationResult;
      
      if (confirmationResult && confirmationResult.confirm) {
        // This will link automatically if user is already signed in
        await confirmationResult.confirm(verificationCode);
      } else if (state.verificationId) {
        // Fallback to credential-based linking
        credential = PhoneAuthProvider.credential(state.verificationId, verificationCode);
        await linkWithCredential(user, credential);
      } else {
        throw new Error('Unable to verify code');
      }
      
      // Update user document with phone verification
      if (db) {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          'phoneNumber.number': state.phoneNumber,
          'phoneNumber.isVerified': true,
          'phoneNumber.verifiedAt': new Date(),
          updatedAt: new Date()
        });
      }
      
      // Call backend function to create wallets
      if (functions) {
        console.log('Calling onPhoneVerified with:', { 
          uid: user.uid, 
          phoneNumber: state.phoneNumber 
        });
        
        const onPhoneVerified = httpsCallable(functions, 'onPhoneVerified');
        
        try {
          const result = await onPhoneVerified({ 
            uid: user.uid, 
            phoneNumber: state.phoneNumber 
          });
          console.log('onPhoneVerified successful:', result);
        } catch (functionError) {
          console.error('onPhoneVerified failed but continuing:', functionError);
          // Don't throw - let the user continue
        }
      }

      setState(prev => ({ 
        ...prev, 
        step: 'completed', 
        loading: false,
        error: null 
      }));
      
      return true;
    } catch (error: any) {
      console.error('Error linking phone to user:', error);
      
      let errorMessage = 'Failed to link phone number';
      
      if (error.code === 'auth/invalid-verification-code') {
        errorMessage = 'Invalid verification code';
      } else if (error.code === 'auth/credential-already-in-use') {
        errorMessage = 'This phone number is already linked to another account';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      
      throw new Error(errorMessage);
    }
  };

  // Reset state
  const reset = () => {
    // Clear any stored confirmation result
    if ((window as any).confirmationResult) {
      (window as any).confirmationResult = null;
    }
    
    // Clear reCAPTCHA
    if (recaptchaVerifier) {
      try {
        recaptchaVerifier.clear();
      } catch (error) {
        console.log('Error clearing reCAPTCHA:', error);
      }
      setRecaptchaVerifier(null);
    }
    
    setState({
      step: 'phone',
      loading: false,
      error: null,
      phoneNumber: '',
      verificationId: null,
      confirmationResult: null
    });
  };

  return {
    ...state,
    sendOTP,
    verifyOTP,
    linkPhoneToUser,
    reset
  };
};
