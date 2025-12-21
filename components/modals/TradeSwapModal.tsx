"use client";

import React, { useMemo, useState } from "react";
import {
  ArrowPathIcon,
  ChevronDownIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/contexts/ToastContext";
import { useAuth } from "@/contexts/AuthContext";
import { executeSwap } from "@/api/routes/swaps";
import { SwapType } from "@/enums";
import { useWalletBalances } from "@/hooks/use-wallet-balances";
import { useExchangeRates } from "@/hooks/use-exchange-rates";
import { getTokenIcon } from "@/lib/tokenIcons";
import { FiatIcon } from "@/lib/fiatIcons";
import { TokenSelectModal } from "./TokenSelectModal";

interface ExchangeRate {
  fiatSymbol: string;
  tokenSymbol: string;
  rate: number;
  lastUpdated: string;
}

interface TradeSwapModalProps {
  onContinue: (data: {
    fromToken: string;
    toToken: string;
    amount: string;
    estimated: string;
    direction: "cryptoToStable" | "stableToCrypto";
  }) => void;
}

// Supported stable coins mapping (country -> stable coin)
const STABLE_COINS: Record<string, { symbol: string; name: string; fiatCode: string }> = {
  NGN: { symbol: "sNGN", name: "Stable NGN", fiatCode: "NGN" },
  USD: { symbol: "USDC", name: "USD Coin", fiatCode: "USD" },
  // Add more countries as needed
};

export function TradeSwapModal({ onContinue }: TradeSwapModalProps) {
  const { addToast } = useToast();
  const [fromToken, setFromToken] = useState<string>("");
  const [toToken, setToToken] = useState<string>("");
  const [amount, setAmount] = useState("");
  const [showTokenModal, setShowTokenModal] = useState<"from" | "to" | null>(null);
  const [slippage, setSlippage] = useState(0.5); // Default 0.5% slippage
  const [showPriceDetails, setShowPriceDetails] = useState(false);

  const { data: walletData } = useWalletBalances();
  const { data: exchangeRates } = useExchangeRates();

  // Get available tokens (crypto + stable coins)
  const availableTokens = useMemo(() => {
    const tokens: Array<{ id: string; name: string; symbol: string; balance: number; type: "crypto" | "stable"; address?: string }> = [];
    
    // Add crypto tokens
    walletData?.cryptoBalances.forEach((balance) => {
      tokens.push({
        id: balance.currency,
        name: balance.currency,
        symbol: balance.currency,
        balance: Number(balance.balance),
        type: "crypto",
        address: balance.walletId, // Using walletId as address placeholder
      });
    });

    // Add stable coins (check if user has balances)
    Object.values(STABLE_COINS).forEach((stable) => {
      const fiatBalance = walletData?.fiatBalances.find(
        (b) => b.currency === stable.fiatCode
      );
      if (fiatBalance) {
        tokens.push({
          id: stable.symbol,
          name: stable.name,
          symbol: stable.symbol,
          balance: Number(fiatBalance.balance || "0"),
          type: "stable",
          address: fiatBalance.accountId, // Using accountId as address placeholder
        });
      }
    });

    return tokens.sort((a, b) => {
      // Prioritize ETH, USDC, sNGN
      const priority = ["ETH", "USDC", "sNGN", "STRK"];
      const aIdx = priority.indexOf(a.symbol);
      const bIdx = priority.indexOf(b.symbol);
      if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
      if (aIdx !== -1) return -1;
      if (bIdx !== -1) return 1;
      return 0;
    });
  }, [walletData]);

  // Build rates object
  const rates = useMemo(() => {
    const ratesObj: Record<string, number> = {};
    if (exchangeRates) {
      exchangeRates.forEach((rate: ExchangeRate) => {
        if (rate.fiatSymbol === "USD") {
          ratesObj[rate.tokenSymbol] = rate.rate;
        } else if (rate.fiatSymbol === "NGN" && rate.tokenSymbol === "USD") {
          ratesObj.USD_NGN = rate.rate;
        }
      });
    }
    return ratesObj;
  }, [exchangeRates]);

  // Determine swap direction
  const direction = useMemo(() => {
    if (!fromToken || !toToken) return null;
    const fromTokenData = availableTokens.find((t) => t.id === fromToken);
    const toTokenData = availableTokens.find((t) => t.id === toToken);
    if (!fromTokenData || !toTokenData) return null;
    return fromTokenData.type === "crypto" && toTokenData.type === "stable"
      ? "cryptoToStable"
      : "stableToCrypto";
  }, [fromToken, toToken, availableTokens]);

  // Calculate estimated output
  const estimated = useMemo(() => {
    const amt = parseFloat(amount || "0");
    if (!amt || Number.isNaN(amt) || !fromToken || !toToken || !direction) return "0";

    const fromTokenData = availableTokens.find((t) => t.id === fromToken);
    const toTokenData = availableTokens.find((t) => t.id === toToken);

    if (!fromTokenData || !toTokenData) return "0";

    if (direction === "cryptoToStable") {
      // Crypto -> Stable: Get crypto price in USD, convert to stable coin
      const cryptoPrice = rates[fromTokenData.symbol] || 1;
      const usdValue = amt * cryptoPrice;
      
      // If stable is sNGN, convert USD to NGN
      if (toTokenData.symbol === "sNGN") {
        const ngnRate = rates.USD_NGN || 1600; // Fallback rate
        return (usdValue * ngnRate).toFixed(6);
      }
      return usdValue.toFixed(6);
    } else {
      // Stable -> Crypto: Convert stable to USD, then to crypto
      let usdValue = amt;
      if (fromTokenData.symbol === "sNGN") {
        const ngnRate = rates.USD_NGN || 1600;
        usdValue = amt / ngnRate;
      }
      const cryptoPrice = rates[toTokenData.symbol] || 1;
      return (usdValue / cryptoPrice).toFixed(6);
    }
  }, [amount, fromToken, toToken, direction, rates, availableTokens]);

  // Calculate USD values
  const fromUsdValue = useMemo(() => {
    if (!amount || !fromToken) return 0;
    const fromTokenData = availableTokens.find((t) => t.id === fromToken);
    if (!fromTokenData) return 0;
    const price = rates[fromTokenData.symbol] || 1;
    return parseFloat(amount || "0") * price;
  }, [amount, fromToken, rates, availableTokens]);

  const toUsdValue = useMemo(() => {
    if (!estimated || !toToken) return 0;
    const toTokenData = availableTokens.find((t) => t.id === toToken);
    if (!toTokenData) return 0;
    const price = rates[toTokenData.symbol] || 1;
    return parseFloat(estimated || "0") * price;
  }, [estimated, toToken, rates, availableTokens]);

  // Calculate price impact (simplified)
  const priceImpact = useMemo(() => {
    if (!amount || parseFloat(amount) === 0) return 0;
    // This would typically come from a DEX aggregator
    // For now, return a mock value based on amount
    const amt = parseFloat(amount);
    if (amt > 10000) return 2.5;
    if (amt > 1000) return 1.0;
    return 0.1;
  }, [amount]);

  const priceImpactLabel = useMemo(() => {
    if (priceImpact < 0.5) return "Low";
    if (priceImpact < 1.0) return "Medium";
    return "High";
  }, [priceImpact]);

  // Calculate exchange rate
  const exchangeRate = useMemo(() => {
    if (!amount || parseFloat(amount) === 0 || !estimated || parseFloat(estimated) === 0) return null;
    const rate = parseFloat(estimated) / parseFloat(amount);
    return rate;
  }, [amount, estimated]);

  // Swap positions instead of resetting
  const handleSwapDirection = () => {
    const tempToken = fromToken;
    const tempAmount = amount;
    setFromToken(toToken);
    setToToken(tempToken);
    // Swap amounts too
    setAmount(estimated);
  };

  const handleMax = () => {
    const fromTokenData = availableTokens.find((t) => t.id === fromToken);
    if (fromTokenData) {
      setAmount(fromTokenData.balance.toString());
    }
  };

  const handleTokenSelect = (tokenId: string) => {
    if (showTokenModal === "from") {
      setFromToken(tokenId);
      if (toToken === tokenId) {
        setToToken("");
      }
    } else if (showTokenModal === "to") {
      setToToken(tokenId);
      if (fromToken === tokenId) {
        setFromToken("");
      }
    }
  };

  const handleContinue = () => {
    if (!fromToken || !toToken) {
      addToast("Please select both tokens", "error");
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      addToast("Please enter a valid amount", "error");
      return;
    }
    if (!direction) {
      addToast("Invalid token pair", "error");
      return;
    }

    onContinue({
      fromToken,
      toToken,
      amount,
      estimated,
      direction,
    });
  };

  const fromTokenData = availableTokens.find((t) => t.id === fromToken);
  const toTokenData = availableTokens.find((t) => t.id === toToken);

  // Check if user has sufficient balance
  const hasInsufficientBalance = fromTokenData && parseFloat(amount || "0") > fromTokenData.balance;

  return (
    <div className="space-y-4">
      {/* From Token */}
      <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-400">From</span>
          {fromTokenData && (
            <span className="text-xs text-gray-400">
              Balance: {fromTokenData.balance.toFixed(4)} {fromTokenData.symbol}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <input
            type="number"
            placeholder="0.0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-transparent text-3xl font-bold text-white w-full outline-none placeholder-gray-600"
          />
          <button
            onClick={() => setShowTokenModal("from")}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-700 rounded-xl transition-colors border border-gray-600"
          >
            {fromTokenData ? (
              <>
                <img
                  src={getTokenIcon(fromTokenData.symbol)}
                  alt={fromTokenData.name}
                  className="h-6 w-6 rounded-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/images/tokens/default-token.png";
                  }}
                />
                <span className="text-white font-semibold">
                  {fromTokenData.symbol}
                </span>
                <ChevronDownIcon className="h-4 w-4 text-gray-400" />
              </>
            ) : (
              <>
                <span className="text-gray-400">Select token</span>
                <ChevronDownIcon className="h-4 w-4 text-gray-400" />
              </>
            )}
          </button>
        </div>
        {fromTokenData && amount && parseFloat(amount) > 0 && (
          <div className="mt-2 text-sm text-gray-400">
            ≈ ${fromUsdValue.toFixed(2)}
          </div>
        )}
        {fromTokenData && (
          <button
            onClick={handleMax}
            className="mt-2 text-xs text-purple-400 hover:text-purple-300 transition-colors"
          >
            Max
          </button>
        )}
      </div>

      {/* Swap Direction Button */}
      <div className="flex justify-center -my-2 relative z-10">
        <button
          onClick={handleSwapDirection}
          className="p-2 bg-gray-800 border-2 border-gray-700 rounded-full hover:border-purple-500 transition-all hover:bg-gray-700"
        >
          <ArrowPathIcon className="h-5 w-5 text-white" />
        </button>
      </div>

      {/* To Token */}
      <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-400">To</span>
          {toTokenData && (
            <span className="text-xs text-gray-400">
              Balance: {toTokenData.balance.toFixed(4)} {toTokenData.symbol}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="text-3xl font-bold text-white">
            {estimated || "0"}
          </div>
          <button
            onClick={() => setShowTokenModal("to")}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-700 rounded-xl transition-colors border border-gray-600"
          >
            {toTokenData ? (
              <>
                <img
                  src={getTokenIcon(toTokenData.symbol)}
                  alt={toTokenData.name}
                  className="h-6 w-6 rounded-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/images/tokens/default-token.png";
                  }}
                />
                <span className="text-white font-semibold">
                  {toTokenData.symbol}
                </span>
                <ChevronDownIcon className="h-4 w-4 text-gray-400" />
              </>
            ) : (
              <>
                <span className="text-gray-400">Select token</span>
                <ChevronDownIcon className="h-4 w-4 text-gray-400" />
              </>
            )}
          </button>
        </div>
        {toTokenData && estimated && parseFloat(estimated) > 0 && (
          <div className="mt-2 text-sm text-gray-400">
            ≈ ${toUsdValue.toFixed(2)} {priceImpact > 0 && `(${priceImpactLabel === "Low" ? "0%" : `${priceImpact.toFixed(2)}%`})`}
          </div>
        )}
      </div>

      {/* Exchange Rate & Price Details */}
      {fromToken && toToken && amount && parseFloat(amount) > 0 && exchangeRate && (
        <div className="bg-gray-800/30 rounded-xl p-3 border border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">
                1 {fromTokenData?.symbol} ≈ {exchangeRate.toFixed(6)} {toTokenData?.symbol} (${fromUsdValue > 0 ? (fromUsdValue / parseFloat(amount)).toFixed(2) : "0.00"})
              </span>
              <button
                onClick={() => setShowPriceDetails(!showPriceDetails)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <InformationCircleIcon className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={() => setShowPriceDetails(!showPriceDetails)}
              className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1"
            >
              Price details
              <ChevronDownIcon
                className={`h-4 w-4 transition-transform ${
                  showPriceDetails ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          {showPriceDetails && (
            <div className="mt-3 pt-3 border-t border-gray-700 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Min received:</span>
                <span className="text-white">
                  {(parseFloat(estimated) * (1 - slippage / 100)).toFixed(6)} {toTokenData?.symbol}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Price impact:</span>
                <span
                  className={
                    priceImpact < 0.5
                      ? "text-green-400"
                      : priceImpact < 1.0
                      ? "text-yellow-400"
                      : "text-red-400"
                  }
                >
                  {priceImpactLabel}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Slippage tolerance:</span>
                <div className="flex items-center gap-2">
                  <Badge className="bg-purple-900 text-purple-400 text-xs">
                    Low
                  </Badge>
                  <span className="text-white">{slippage}%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Continue Button */}
      <Button
        onClick={handleContinue}
        disabled={
          !fromToken ||
          !toToken ||
          !amount ||
          parseFloat(amount) <= 0 ||
          hasInsufficientBalance
        }
        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {!fromToken || !toToken
          ? "Select tokens"
          : !amount || parseFloat(amount) <= 0
          ? "Enter amount"
          : hasInsufficientBalance
          ? `Insufficient ${fromTokenData?.symbol} balance`
          : "Swap"}
      </Button>

      {/* Token Select Modal */}
      <TokenSelectModal
        isOpen={showTokenModal !== null}
        onClose={() => setShowTokenModal(null)}
        onSelect={handleTokenSelect}
        tokens={availableTokens}
        excludeTokenId={showTokenModal === "from" ? toToken : fromToken}
      />
    </div>
  );
}
