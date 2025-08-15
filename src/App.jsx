import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { config } from './config/wagmi'
import { WalletConnect } from './components/WalletConnect'
import { MintGMONAD } from './components/MintGMONAD'
import gmonadImage from './assets/Gmonad.png'
import './App.css'

const queryClient = new QueryClient()

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <div 
          className="min-h-screen bg-gradient-to-br from-purple-100 via-purple-50 to-blue-50 p-4 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${gmonadImage})`, backgroundBlendMode: 'overlay' }}
        >
          <div className="max-w-2xl mx-auto py-8 bg-white bg-opacity-80 rounded-lg shadow-lg p-6">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <img src={gmonadImage} alt="GMONAD" className="w-16 h-16 rounded-lg shadow-lg" />
                <h1 className="text-4xl font-bold text-gray-900">
                  GMONAD
                </h1>
              </div>
              <p className="text-gray-600 mb-2">
                gmonad on farcaster
              </p>
              <p className="text-sm text-purple-600">
                Mint your GMONAD NFT on Monad testnet • 1 MONAD per mint
              </p>
            </div>
            
            <WalletConnect />
            <MintGMONAD />
            
            <div className="text-center mt-8 text-sm text-gray-500">
              <p>Powered by Wagmi & Farcaster Mini Apps</p>
              <p className="text-xs mt-1">Built on Monad Testnet</p>
            </div>
          </div>
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App

