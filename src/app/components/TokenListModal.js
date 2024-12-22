"use client";

import React from "react";
import TokenListDropdown from "./TokenListDropdown";

const TokenListModal = ({
  handleSwap,
  isLoading,
  inputAmount,
  setInputAmount,
  outputAmount,
  selectedTokens,
  setSelectedTokens,
  tokens,
}) => {
  return (
    <div className="space-y-6 bg-[#232323] rounded-xl p-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="input-amount" className="text-gray-400 text-sm block mb-2">From</label>
          <div className="flex space-x-4 items-center">
            <input
              id="input-amount"
              type="number"
              value={inputAmount}
              onChange={(e) => setInputAmount(e.target.value)}
              placeholder="Amount"
              className="flex-grow bg-[#1C1C1C] text-white rounded-lg p-3 outline-none border border-[#323232] focus:border-[#14F195] transition-colors"
            />
            <TokenListDropdown
              selectedTokens={selectedTokens}
              location={0}
              tokens={tokens}
              onSelectToken={setSelectedTokens}
              selectedToken={selectedTokens[0]}
            />
          </div>
        </div>
        <div>
          <label htmlFor="output-amount" className="text-gray-400 text-sm block mb-2">To</label>
          <div className="flex space-x-4 items-center">
            <input
              id="output-amount"
              type="number"
              value={outputAmount}
              readOnly
              placeholder="Estimated amount"
              className="flex-grow bg-[#1C1C1C] text-white rounded-lg p-3 outline-none border border-[#323232]"
            />
            <TokenListDropdown
              selectedTokens={selectedTokens}
              location={1}
              tokens={tokens}
              onSelectToken={setSelectedTokens}
              selectedToken={selectedTokens[1]}
            />
          </div>
        </div>
        <button
          onClick={handleSwap}
          className="w-full bg-gradient-to-r from-[#9945FF] to-[#14F195] py-4 rounded-xl text-white font-bold
            hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading || !inputAmount}
        >
          {isLoading ? "Swapping..." : "Swap"}
        </button>
      </div>
    </div>
  );
};

export default TokenListModal;