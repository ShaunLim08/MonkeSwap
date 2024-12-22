'use client';

import React, { useState, useEffect } from "react";
import Modal from "react-modal"; // Ensure you have react-modal installed
import './TokenListDropdown.css';

const TokenListDropdown = ({ tokens, onSelectToken, selectedToken, selectedTokens, location }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTokens, setFilteredTokens] = useState(tokens);
  const [selection, setSelection] = useState(selectedToken);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const filtered = tokens.filter(
      (token) =>
        token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTokens(filtered);
  }, [searchTerm, tokens]);

  const getSelectedTokenData = () => {
    return tokens.find(t => t.symbol === selection) || null;
  };

  const handleChange = (value) => {
    let newTokens = [...selectedTokens];
    newTokens[location] = value;
    onSelectToken(newTokens);
    setSelection(value);
    setIsOpen(false);
  };

  const renderSelectedToken = () => {
    const selectedTokenData = getSelectedTokenData();
    
    if (selectedTokenData) {
      return (
        <div className="flex items-center gap-2 bg-[#1C1C1C] p-3 rounded-lg border border-[#323232]">
          <img
            src={selectedTokenData.logoURI}
            alt={selectedTokenData.name}
            className="h-6 w-6 rounded-full object-cover"
          />
          <span className="font-medium text-white">{selectedTokenData.symbol}</span>
          <span className="text-sm text-gray-400">{selectedTokenData.name}</span>
        </div>
      );
    }
    return (
      <div className="text-gray-400 bg-[#1C1C1C] p-3 rounded-lg border border-[#323232]">
        Select Token
      </div>
    );
  };

  return (
    <div className="w-72 relative">
      <div onClick={() => setIsOpen(true)} className="cursor-pointer">
        {renderSelectedToken()}
      </div>
      <Modal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        contentLabel="Select Token"
        className="modal float justify-center items-center"
        overlayClassName="overlay"
        ariaHideApp={false}
      >
        <div className="p-4">
          <h2 className="text-lg font-bold text-white mb-4">Select Token</h2>
          <input
            type="text"
            placeholder="Search tokens"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
            className="w-full bg-[#1C1C1C] text-white rounded-lg p-3 outline-none border border-[#323232] focus:border-[#14F195] transition-colors mb-4"
          />
          <div className="max-h-60 overflow-y-auto">
            {filteredTokens.length > 0 ? (
              filteredTokens.map((token, index) => (
                <div
                  key={token.symbol + index}
                  onClick={() => handleChange(token.symbol)}
                  className="flex items-center p-3 hover:bg-[#323232] cursor-pointer transition-colors"
                >
                  <img
                    src={token.logoURI}
                    alt={token.name}
                    className="h-8 w-8 rounded-full object-cover mr-3"
                  />
                  <div>
                    <span className="font-medium text-white">{token.symbol}</span>
                    <span className="text-sm text-gray-400 block">{token.name}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-2 text-gray-400">No tokens found</div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TokenListDropdown;