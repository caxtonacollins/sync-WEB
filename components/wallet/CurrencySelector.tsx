"use client";

import React, { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils/formatters";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface CurrencySelectorProps {
  totalValueUSD?: number;
  totalValueNGN?: number;
  defaultCurrency?: string;
  onCurrencyChange?: (currency: string) => void;
}

export function CurrencySelector({
  totalValueUSD = 0,
  totalValueNGN = 0,
  defaultCurrency = "USD",
  onCurrencyChange,
}: CurrencySelectorProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useLocalStorage(
    "selectedDisplayCurrency",
    defaultCurrency
  );

  const currencyOptions = [
    { code: "USD", value: totalValueUSD, symbol: "$" },
    { code: "NGN", value: totalValueNGN, symbol: "₦" },
    { code: "PORTFOLIO", value: null, label: "Total Portfolio" },
  ];

  const getCurrentDisplay = () => {
    if (selectedCurrency === "PORTFOLIO") {
      return {
        label: "Total Portfolio",
        value: null,
        symbol: "💼",
      };
    }
    const option = currencyOptions.find((o) => o.code === selectedCurrency);
    return {
      label: selectedCurrency,
      value: option?.value || 0,
      symbol: option?.symbol || selectedCurrency,
    };
  };

  const current = getCurrentDisplay();

  const handleCurrencySelect = (currency: string) => {
    setSelectedCurrency(currency);
    setShowDropdown(false);
    onCurrencyChange?.(currency);
  };

  return (
    <div className="space-y-3">
      {/* Currency Display */}
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 rounded-lg border border-gray-700 transition-all duration-200"
        >
          <div className="flex items-center gap-3">
            <div className="text-left">
              <div className="text-xs text-gray-400 uppercase tracking-wider">
                Displaying in
              </div>
              <div className="text-xl font-bold text-white">
                {current.label}
              </div>
            </div>
          </div>

          {current.value !== null && (
            <div className="text-right">
              <div className="text-2xl font-bold text-transparent bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text">
                {formatCurrency(current.value, current.label)}
              </div>
            </div>
          )}

          <ChevronDownIcon
            className={`h-5 w-5 text-gray-400 transition-transform ${
              showDropdown ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Currency Dropdown Menu */}
        {showDropdown && (
          <div className="absolute z-50 w-full mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden">
            {currencyOptions.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleCurrencySelect(option.code)}
                className={`w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors flex items-center justify-between border-b border-gray-700 last:border-0 ${
                  selectedCurrency === option.code ? "bg-gray-700" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{option.symbol || "💼"}</span>
                  <div>
                    <div className="text-sm font-semibold text-white">
                      {option.label || option.code}
                    </div>
                    {option.value !== null && (
                      <div className="text-xs text-gray-400">
                        {formatCurrency(option.value, option.code)}
                      </div>
                    )}
                  </div>
                </div>

                {selectedCurrency === option.code && (
                  <Badge className="bg-blue-900 text-blue-300 text-xs animate-pulse">
                    ✓ Active
                  </Badge>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
