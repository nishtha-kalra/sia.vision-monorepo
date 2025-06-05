# Security Guide for Sia.vision

This document outlines the security measures implemented and best practices for maintaining the security of the Sia.vision contact form system.

## 🔒 Security Measures Implemented

### 1. **API Key Security**
- ✅ SendGrid API key stored in Firebase Functions configuration (not in code)
- ✅ API key never exposed in client-side code
- ✅ Environment variables properly excluded from git
- ⚠️ **Action Required**: Regenerate SendGrid API key (current one was exposed)

### 2. **Code Security**
- ✅ Sensitive files added to `.gitignore`
- ✅ Functions and hosting properly separated
- ✅ Input validation implemented
- ✅ CORS properly configured
- ✅ Rate limiting implemented (2 requests per IP per 5 minutes)

### 3. **Infrastructure Security**
- ✅ Firestore rules restrict direct client access
- ✅ Functions run with minimal required permissions
- ✅ Security headers implemented
- ✅ Error handling prevents information leakage

### 4. **Data Protection**
- ✅ Personal data (IP addresses) collected with purpose
- ✅ Email validation prevents injection
- ✅ Metadata collection documented for compliance
- ✅ Data retention policies recommended

## 🛡️ Security Headers Implemented

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

## 🚨 Immediate Action Items

### 1. **Regenerate SendGrid API Key**
```bash
# 1. Go to SendGrid → Settings → API Keys
# 2. Delete current key: SG.0Wd17HAZSwCKYO8KnYb9Wg...
# 3. Create new key with "Mail Send" permissions only
# 4. Update Firebase config:
firebase functions:config:set sendgrid.api_key="NEW_SECURE_KEY"
# 5. Redeploy functions:
firebase deploy --only functions
```

### 2. **Verify SendGrid Sender Authentication**
```bash
# Ensure connect@sia.vision is verified in SendGrid
# Go to: Settings → Sender Authentication → Single Sender Verification
```

### 3. **Review Privacy Policy**
- Update privacy policy to include metadata collection
- Mention IP address collection for security purposes
- Include data retention policies

## 🔍 Security Monitoring

### Function Logs
```bash
# Monitor for suspicious activity
firebase functions:log

# Check specific function
firebase functions:log --only submitContactForm
```

### Rate Limiting Alerts
Monitor logs for `429` responses indicating potential abuse:
```
"Too many requests. Please wait before submitting again."
```

### Firestore Security
```javascript
// Current rules in firestore.rules
match /enquiries/{document} {
  allow read, write: if false; // Only functions can access
}
```

## 📊 Data Security & Privacy

### What Data is Collected
- **Form Data**: Name, email, inquiry type, message
- **Metadata**: IP address, user agent, referrer, language
- **Timestamps**: Submission time, processing status

### Data Access
- **Admin Access**: Via Firebase Console (authenticated)
- **Function Access**: Automated processing only
- **Client Access**: None (functions-only)

### Data Retention
- **Recommendation**: Implement automatic cleanup after 2 years
- **Legal Requirement**: Check local data protection laws
- **User Rights**: Provide deletion mechanism if required

## 🔧 Additional Security Enhancements

### 1. **Enhanced Rate Limiting** (Future)
Consider implementing:
- Per-session limits
- CAPTCHA for repeated submissions
- Geographic rate limiting

### 2. **Email Security** (Current)
- SendGrid handles SPF/DKIM authentication
- Sender reputation managed by SendGrid
- No email parsing (prevents injection)

### 3. **Input Sanitization** (Current)
```typescript
// All inputs are trimmed and validated
name: name.trim(),
email: email.trim().toLowerCase(),
message: message.trim(),
```

### 4. **Error Handling** (Current)
```typescript
// Errors don't expose system details
return res.status(500).json({
  error: "Internal server error",
  details: process.env.NODE_ENV === "development" ? error : undefined,
});
```

## 🚫 What's NOT Exposed

### Client-Side
- ❌ No API keys in frontend code
- ❌ No direct database access
- ❌ No internal system details
- ❌ No function implementation details

### Public Endpoints
- ❌ No admin endpoints exposed
- ❌ No debugging information in production
- ❌ No stack traces in errors
- ❌ No internal configuration exposed

## ✅ Security Checklist

### Setup Security
- [ ] SendGrid API key regenerated
- [ ] Sender email verified in SendGrid
- [ ] Firebase project properly configured
- [ ] Firestore rules tested
- [ ] Functions deployed successfully

### Code Security
- [ ] All sensitive files in `.gitignore`
- [ ] No hardcoded secrets in code
- [ ] Input validation implemented
- [ ] Rate limiting active
- [ ] Error handling secure

### Operational Security
- [ ] Monitoring set up for function logs
- [ ] Privacy policy updated
- [ ] Data retention policy defined
- [ ] Access controls reviewed
- [ ] Security headers deployed

### Ongoing Security
- [ ] Regular log review scheduled
- [ ] API key rotation planned
- [ ] Dependency updates scheduled
- [ ] Security audit planned
- [ ] Incident response plan created

## 🆘 Security Incident Response

### If API Key is Compromised
1. Immediately revoke the key in SendGrid
2. Generate new key with minimal permissions
3. Update Firebase configuration
4. Redeploy functions
5. Monitor for unauthorized usage

### If Unusual Activity Detected
1. Check function logs for patterns
2. Review Firestore for suspicious entries
3. Consider temporary rate limit reduction
4. Block IPs if necessary (via hosting rules)

### If Data Breach Suspected
1. Investigate scope of breach
2. Preserve logs and evidence
3. Notify relevant authorities if required
4. Implement additional security measures
5. Update incident response procedures

## 📞 Security Contacts

- **Firebase Support**: Firebase Console → Support
- **SendGrid Support**: SendGrid Dashboard → Support
- **Security Issues**: Document in project issues with "security" label

## 📚 Additional Resources

- [Firebase Security Documentation](https://firebase.google.com/docs/rules)
- [SendGrid Security Best Practices](https://docs.sendgrid.com/for-developers/sending-email/authentication)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Web Security Headers](https://securityheaders.com/)

---

**Last Updated**: December 2024  
**Review Schedule**: Quarterly  
**Next Review**: March 2025 