"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ChevronDownIcon,
  ClipboardDocumentIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";
import { getTokenIcon } from "@/lib/tokenIcons";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatAddress } from "@/lib/utils/formatters";
import { useWalletVisibility } from "@/contexts/WalletVisibilityContext";
import { useToast } from "@/contexts/ToastContext";
import { useAuth } from "@/contexts/AuthContext";
import { WalletBalance, UnifiedWalletCardProps } from "@/types/wallet";

export function UnifiedWalletCard({
  cryptoBalances = [],
}: UnifiedWalletCardProps) {
  const { showBalance } = useWalletVisibility();
  const { addToast } = useToast();

  const [showCryptoDropdown, setShowCryptoDropdown] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState<WalletBalance | null>(
    cryptoBalances.find((c) => c.isDefault) || cryptoBalances[0] || null
  );
  const [copiedCrypto, setCopiedCrypto] = useState(false);
  const { user } = useAuth();

  const cryptoDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cryptoDropdownRef.current && !cryptoDropdownRef.current.contains(event.target as Node) && showCryptoDropdown) {
        setShowCryptoDropdown(false);
      }
    }

    // Add event listener when component mounts
    document.addEventListener('mousedown', handleClickOutside);
    
    // Clean up
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCryptoDropdown]);

  const copyToClipboard = async (text: string, type: "crypto") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "crypto") {
        setCopiedCrypto(true);
        setTimeout(() => setCopiedCrypto(false), 2000);
      } else {
        setCopiedCrypto(true);
        setTimeout(() => setCopiedCrypto(false), 2000);
      }
      addToast("Copied to clipboard!", "success");
    } catch (err) {
      addToast("Failed to copy", "error");
    }
  };

  const maskBalance = (balance: number, currency: string) => {
    if (!showBalance) return "••••••";
    return formatCurrency(balance, currency);
  };

  return (
    <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700/50 backdrop-blur-sm hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300">
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-4">
          {/* Crypto Wallet Section */}
          <div className="border border-purple-700/30 rounded-lg p-4 bg-purple-900/10 hover:bg-purple-900/20 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="flex-shrink-0">
                  <img
                    src={getTokenIcon(selectedCrypto?.tokenSymbol || '')}
                    alt={selectedCrypto?.tokenSymbol || 'Crypto'}
                    className="h-8 w-8 rounded-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/tokens/default-token.png';
                    }}
                  />
                </div>
                <span className="font-semibold text-purple-300">
                  Crypto Wallet
                </span>
              </div>
              {selectedCrypto?.isDefault && (
                <Badge className="bg-purple-900 text-purple-300 text-xs">
                  Default
                </Badge>
              )}
            </div>

            {/* Crypto Selection Dropdown */}
            <div className="relative mb-3" ref={cryptoDropdownRef}>
              <button
                onClick={() => setShowCryptoDropdown(!showCryptoDropdown)}
                className="w-full flex items-center justify-between p-2 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors text-sm"
              >
                <div className="text-left flex items-center gap-2 flex-1 ">
                  <img
                    src={getTokenIcon(selectedCrypto?.tokenSymbol || '')}
                    alt={selectedCrypto?.tokenSymbol || 'Crypto'}
                    className="h-8 w-8 rounded-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/tokens/default-token.png';
                    }}
                  />
                  <div className="flex items-center gap-2">
                    <div className="font-semibold text-white">
                      {showBalance && selectedCrypto
                        ? `${selectedCrypto.tokenSymbol} ${selectedCrypto?.available}`
                        : `${selectedCrypto?.tokenSymbol || "N/A"} ••••••`}
                    </div>
                  </div>
                </div>
                <ChevronDownIcon
                  className={`h-4 w-4 text-gray-400 transition-transform ${showCryptoDropdown ? "rotate-180" : ""
                    }`}
                />
              </button>

              {/* Crypto Dropdown Menu */}
              {showCryptoDropdown && cryptoBalances.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {cryptoBalances.map((crypto: WalletBalance, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedCrypto(crypto);
                        setShowCryptoDropdown(false);
                      }}
                      className="w-full px-3 py-2 hover:bg-gray-700 transition-colors border-b border-gray-700 last:border-0 text-left text-sm"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <img
                              src={getTokenIcon(crypto.tokenSymbol)}
                              alt={crypto.tokenSymbol}
                              className="h-5 w-5 rounded-full"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/images/tokens/default-token.png';
                              }}
                            />
                            <div>
                              <div className="font-semibold text-white">
                                {crypto.tokenSymbol} {crypto.available}
                              </div>
                            </div>
                          </div>
                        </div>
                        {crypto.isDefault && (
                          <Badge className="bg-purple-900 text-purple-300 text-xs">
                            Default
                          </Badge>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Copy Token Address */}
            {user?.starknetAccountAddress && (
              <button
                onClick={() =>
                  copyToClipboard(user.starknetAccountAddress!, "crypto")
                }
                className="w-full flex items-center justify-center gap-2 p-2 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors mb-2 text-xs text-gray-300"
              >
                {copiedCrypto ? (
                  <>
                    <ClipboardDocumentCheckIcon className="h-4 w-4 text-green-400" />
                    <span className="text-green-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <ClipboardDocumentIcon className="h-4 w-4" />
                    <span>
                        Copy: {formatAddress(user.starknetAccountAddress, 5)}
                    </span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
