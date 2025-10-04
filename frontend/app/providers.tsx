"use client"

import type { ReactNode } from "react"
import { useMemo } from "react"
import { SequenceConnect, createConfig as createSequenceConfig } from "@0xsequence/connect"

export default function Providers({ children }: { children: ReactNode }) {
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
