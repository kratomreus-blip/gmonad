import { useState } from 'react'
import { 
  useAccount,
  useWaitForTransactionReceipt, 
  useWriteContract,
  useReadContract
} from 'wagmi'
import { parseEther } from 'viem'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { gmonadAbi, GMONAD_CONTRACT_ADDRESS, MINT_PRICE } from '../contracts/gmonad-abi'
import gmonadImage from '../assets/Gmonad.png'

export function MintGMONAD() {
  const { isConnected, address } = useAccount()
  const [tokenId, setTokenId] = useState('')
  const [mintType, setMintType] = useState('auto') // 'auto' or 'custom'
  
  const { 
    data: hash,
    error,
    isPending, 
    writeContract 
  } = useWriteContract() 

  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ 
      hash, 
    })

  // Read next token ID for auto mint
  const { data: nextTokenId } = useReadContract({
    address: GMONAD_CONTRACT_ADDRESS,
    abi: gmonadAbi,
    functionName: 'getNextTokenId',
  })

  async function handleAutoMint(e) { 
    e.preventDefault()

    try {
      writeContract({
        address: GMONAD_CONTRACT_ADDRESS,
        abi: gmonadAbi,
        functionName: 'mint',
        value: parseEther('1'), // 1 MONAD
      })
    } catch (err) {
      console.error('Minting error:', err)
    }
  }

  async function handleCustomMint(e) { 
    e.preventDefault()
    
    if (!tokenId) {
      return
    }

    try {
      writeContract({
        address: GMONAD_CONTRACT_ADDRESS,
        abi: gmonadAbi,
        functionName: 'mintWithTokenId',
        args: [BigInt(tokenId)],
        value: parseEther('1'), // 1 MONAD
      })
    } catch (err) {
      console.error('Minting error:', err)
    }
  } 

  if (!isConnected) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <img src={gmonadImage} alt="GMONAD" className="w-8 h-8 rounded" />
            Mint GMONAD
          </CardTitle>
          <CardDescription>
            Please connect your wallet first to mint GMONAD NFTs
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <img src={gmonadImage} alt="GMONAD" className="w-8 h-8 rounded" />
          Mint GMONAD NFT
        </CardTitle>
        <CardDescription>
          gmonad on farcaster • Price: 1 MONAD
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center mb-4">
          <img src={gmonadImage} alt="GMONAD NFT" className="w-32 h-32 rounded-lg shadow-md" />
        </div>
        <div className="space-y-4">
          {/* Mint Type Selection */}
          <div className="flex gap-2">
            <Button
              variant={mintType === 'auto' ? 'default' : 'outline'}
              onClick={() => setMintType('auto')}
              className="flex-1"
            >
              Auto Mint
            </Button>
            <Button
              variant={mintType === 'custom' ? 'default' : 'outline'}
              onClick={() => setMintType('custom')}
              className="flex-1"
            >
              Custom ID
            </Button>
          </div>

          {/* Auto Mint Form */}
          {mintType === 'auto' && (
            <form onSubmit={handleAutoMint} className="space-y-4">
              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="text-sm text-purple-800">
                  <strong>Next Token ID:</strong> #{nextTokenId?.toString() || '...'}
                </p>
                <p className="text-xs text-purple-600 mt-1">
                  Your NFT will be automatically assigned the next available ID
                </p>
              </div>
              
              <Button 
                type="submit"
                disabled={isPending || isConfirming} 
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {isPending ? 'Confirming...' : isConfirming ? 'Minting...' : 'Mint GMONAD (1 MON)'} 
              </Button>
            </form>
          )}

          {/* Custom ID Mint Form */}
          {mintType === 'custom' && (
            <form onSubmit={handleCustomMint} className="space-y-4">
              <div>
                <label htmlFor="tokenId" className="block text-sm font-medium mb-2">
                  Custom Token ID
                </label>
                <Input
                  id="tokenId"
                  type="number"
                  placeholder="Enter token ID (e.g., 12345)"
                  value={tokenId}
                  onChange={(e) => setTokenId(e.target.value)}
                  required
                  min="1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Choose a unique number that hasn't been minted before
                </p>
              </div>
              
              <Button 
                type="submit"
                disabled={isPending || isConfirming || !tokenId} 
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {isPending ? 'Confirming...' : isConfirming ? 'Minting...' : 'Mint GMONAD (1 MON)'} 
              </Button>
            </form>
          )}

          {/* Transaction Status */}
          {hash && (
            <Alert className="border-purple-200 bg-purple-50">
              <AlertDescription>
                <strong>Transaction Hash:</strong> 
                <br />
                <a 
                  href={`https://testnet.monadexplorer.com/tx/${hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs break-all text-purple-600 hover:underline"
                >
                  {hash}
                </a>
              </AlertDescription>
            </Alert>
          )}

          {isConfirming && (
            <Alert className="border-blue-200 bg-blue-50">
              <AlertDescription className="text-blue-800">
                ⏳ Waiting for confirmation on Monad testnet...
              </AlertDescription>
            </Alert>
          )}

          {isConfirmed && (
            <Alert className="border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">
                🎉 GMONAD NFT minted successfully! 
                <br />
                {mintType === 'custom' && `Token ID: ${tokenId}`}
                {mintType === 'auto' && `Token ID: ${nextTokenId?.toString()}`}
                <br />
                Owner: {address?.slice(0, 6)}...{address?.slice(-4)}
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                ❌ Error: {error.shortMessage || error.message}
                <br />
                <span className="text-xs">
                  Make sure you have enough MON for the mint price (1 MON) + gas fees.
                </span>
              </AlertDescription>
            </Alert>
          )}

          {/* Info Box */}
          <div className="p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <img src={gmonadImage} alt="GMONAD" className="w-6 h-6 rounded" />
              <h4 className="font-medium text-gray-900">GMONAD Collection</h4>
            </div>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Price: 1 MONAD per NFT</li>
              <li>• Unlimited supply</li>

              <li>• Built on Monad testnet</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

