'use client';
import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';

export const PhoneAuthDebugger = () => {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [testPhone, setTestPhone] = useState('+15555555555');
  const [testCode, setTestCode] = useState('123456');

  useEffect(() => {
    if (auth) {
      setDebugInfo(prev => ({
        ...prev,
        authInitialized: true,
        authDomain: auth.config.authDomain,
        apiKey: auth.config.apiKey ? '✓ Set' : '✗ Missing',
        currentUser: auth.currentUser?.uid || 'Not signed in',
        languageCode: auth.languageCode || 'Not set',
        settings: auth.settings
      }));
    } else {
      setDebugInfo(prev => ({
        ...prev,
        authInitialized: false,
        error: 'Firebase Auth not initialized'
      }));
    }

    // Check for reCAPTCHA container
    const container = document.getElementById('recaptcha-container');
    setDebugInfo(prev => ({
      ...prev,
      recaptchaContainer: container ? '✓ Found' : '✗ Not found',
      recaptchaContainerStyle: container ? container.style.cssText : 'N/A'
    }));

    // Check for global reCAPTCHA
    setDebugInfo(prev => ({
      ...prev,
      globalRecaptcha: (window as any).recaptchaVerifier ? '✓ Set' : '✗ Not set',
      grecaptcha: typeof (window as any).grecaptcha !== 'undefined' ? '✓ Loaded' : '✗ Not loaded'
    }));
  }, []);

  const testPhoneAuth = async () => {
    try {
      setDebugInfo(prev => ({ ...prev, testing: true, testError: null }));
      
      // Create a test container
      let container = document.getElementById('test-recaptcha-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'test-recaptcha-container';
        container.style.display = 'none';
        document.body.appendChild(container);
      }

      // Log auth state
      console.log('Auth state:', {
        auth,
        settings: auth?.settings,
        languageCode: auth?.languageCode
      });

      setDebugInfo(prev => ({ 
        ...prev, 
        testing: false, 
        testResult: 'Check console for detailed logs'
      }));

    } catch (error: any) {
      console.error('Test error:', error);
      setDebugInfo(prev => ({ 
        ...prev, 
        testing: false, 
        testError: error.message 
      }));
    }
  };

  return (
    <div className="fixed bottom-20 right-6 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-96 max-h-96 overflow-y-auto z-50">
      <h3 className="font-bold text-lg mb-2">Phone Auth Debugger</h3>
      
      <div className="space-y-2 text-sm">
        <div className="font-semibold">Firebase Status:</div>
        {Object.entries(debugInfo).map(([key, value]) => (
          <div key={key} className="flex justify-between">
            <span className="text-gray-600">{key}:</span>
            <span className="font-mono text-xs">{String(value)}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-2">
        <div className="font-semibold text-sm">Test Configuration:</div>
        <input
          type="text"
          value={testPhone}
          onChange={(e) => setTestPhone(e.target.value)}
          placeholder="Test phone number"
          className="w-full px-2 py-1 border rounded text-sm"
        />
        <input
          type="text"
          value={testCode}
          onChange={(e) => setTestCode(e.target.value)}
          placeholder="Test code"
          className="w-full px-2 py-1 border rounded text-sm"
        />
        <button
          onClick={testPhoneAuth}
          disabled={debugInfo.testing}
          className="w-full bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 disabled:opacity-50"
        >
          {debugInfo.testing ? 'Testing...' : 'Test Phone Auth'}
        </button>
      </div>

      <div className="mt-4 text-xs text-gray-500">
        <p>Add test numbers in Firebase Console:</p>
        <p>Auth → Sign-in method → Phone → Test numbers</p>
        <p className="mt-1">Common test: +1 555-555-5555 / 123456</p>
      </div>
    </div>
  );
};