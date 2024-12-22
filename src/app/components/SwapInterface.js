'use client';

import React, { useState, useEffect } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import TokenListModal from "./TokenListModal";
import Image from "next/image";

const SwapInterface = () => {
  const { publicKey, signTransaction } = useWallet();
  const [balance, setBalance] = useState(0);
  const [inputAmount, setInputAmount] = useState("");
  const [outputAmount, setOutputAmount] = useState("");
  const [selectedTokens, setSelectedTokens] = useState(["PENGU", "CHILLGUY"]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [tokens, setTokens] = useState([]);
  const { connection } = useConnection();

  useEffect(() => {
    fetchTokens();
  }, []);

  const fetchBalance = async () => {
    if (publicKey) {
      const balance = await connection.getBalance(publicKey);
      setBalance(balance / 1e9); // Convert lamports to SOL
    }
  };

  const fetchTokens = async () => {
    try {
      const response = await fetch(
        "https://tokens.jup.ag/tokens?tags=verified"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const allTokens = await response.json();
      setTokens(allTokens);
    } catch (error) {
      console.error("Error fetching tokens:", error);
    }
  };

  const handleSwap = async () => {
    setIsLoading(true);
    try {
      // Fetch balance before proceeding with the swap
      await fetchBalance();

      const inputToken = tokens.find((t) => t.symbol === selectedTokens[0]);
      const outputToken = tokens.find((t) => t.symbol === selectedTokens[1]);

      if (!inputToken || !outputToken) {
        throw new Error("Invalid token selection");
      }

      const inputMint = inputToken.address;
      const outputMint = outputToken.address;
      const amount = Math.floor(inputAmount * 10 ** inputToken.decimals);

      // Step 1: Fetch routes
      const routesResponse = await fetch(
        `https://quote-api.jup.ag/v6/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=50`
      );
      const routes = await routesResponse.json();

      if (!routes.data || routes.data.length === 0) {
        throw new Error("No routes found");
      }

      // Step 2: Get serialized transactions
      const { swapTransaction } = await fetch(
        "https://quote-api.jup.ag/v6/swap",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quoteResponse: routes.data[0],
            userPublicKey: publicKey.toString(),
            wrapUnwrapSOL: true,
          }),
        }
      ).then((res) => res.json());

      // Step 3: Deserialize and sign the transaction
      const transaction = await connection.deserializeTransaction(
        swapTransaction
      );
      const signedTransaction = await signTransaction(transaction);

      // Step 4: Execute the swap
      const txid = await connection.sendRawTransaction(
        signedTransaction.serialize()
      );
      await connection.confirmTransaction({
        signature: txid,
      });

      console.log("Swap executed:", txid);

      // Refresh balance after swap
      await fetchBalance();
    } catch (error) {
      console.error("Swap failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 p-6 bg-[#1C1C1C] rounded-xl border border-[#232323]">
      <div className="mb-6">
        <p className="text-2xl font-bold text-white mb-4">
          Swap Tokens
        </p>
        <TokenListModal
          handleSwap={handleSwap}
          isLoading={isLoading}
          tokens={tokens}
          isOpen={isOpen}
          inputAmount={inputAmount}
          setInputAmount={setInputAmount}
          outputAmount={outputAmount}
          toggleModal={() => setIsOpen(false)}
          selectedTokens={selectedTokens}
          setSelectedTokens={setSelectedTokens}
          modalSelectToken={(token) => {
            setSelectedTokens((old) => {
              let newTokens = [token, old[1]];
              if (old.length === 3) newTokens = newTokens.reverse();
              return newTokens;
            });
            setIsOpen(false);
          }}
        />
      </div>
      <div className="flex items-center justify-between mt-6 pl-4">
        <p className="text-sm text-gray-400 flex items-center">
          Powered by
          <Image
            src="https://cryptologos.cc/logos/jupiter-ag-jup-logo.png"
            alt="Jupiter"
            width={24}
            height={24}
            className="inline ml-2 hover:opacity-80 transition-opacity"
          />
        </p>
      </div>
    </div>
  );
};

export default SwapInterface;