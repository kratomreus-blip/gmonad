import { useAccount, useConnect } from 'wagmi'
import { Button } from '@/components/ui/button'

export function WalletConnect() {
  const { isConnected, address } = useAccount()
  const { connect, connectors } = useConnect()

  if (isConnected) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-green-800 font-medium">Wallet Connected</span>
        </div>
        <div className="text-sm text-green-600 mt-1">
          Address: {address?.slice(0, 6)}...{address?.slice(-4)}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <div className="text-yellow-800 font-medium mb-2">Connect Your Wallet</div>
      <div className="text-sm text-yellow-600 mb-3">
        Connect your wallet to start minting NFTs
      </div>
      <Button
        onClick={() => connect({ connector: connectors[0] })}
        className="w-full"
      >
        Connect Wallet
      </Button>
    </div>
  )
}

