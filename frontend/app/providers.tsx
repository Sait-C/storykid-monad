"use client"

import type { ReactNode } from "react"
import { useEffect, useMemo } from "react"
import { SequenceConnect, createConfig as createSequenceConfig } from "@0xsequence/connect"

const DIALOG_WARNING_SNIPPET = "`DialogContent` requires a `DialogTitle`"

export default function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined") return

    const originalError = console.error
    console.error = (...args) => {
      // Suppress the DialogContent warning
      if (typeof args[0] === "string" && args[0].includes(DIALOG_WARNING_SNIPPET)) {
        return
      }
      
      // Enhanced error logging for AnswerIncorrect
      if (typeof args[0] === "string" && args[0].includes("AnswerIncorrect")) {
        console.group("🔴 Sequence Authentication Error")
        originalError(...args)
        console.error("\n📖 This is a configuration issue in Sequence Builder.")
        console.error("📖 Please check SEQUENCE_TROUBLESHOOTING.md for solutions.")
        console.error("\nQuick fixes:")
        console.error("1. Clear browser local storage and cookies")
        console.error("2. Check Sequence Builder → WaaS Configuration")
        console.error("3. Verify Google OAuth redirect URIs")
        console.error("4. Try with a different Google account")
        console.groupEnd()
        return
      }
      
      originalError(...args)
    }

    return () => {
      console.error = originalError
    }
  }, [])

  const projectAccessKey = process.env.NEXT_PUBLIC_SEQUENCE_PROJECT_ACCESS_KEY
  const waasConfigKey = process.env.NEXT_PUBLIC_SEQUENCE_WAAS_CONFIG_KEY
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

  const sequenceConfig = useMemo(() => {
    if (!projectAccessKey || !waasConfigKey) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          "⚠️  Sequence API keys missing. The wallet connect feature will be disabled.",
        )
        console.warn(
          "To enable social login:",
        )
        console.warn(
          "1. Get your keys from https://sequence.build/",
        )
        console.warn(
          "2. Add them to .env.local:",
        )
        console.warn(
          "   NEXT_PUBLIC_SEQUENCE_PROJECT_ACCESS_KEY=your_key",
        )
        console.warn(
          "   NEXT_PUBLIC_SEQUENCE_WAAS_CONFIG_KEY=your_key",
        )
        console.warn(
          "   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id",
        )
      }
      return null
    }

    try {
      // Decode and verify WaaS config
      if (process.env.NODE_ENV !== "production") {
        try {
          const decoded = atob(waasConfigKey)
          const config = JSON.parse(decoded)
          console.log("📋 WaaS Config - Project ID:", config.projectId)
          console.log("📋 WaaS Config - RPC Server:", config.rpcServer)
        } catch {
          console.warn("⚠️  Could not decode WaaS config key")
        }
      }

      const config = createSequenceConfig("waas", {
        projectAccessKey,
        waasConfigKey,
        chainIds: [10143],
        defaultChainId: 10143,
        signIn: {
          projectName: "Storykid",
        },
        enableConfirmationModal: false,
        ...(googleClientId && {
          google: {
            clientId: googleClientId,
          },
        }),
      })
      
      console.log("✅ Sequence WaaS configuration created successfully")
      return config
    } catch (error) {
      console.error("❌ Failed to create Sequence config:", error)
      console.error(
        "Please verify your API keys in .env.local are valid and from https://sequence.build/"
      )
      return null
    }
  }, [googleClientId, projectAccessKey, waasConfigKey])

  if (!sequenceConfig) {
    return <>{children}</>
  }

  return <SequenceConnect config={sequenceConfig}>{children}</SequenceConnect>
}
