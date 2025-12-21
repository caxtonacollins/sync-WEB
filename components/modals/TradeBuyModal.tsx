"use client";

import React, { useState, useMemo } from "react";
import {
  ChevronDownIcon,
  CreditCardIcon,
  BuildingLibraryIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/contexts/ToastContext";
import { useAuth } from "@/contexts/AuthContext";
import { FiatIcon } from "@/lib/fiatIcons";
import { getTokenIcon } from "@/lib/tokenIcons";

// Supported countries and their stable coins
const SUPPORTED_COUNTRIES = [
  { code: "NGN", name: "Nigeria", stableCoin: "sNGN", stableCoinName: "Stable NGN" },
  { code: "USD", name: "United States", stableCoin: "USDC", stableCoinName: "USD Coin" },
  // Add more countries as needed
];

interface PaymentMethod {
  id: string;
  type: "bank" | "card";
  name: string;
  details: string;
  icon: React.ReactNode;
}

interface TradeBuyModalProps {
  onContinue: (data: {
    country: string;
    amount: string;
    stableCoin: string;
    paymentMethod: string;
  }) => void;
}

export function TradeBuyModal({ onContinue }: TradeBuyModalProps) {
  const { addToast } = useToast();
  const { user } = useAuth();
  const [selectedCountry, setSelectedCountry] = useState<string>("NGN");
  const [amount, setAmount] = useState("");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");

  const selectedCountryData = SUPPORTED_COUNTRIES.find(
    (c) => c.code === selectedCountry
  );

  // Payment methods (would typically come from user's saved payment methods)
  const paymentMethods: PaymentMethod[] = useMemo(() => [
    {
      id: "bank-transfer",
      type: "bank",
      name: "Bank Transfer",
      details: "Direct bank transfer",
      icon: <BuildingLibraryIcon className="h-5 w-5" />,
    },
    {
      id: "card",
      type: "card",
      name: "Credit/Debit Card",
      details: "Visa, Mastercard, etc.",
      icon: <CreditCardIcon className="h-5 w-5" />,
    },
  ], []);

  const handleContinue = () => {
    if (!selectedCountry) {
      addToast("Please select a country", "error");
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      addToast("Please enter a valid amount", "error");
      return;
    }
    if (!selectedPaymentMethod) {
      addToast("Please select a payment method", "error");
      return;
    }

    onContinue({
      country: selectedCountry,
      amount,
      stableCoin: selectedCountryData?.stableCoin || "",
      paymentMethod: selectedPaymentMethod,
    });
  };

  // Calculate equivalent stable coin amount (1:1 for stable coins)
  const stableCoinAmount = amount; // 1 NGN = 1 sNGN, 1 USD = 1 USDC

  return (
    <div className="space-y-4">
      {/* Country Selection */}
      <div>
        <label className="text-sm font-medium text-gray-400 mb-2 block">
          Select Country
        </label>
        <div className="relative">
          <button
            onClick={() => setShowCountryDropdown(!showCountryDropdown)}
            className="w-full flex items-center justify-between p-4 bg-gray-800 border-2 border-gray-700 rounded-lg hover:border-purple-500 transition-all"
          >
            <div className="flex items-center gap-3">
              {selectedCountryData && (
                <FiatIcon code={selectedCountryData.code} className="h-6 w-6" />
              )}
              <div className="text-left">
                <p className="font-semibold text-white">
                  {selectedCountryData?.name || "Select Country"}
                </p>
                <p className="text-xs text-gray-400">
                  {selectedCountryData?.code}
                </p>
              </div>
            </div>
            <ChevronDownIcon
              className={`h-5 w-5 text-gray-400 transition-transform ${
                showCountryDropdown ? "rotate-180" : ""
              }`}
            />
          </button>

          {showCountryDropdown && (
            <div className="absolute z-10 w-full mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-60 overflow-y-auto">
              {SUPPORTED_COUNTRIES.map((country) => (
                <button
                  key={country.code}
                  onClick={() => {
                    setSelectedCountry(country.code);
                    setShowCountryDropdown(false);
                  }}
                  className="w-full flex items-center justify-between p-3 hover:bg-gray-700 transition-colors border-b border-gray-700 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <FiatIcon code={country.code} className="h-6 w-6" />
                    <div className="text-left">
                      <p className="font-semibold text-white">{country.name}</p>
                      <p className="text-xs text-gray-400">{country.code}</p>
                    </div>
                  </div>
                  <Badge className="bg-green-900 text-green-400">
                    {country.stableCoin}
                  </Badge>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Amount Input */}
      <div>
        <label className="text-sm font-medium text-gray-400 mb-2 block">
          Amount ({selectedCountryData?.code})
        </label>
        <div className="bg-gray-800 border-2 border-gray-700 rounded-lg p-4">
          <input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-transparent text-2xl font-bold text-white outline-none"
          />
          <div className="flex justify-between mt-2 text-sm">
            <span className="text-gray-400">
              You'll receive: {stableCoinAmount || "0.00"} {selectedCountryData?.stableCoin}
            </span>
            <span className="text-purple-400">
              1 {selectedCountryData?.code} = 1 {selectedCountryData?.stableCoin}
            </span>
          </div>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div>
        <label className="text-sm font-medium text-gray-400 mb-2 block">
          Payment Method
        </label>
        <div className="space-y-2">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => setSelectedPaymentMethod(method.id)}
              className={`w-full flex items-center justify-between p-4 bg-gray-800 border-2 rounded-lg transition-all ${
                selectedPaymentMethod === method.id
                  ? "border-purple-500 bg-purple-900/20"
                  : "border-gray-700 hover:border-gray-600"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="text-purple-400">{method.icon}</div>
                <div className="text-left">
                  <p className="font-semibold text-white">{method.name}</p>
                  <p className="text-xs text-gray-400">{method.details}</p>
                </div>
              </div>
              {selectedPaymentMethod === method.id && (
                <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction Details */}
      {amount && parseFloat(amount) > 0 && (
        <div className="bg-gray-800 p-4 rounded-lg space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">You Pay:</span>
            <span className="text-white font-semibold">
              {amount} {selectedCountryData?.code}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">You Receive:</span>
            <span className="text-white font-semibold">
              {stableCoinAmount} {selectedCountryData?.stableCoin}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Exchange Rate:</span>
            <span className="text-green-400">1:1 (Pegged)</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Processing Fee:</span>
            <span className="text-white">~2.5%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Network:</span>
            <Badge className="bg-purple-900 text-purple-400">Starknet</Badge>
          </div>
        </div>
      )}

      {/* Continue Button */}
      <Button
        onClick={handleContinue}
        disabled={
          !selectedCountry ||
          !amount ||
          parseFloat(amount) <= 0 ||
          !selectedPaymentMethod
        }
        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {!selectedCountry
          ? "Select country"
          : !amount || parseFloat(amount) <= 0
          ? "Enter amount"
          : !selectedPaymentMethod
          ? "Select payment method"
          : "Continue to Payment"}
      </Button>
    </div>
  );
}

