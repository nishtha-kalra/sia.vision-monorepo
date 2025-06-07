'use client';
import { useEffect, useState } from 'react';
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  User,
  OAuthProvider,
  FacebookAuthProvider
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navigation/Navbar';
import { PhoneVerification } from '@/components/auth/PhoneVerification';
import { doc, getDoc } from 'firebase/firestore';

type AuthStep = 'providers' | 'phone-required' | 'profile';

export default function JoinPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingIn, setSigningIn] = useState(false);
  const [authStep, setAuthStep] = useState<AuthStep>('providers');
  const [needsPhoneVerification, setNeedsPhoneVerification] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    if (!auth) return;
    
    return onAuthStateChanged(auth as any, async (u) => {
      setUser(u);
      setLoading(false);
      
      if (u) {
        // Check if user has phone number
        const hasPhoneNumber = await checkUserPhoneNumber(u);
        
        if (hasPhoneNumber) {
          // User has phone number, redirect to profile
          router.replace('/profile');
        } else {
          // User needs phone verification
          setAuthStep('phone-required');
          setNeedsPhoneVerification(true);
        }
      } else {
        setAuthStep('providers');
        setNeedsPhoneVerification(false);
      }
    });
  }, [router]);

  const checkUserPhoneNumber = async (user: User) => {
    if (!db) return false;
    
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();
      
      // Check if user has verified phone number
      return userData?.phoneNumber?.isVerified === true;
    } catch (error) {
      console.error('Error checking user phone number:', error);
      return false;
    }
  };

  const handleGoogleSignIn = async () => {
    if (!auth) return;
    
    setSigningIn(true);
    try {
      const provider = new GoogleAuthProvider();
      // Request additional scopes if needed
      provider.addScope('email');
      provider.addScope('profile');
      
      const result = await signInWithPopup(auth as any, provider);
      
      // Check if user has phone number after sign in
      const hasPhoneNumber = await checkUserPhoneNumber(result.user);
      
      if (!hasPhoneNumber) {
        setAuthStep('phone-required');
        setNeedsPhoneVerification(true);
      }
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      // Handle specific error cases for account merging
      if (error.code === 'auth/account-exists-with-different-credential') {
        // Handle account merging scenario
        console.log('Account exists with different credential - handle merging');
      }
    }
    setSigningIn(false);
  };

  const handleAppleSignIn = async () => {
    if (!auth) return;
    
    setSigningIn(true);
    try {
      const provider = new OAuthProvider('apple.com');
      provider.addScope('email');
      provider.addScope('name');
      
      const result = await signInWithPopup(auth as any, provider);
      
      // Check if user has phone number after sign in
      const hasPhoneNumber = await checkUserPhoneNumber(result.user);
      
      if (!hasPhoneNumber) {
        setAuthStep('phone-required');
        setNeedsPhoneVerification(true);
      }
    } catch (error: any) {
      console.error('Error signing in with Apple:', error);
      // Handle account merging
      if (error.code === 'auth/account-exists-with-different-credential') {
        console.log('Account exists with different credential - handle merging');
      }
    }
    setSigningIn(false);
  };

  const handleFacebookSignIn = async () => {
    if (!auth) return;
    
    setSigningIn(true);
    try {
      const provider = new FacebookAuthProvider();
      provider.addScope('email');
      
      const result = await signInWithPopup(auth as any, provider);
      
      // Check if user has phone number after sign in
      const hasPhoneNumber = await checkUserPhoneNumber(result.user);
      
      if (!hasPhoneNumber) {
        setAuthStep('phone-required');
        setNeedsPhoneVerification(true);
      }
    } catch (error: any) {
      console.error('Error signing in with Facebook:', error);
      // Handle account merging
      if (error.code === 'auth/account-exists-with-different-credential') {
        console.log('Account exists with different credential - handle merging');
      }
    }
    setSigningIn(false);
  };

  const handlePhoneVerificationSuccess = () => {
    // Phone verification completed, redirect to profile
    setNeedsPhoneVerification(false);
    setAuthStep('profile');
    router.replace('/profile');
  };

  if (loading) {
    return (
      <main className="flex flex-col min-h-screen bg-gradient-to-br from-creative-tech-surface via-white to-blue-50">
        <Navbar />
        <div className="flex flex-1 items-center justify-center p-4 pt-32">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 border-4 border-creative-tech-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-creative-tech-on-surface">Loading...</p>
          </div>
        </div>
      </main>
    );
  }

  // Show phone verification if user is signed in but needs phone verification
  if (user && needsPhoneVerification && authStep === 'phone-required') {
    return (
      <main className="flex flex-col min-h-screen bg-gradient-to-br from-creative-tech-surface via-white to-blue-50">
        <Navbar />
        <div className="flex flex-1 items-center justify-center p-4 pt-32">
          <PhoneVerification
            user={user}
            isLinking={true}
            onSuccess={handlePhoneVerificationSuccess}
          />
        </div>
      </main>
    );
  }

  // Show auth providers if no user or user completed verification
  if (!user || authStep === 'providers') {
    return (
      <main className="flex flex-col min-h-screen bg-gradient-to-br from-creative-tech-surface via-white to-blue-50">
        <Navbar />
        <div className="flex flex-1 items-center justify-center p-4 pt-32">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-creative-tech-on-surface mb-2 font-serif">
                Welcome
              </h1>
              <p className="text-lg text-creative-tech-on-surface opacity-70">
                Join the future of creative technology
              </p>
            </div>

            {/* Sign In Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-creative-tech-primary/20 shadow-xl">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-creative-tech-on-surface mb-2 font-serif">
                  Join SIA
                </h2>
                <p className="text-creative-tech-on-surface opacity-70">
                  Continue with your preferred method
                </p>
              </div>

              <div className="space-y-4">
                {/* Google Sign In */}
                <button
                  onClick={handleGoogleSignIn}
                  disabled={signingIn}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 border border-gray-300 rounded-xl bg-white hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span className="text-gray-700 font-medium group-hover:text-gray-900">
                    Continue with Google
                  </span>
                </button>

                {signingIn && (
                  <div className="text-center py-2">
                    <div className="animate-spin h-5 w-5 border-2 border-creative-tech-primary border-t-transparent rounded-full mx-auto"></div>
                  </div>
                )}
              </div>

              {/* Privacy Notice */}
              <p className="text-xs text-creative-tech-on-surface opacity-60 text-center mt-6">
                By continuing, you agree to our terms of service and privacy policy
              </p>
            </div>

            {/* Features */}
            <div className="mt-8 text-center space-y-4">
              <p className="text-sm text-creative-tech-on-surface opacity-70">
                What you&#39;ll get:
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <div className="flex items-center gap-2 text-sm text-creative-tech-on-surface">
                  <div className="w-2 h-2 bg-creative-tech-primary rounded-full"></div>
                  Multi-chain wallets
                </div>
                <div className="flex items-center gap-2 text-sm text-creative-tech-on-surface">
                  <div className="w-2 h-2 bg-creative-tech-accent rounded-full"></div>
                  Secure authentication
                </div>
                <div className="flex items-center gap-2 text-sm text-creative-tech-on-surface">
                  <div className="w-2 h-2 bg-creative-tech-primary rounded-full"></div>
                  Creative community
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return null;
}
