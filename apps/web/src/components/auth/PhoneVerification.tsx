'use client';
import { useState, useEffect } from 'react';
import { usePhoneAuth } from '@/hooks/usePhoneAuth';
import { useGeoLocation } from '@/hooks/useGeoLocation';
import { User } from 'firebase/auth';

interface PhoneVerificationProps {
  user?: User;
  isLinking?: boolean;
  onSuccess: () => void;
  onCancel?: () => void;
}

// Comprehensive country list with flags and dial codes
const COUNTRIES = [
  { code: 'US', name: 'United States', flag: '🇺🇸', dialCode: '+1' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', dialCode: '+1' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', dialCode: '+44' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', dialCode: '+61' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', dialCode: '+49' },
  { code: 'FR', name: 'France', flag: '🇫🇷', dialCode: '+33' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', dialCode: '+81' },
  { code: 'IN', name: 'India', flag: '🇮🇳', dialCode: '+91' },
  { code: 'CN', name: 'China', flag: '🇨🇳', dialCode: '+86' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷', dialCode: '+82' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', dialCode: '+65' },
  { code: 'HK', name: 'Hong Kong', flag: '🇭🇰', dialCode: '+852' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', dialCode: '+55' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', dialCode: '+52' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', dialCode: '+34' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', dialCode: '+39' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', dialCode: '+31' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪', dialCode: '+46' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴', dialCode: '+47' },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰', dialCode: '+45' },
  { code: 'FI', name: 'Finland', flag: '🇫🇮', dialCode: '+358' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺', dialCode: '+7' },
  { code: 'PL', name: 'Poland', flag: '🇵🇱', dialCode: '+48' },
  { code: 'CZ', name: 'Czech Republic', flag: '🇨🇿', dialCode: '+420' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹', dialCode: '+43' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭', dialCode: '+41' },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪', dialCode: '+32' },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪', dialCode: '+353' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', dialCode: '+351' },
  { code: 'GR', name: 'Greece', flag: '🇬🇷', dialCode: '+30' },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷', dialCode: '+90' },
  { code: 'IL', name: 'Israel', flag: '🇮🇱', dialCode: '+972' },
  { code: 'AE', name: 'UAE', flag: '🇦🇪', dialCode: '+971' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', dialCode: '+966' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬', dialCode: '+20' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', dialCode: '+27' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', dialCode: '+234' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', dialCode: '+254' },
  { code: 'MA', name: 'Morocco', flag: '🇲🇦', dialCode: '+212' },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭', dialCode: '+66' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩', dialCode: '+62' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾', dialCode: '+60' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭', dialCode: '+63' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳', dialCode: '+84' },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿', dialCode: '+64' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷', dialCode: '+54' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱', dialCode: '+56' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴', dialCode: '+57' },
  { code: 'PE', name: 'Peru', flag: '🇵🇪', dialCode: '+51' },
  { code: 'UY', name: 'Uruguay', flag: '🇺🇾', dialCode: '+598' },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰', dialCode: '+92' },
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩', dialCode: '+880' },
  { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰', dialCode: '+94' },
].sort((a, b) => a.name.localeCompare(b.name));

export const PhoneVerification = ({ user, isLinking = false, onSuccess, onCancel }: PhoneVerificationProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  
  const phoneAuth = usePhoneAuth();
  const geoLocation = useGeoLocation();

  // Set default country from geo location
  useEffect(() => {
    if (geoLocation.location && !selectedCountry) {
      setSelectedCountry(geoLocation.location.dialCode);
    }
  }, [geoLocation.location, selectedCountry]);

  // Countdown timer for resend OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;

    try {
      // Combine country code with phone number (clean numbers only)
      const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');
      const fullPhoneNumber = selectedCountry + cleanPhoneNumber;
      await phoneAuth.sendOTP(fullPhoneNumber);
      setCountdown(60); // Start 60 second countdown
    } catch (error) {
      console.error('Failed to send OTP:', error);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode.trim()) return;

    try {
      if (isLinking && user) {
        // Link phone to existing user
        await phoneAuth.linkPhoneToUser(user, phoneAuth.phoneNumber, verificationCode);
      } else {
        // Sign in with phone (new user or standalone phone auth)
        await phoneAuth.verifyOTP(verificationCode);
      }
      onSuccess();
    } catch (error) {
      console.error('Failed to verify OTP:', error);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    
    try {
      await phoneAuth.sendOTP(phoneAuth.phoneNumber || phoneNumber);
      setCountdown(60);
    } catch (error) {
      console.error('Failed to resend OTP:', error);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers and basic formatting
    const value = e.target.value.replace(/[^\d]/g, '');
    setPhoneNumber(value);
  };

  if (phoneAuth.step === 'phone') {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-creative-tech-primary/20 shadow-xl">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-creative-tech-on-surface mb-2 font-serif">
              {isLinking ? 'Add Phone Number' : 'Verify Phone Number'}
            </h2>
            <p className="text-creative-tech-on-surface opacity-70">
              {isLinking 
                ? 'Link your phone number to complete your profile'
                : 'Phone number is required to create your wallet and complete registration'
              }
            </p>
          </div>

          <form onSubmit={handleSendOTP} className="space-y-6">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-creative-tech-on-surface mb-2">
                Phone Number
              </label>
              <div className="flex gap-2">
                {/* Country Code Selector */}
                <div className="relative">
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="appearance-none w-24 px-3 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-creative-tech-primary focus:border-transparent transition-all duration-200 text-sm"
                  >
                    {COUNTRIES.map((country) => (
                      <option key={country.code} value={country.dialCode}>
                        {country.flag} {country.dialCode}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                
                {/* Phone Number Input */}
                <div className="flex-1">
                  <input
                    type="tel"
                    id="phone"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    placeholder="Enter phone number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-creative-tech-primary focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
              </div>
            </div>

            {phoneAuth.error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-600">{phoneAuth.error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={phoneAuth.loading || !phoneNumber.trim()}
                className="flex-1 bg-creative-tech-primary text-white py-3 px-6 rounded-xl font-medium hover:bg-creative-tech-primary/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {phoneAuth.loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Sending...
                  </div>
                ) : (
                  'Send Code'
                )}
              </button>
              
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-6 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (phoneAuth.step === 'verification') {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-creative-tech-primary/20 shadow-xl">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-creative-tech-on-surface mb-2 font-serif">
              Enter Verification Code
            </h2>
            <p className="text-creative-tech-on-surface opacity-70">
              We sent a 6-digit code to<br />
              <span className="font-medium">{phoneAuth.phoneNumber}</span>
            </p>
          </div>

          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-creative-tech-on-surface mb-2">
                Verification Code
              </label>
              <input
                type="text"
                id="code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit code"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-creative-tech-primary focus:border-transparent transition-all duration-200 text-center text-lg tracking-widest"
                required
                maxLength={6}
                autoComplete="one-time-code"
              />
            </div>

            {phoneAuth.error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-600">{phoneAuth.error}</p>
              </div>
            )}

            <div className="space-y-4">
              <button
                type="submit"
                disabled={phoneAuth.loading || verificationCode.length !== 6}
                className="w-full bg-creative-tech-primary text-white py-3 px-6 rounded-xl font-medium hover:bg-creative-tech-primary/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {phoneAuth.loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Verifying...
                  </div>
                ) : (
                  'Verify Code'
                )}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={countdown > 0 || phoneAuth.loading}
                  className="text-creative-tech-primary hover:text-creative-tech-primary/80 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {countdown > 0 ? `Resend code in ${countdown}s` : 'Resend code'}
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    phoneAuth.reset();
                    setVerificationCode('');
                  }}
                  className="text-gray-600 hover:text-gray-800 text-sm"
                >
                  Change phone number
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (phoneAuth.step === 'completed') {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-creative-tech-primary/20 shadow-xl text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Phone Verified!</h3>
          <p className="text-gray-600 mb-6">
            Your phone number has been successfully verified.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-3"></div>
              <p className="text-sm text-blue-800">
                Creating your wallets in the background...
              </p>
            </div>
          </div>
          <button
            onClick={onSuccess}
            className="w-full bg-creative-tech-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-creative-tech-primary/90 transition-colors"
          >
            Continue to Profile
          </button>
        </div>
      </div>
    );
  }

  return null;
}; 