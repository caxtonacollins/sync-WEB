"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ChevronDownIcon,
  ClipboardDocumentIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";
import { getTokenIcon } from "@/lib/tokenIcons";
import { FiatIcon } from "@/lib/fiatIcons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatAddress } from "@/lib/utils/formatters";
import { useWalletVisibility } from "@/contexts/WalletVisibilityContext";
import { useToast } from "@/contexts/ToastContext";

interface WalletBalance {
  currency: string;
  balance: number;
  accountId?: string;
  accountNumber?: string;
  bankName?: string;
  walletId?: string;
  provider?: string;
  network?: string;
  address?: string;
  isDefault: boolean;
}

interface UnifiedWalletCardProps {
  fiatBalances: WalletBalance[];
  cryptoBalances: WalletBalance[];
  totalValueUSD?: number;
  totalValueNGN?: number;
}

export function UnifiedWalletCard({
  fiatBalances = [],
  cryptoBalances = [],
}: UnifiedWalletCardProps) {
  const { showBalance } = useWalletVisibility();
  const { addToast } = useToast();

  const [showFiatDropdown, setShowFiatDropdown] = useState(false);
  const [showCryptoDropdown, setShowCryptoDropdown] = useState(false);
  const [selectedFiat, setSelectedFiat] = useState<WalletBalance | null>(
    fiatBalances.find((f) => f.isDefault) || fiatBalances[0] || null
  );
  const [selectedCrypto, setSelectedCrypto] = useState<WalletBalance | null>(
    cryptoBalances.find((c) => c.isDefault) || cryptoBalances[0] || null
  );
  const [copiedFiat, setCopiedFiat] = useState(false);
  const [copiedCrypto, setCopiedCrypto] = useState(false);
  
  const fiatDropdownRef = useRef<HTMLDivElement>(null);
  const cryptoDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (fiatDropdownRef.current && !fiatDropdownRef.current.contains(event.target as Node) && showFiatDropdown) {
        setShowFiatDropdown(false);
      }
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
  }, [showFiatDropdown, showCryptoDropdown]);

  const copyToClipboard = async (text: string, type: "fiat" | "crypto") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "fiat") {
        setCopiedFiat(true);
        setTimeout(() => setCopiedFiat(false), 2000);
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
        {/* Total Portfolio Overview */}
        {/* <div className="grid grid-cols-2 gap-4 p-4 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg border border-purple-700/30">
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">
              Fiat Balance
            </div>
            <div className="text-2xl font-bold text-white">
              {maskBalance(totalValueNGN, "NGN")}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">
              Crypto Balance
            </div>
            <div className="text-2xl font-bold text-white">
              {maskBalance(totalValueUSD, "USD")}
            </div>
          </div>
        </div> */}

        <div className="space-y-4">
          {/* Fiat Wallet Section */}
          <div className="border border-blue-700/30 rounded-lg p-4 bg-blue-900/10 hover:bg-blue-900/20 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FiatIcon
                  code={selectedFiat?.currency || ""}
                  className="h-8 w-8"
                />
                <span className="font-semibold text-blue-300">Fiat Wallet</span>
              </div>
              {selectedFiat?.isDefault && (
                <Badge className="bg-blue-900 text-blue-300 text-xs">
                  Default
                </Badge>
              )}
            </div>

            {/* Fiat Selection Dropdown */}
            <div className="relative mb-3" ref={fiatDropdownRef}>
              <button
                onClick={() => setShowFiatDropdown(!showFiatDropdown)}
                className="w-full flex items-center justify-between p-2 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors text-sm"
              >
                <div className="text-left flex-1 flex items-center gap-2">
                  <FiatIcon code={selectedFiat?.currency || ""} className="h-6 w-6" />
                  <div>
                    <div className="font-semibold text-white">
                      {showBalance && selectedFiat
                        ? selectedFiat.balance.toLocaleString()
                        : "••••••"}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {selectedFiat?.bankName || "No account"}
                    </div>
                  </div>
                </div>
                <ChevronDownIcon
                  className={`h-4 w-4 text-gray-400 transition-transform ${showFiatDropdown ? "rotate-180" : ""
                    }`}
                />
              </button>

              {/* Fiat Dropdown Menu */}
              {showFiatDropdown && fiatBalances.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {fiatBalances.map((fiat, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedFiat(fiat);
                        setShowFiatDropdown(false);
                      }}
                      className="w-full px-3 py-2 hover:bg-gray-700 transition-colors border-b border-gray-700 last:border-0 text-left text-sm"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FiatIcon code={fiat.currency} className="h-6 w-6" />
                          <div>
                            <div className="font-semibold text-white">
                              {fiat.balance.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-400">
                              {fiat.bankName}
                            </div>
                          </div>
                        </div>
                        {fiat.isDefault && (
                          <Badge className="bg-blue-900 text-blue-300 text-xs">
                            Default
                          </Badge>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Copy Account Number */}
            {selectedFiat?.accountNumber && (
              <button
                onClick={() =>
                  copyToClipboard(selectedFiat.accountNumber!, "fiat")
                }
                className="w-full flex items-center justify-center gap-2 p-2 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors mb-2 text-xs text-gray-300"
              >
                {copiedFiat ? (
                  <>
                    <ClipboardDocumentCheckIcon className="h-4 w-4 text-green-400" />
                    <span className="text-green-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <ClipboardDocumentIcon className="h-4 w-4" />
                    <span>Copy: {selectedFiat.accountNumber.slice(-6)}</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Crypto Wallet Section */}
          <div className="border border-purple-700/30 rounded-lg p-4 bg-purple-900/10 hover:bg-purple-900/20 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="flex-shrink-0">
                  <img
                    src={getTokenIcon(selectedCrypto?.currency || '')}
                    alt={selectedCrypto?.currency || 'Crypto'}
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
                    src={getTokenIcon(selectedCrypto?.currency || '')}
                    alt={selectedCrypto?.currency || 'Crypto'}
                    className="h-8 w-8 rounded-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/tokens/default-token.png';
                    }}
                  />
                  <div className="flex items-center gap-2">
                    <div className="font-semibold text-white">
                      {showBalance && selectedCrypto
                        ? `${selectedCrypto.currency} ${selectedCrypto?.balance}`
                        : `${selectedCrypto?.currency || "N/A"} ••••••`}
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
                  {cryptoBalances.map((crypto, idx) => (
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
                              src={getTokenIcon(crypto.currency)}
                              alt={crypto.currency}
                              className="h-5 w-5 rounded-full"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/images/tokens/default-token.png';
                              }}
                            />
                            <div>
                              <div className="font-semibold text-white">
                                {crypto.currency} {crypto.balance}
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
            {selectedCrypto?.address && (
              <button
                onClick={() =>
                  copyToClipboard(selectedCrypto.address!, "crypto")
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
                      Copy: {formatAddress(selectedCrypto.address, 3)}
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
