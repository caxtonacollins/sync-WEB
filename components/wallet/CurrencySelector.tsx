"use client";

import React, { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { formatCurrency } from "@/lib/utils/formatters";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface CurrencySelectorProps {
  totalValueUSD?: number;
  defaultCurrency?: string;
  onCurrencyChange?: (currency: string) => void;
}

export function CurrencySelector({
  totalValueUSD = 0,
  defaultCurrency = "USD",
  onCurrencyChange,
}: CurrencySelectorProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useLocalStorage(
    "selectedDisplayCurrency",
    defaultCurrency
  );

  const currencyOptions = [
    { code: "USD", value: totalValueUSD, symbol: "$", label: "USD" },
    { code: "PORTFOLIO", value: null, symbol: "💼", label: "Total Portfolio" },
  ];

  const currentDisplay = currencyOptions.find(c => c.code === selectedCurrency) || currencyOptions[0];
  const isPortfolio = selectedCurrency === "PORTFOLIO";

  const handleCurrencySelect = (currency: string) => {
    setSelectedCurrency(currency);
    setShowDropdown(false);
    onCurrencyChange?.(currency);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="w-full flex items-center justify-between p-5 bg-gray-800/80 hover:bg-gray-700/80 rounded-xl border border-gray-700 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <span className="text-2xl">{currentDisplay.symbol}</span>
            </div>
            <div className="text-left">
              <div className="text-xs text-gray-400 uppercase tracking-wider font-medium">
                {isPortfolio ? 'Portfolio Value' : 'Balance'}
              </div>
              <div className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {formatCurrency(isPortfolio ? totalValueUSD : (currentDisplay.value || 0), 'USD')}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-400">
              {currentDisplay.label}
            </span>
            <div className="p-1.5 bg-gray-700/50 rounded-lg">
              <ChevronDownIcon
                className={`h-4 w-4 text-gray-300 transition-transform ${
                  showDropdown ? "rotate-180" : ""
                }`}
              />
            </div>
          </div>
        </button>

        {showDropdown && (
          <div className="absolute z-50 w-full mt-2 bg-gray-800/95 border border-gray-700/50 rounded-xl shadow-2xl overflow-hidden backdrop-blur-lg">
            {currencyOptions.map((option) => (
              <button
                key={option.code}
                onClick={() => handleCurrencySelect(option.code)}
                className={`w-full px-4 py-3.5 text-left hover:bg-gray-700/80 transition-all duration-200 flex items-center justify-between ${
                  selectedCurrency === option.code ? "bg-gray-700/50" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    selectedCurrency === option.code 
                      ? 'bg-purple-500/20' 
                      : 'bg-gray-700/50'
                  }`}>
                    <span className="text-xl">{option.symbol}</span>
                  </div>
                  <div>
                    <div className={`text-sm font-semibold ${
                      selectedCurrency === option.code 
                        ? 'text-white' 
                        : 'text-gray-200'
                    }`}>
                      {option.label}
                    </div>
                    <div className={`text-xs ${
                      selectedCurrency === option.code 
                        ? 'text-gray-300' 
                        : 'text-gray-400'
                    }`}>
                      {option.value !== null 
                        ? formatCurrency(option.value, 'USD')
                        : `Total: ${formatCurrency(totalValueUSD, 'USD')}`}
                    </div>
                  </div>
                </div>

                {selectedCurrency === option.code && (
                  <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
