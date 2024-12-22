'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full bg-[#1C1C1C] border-b border-[#232323] px-6 py-4 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-[#14F195] font-bold text-xl">MonkeSwap</div>
        <div className="flex items-center gap-4">
          <button className="bg-[#232323] px-4 py-2 rounded-lg text-white hover:bg-[#2C2C2C] transition-all duration-300">
            Learn More
          </button>
          <WalletMultiButton />
        </div>
      </div>
    </nav>
  )
}

export default Navbar;