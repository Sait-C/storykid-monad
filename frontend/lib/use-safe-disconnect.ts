"use client"

import { useCallback } from "react"
import type { Connector } from "wagmi"
import { useConfig } from "wagmi"

type DisconnectOptions = {
  connector?: Connector
}

type StorageLike = {
  removeItem?: (key: string) => unknown
  setItem?: (key: string, value: string) => unknown
} | null | undefined

const WAAS_ACTIVE_LOGIN_TYPE_KEY = "@kit.waasActiveLoginType"
const WAAS_SIGN_IN_EMAIL_KEY = "@kit.waasSignInEmail"

function isWaasConnector(connector: Connector) {
  return connector.id.includes("waas") || connector.type === "sequence-waas"
}

function isSequenceConnector(connector: Connector) {
  return connector.id === "sequence" || connector.type === "sequence"
}

async function cleanupSequenceWaas(connector: Connector, storage: StorageLike) {
  try {
    if (typeof connector.getProvider === "function") {
      const provider = await connector.getProvider()
      const waas = (provider as { sequenceWaas?: { getSessionId?: () => Promise<string | undefined>; dropSession?: (args: { sessionId?: string; strict: boolean }) => Promise<void> } }).sequenceWaas
      if (waas?.dropSession) {
        try {
          const sessionId = (await waas.getSessionId?.()) || undefined
          await waas.dropSession({ sessionId, strict: false })
        } catch (error) {
          console.warn("Sequence WaaS dropSession failed", error)
        }
      }
    }
  } catch (error) {
    console.warn("Sequence WaaS provider cleanup failed", error)
  }

  try {
    await storage?.removeItem?.(WAAS_ACTIVE_LOGIN_TYPE_KEY)
    await storage?.removeItem?.(WAAS_SIGN_IN_EMAIL_KEY)
  } catch (error) {
    console.warn("Sequence WaaS storage cleanup failed", error)
  }
}

async function cleanupSequenceUniversal(connector: Connector, storage: StorageLike) {
  try {
    if (typeof connector.getProvider === "function") {
      const provider = await connector.getProvider()
      if (typeof (provider as { disconnect?: () => void }).disconnect === "function") {
        (provider as { disconnect: () => void }).disconnect()
      }
    }
  } catch (error) {
    console.warn("Sequence universal provider cleanup failed", error)
  }

  try {
    await storage?.removeItem?.(WAAS_SIGN_IN_EMAIL_KEY)
  } catch (error) {
    console.warn("Sequence universal storage cleanup failed", error)
  }
}

export function useSafeDisconnect() {
  const config = useConfig()

  const disconnect = useCallback(
    async (options?: DisconnectOptions) => {
      const { connections } = config.state
      let target = options?.connector
      if (!target) {
        const current = config.state.current
        target = current ? connections.get(current)?.connector : undefined
      }

      if (!target) return

      if (typeof target.disconnect === "function") {
        await target.disconnect()
      } else if (isWaasConnector(target)) {
        await cleanupSequenceWaas(target, config.storage)
      } else if (isSequenceConnector(target)) {
        await cleanupSequenceUniversal(target, config.storage)
      }

      target.emitter.off("change", config._internal.events.change)
      target.emitter.off("disconnect", config._internal.events.disconnect)
      target.emitter.on("connect", config._internal.events.connect)
      connections.delete(target.uid)

      config.setState((state) => {
        if (connections.size === 0) {
          return {
            ...state,
            connections: new Map(),
            current: null,
            status: "disconnected",
          }
        }

        const nextConnection = connections.values().next().value as { connector: Connector }
        return {
          ...state,
          connections: new Map(connections),
          current: nextConnection.connector.uid,
        }
      })

      const current = config.state.current
      if (!current) {
        await config.storage?.removeItem?.("recentConnectorId")
        return
      }

      const nextConnector = config.state.connections.get(current)?.connector
      if (!nextConnector) return

      await config.storage?.setItem?.("recentConnectorId", nextConnector.id)
    },
    [config],
  )

  return { disconnect }
}
