# Firebase Phone Authentication Setup Guide

## Overview
This guide helps resolve the 500 error with Firebase phone authentication and ensures proper setup.

## Important: reCAPTCHA Requirements

Firebase Phone Authentication requires **standard reCAPTCHA v3**, not reCAPTCHA Enterprise. The key you provided (`6Lfy4WMrAAAAANQpz-iA4-qss-NHCI23obCK7D3R`) appears to be a reCAPTCHA Enterprise key, which is not compatible.

## Step 1: Enable Phone Authentication in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to **Authentication** → **Sign-in method**
4. Enable **Phone** authentication
5. Add your domain to the authorized domains list:
   - Add `localhost` for development
   - Add your production domain (e.g., `sia.vision`)

## Step 2: Set Up Standard reCAPTCHA (Not Enterprise)

Firebase automatically handles reCAPTCHA for phone auth. You don't need to manually add reCAPTCHA Enterprise.

### For Web Applications:
1. Firebase will automatically use invisible reCAPTCHA
2. No manual script tags needed
3. The reCAPTCHA badge will be hidden with our CSS

### Remove Manual reCAPTCHA Script:
Remove this from your HTML:
```html
<!-- Remove this -->
<script src="https://www.google.com/recaptcha/enterprise.js?render=6Lfy4WMrAAAAANQpz-iA4-qss-NHCI23obCK7D3R"></script>
```

## Step 3: Firebase App Check (Optional but Recommended)

For additional security, enable Firebase App Check:

1. In Firebase Console, go to **App Check**
2. Register your app
3. Choose reCAPTCHA v3 (not Enterprise) as the attestation provider
4. Add the site key to your environment variables

## Step 4: Environment Variables

Ensure these are set in your `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

## Step 5: Testing Phone Authentication

### In Development:
1. Use Firebase Auth Emulator for testing without SMS charges
2. Add test phone numbers in Firebase Console:
   - Authentication → Sign-in method → Phone → Phone numbers for testing
   - Example: `+1 555-555-5555` with code `123456`

### In Production:
1. Ensure your domain is whitelisted
2. Phone numbers must be in E.164 format (e.g., `+1234567890`)
3. Monitor Firebase Console for quota limits

## Common Issues and Solutions

### 500 Error Causes:
1. **Wrong reCAPTCHA type**: Using Enterprise instead of standard v3
2. **Domain not whitelisted**: Add domain in Firebase Console
3. **Quota exceeded**: Check Firebase quotas
4. **Missing auth initialization**: Ensure Firebase is properly initialized

### Debugging Steps:

1. **Check Browser Console**:
   ```javascript
   // Should see successful initialization
   console.log('Auth initialized:', auth);
   ```

2. **Verify reCAPTCHA Container**:
   ```javascript
   // Check if container exists
   const container = document.getElementById('recaptcha-container');
   console.log('Container:', container);
   ```

3. **Test with Emulator**:
   ```bash
   firebase emulators:start --only auth
   ```

## Code Implementation Summary

### 1. Updated `usePhoneAuth.ts`:
- Better error handling for specific Firebase auth errors
- Proper reCAPTCHA initialization
- Fallback to confirmation result method
- Clear error messages for users

### 2. Updated `firebase.ts`:
- Proper auth initialization
- Language settings for SMS
- Development/production environment handling

### 3. Hidden reCAPTCHA Badge:
CSS in `layout.tsx` hides the reCAPTCHA badge while maintaining compliance

## Testing Checklist

- [ ] Phone auth enabled in Firebase Console
- [ ] Domain whitelisted
- [ ] Test phone numbers added (for development)
- [ ] Environment variables set correctly
- [ ] No reCAPTCHA Enterprise scripts in HTML
- [ ] Error handling shows user-friendly messages
- [ ] SMS successfully sends to real phone numbers

## Production Considerations

1. **Rate Limiting**: Firebase has SMS quotas
   - Free tier: 10 SMS/day
   - Paid tier: Higher limits

2. **International Numbers**: 
   - Ensure country selector works
   - Test with various country codes

3. **Security Rules**:
   - Implement Firestore rules for phone number uniqueness
   - Add Cloud Functions for additional validation

4. **Monitoring**:
   - Set up Firebase alerts for auth errors
   - Monitor SMS delivery rates

## Need Help?

If you continue to see 500 errors:

1. Check Firebase Console → Authentication → Usage for specific error logs
2. Verify no reCAPTCHA Enterprise code is being used
3. Test with Firebase Auth Emulator first
4. Check browser network tab for detailed error responses

Remember: Firebase Phone Auth uses its own reCAPTCHA implementation. Don't mix it with reCAPTCHA Enterprise.