# Firebase Contact Form Setup Guide

This guide will help you set up the complete Firebase integration for the Sia.vision contact form system.

## Architecture Overview

```
[React Website] 
    ↓ (User clicks submit)
[HTTP Firebase Function: Writes to Firestore] 
    ↓ 
[Firestore Database] 
    ↓ (New document triggers)
[Firestore Triggered Firebase Function: Sends Email via SendGrid] 
    ↓ 
[Email to User & Admin]
```

## Prerequisites

1. **Firebase Project**: Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. **SendGrid Account**: Sign up at [SendGrid](https://sendgrid.com/) for email service
3. **Node.js**: Ensure you have Node.js 18+ installed
4. **Firebase CLI**: Install globally with `npm install -g firebase-tools`

## Setup Instructions

### 1. Firebase Project Configuration

#### Enable Required Services
1. **Firestore Database**:
   - Go to Firebase Console → Firestore Database
   - Click "Create database"
   - Choose "Start in test mode" (or production mode with proper rules)
   - Select a location close to your users

2. **Cloud Functions**:
   - Go to Firebase Console → Functions
   - Functions will be enabled automatically when you deploy

#### Get Firebase Configuration
1. Go to Project Settings → General → Your apps
2. Add a web app if you haven't already
3. Copy the Firebase configuration object

### 2. Environment Variables Setup

#### Frontend (.env.local)
Create `sia-modern/.env.local`:
```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

#### Update Contact Form URL
In `src/components/contact-form/ContactFormSection.tsx`, update line 42:
```typescript
const functionUrl = process.env.NODE_ENV === 'production'
  ? `https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/submitContactForm`
  : 'http://localhost:5001/YOUR_PROJECT_ID/us-central1/submitContactForm';
```
Replace `YOUR_PROJECT_ID` with your actual Firebase project ID.

### 3. SendGrid Configuration

#### Setup SendGrid
1. Create a SendGrid account and verify your identity
2. Create an API key:
   - Go to Settings → API Keys
   - Create API Key with "Full Access"
   - Copy the API key (you won't see it again!)

3. **Verify Sender Identity**:
   - Go to Settings → Sender Authentication
   - Verify your domain OR single sender email
   - Use the verified email as the "from" address in functions

#### Set SendGrid API Key in Firebase
```bash
# Navigate to functions directory
cd functions

# Set the SendGrid API key
firebase functions:config:set sendgrid.api_key="YOUR_SENDGRID_API_KEY"
```

### 4. Functions Deployment

#### Install Dependencies
```bash
cd functions
npm install
```

#### Build and Deploy
```bash
# Build the functions
npm run build

# Deploy functions only
firebase deploy --only functions

# Or deploy everything (hosting + functions)
firebase deploy
```

### 5. Firestore Security Rules

Update `firestore.rules`:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow admin access to enquiries
    match /enquiries/{document} {
      allow read, write: if false; // Only functions can write
    }
    
    // Deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### 6. Testing

#### Local Development
```bash
# Terminal 1: Start Firebase emulators
cd sia-modern
firebase emulators:start

# Terminal 2: Start Next.js dev server
npm run dev
```

#### Production Testing
1. Deploy functions: `firebase deploy --only functions`
2. Test the contact form on your live site
3. Check Firebase Console → Functions → Logs for any errors
4. Verify emails are being sent through SendGrid

## File Structure

```
sia-modern/
├── functions/
│   ├── src/
│   │   ├── index.ts          # Main functions file
│   │   └── analytics.ts      # Analytics helper functions
│   ├── package.json          # Functions dependencies
│   └── tsconfig.json         # TypeScript config
├── src/
│   ├── lib/
│   │   └── firebase.ts       # Firebase client config
│   └── components/
│       └── contact-form/
│           └── ContactFormSection.tsx
├── .env.local                # Environment variables (create this)
├── firebase.json             # Firebase configuration
└── firestore.rules           # Database security rules
```

## Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Functions include CORS handling
   - Ensure your domain is not blocked

2. **SendGrid Errors**:
   - Verify your sender email in SendGrid
   - Check API key has correct permissions
   - Review SendGrid logs for blocked emails

3. **Function Timeout**:
   - Default timeout is 60s, should be sufficient
   - Check function logs for performance issues

4. **Environment Variables Not Loading**:
   - Ensure `.env.local` is in the project root
   - Restart your development server
   - Check variable names have `NEXT_PUBLIC_` prefix

### Debugging

#### View Function Logs
```bash
# View all function logs
firebase functions:log

# View logs for specific function
firebase functions:log --only submitContactForm
```

#### Test Functions Locally
```bash
# Start emulators
firebase emulators:start

# Test with curl
curl -X POST http://localhost:5001/YOUR_PROJECT_ID/us-central1/submitContactForm \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "inquiryType": "general",
    "message": "Test message"
  }'
```

## Database Schema

### Enquiries Collection
```typescript
interface EnquiryData {
  name: string;           // User's name
  email: string;          // User's email
  inquiryType: string;    // Type of enquiry
  message: string;        // User's message
  timestamp: Timestamp;   // When submitted
  status: string;         // 'new' | 'email_sent' | 'email_failed'
  metadata?: {            // Request metadata for analytics/security
    ipAddress?: string;     // User's IP address
    userAgent?: string;     // Browser/device information
    referrer?: string;      // Referring page
    origin?: string;        // Request origin
    acceptLanguage?: string; // User's language preferences
    country?: string;       // Geographic location (future enhancement)
    region?: string;        // Geographic region (future enhancement)
    city?: string;          // Geographic city (future enhancement)
  };
}
```

## Security Considerations

1. **Firestore Rules**: Only allow functions to write to enquiries
2. **API Rate Limiting**: Consider implementing rate limiting
3. **Input Validation**: Functions validate all input data
4. **Email Verification**: SendGrid handles email deliverability
5. **Environment Variables**: Never commit sensitive data to git

## Privacy & Metadata Collection

The system automatically collects metadata for security and analytics purposes:

### Data Collected
- **IP Address**: For security monitoring and geographic insights
- **User Agent**: Browser/device information for compatibility tracking
- **Referrer**: Source page for marketing attribution
- **Language**: User's browser language preferences
- **Timestamp**: When the enquiry was submitted

### Privacy Compliance
- Ensure you have proper privacy policy covering data collection
- Consider GDPR compliance if serving EU users
- IP addresses are considered personal data in many jurisdictions
- Provide opt-out mechanisms if required by local laws

### Data Retention
- Review and purge old enquiry data periodically
- Consider implementing automated data retention policies
- Document data handling procedures for compliance

## Production Checklist

- [ ] Firebase project created and configured
- [ ] SendGrid account set up and sender verified
- [ ] Environment variables configured
- [ ] Functions deployed successfully
- [ ] Firestore rules updated
- [ ] Contact form tested end-to-end
- [ ] Email delivery confirmed
- [ ] Error monitoring set up
- [ ] Privacy policy updated to cover metadata collection
- [ ] Analytics functions reviewed for compliance

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Firebase Console logs
3. Verify all environment variables are set correctly
4. Test with Firebase emulators first 