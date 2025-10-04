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
      if (typeof args[0] === "string" && args[0].includes(DIALOG_WARNING_SNIPPET)) {
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
          "Sequence projectAccessKey or waasConfigKey missing. Add them to .env.local to enable social login.",
        )
      }
      return null
    }

    return createSequenceConfig("waas", {
      projectAccessKey,
      waasConfigKey,
      chainIds: [10143],
      defaultChainId: 10143,
      signIn: {
        projectName: "Storykid",
      },
      ...(googleClientId && {
        google: {
          clientId: googleClientId,
        },
      }),
    })
  }, [googleClientId, projectAccessKey, waasConfigKey])

  if (!sequenceConfig) {
    return <>{children}</>
  }

  return <SequenceConnect config={sequenceConfig}>{children}</SequenceConnect>
}
