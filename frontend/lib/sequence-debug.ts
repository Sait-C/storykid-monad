/**
 * Debug utilities for Sequence WaaS configuration
 */

export function debugSequenceConfig() {
  const projectAccessKey = process.env.NEXT_PUBLIC_SEQUENCE_PROJECT_ACCESS_KEY
  const waasConfigKey = process.env.NEXT_PUBLIC_SEQUENCE_WAAS_CONFIG_KEY
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

  console.group("🔍 Sequence Configuration Debug")
  
  console.log("Environment Variables:")
  console.log("- Project Access Key:", projectAccessKey ? "✅ Set" : "❌ Missing")
  console.log("- WaaS Config Key:", waasConfigKey ? "✅ Set" : "❌ Missing")
  console.log("- Google Client ID:", googleClientId ? "✅ Set" : "❌ Missing")

  if (waasConfigKey) {
    try {
      const decoded = atob(waasConfigKey)
      const config = JSON.parse(decoded)
      console.log("\nDecoded WaaS Config:")
      console.log("- Project ID:", config.projectId)
      console.log("- RPC Server:", config.rpcServer)
    } catch (error) {
      console.error("❌ Failed to decode WaaS Config Key - it may be invalid")
    }
  }

  console.groupEnd()
}

export function getWaasConfigInfo(waasConfigKey: string) {
  try {
    const decoded = atob(waasConfigKey)
    return JSON.parse(decoded)
  } catch {
    return null
  }
}
