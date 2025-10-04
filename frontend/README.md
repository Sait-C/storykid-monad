# Storykid Frontend

This Next.js frontend now bundles Sequence Embedded Wallet so families can sign in with Google and receive a ready-to-use smart wallet on Monad Testnet. Once authenticated, the sample action can mint an NFT (or invoke any contract) through the gas-sponsored Sequence account abstraction flow.

## Prerequisites

- Sequence Builder project with your **Project Access Key** and **WaaS Config Key**.
- Google OAuth client ID registered in Sequence Builder.
- Optional: an ERC-721 contract deployed on Monad Testnet if you want the demo mint button to succeed.

## Setup

1. Copy `.env.example` to `.env.local` and fill in the required keys:

   ```bash
   cp .env.example .env.local
   ```

   | Variable | Description |
   | --- | --- |
   | `NEXT_PUBLIC_SEQUENCE_PROJECT_ACCESS_KEY` | Project access key from Sequence Builder |
   | `NEXT_PUBLIC_SEQUENCE_WAAS_CONFIG_KEY` | WaaS config key from Sequence Builder |
   | `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth client ID registered with Sequence |
   | `NEXT_PUBLIC_MONAD_NFT_CONTRACT` | *(Optional)* ERC-721 contract on Monad Testnet used by the demo mint button |

2. Install dependencies and start the dev server:

   ```bash
   pnpm install
   pnpm dev
   ```

   The app expects to run on `http://localhost:3000`. Ensure your Google config includes this origin.

## Troubleshooting

### 🚀 Quick Start Guides

- **⚡ Need a quick fix?** → [QUICK_FIX.md](./QUICK_FIX.md) (5 minutes)
- **📖 Step-by-step setup?** → [CONFIGURATION_GUIDE.md](./CONFIGURATION_GUIDE.md) (30 minutes)
- **🔧 Detailed troubleshooting?** → [SEQUENCE_TROUBLESHOOTING.md](./SEQUENCE_TROUBLESHOOTING.md)

---

## Common Errors

### "WebrpcEndpoint: endpoint error" when connecting wallet

This error occurs when the Sequence WaaS API keys are invalid or misconfigured. To fix:

1. **Verify your API keys** in [Sequence Builder](https://sequence.build/):
   - Go to your project settings
   - Copy the **Project Access Key** and **WaaS Config Key**
   - Make sure you're using keys from the correct environment (testnet/mainnet)

2. **Check Google OAuth configuration**:
   - The Google Client ID must be registered in Sequence Builder
   - Authorized redirect URIs must include `http://localhost:3000`
   - The OAuth consent screen must be properly configured

3. **Regenerate keys if needed**:
   - If your keys are old or invalid, regenerate them in Sequence Builder
   - Update your `.env.local` file with the new keys
   - Restart the dev server

4. **Test without Google OAuth first**:
   - Temporarily remove `NEXT_PUBLIC_GOOGLE_CLIENT_ID` from `.env.local`
   - Restart the dev server
   - If this works, the issue is with Google OAuth configuration

### "AnswerIncorrect: The provided answer is incorrect"

This error occurs during the WaaS authentication challenge. This is a **configuration issue in Sequence Builder**.

**👉 See [SEQUENCE_TROUBLESHOOTING.md](./SEQUENCE_TROUBLESHOOTING.md) for detailed solutions.**

**Quick Fix:**
1. Clear browser local storage and cookies for `localhost:3000`
2. Go to [Sequence Builder](https://sequence.build/) → Your Project → Settings → WaaS Configuration
3. Temporarily **disable PIN authentication** for testing
4. Ensure Google OAuth redirect URIs include:
   - `http://localhost:3000`
   - `https://waas.sequence.app`
   - `https://api.sequence.app`
5. Try connecting again in an incognito window

Common causes:
- PIN authentication is enabled but user hasn't set a PIN
- Google OAuth redirect URIs are incomplete
- Email verification flow is failing
- Stale session data in browser

**Still stuck?** Check the comprehensive guide in [SEQUENCE_TROUBLESHOOTING.md](./SEQUENCE_TROUBLESHOOTING.md)

### Environment Variable Format

⚠️ **Important:** Do NOT use quotes in `.env.local`:

```bash
# ✅ CORRECT
NEXT_PUBLIC_SEQUENCE_PROJECT_ACCESS_KEY=AQAAAAAAAJbd_5JOcE50AqglZCtvu51YlGI

# ❌ WRONG (will cause errors)
NEXT_PUBLIC_SEQUENCE_PROJECT_ACCESS_KEY='AQAAAAAAAJbd_5JOcE50AqglZCtvu51YlGI'
```

For more help, see the [Sequence documentation](https://docs.sequence.xyz/)

## What was added

- `app/providers.tsx`: wraps the app with `SequenceConnect`, locking wagmi to Monad Testnet and enabling Google social login.
- `lib/chains.ts` & `lib/wagmi.ts`: configure Monad Testnet for viem/wagmi.
- `components/wallet-actions.tsx`: renders the social connect button, shows the connected smart wallet, and exposes a demo NFT mint action.
- `app/page.tsx`: surfaces the wallet actions above the existing story creator experience.
- `package.json`: includes Sequence, wagmi, viem, ethers, and TanStack Query dependencies required by the Sequence Web SDK.
- `.env.example`: documents the environment variables needed for the integration.

With the credential in place, users can authenticate via Google, Sequence provisions their Monad Testnet smart wallet automatically, and you can trigger contract calls (gas sponsorship is handled by Sequence on testnets).
