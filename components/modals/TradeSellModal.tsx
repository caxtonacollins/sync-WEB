"use client";

import React, { useState, useMemo } from "react";
import {
  ChevronDownIcon,
  BuildingLibraryIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/contexts/ToastContext";
import { useAuth } from "@/contexts/AuthContext";
import { useWalletBalances } from "@/hooks/use-wallet-balances";
import { FiatIcon } from "@/lib/fiatIcons";
import { getTokenIcon } from "@/lib/tokenIcons";

// Supported countries and their stable coins
const SUPPORTED_COUNTRIES = [
  {
    code: "NGN",
    name: "Nigeria",
    stableCoin: "sNGN",
    stableCoinName: "Stable NGN",
  },
  {
    code: "USD",
    name: "United States",
    stableCoin: "USDC",
    stableCoinName: "USD Coin",
  },
];

interface BankAccount {
  id: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
  bankCode: string;
  currency: string;
}

interface TradeSellModalProps {
  onContinue: (data: {
    country: string;
    stableCoin: string;
    amount: string;
    bankAccount: BankAccount | null;
  }) => void;
}

export function TradeSellModal({ onContinue }: TradeSellModalProps) {
  const { addToast } = useToast();
  const { data: walletData } = useWalletBalances();
  const [selectedCountry, setSelectedCountry] = useState<string>("NGN");
  const [amount, setAmount] = useState("");
  const [selectedBankAccount, setSelectedBankAccount] = useState<string>("");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showBankDropdown, setShowBankDropdown] = useState(false);

  const selectedCountryData = SUPPORTED_COUNTRIES.find(
    (c) => c.code === selectedCountry
  );

  // Get user's stable coin balance
  const stableCoinBalance = useMemo(() => {
    return (
      walletData?.cryptoBalances.find(
        (b) => b.tokenSymbol === selectedCountryData?.stableCoin
      )?.balance || 0
    );
  }, [selectedCountry, walletData, selectedCountryData]);

  // Get user's bank accounts (would typically come from API)
  const bankAccounts: BankAccount[] = useMemo(
    () => [
      {
        id: "bank-1",
        accountName: "John Doe",
        accountNumber: "0690000031",
        bankName: "Access Bank",
        bankCode: "044",
        currency: "NGN",
      },
    ],
    []
  );

  // Filter bank accounts by selected country
  const availableBankAccounts = useMemo(() => {
    return bankAccounts.filter((acc) => acc.currency === selectedCountry);
  }, [bankAccounts, selectedCountry]);

  const selectedBankAccountData = availableBankAccounts.find(
    (acc) => acc.id === selectedBankAccount
  );

  const handleMax = () => {
    setAmount(stableCoinBalance.toString());
  };

  const handleContinue = () => {
    if (!selectedCountry) {
      addToast("Please select a country", "error");
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      addToast("Please enter a valid amount", "error");
      return;
    }
    if (parseFloat(amount) > parseFloat(stableCoinBalance.toString())) {
      addToast("Insufficient balance", "error");
      return;
    }
    if (!selectedBankAccount) {
      addToast("Please select a bank account", "error");
      return;
    }

    onContinue({
      country: selectedCountry,
      stableCoin: selectedCountryData?.stableCoin || "",
      amount,
      bankAccount: selectedBankAccountData || null,
    });
  };

  // Calculate fiat amount (1:1 for stable coins)
  const fiatAmount = amount; // 1 sNGN = 1 NGN, 1 USDC = 1 USD

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
                    setSelectedBankAccount(""); // Reset bank account when country changes
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

      {/* Stable Coin Balance Display */}
      {selectedCountryData && (
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src={getTokenIcon(selectedCountryData.stableCoin)}
                alt={selectedCountryData.stableCoinName}
                className="h-5 w-5 rounded-full"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/images/tokens/default-token.png";
                }}
              />
              <span className="text-sm text-gray-400">Available Balance:</span>
            </div>
            <span className="font-bold text-white">
              {Number(stableCoinBalance).toFixed(2)}{" "}
              {selectedCountryData.stableCoin}{" "}
            </span>
          </div>
        </div>
      )}

      {/* Amount Input */}
      <div>
        <label className="text-sm font-medium text-gray-400 mb-2 block">
          Amount ({selectedCountryData?.stableCoin})
        </label>
        <div className="bg-gray-800 border-2 border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-transparent text-2xl font-bold text-white w-full outline-none"
            />
            <button
              onClick={handleMax}
              className="text-purple-400 hover:text-purple-300 text-sm font-semibold"
            >
              Max
            </button>
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <span className="text-gray-400">
              You'll receive: {fiatAmount || "0.00"} {selectedCountryData?.code}
            </span>
            <span className="text-purple-400">
              1 {selectedCountryData?.stableCoin} = 1{" "}
              {selectedCountryData?.code}
            </span>
          </div>
        </div>
      </div>

      {/* Bank Account Selection */}
      <div>
        <label className="text-sm font-medium text-gray-400 mb-2 block">
          Bank Account
        </label>
        <div className="relative">
          <button
            onClick={() => setShowBankDropdown(!showBankDropdown)}
            className="w-full flex items-center justify-between p-4 bg-gray-800 border-2 border-gray-700 rounded-lg hover:border-purple-500 transition-all"
          >
            <div className="flex items-center gap-3">
              {selectedBankAccountData ? (
                <>
                  <BuildingLibraryIcon className="h-6 w-6 text-purple-400" />
                  <div className="text-left">
                    <p className="font-semibold text-white">
                      {selectedBankAccountData.accountName}
                    </p>
                    <p className="text-xs text-gray-400">
                      {selectedBankAccountData.bankName} •{" "}
                      {selectedBankAccountData.accountNumber}
                    </p>
                  </div>
                </>
              ) : (
                <span className="text-gray-400">Select bank account</span>
              )}
            </div>
            <ChevronDownIcon
              className={`h-5 w-5 text-gray-400 transition-transform ${
                showBankDropdown ? "rotate-180" : ""
              }`}
            />
          </button>

          {showBankDropdown && (
            <div className="absolute z-10 w-full mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-60 overflow-y-auto">
              {availableBankAccounts.length > 0 ? (
                availableBankAccounts.map((account) => (
                  <button
                    key={account.id}
                    onClick={() => {
                      setSelectedBankAccount(account.id);
                      setShowBankDropdown(false);
                    }}
                    className="w-full flex items-center justify-between p-3 hover:bg-gray-700 transition-colors border-b border-gray-700 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <BuildingLibraryIcon className="h-6 w-6 text-purple-400" />
                      <div className="text-left">
                        <p className="font-semibold text-white">
                          {account.accountName}
                        </p>
                        <p className="text-xs text-gray-400">
                          {account.bankName} • {account.accountNumber}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-4 text-center">
                  <p className="text-gray-400 text-sm mb-2">
                    No bank accounts found
                  </p>
                  <button className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1 mx-auto">
                    <PlusIcon className="h-4 w-4" />
                    Add Bank Account
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Transaction Details */}
      {amount && parseFloat(amount) > 0 && (
        <div className="bg-gray-800 p-4 rounded-lg space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">You Sell:</span>
            <span className="text-white font-semibold">
              {amount} {selectedCountryData?.stableCoin}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">You Receive:</span>
            <span className="text-white font-semibold">
              {fiatAmount} {selectedCountryData?.code}
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
            <span className="text-gray-400">Estimated Time:</span>
            <span className="text-white">1-3 business days</span>
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
          parseFloat(amount) > parseFloat(stableCoinBalance.toString()) ||
          !selectedBankAccount
        }
        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {!selectedCountry
          ? "Select country"
          : !amount || parseFloat(amount) <= 0
          ? "Enter amount"
          : parseFloat(amount) > parseFloat(stableCoinBalance.toString())
          ? "Insufficient balance"
          : !selectedBankAccount
          ? "Select bank account"
          : "Continue"}
      </Button>
    </div>
  );
}
