# Step-by-Step Configuration Guide

This guide will help you configure Google OAuth and Sequence WaaS properly to fix the "AnswerIncorrect" error.

---

## Part 1: Configure Google OAuth (15 minutes)

### Step 1: Go to Google Cloud Console

1. Open your browser and go to: https://console.cloud.google.com/
2. Log in with your Google account
3. Select your project (or create a new one if you haven't)

### Step 2: Enable Google OAuth

1. In the left sidebar, click **"APIs & Services"**
2. Click **"Credentials"**
3. You should see your OAuth 2.0 Client ID: `570178099670-76o6bij33gjaf5r3sgiv8j9higf2i92h`
4. Click on the **pencil icon** (Edit) next to it

### Step 3: Add Authorized JavaScript Origins

In the **"Authorized JavaScript origins"** section, add these URLs:

```
http://localhost:3000
http://localhost:3001
https://sequence.app
https://waas.sequence.app
```

**How to add:**
- Click **"+ ADD URI"** button
- Paste one URL
- Click **"+ ADD URI"** again for the next URL
- Repeat for all URLs above

### Step 4: Add Authorized Redirect URIs

In the **"Authorized redirect URIs"** section, add these URLs:

```
http://localhost:3000
http://localhost:3000/callback
https://sequence.app/oauth/callback
https://waas.sequence.app/oauth/callback
https://api.sequence.app/oauth/callback
https://sequence.build/oauth/callback
```

**How to add:**
- Click **"+ ADD URI"** button
- Paste one URL
- Click **"+ ADD URI"** again for the next URL
- Repeat for all URLs above

### Step 5: Configure OAuth Consent Screen

1. In the left sidebar, click **"OAuth consent screen"**
2. If your app is in **"Testing"** status:
   - Scroll down to **"Test users"** section
   - Click **"+ ADD USERS"**
   - Add your email address (the one you'll use to test)
   - Click **"SAVE"**

3. If you want anyone to be able to use it:
   - Click **"PUBLISH APP"** button at the top
   - Confirm the action

### Step 6: Save Changes

- Click **"SAVE"** button at the bottom
- Wait for "Client ID updated" confirmation

---

## Part 2: Configure Sequence Builder (10 minutes)

### Step 1: Access Sequence Builder

1. Go to: https://sequence.build/
2. Log in with your account
3. You should see your project with ID: **38621**
4. Click on your project to open it

### Step 2: Configure WaaS Settings

1. In the project dashboard, click **"Settings"** in the left sidebar
2. Click on **"WaaS"** or **"Wallet-as-a-Service"** tab

### Step 3: Configure Authentication Methods

You'll see different authentication options. For easier testing, configure like this:

#### Option A: Social Login Only (Recommended for Testing)

**Enable:**
- ✅ **Google** (should already be enabled)

**Disable (for now):**
- ❌ **Email Authentication** - Turn OFF
- ❌ **PIN Requirement** - Turn OFF
- ❌ **Biometric Authentication** - Turn OFF (if present)

This configuration will let users sign in with just Google, without additional challenges.

#### Option B: Email + Google (More Secure)

If you prefer to use email authentication:

**Enable:**
- ✅ **Google**
- ✅ **Email Authentication**

**Configure Email Settings:**
- Make sure your email service is properly configured
- Test that verification emails are being received

**Disable:**
- ❌ **PIN Requirement** - Turn OFF (enable this later after testing)

### Step 4: Add Google OAuth Details

1. Find the **"Social Providers"** or **"OAuth Providers"** section
2. Under **Google**:
   - **Client ID**: `570178099670-76o6bij33gjaf5r3sgiv8j9higf2i92h`
   - Make sure it's marked as **Active/Enabled**

### Step 5: Verify Project Keys

Double-check your keys are correct:

1. Find **"Project Access Key"** section:
   - Should show: `AQAAAAAAAJbd_5JOcE50AqglZCtvu51YlGI`
   
2. Find **"WaaS Config Key"** section:
   - Should show: `eyJwcm9qZWN0SWQiOjM4NjIxLCJycGNTZXJ2ZXIiOiJodHRwczovL3dhYXMuc2VxdWVuY2UuYXBwIn0=`

### Step 6: Configure Redirect URLs (if available)

If there's a section for **"Redirect URLs"** or **"Allowed Origins"**:

Add these URLs:
```
http://localhost:3000
http://localhost:3001
https://sequence.app
```

### Step 7: Save Changes

- Click **"Save"** or **"Update"** button
- Wait for confirmation

---

## Part 3: Test the Configuration (5 minutes)

### Step 1: Clear Browser Data

1. Open your browser
2. Press **F12** to open Developer Tools
3. Go to **"Application"** tab (Chrome) or **"Storage"** tab (Firefox)
4. In the left sidebar:
   - Click **"Local Storage"** → `http://localhost:3000` → Right-click → Clear
   - Click **"Session Storage"** → `http://localhost:3000` → Right-click → Clear
   - Click **"Cookies"** → `http://localhost:3000` → Right-click → Clear all

**OR** use an **Incognito/Private** window for testing

### Step 2: Restart Your Dev Server

```bash
cd frontend
rm -rf .next
pnpm dev
```

### Step 3: Test the Connection

1. Open http://localhost:3000 in your browser
2. Click **"Google ile giriş yap"** (Sign in with Google)
3. The Google OAuth popup should appear
4. Select your Google account
5. Grant permissions
6. You should be connected!

---

## Troubleshooting Common Issues

### Issue: "Access blocked: This app's request is invalid"

**Solution:**
- Go back to Google Cloud Console → OAuth consent screen
- Make sure your email is added to **Test users**
- OR publish the app

### Issue: "Redirect URI mismatch"

**Solution:**
- The error message will show you the exact redirect URI that was used
- Copy that URI and add it to Google Cloud Console → Credentials → Authorized redirect URIs
- Save and try again

### Issue: Still getting "AnswerIncorrect" error

**Try these in order:**

1. **Clear ALL browser data:**
   ```
   - Settings → Privacy → Clear browsing data
   - Select "All time"
   - Check all boxes
   - Clear data
   ```

2. **Revoke access to your Google account:**
   - Go to https://myaccount.google.com/permissions
   - Find your app
   - Click "Remove Access"
   - Try connecting again

3. **Try a different Google account:**
   - Use a different email address
   - If this works, the first account may have stale data

4. **Wait 5-10 minutes:**
   - Google OAuth changes can take a few minutes to propagate
   - Sequence Builder changes are usually instant

5. **Check browser console:**
   - Press F12 → Console tab
   - Look for detailed error messages
   - Share them if you need more help

### Issue: Google OAuth popup is blocked

**Solution:**
- Allow popups for localhost:3000 in your browser
- Chrome: Click the blocked popup icon in address bar → Allow
- Try again

---

## Verification Checklist

Before testing, verify:

### Google Cloud Console
- [ ] OAuth 2.0 Client ID exists
- [ ] Authorized JavaScript origins include `http://localhost:3000`
- [ ] Authorized redirect URIs include at least 5-6 URIs (see Step 4 above)
- [ ] Your email is added to Test users (if app is in Testing status)

### Sequence Builder
- [ ] Project ID is 38621
- [ ] Google OAuth provider is enabled
- [ ] Google Client ID is set correctly
- [ ] PIN requirement is disabled (for testing)
- [ ] Keys match what's in your .env.local file

### Your Application
- [ ] .env.local has all three keys (no quotes!)
- [ ] Dev server is running (`pnpm dev`)
- [ ] Browser local storage is cleared
- [ ] Using http://localhost:3000 (not https)

---

## Quick Reference: All URLs to Add

### In Google Cloud Console → Authorized JavaScript Origins:
```
http://localhost:3000
http://localhost:3001
https://sequence.app
https://waas.sequence.app
```

### In Google Cloud Console → Authorized Redirect URIs:
```
http://localhost:3000
http://localhost:3000/callback
https://sequence.app/oauth/callback
https://waas.sequence.app/oauth/callback
https://api.sequence.app/oauth/callback
https://sequence.build/oauth/callback
```

---

## Still Need Help?

1. **Check the detailed troubleshooting guide:** `SEQUENCE_TROUBLESHOOTING.md`

2. **Enable debug mode:**
   - Open browser DevTools (F12) → Console
   - Look for messages starting with "🔍" or "✅" or "❌"
   - Share these logs if asking for help

3. **Contact Sequence Support:**
   - Discord: https://discord.gg/sequence
   - Documentation: https://docs.sequence.xyz
   - Include your Project ID: **38621**

4. **Test with official example:**
   ```bash
   git clone https://github.com/0xsequence/demo-waas-auth
   cd demo-waas-auth
   # Copy your .env values
   npm install && npm run dev
   ```
   If the official example works but your app doesn't, there may be a configuration difference.

---

## Summary

The key points:
1. ✅ Add all redirect URIs to Google Cloud Console
2. ✅ Disable PIN requirement in Sequence Builder (for testing)
3. ✅ Clear browser local storage before testing
4. ✅ Use incognito window for clean test

Good luck! 🚀
