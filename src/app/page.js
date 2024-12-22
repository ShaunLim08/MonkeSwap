"use client";

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import SwapInterface from './components/SwapInterface'
import Navbar from './components/Navbar'
import TokenPhysics from './components/TokenPhysics'
import FallingBanana from './components/FallingBanana';
import Image from 'next/image';

function App() {
  return (
    <div className="min-h-screen bg-[#121212]">
      <FallingBanana />
      <Navbar />
      
      {/* Hero Section */}
      <div className="pt-20 pb-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center align-middle mx-auto items-center justify-center">
            {/* Placeholder for solution architect image */}
            <Image src="/logo.png" alt="MonkeSwap Logo" className="h-64 my-8 w-auto mx-auto" width={96} height={96} />
            <button className="bg-gradient-to-r from-[#9945FF] to-[#14F195] px-8 py-4 rounded-xl text-white text-xl font-bold hover:opacity-90 transition-all duration-300">
              Let&apos;s Meme!
            </button>
            <TokenPhysics />
          </div>
        </div>
      </div>

      {/* Swap Interface Section */}
      <div className="max-w-7xl mx-auto px-4 flex gap-8">
      <SwapInterface />
      </div>
    </div>
  )
}

export default App
