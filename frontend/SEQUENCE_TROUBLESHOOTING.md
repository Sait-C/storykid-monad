# Sequence WaaS Troubleshooting Guide

## "AnswerIncorrect: The provided answer is incorrect" Error

This error occurs during the WaaS authentication challenge when registering a new session. This is a **configuration issue in Sequence Builder**, not in the application code.

### Root Cause

The error happens in one of these scenarios:

1. **Email Authentication is enabled** but the email verification flow fails
2. **PIN Authentication is required** but not being provided correctly
3. **Account recovery challenge** is being triggered unexpectedly
4. **Google OAuth token** is invalid or not properly configured

### Solution Steps

#### Step 1: Check Your WaaS Configuration in Sequence Builder

1. Go to [Sequence Builder](https://sequence.build/)
2. Navigate to your project (Project ID: **38621** based on your WaaS config key)
3. Go to **Settings** → **WaaS Configuration**

#### Step 2: Verify Authentication Settings

Check which authentication method is enabled:

**Option A: Email Authentication (Recommended for Development)**
- ✅ Enable "Email Authentication"
- ✅ Make sure email verification emails are being sent
- ✅ Check spam folder if not receiving verification emails
- ⚠️  Disable "PIN Requirement" for initial testing

**Option B: Social-Only Authentication (Easiest)**
- ✅ Disable "Email Authentication"
- ✅ Disable "PIN Requirement"
- ✅ Only enable "Social Login" (Google)
- This avoids challenge flows during registration

#### Step 3: Configure Google OAuth Properly

1. In Sequence Builder → Settings → Social Login:
   - Add Google as a provider
   - Use your Google Client ID: `570178099670-76o6bij33gjaf5r3sgiv8j9higf2i92h.apps.googleusercontent.com`
   
2. In Google Cloud Console:
   - Go to APIs & Services → Credentials
   - Edit your OAuth 2.0 Client ID
   - Add Authorized JavaScript origins:
     - `http://localhost:3000`
   - Add Authorized redirect URIs:
     - `http://localhost:3000`
     - `https://waas.sequence.app` (for Sequence's OAuth handler)
     - `https://api.sequence.app` (for Sequence's OAuth handler)

3. Check OAuth Consent Screen:
   - Ensure the consent screen is properly configured
   - Add test users if app is in "Testing" status
   - Make sure your email is in the test users list

#### Step 4: Clear Session and Try Again

```bash
# 1. Clear browser local storage
# - Open DevTools (F12)
# - Go to Application → Local Storage
# - Delete all localhost:3000 entries

# 2. Clear browser cookies for localhost:3000

# 3. Restart your dev server
cd frontend
rm -rf .next
pnpm dev
```

#### Step 5: Test with Different Account

Sometimes the issue is with a specific Google account:

1. Try signing in with a different Google account
2. Use an Incognito/Private window to test
3. If one account works but another doesn't, the failing account may have:
   - Incomplete verification in Sequence
   - Old session data that needs to be cleared

### Alternative: Use Email-Only Authentication

If Google OAuth continues to fail, you can configure email-only authentication:

1. In Sequence Builder → Settings → WaaS Configuration:
   - Enable "Email Authentication"
   - Disable "Google OAuth" temporarily
   - This will send a verification code to the user's email

2. Update your `.env.local`:
   ```bash
   NEXT_PUBLIC_SEQUENCE_PROJECT_ACCESS_KEY=AQAAAAAAAJbd_5JOcE50AqglZCtvu51YlGI
   NEXT_PUBLIC_SEQUENCE_WAAS_CONFIG_KEY=eyJwcm9qZWN0SWQiOjM4NjIxLCJycGNTZXJ2ZXIiOiJodHRwczovL3dhYXMuc2VxdWVuY2UuYXBwIn0=
   # Remove or comment out Google Client ID
   # NEXT_PUBLIC_GOOGLE_CLIENT_ID=
   ```

3. Restart the dev server

### Debug Checklist

- [ ] WaaS Config Key is valid (Project ID: 38621)
- [ ] Project Access Key matches the project
- [ ] Google OAuth consent screen is configured
- [ ] Redirect URIs include `http://localhost:3000`
- [ ] Browser local storage is cleared
- [ ] Using a fresh browser session (incognito)
- [ ] Email domain is not blocked by spam filters
- [ ] Google account has access (if using test mode)

### Still Having Issues?

1. **Check Sequence Status**: Visit [status.sequence.xyz](https://status.sequence.xyz) to see if there are any service issues

2. **Enable Debug Logs**: Open browser DevTools (F12) → Console to see detailed error messages

3. **Contact Sequence Support**: 
   - Discord: [discord.gg/sequence](https://discord.gg/sequence)
   - Docs: [docs.sequence.xyz](https://docs.sequence.xyz)
   - Include your Project ID (38621) when asking for help

4. **Try the Official Example**: Test with Sequence's official example to rule out configuration issues:
   ```bash
   git clone https://github.com/0xsequence/demo-waas-auth
   cd demo-waas-auth
   # Use your API keys in .env
   npm install && npm run dev
   ```

### Common Fixes That Work

✅ **Most Common Fix**: Clear all browser data for localhost:3000 and try again
✅ **Second Most Common**: Add all required redirect URIs in Google OAuth settings
✅ **Third Most Common**: Disable PIN authentication in Sequence Builder for testing
