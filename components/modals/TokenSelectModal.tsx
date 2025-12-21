"use client";

import React, { useState, useMemo } from "react";
import { XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { getTokenIcon } from "@/lib/tokenIcons";

interface Token {
  id: string;
  name: string;
  symbol: string;
  balance: number;
  type: "crypto" | "stable";
  address?: string;
}

interface TokenSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (tokenId: string) => void;
  tokens: Token[];
  excludeTokenId?: string;
}

// Popular tokens to show at the top
const POPULAR_TOKENS = ["USDC", "STRK", "ETH", "USDT", "sNGN"];

export function TokenSelectModal({
  isOpen,
  onClose,
  onSelect,
  tokens,
  excludeTokenId,
}: TokenSelectModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTokens = useMemo(() => {
    let filtered = tokens.filter(
      (token) => token.id !== excludeTokenId
    );

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (token) =>
          token.name.toLowerCase().includes(query) ||
          token.symbol.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [tokens, searchQuery, excludeTokenId]);

  const popularTokens = useMemo(() => {
    return POPULAR_TOKENS.map((symbol) =>
      tokens.find((t) => t.symbol === symbol)
    ).filter(Boolean) as Token[];
  }, [tokens]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex justify-center items-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Select a token</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-gray-700">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search tokens"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-purple-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Popular Tokens */}
        {popularTokens.length > 0 && !searchQuery && (
          <div className="px-4 pt-4 pb-2">
            <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {popularTokens.map((token) => (
                <button
                  key={token.id}
                  onClick={() => {
                    onSelect(token.id);
                    onClose();
                  }}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 transition-colors flex-shrink-0"
                >
                  <img
                    src={getTokenIcon(token.symbol)}
                    alt={token.symbol}
                    className="h-6 w-6 rounded-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/images/tokens/default-token.png";
                    }}
                  />
                  <span className="text-white text-sm font-medium">
                    {token.symbol}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Token List */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {filteredTokens.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">No tokens found</p>
            </div>
          ) : (
            <>
              {!searchQuery && (
                <h3 className="text-sm font-semibold text-gray-400 mb-3">
                  Popular tokens
                </h3>
              )}
              <div className="space-y-1">
                {filteredTokens.map((token) => (
                  <button
                    key={token.id}
                    onClick={() => {
                      onSelect(token.id);
                      onClose();
                    }}
                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-800 rounded-lg transition-colors group"
                  >
                    <div className="relative">
                      <img
                        src={getTokenIcon(token.symbol)}
                        alt={token.name}
                        className="h-10 w-10 rounded-full"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/images/tokens/default-token.png";
                        }}
                      />
                      {/* Starknet indicator */}
                      <div className="absolute -bottom-1 -right-1 bg-purple-600 rounded-full p-1">
                        <div className="h-3 w-3 bg-white rounded-full flex items-center justify-center">
                          <span className="text-[8px] font-bold text-purple-600">
                            S
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="font-semibold text-white group-hover:text-purple-400 transition-colors truncate">
                        {token.name}
                      </div>
                      <div className="text-sm text-gray-400 truncate">{token.symbol}</div>
                    </div>
                    {token.address && token.address.length > 10 && (
                      <div className="text-xs text-gray-500 font-mono flex-shrink-0 ml-2">
                        {token.address.slice(0, 6)}...{token.address.slice(-4)}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

