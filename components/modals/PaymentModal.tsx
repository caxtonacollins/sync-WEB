"use client";

import React, { useMemo, useState } from "react";
import {
  XMarkIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ClipboardIcon,
  ArrowTopRightOnSquareIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/contexts/ToastContext";
import { useAuth } from "@/contexts/AuthContext";
import { transferToken, transferFiat } from "@/api/routes/transfers";
import { executeSwap } from "@/api/routes/swaps";
import { SwapType } from "@/enums";
import { useWalletBalances } from "@/hooks/use-wallet-balances";
import { useExchangeRates } from "@/hooks/use-exchange-rates";

interface ExchangeRate {
  fiatSymbol: string;
  tokenSymbol: string;
  rate: number;
  lastUpdated: string;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose }) => {
  const { addToast } = useToast();
  const { token, user } = useAuth();
  const [mode, setMode] = useState<"swap" | "transfer">("swap");
  const [direction, setDirection] = useState<"tokenToFiat" | "fiatToToken">(
    "tokenToFiat"
  );
  const [transferType, setTransferType] = useState<
    "tokenToToken" | "fiatToFiat"
  >("tokenToToken");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedToken, setSelectedToken] = useState("USDC/USD");
  const [selectedFiat, setSelectedFiat] = useState("USD");
  const [step, setStep] = useState<
    "select" | "confirm" | "processing" | "success"
  >("select");
  const [transactionHash, setTransactionHash] = useState<string>("");
  const [showTokenDropdown, setShowTokenDropdown] = useState(false);
  const [showFiatDropdown, setShowFiatDropdown] = useState(false);

  const { data: walletData, isLoading: isLoadingWallets } = useWalletBalances();

  // Convert wallet data to UI format with ETH and USDC prioritized
  const availableToken = useMemo(
    () =>
      walletData?.cryptoBalances.map((balance) => ({
        id: `${balance.currency}/USD`,
        name: balance.currency,
        balance: balance.balance,
        isActive: true,
      })).sort((a, b) => {
        // Prioritize ETH and USDC
        const priorityOrder = ['USDC', 'ETH'];
        const aPriority = priorityOrder.indexOf(a.name);
        const bPriority = priorityOrder.indexOf(b.name);
        if (aPriority !== -1 && bPriority !== -1) {
          return aPriority - bPriority;
        }
        if (aPriority !== -1) return -1;
        if (bPriority !== -1) return 1;
        return 0;
      }) || [],
    [walletData]
  );

  const availableFiat = useMemo(
    () =>
      walletData?.fiatBalances.map((balance) => ({
        id: balance.currency,
        name: balance.currency,
        balance: balance.balance,
        isActive: true,
      })) || [],
    [walletData]
  );

  // Get live exchange rates
  const { data: exchangeRates } = useExchangeRates();

  // Build rates object from live data
  const rates = useMemo(() => {
    const ratesObj: Record<string, number> = {};

    if (exchangeRates) {
      exchangeRates.forEach((rate: ExchangeRate) => {
        if (rate.fiatSymbol === "USD") {
          ratesObj[`${rate.tokenSymbol}/USD`] = rate.rate;
        } else if (rate.fiatSymbol === "NGN" && rate.tokenSymbol === "USD") {
          ratesObj.USD_NGN = rate.rate;
        }
      });
    }

    return ratesObj;
  }, [exchangeRates]);

  const estimated = useMemo(() => {
    const amt = parseFloat(amount || "0");
    if (!amt || Number.isNaN(amt)) return "0";
    if (mode === "swap") {
      if (direction === "tokenToFiat") {
        const usd = amt * (rates[selectedToken as keyof typeof rates] || 0);
        return selectedFiat === "USD"
          ? usd.toFixed(2)
          : (usd * rates.USD_NGN).toFixed(2);
      } else {
        // fiat -> token
        const usd = selectedFiat === "USD" ? amt : amt / rates.USD_NGN;
        const price = rates[selectedToken as keyof typeof rates] || 1;
        const tokenOut = price ? usd / price : 0;
        return tokenOut.toFixed(6);
      }
    }
    // transfer mode: just echo amount
    return amt.toFixed(2);
  }, [amount, direction, mode, rates, selectedFiat, selectedToken]);

  const handleContinue = () => {
    if (!amount || parseFloat(amount) <= 0) {
      addToast("Please enter a valid amount", "error");
      return;
    }
    setStep("confirm");
  };

  const confirmTransaction = async () => {
    setStep("processing");

    if (!token) {
      addToast("Authentication token not found.", "error");
      setStep("select");
      return;
    }

    try {
      let response;
      if (mode === "transfer") {
        const payload = {
          toAddress: recipientAddress,
          amount: parseFloat(amount),
          token:
            transferType === "tokenToToken"
              ? selectedToken.split("/")[0]
              : selectedFiat,
        };

        console.log("payload", payload);
        if (transferType === "tokenToToken") {
          response = await transferToken(payload, token);
        } else {
          response = await transferFiat(payload, token);
        }
      } else if (mode === "swap") {
        if (!user) {
          addToast("User not found.", "error");
          setStep("select");
          return;
        }

        const payload = {
          fromCurrency:
            direction === "tokenToFiat"
              ? selectedToken.split("/")[0]
              : selectedFiat,
          toCurrency:
            direction === "tokenToFiat"
              ? selectedFiat
              : selectedToken.split("/")[0],
          fromAmount: parseFloat(amount),
          toAmount: parseFloat(estimated),
          rate: parseFloat(estimated) / parseFloat(amount) || 0,
          status: "pending",
          userId: user!.id,
          reference: `SWAP_${Date.now()}`,
          swapType:
            direction === "tokenToFiat"
              ? SwapType.TOKENTOFIAT
              : SwapType.FIATTOTOKEN,
        };

        response = await executeSwap(token, payload);
      }

      if (response?.transaction_hash) {
        setTransactionHash(response.transaction_hash);
      } else if (response?.transaction?.transactionHash) {
        setTransactionHash(response.transaction.transactionHash);
      } else if (response?.transactionHash) {
        setTransactionHash(response.transactionHash);
      }
      setStep("success");
      addToast("Transaction successful!", "success");
    } catch (error) {
      addToast("Transaction failed", "error");
      setStep("select");
    }
  };

  const handleClose = () => {
    setStep("select");
    setAmount("");
    setMode("swap");
    setTransactionHash("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <Card className="bg-gray-900 border-gray-700 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <ArrowPathIcon className="h-6 w-6 text-purple-400 mr-2" />
              <h2 className="text-2xl font-bold text-white">Swap / Transfer</h2>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Mode & Direction */}
          {step === "select" && (
            <div className="mb-4 grid grid-cols-2 gap-2">
              <button
                onClick={() => setMode("swap")}
                className={`py-2 rounded-lg border ${
                  mode === "swap"
                    ? "border-purple-500 text-white"
                    : "border-gray-700 text-gray-300"
                } bg-gray-800`}
              >
                Swap
              </button>
              <button
                onClick={() => setMode("transfer")}
                className={`py-2 rounded-lg border ${
                  mode === "transfer"
                    ? "border-purple-500 text-white"
                    : "border-gray-700 text-gray-300"
                } bg-gray-800`}
              >
                Transfer
              </button>
            </div>
          )}

          {/* Select Assets & Amount */}
          {step === "select" && (
            <div className="space-y-6">
              {mode === "swap" && (
                <>
                  <div>
                    <label className="text-sm font-medium text-gray-400 mb-2 block">
                      Select Token
                    </label>
                    <div className="relative">
                      <button
                        onClick={() => setShowTokenDropdown(!showTokenDropdown)}
                        className="w-full flex items-center justify-between p-4 bg-gray-800 border-2 border-gray-700 rounded-lg hover:border-purple-500 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-left">
                            <p className="font-semibold text-white">
                              {availableToken.find((t) => t.id === selectedToken)?.name || "Select Token"}
                              {availableToken.find((t) => t.id === selectedToken)?.name === 'ETH' && (
                                <span className="ml-2 text-xs bg-blue-900 text-blue-400 px-2 py-1 rounded">
                                  Popular
                                </span>
                              )}
                              {availableToken.find((t) => t.id === selectedToken)?.name === 'USDC' && (
                                <span className="ml-2 text-xs bg-green-900 text-green-400 px-2 py-1 rounded">
                                  Stable
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-gray-400">
                              Balance: {availableToken.find((t) => t.id === selectedToken)?.balance || 0}
                            </p>
                          </div>
                        </div>
                        <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform ${
                          showTokenDropdown ? "rotate-180" : ""
                        }`} />
                      </button>

                      {showTokenDropdown && (
                        <div className="absolute z-10 w-full mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                          {availableToken.map((t) => (
                            <button
                              key={t.id}
                              onClick={() => {
                                setSelectedToken(t.id);
                                setShowTokenDropdown(false);
                              }}
                              className="w-full flex items-center justify-between p-4 hover:bg-gray-700 transition-colors border-b border-gray-700 last:border-0"
                            >
                              <div className="text-left">
                                <p className="font-semibold text-white">
                                  {t.name}
                                  {t.name === 'ETH' && (
                                    <span className="ml-2 text-xs bg-blue-900 text-blue-400 px-2 py-1 rounded">
                                      Popular
                                    </span>
                                  )}
                                  {t.name === 'USDC' && (
                                    <span className="ml-2 text-xs bg-green-900 text-green-400 px-2 py-1 rounded">
                                      Stable
                                    </span>
                                  )}
                                </p>
                                <p className="text-xs text-gray-400">
                                  Balance: {t.balance}
                                </p>
                              </div>
                              <Badge className="bg-purple-900 text-purple-400">
                                Token
                              </Badge>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Direction</span>
                    <div className="flex bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                      <button
                        onClick={() => setDirection("tokenToFiat")}
                        className={`px-3 py-1 text-sm ${
                          direction === "tokenToFiat"
                            ? "bg-purple-600 text-white"
                            : "text-gray-300"
                        }`}
                      >
                        Token → Fiat
                      </button>
                      <button
                        onClick={() => setDirection("fiatToToken")}
                        className={`px-3 py-1 text-sm ${
                          direction === "fiatToToken"
                            ? "bg-purple-600 text-white"
                            : "text-gray-300"
                        }`}
                      >
                        Fiat → Token
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400 mb-2 block">
                      Select Fiat
                    </label>
                    <div className="relative">
                      <button
                        onClick={() => setShowFiatDropdown(!showFiatDropdown)}
                        className="w-full flex items-center justify-between p-4 bg-gray-800 border-2 border-gray-700 rounded-lg hover:border-purple-500 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <p className="font-semibold text-white">
                            {availableFiat.find((f) => f.id === selectedFiat)?.name || "Select Fiat"}
                          </p>
                        </div>
                        <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform ${
                          showFiatDropdown ? "rotate-180" : ""
                        }`} />
                      </button>

                      {showFiatDropdown && (
                        <div className="absolute z-10 w-full mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                          {availableFiat.map((f) => (
                            <button
                              key={f.id}
                              onClick={() => {
                                setSelectedFiat(f.id);
                                setShowFiatDropdown(false);
                              }}
                              className="w-full flex items-center justify-between p-3 hover:bg-gray-700 transition-colors border-b border-gray-700 last:border-0"
                            >
                              <p className="font-semibold text-white">{f.name}</p>
                              <Badge className="bg-blue-900 text-blue-400">
                                Fiat
                              </Badge>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {mode === "transfer" && (
                <>
                  <div className="mb-4 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setTransferType("tokenToToken")}
                      className={`py-2 rounded-lg border ${
                        transferType === "tokenToToken"
                          ? "border-purple-500 text-white"
                          : "border-gray-700 text-gray-300"
                      } bg-gray-800`}
                    >
                      Token → Token
                    </button>
                    <button
                      onClick={() => setTransferType("fiatToFiat")}
                      className={`py-2 rounded-lg border ${
                        transferType === "fiatToFiat"
                          ? "border-purple-500 text-white"
                          : "border-gray-700 text-gray-300"
                      } bg-gray-800`}
                    >
                      Fiat → Fiat
                    </button>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-400 mb-2 block">
                      Recipient Address
                    </label>
                    <input
                      type="text"
                      placeholder={
                        transferType === "tokenToToken"
                          ? "Enter Starknet address"
                          : "Enter recipient's email"
                      }
                      value={recipientAddress}
                      onChange={(e) => setRecipientAddress(e.target.value)}
                      className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white text-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  {transferType === "tokenToToken" && (
                    <div>
                      <label className="text-sm font-medium text-gray-400 mb-2 block">
                        Select Token
                      </label>
                      <div className="relative">
                        <button
                          onClick={() => setShowTokenDropdown(!showTokenDropdown)}
                          className="w-full flex items-center justify-between p-4 bg-gray-800 border-2 border-gray-700 rounded-lg hover:border-purple-500 transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-left">
                              <p className="font-semibold text-white">
                                {availableToken.find((t) => t.id === selectedToken)?.name || "Select Token"}
                                {availableToken.find((t) => t.id === selectedToken)?.name === 'ETH' && (
                                  <span className="ml-2 text-xs bg-blue-900 text-blue-400 px-2 py-1 rounded">
                                    Popular
                                  </span>
                                )}
                                {availableToken.find((t) => t.id === selectedToken)?.name === 'USDC' && (
                                  <span className="ml-2 text-xs bg-green-900 text-green-400 px-2 py-1 rounded">
                                    Stable
                                  </span>
                                )}
                              </p>
                              <p className="text-xs text-gray-400">
                                Balance: {availableToken.find((t) => t.id === selectedToken)?.balance || 0}
                              </p>
                            </div>
                          </div>
                          <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform ${
                            showTokenDropdown ? "rotate-180" : ""
                          }`} />
                        </button>

                        {showTokenDropdown && (
                          <div className="absolute z-10 w-full mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                            {availableToken.map((t) => (
                              <button
                                key={t.id}
                                onClick={() => {
                                  setSelectedToken(t.id);
                                  setShowTokenDropdown(false);
                                }}
                                className="w-full flex items-center justify-between p-4 hover:bg-gray-700 transition-colors border-b border-gray-700 last:border-0"
                              >
                                <div className="text-left">
                                  <p className="font-semibold text-white">
                                    {t.name}
                                    {t.name === 'ETH' && (
                                      <span className="ml-2 text-xs bg-blue-900 text-blue-400 px-2 py-1 rounded">
                                        Popular
                                      </span>
                                    )}
                                    {t.name === 'USDC' && (
                                      <span className="ml-2 text-xs bg-green-900 text-green-400 px-2 py-1 rounded">
                                        Stable
                                      </span>
                                    )}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    Balance: {t.balance}
                                  </p>
                                </div>
                                <Badge className="bg-purple-900 text-purple-400">
                                  Token
                                </Badge>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {transferType === "fiatToFiat" && (
                    <div>
                      <label className="text-sm font-medium text-gray-400 mb-2 block">
                        Select Fiat Currency
                      </label>
                      <div className="relative">
                        <button
                          onClick={() => setShowFiatDropdown(!showFiatDropdown)}
                          className="w-full flex items-center justify-between p-4 bg-gray-800 border-2 border-gray-700 rounded-lg hover:border-purple-500 transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <p className="font-semibold text-white">
                              {availableFiat.find((f) => f.id === selectedFiat)?.name || "Select Fiat"}
                            </p>
                          </div>
                          <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform ${
                            showFiatDropdown ? "rotate-180" : ""
                          }`} />
                        </button>

                        {showFiatDropdown && (
                          <div className="absolute z-10 w-full mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                            {availableFiat.map((f) => (
                              <button
                                key={f.id}
                                onClick={() => {
                                  setSelectedFiat(f.id);
                                  setShowFiatDropdown(false);
                                }}
                                className="w-full flex items-center justify-between p-3 hover:bg-gray-700 transition-colors border-b border-gray-700 last:border-0"
                              >
                                <p className="font-semibold text-white">{f.name}</p>
                                <Badge className="bg-blue-900 text-blue-400">
                                  Fiat
                                </Badge>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}

              <div>
                <label className="text-sm font-medium text-gray-400 mb-2 block">
                  {mode === "swap"
                    ? direction === "tokenToFiat"
                      ? "Token amount"
                      : `${selectedFiat} amount`
                    : "Transfer amount"}
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white text-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <div className="flex justify-between mt-2 text-sm">
                  <span className="text-gray-400">
                    Estimated: {estimated}{" "}
                    {mode === "swap"
                      ? direction === "tokenToFiat"
                        ? selectedFiat
                        : availableToken.find((t) => t.id === selectedToken)
                            ?.name
                      : selectedFiat}
                  </span>
                  <button
                    onClick={() => setAmount("450")}
                    className="text-purple-400 hover:text-purple-300"
                  >
                    Max
                  </button>
                </div>
              </div>

              <div className="bg-gray-800 p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Network Fee:</span>
                  <span className="text-white">~$0.50</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Estimated Time:</span>
                  <span className="text-white">~30 seconds</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Network:</span>
                  <Badge className="bg-purple-900 text-purple-400">
                    StarkNet
                  </Badge>
                </div>
              </div>

              <Button
                onClick={handleContinue}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg"
              >
                Continue
              </Button>
            </div>
          )}

          {/* Confirm Transaction */}
          {step === "confirm" && (
            <div className="space-y-6">
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ArrowPathIcon className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Confirm {mode === "swap" ? "Swap" : "Transfer"}
                </h3>
                <p className="text-gray-400">Review your transaction details</p>
              </div>

              <div className="bg-gray-800 p-4 rounded-lg space-y-3">
                {mode === "swap" && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Token:</span>
                      <span className="text-white font-semibold">
                        {
                          availableToken.find((p) => p.id === selectedToken)
                            ?.name
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Fiat:</span>
                      <span className="text-white font-semibold">
                        {selectedFiat}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Direction:</span>
                      <span className="text-white font-semibold">
                        {direction === "tokenToFiat"
                          ? "Token → Fiat"
                          : "Fiat → Token"}
                      </span>
                    </div>
                  </>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-400">Amount:</span>
                  <span className="text-white font-semibold">{amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Network Fee:</span>
                  <span className="text-white">$0.50</span>
                </div>
                <div className="border-t border-gray-700 pt-3 flex justify-between">
                  <span className="text-gray-400">Total:</span>
                  <span className="text-white font-bold text-lg">
                    {(parseFloat(amount || "0") + 0.5).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={() => setStep("select")}
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  Back
                </Button>
                <Button
                  onClick={confirmTransaction}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {mode === "swap" ? "Confirm Swap" : "Confirm Transfer"}
                </Button>
              </div>
            </div>
          )}

          {/* Processing */}
          {step === "processing" && (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <h3 className="text-xl font-bold text-white mb-2">
                Processing Transaction
              </h3>
              <p className="text-gray-400">
                Please wait while we process your transaction...
              </p>
              <p className="text-sm text-gray-500 mt-4">
                This may take up to 30 seconds
              </p>
            </div>
          )}

          {/* Success */}
          {step === "success" && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircleIcon className="h-10 w-10 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {mode === "swap" ? "Swap" : "Transfer"} Successful!
              </h3>
              <p className="text-gray-400 mb-6">
                {mode === "swap"
                  ? `Completed ${
                      direction === "tokenToFiat"
                        ? "Token → Fiat"
                        : "Fiat → Token"
                    } using ${
                      availableToken.find((p) => p.id === selectedToken)?.name
                    }/${selectedFiat}`
                  : `Your transfer has been processed`}
              </p>
              <div className="bg-gray-800 p-4 rounded-lg mb-6">
                <div className="text-3xl font-bold text-purple-400 mb-1">
                  {amount}
                </div>
                <div className="text-sm text-gray-400">
                  Successfully {mode === "swap" ? "Processed" : "Transferred"}
                </div>
                {transactionHash && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="text-sm text-gray-400 mb-2">
                      Transaction Hash
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex-1 bg-gray-900 p-3 rounded-lg border border-gray-600">
                        <div className="text-purple-400 text-sm font-mono break-all">
                          {transactionHash}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(transactionHash);
                          addToast("Transaction hash copied to clipboard", "success");
                        }}
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                        title="Copy transaction hash"
                      >
                        <ClipboardIcon className="h-5 w-5" />
                      </button>
                    </div>
                    <a
                      href={`https://sepolia.starkscan.co/tx/${transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-purple-400 hover:text-purple-300 text-sm transition-colors"
                    >
                      View on StarkScan
                      <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-1" />
                    </a>
                  </div>
                )}
              </div>
              <Button
                onClick={handleClose}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                Done
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentModal;
