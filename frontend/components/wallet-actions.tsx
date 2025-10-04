"use client"

import { useMemo } from "react"
import { useOpenConnectModal } from "@0xsequence/connect"
import {
  useAccount,
  useDisconnect,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi"
import { Button } from "@/components/ui/button"
import { monadTestnet } from "@/lib/chains"

const MONAD_CHAIN_ID = monadTestnet.id
const contractAddress = process.env.NEXT_PUBLIC_MONAD_NFT_CONTRACT as `0x${string}` | undefined

const erc721MintAbi = [
  {
    type: "function",
    name: "mint",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "tokenId", type: "uint256" },
    ],
    outputs: [],
  },
] as const

function formatAddress(addr?: string | null) {
  if (!addr) return ""
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`
}

export function WalletActions() {
  const { setOpenConnectModal } = useOpenConnectModal()
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { data: txHash, writeContract, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: txHash })

  const formattedAddress = useMemo(() => formatAddress(address), [address])
  const mintDisabled = !isConnected || isPending || isConfirming || !contractAddress

  async function handleMint() {
    if (!address || !contractAddress) return

    await writeContract({
      abi: erc721MintAbi,
      address: contractAddress,
      functionName: "mint",
      args: [address, 1n],
      chainId: MONAD_CHAIN_ID,
    })
  }

  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-border/60 bg-background/40 p-4 text-center shadow-sm">
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">Monad Testnet akıllı cüzdanın</p>
        <p className="text-base font-semibold">
          {isConnected ? formattedAddress : "Sosyal giriş yapılmadı"}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {isConnected ? (
          <Button variant="outline" onClick={() => disconnect()}>
            Oturumu kapat
          </Button>
        ) : (
          <Button onClick={() => setOpenConnectModal(true)}>Google ile giriş yap</Button>
        )}
        <Button disabled={mintDisabled} onClick={handleMint} variant="secondary">
          Test NFT mint et
        </Button>
      </div>

      {!contractAddress && (
        <p className="text-xs text-muted-foreground">
          `NEXT_PUBLIC_MONAD_NFT_CONTRACT` .env değişkenini ayarladığında mint işlemi aktif olur.
        </p>
      )}

      {isPending && <p className="text-xs text-muted-foreground">İşlem gönderiliyor…</p>}
      {isConfirming && <p className="text-xs text-muted-foreground">Monad ağında onay bekleniyor…</p>}
      {isSuccess && <p className="text-xs text-emerald-500">Mint işlemi tamamlandı!</p>}
      {error && <p className="text-xs text-destructive">Hata: {error.message}</p>}
    </div>
  )
}
