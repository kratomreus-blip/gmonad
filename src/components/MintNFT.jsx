import { useState } from 'react'
import { 
  useAccount,
  useWaitForTransactionReceipt, 
  useWriteContract 
} from 'wagmi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { nftAbi, NFT_CONTRACT_ADDRESS } from '../contracts/nft-abi'

export function MintNFT() {
  const { isConnected, address } = useAccount()
  const [tokenId, setTokenId] = useState('')
  
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

  async function handleMint(e) { 
    e.preventDefault()
    
    if (!tokenId) {
      return
    }

    try {
      writeContract({
        address: NFT_CONTRACT_ADDRESS,
        abi: nftAbi,
        functionName: 'publicMint',
        args: [BigInt(tokenId)],
      })
    } catch (err) {
      console.error('Minting error:', err)
    }
  } 

  if (!isConnected) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Mint NFT</CardTitle>
          <CardDescription>
            Please connect your wallet first to mint NFTs
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Mint Your NFT</CardTitle>
        <CardDescription>
          Enter a unique token ID to mint your NFT to your wallet
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleMint} className="space-y-4">
          <div>
            <label htmlFor="tokenId" className="block text-sm font-medium mb-2">
              Token ID
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
            className="w-full"
          >
            {isPending ? 'Confirming...' : isConfirming ? 'Minting...' : 'Mint NFT'} 
          </Button>
        </form>

        {hash && (
          <Alert className="mt-4">
            <AlertDescription>
              <strong>Transaction Hash:</strong> 
              <br />
              <span className="text-xs break-all">{hash}</span>
            </AlertDescription>
          </Alert>
        )}

        {isConfirming && (
          <Alert className="mt-4">
            <AlertDescription>
              ⏳ Waiting for confirmation...
            </AlertDescription>
          </Alert>
        )}

        {isConfirmed && (
          <Alert className="mt-4 border-green-200 bg-green-50">
            <AlertDescription className="text-green-800">
              🎉 NFT minted successfully! 
              <br />
              Token ID: {tokenId}
              <br />
              Owner: {address?.slice(0, 6)}...{address?.slice(-4)}
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="mt-4 border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">
              ❌ Error: {error.shortMessage || error.message}
              <br />
              <span className="text-xs">
                Make sure the token ID is unique and you have enough ETH for gas fees.
              </span>
            </AlertDescription>
          </Alert>
        )}

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-800">
            <strong>Note:</strong> This is a demo app. Make sure to update the contract address 
            in the code to point to your actual deployed NFT contract.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

