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

## What was added

- `app/providers.tsx`: wraps the app with `SequenceConnect`, locking wagmi to Monad Testnet and enabling Google social login.
- `lib/chains.ts` & `lib/wagmi.ts`: configure Monad Testnet for viem/wagmi.
- `components/wallet-actions.tsx`: renders the social connect button, shows the connected smart wallet, and exposes a demo NFT mint action.
- `app/page.tsx`: surfaces the wallet actions above the existing story creator experience.
- `package.json`: includes Sequence, wagmi, viem, ethers, and TanStack Query dependencies required by the Sequence Web SDK.
- `.env.example`: documents the environment variables needed for the integration.

With the credential in place, users can authenticate via Google, Sequence provisions their Monad Testnet smart wallet automatically, and you can trigger contract calls (gas sponsorship is handled by Sequence on testnets).
