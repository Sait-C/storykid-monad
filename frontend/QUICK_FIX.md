# ⚡ Quick Fix Guide - 5 Minutes

If you just want to fix the "AnswerIncorrect" error quickly, follow these exact steps:

## 🔧 Fix in 5 Steps

### 1️⃣ Google Cloud Console (2 min)

**Go to:** https://console.cloud.google.com/apis/credentials

**Find your OAuth 2.0 Client:** `570178099670-76o6bij33gjaf5r3sgiv8j9higf2i92h`

**Click Edit (pencil icon)**

**Add these 6 Redirect URIs** (click + ADD URI for each):
```
http://localhost:3000
http://localhost:3000/callback
https://sequence.app/oauth/callback
https://waas.sequence.app/oauth/callback
https://api.sequence.app/oauth/callback
https://sequence.build/oauth/callback
```

**Click SAVE**

---

### 2️⃣ Sequence Builder (2 min)

**Go to:** https://sequence.build/

**Click your project (ID: 38621)**

**Go to Settings → WaaS**

**Find "PIN Requirement" or "PIN Authentication"**

**Turn it OFF** (toggle/checkbox/switch)

**Click SAVE**

---

### 3️⃣ Clear Browser (30 sec)

**Open DevTools:** Press `F12`

**Click Application tab** (or Storage in Firefox)

**Clear everything for localhost:3000:**
- Right-click **Local Storage** → localhost:3000 → Clear
- Right-click **Session Storage** → localhost:3000 → Clear  
- Right-click **Cookies** → localhost:3000 → Delete all

**OR** just open an **Incognito window** (Ctrl+Shift+N / Cmd+Shift+N)

---

### 4️⃣ Restart Dev Server (30 sec)

```bash
# Stop the server (Ctrl+C)
cd frontend
rm -rf .next
pnpm dev
```

---

### 5️⃣ Test (1 min)

1. Go to http://localhost:3000
2. Click **"Google ile giriş yap"**
3. Choose your Google account
4. Grant permissions
5. ✅ Done!

---

## 🚨 Still Getting Error?

### If "Redirect URI mismatch":
The error will show the exact URI. Copy it and add it to Google Cloud Console → Credentials → Authorized redirect URIs

### If "Access blocked":
Go to Google Cloud Console → OAuth consent screen → Add your email to Test users

### If "AnswerIncorrect" still appears:
1. Try a different Google account
2. Wait 5 minutes (OAuth changes need time to propagate)
3. Revoke app access: https://myaccount.google.com/permissions
4. Read the full guide: `CONFIGURATION_GUIDE.md`

---

## 📋 Checklist

- [ ] Added 6 redirect URIs to Google Cloud Console
- [ ] Saved changes in Google Cloud Console
- [ ] Disabled PIN requirement in Sequence Builder
- [ ] Saved changes in Sequence Builder
- [ ] Cleared browser local storage/cookies
- [ ] Restarted dev server
- [ ] Using http://localhost:3000 (not https)
- [ ] Tested in incognito window

---

## 💡 Pro Tips

- **Use Incognito** - Cleanest way to test without clearing data
- **Check Console** - Press F12 to see helpful error messages
- **Wait 5 min** - OAuth changes can take time to propagate
- **Different account** - Try another Google account if one fails

---

## 📚 More Help

- **Detailed guide:** `CONFIGURATION_GUIDE.md`
- **Troubleshooting:** `SEQUENCE_TROUBLESHOOTING.md`
- **Sequence Discord:** https://discord.gg/sequence
- **Project ID:** 38621 (mention this when asking for help)
