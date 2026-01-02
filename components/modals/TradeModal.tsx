"use client";

import React, { useState } from "react";
import {
  XMarkIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ClipboardIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/contexts/ToastContext";
import { useAuth } from "@/contexts/AuthContext";
import { executeSwap } from "@/api/routes/swaps";
import { SwapType } from "@/enums";
import { TradeSwapModal } from "./TradeSwapModal";
import { TradeBuyModal } from "./TradeBuyModal";
import { TradeSellModal } from "./TradeSellModal";
import { initiateBuy } from "@/api/routes/buy";
import { initiateSell } from "@/api/routes/sell";

interface TradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransactionComplete: (txId: string) => Promise<void>;
}

type TradeTab = "buy" | "sell" | "swap";
type Step = "select" | "confirm" | "processing" | "success";

interface SwapData {
  fromToken: string;
  toToken: string;
  amount: string;
  estimated: string;
  direction: "cryptoToStable" | "stableToCrypto";
}

interface BuyData {
  country: string;
  amount: string;
  stableCoin: string;
  paymentMethod: string;
}

interface SellData {
  country: string;
  stableCoin: string;
  amount: string;
  bankAccount: {
    accountNumber?: string;
    accountName?: string;
    bankName?: string;
    bankCode?: string;
  } | null;
}

export function TradeModal({
  isOpen,
  onClose,
  onTransactionComplete,
}: TradeModalProps) {
  const { addToast } = useToast();
  const { token, user } = useAuth();
  const [activeTab, setActiveTab] = useState<TradeTab>("swap");
  const [step, setStep] = useState<Step>("select");
  const [transactionHash, setTransactionHash] = useState<string>("");

  // Form data for each tab
  const [swapData, setSwapData] = useState<SwapData | null>(null);
  const [buyData, setBuyData] = useState<BuyData | null>(null);
  const [sellData, setSellData] = useState<SellData | null>(null);

  const handleSwapContinue = (data: SwapData) => {
    setSwapData(data);
    setStep("confirm");
  };

  const handleBuyContinue = (data: BuyData) => {
    setBuyData(data);
    setStep("confirm");
  };

  const handleSellContinue = (data: SellData) => {
    setSellData(data);
    setStep("confirm");
  };

  const confirmTransaction = async () => {
    setStep("processing");

    if (!token || !user) {
      addToast("Authentication required", "error");
      setStep("select");
      return;
    }

    try {
      let response;

      if (activeTab === "swap" && swapData) {
        // Execute swap transaction
        const payload = {
          from: swapData.fromToken,
          to: swapData.toToken,
          amount: parseFloat(swapData.amount),
          estimated: parseFloat(swapData.estimated),
          rate:
            parseFloat(swapData.estimated) / parseFloat(swapData.amount) || 0,
          status: "pending",
          userId: user.id,
          reference: `SWAP_${Date.now()}`,
          swapType: SwapType.MARKET, // Use MARKET for all swaps (token-to-token, stable-to-token, etc.)
        };

        response = await executeSwap(token, payload);
      } else if (activeTab === "buy" && buyData) {
        // 1. Prepare the payload
        const payload = {
          amountNGN: parseFloat(buyData.amount),
          paymentMethod: buyData.paymentMethod,
        };

        try {
          // 2. Initiate the buy process
          const response = await initiateBuy(payload, token);

          if (!response.success) {
            throw new Error(response.message || "Failed to initiate payment");
          }

          if (response.data.paymentLink) {
            window.location.href = response.data.paymentLink;
            return;
          }

          // // 3. Load Flutterwave script dynamically
          // const loadFlutterwaveScript = () => {
          //   return new Promise((resolve) => {
          //     if (document.getElementById('flutterwave-script')) {
          //       return resolve(true);
          //     }
          //     const script = document.createElement('script');
          //     script.id = 'flutterwave-script';
          //     script.src = 'https://checkout.flutterwave.com/v3.js';
          //     script.onload = () => resolve(true);
          //     document.body.appendChild(script);
          //   });
          // };

          // await loadFlutterwaveScript();

          // // 4. Show Flutterwave payment modal
          // await new Promise((resolve, reject) => {
          //   window.FlutterwaveCheckout({
          //     public_key: response.data?.data?.publicKey,
          //     tx_ref: response?.data?.data?.txRef,
          //     amount: response?.data?.data?.amount,
          //     currency: response?.data?.data?.currency,
          //     payment_options: 'card,banktransfer',
          //     customer: response?.data?.data?.customer,
          //     customizations: response?.data?.data?.customizations,
          //     callback: async (paymentResponse: any) => {
          //       if (paymentResponse.status === 'successful') {
          //         try {
          //           await onTransactionComplete(paymentResponse);
          //           onClose();
          //         } catch (error) {
          //           console.error('Error completing transaction:', error);
          //         }
          //       } else {
          //         addToast('Payment was not successful. Please try again.', 'error');
          //       }
          //     },
          //     onclose: () => {
          //       reject(new Error('Payment modal closed'));
          //     },
          //   });
          // });
        } catch (error) {
          console.error("Payment error:", error);
          addToast("Payment failed. Please try again.", "error");
        }
      } else if (activeTab === "sell" && sellData) {
        try {
          // Prepare payload
          const payload = {
            amount: parseFloat(sellData.amount),
            currency: sellData.country,
            bankAccount: sellData.bankAccount,
          };

          const sellResponse = await initiateSell(payload, token);

          if (!sellResponse.success) {
            throw new Error(sellResponse.message || "Failed to initiate sell");
          }

          // Normalize response to include a transaction_hash for downstream handling
          const backendData = sellResponse.data;
          response = {
            transaction_hash:
              backendData?.data?.transactionHash ||
              backendData?.data?.id ||
              `SELL_${Date.now()}`,
            status:
              backendData?.data?.status ||
              (backendData?.success ? "processing" : "failed"),
            raw: backendData,
          };

          addToast("Sell initiated. Awaiting payout confirmation.", "success");
        } catch (error) {
          console.error("Sell error:", error);
          addToast("Sell failed. Please try again.", "error");
          setStep("select");
          return;
        }
      } else {
        throw new Error("Invalid transaction data");
      }

      if (response?.transaction_hash) {
        setTransactionHash(response.transaction_hash);
      } else if (response?.transaction?.transactionHash) {
        setTransactionHash(response.transaction.transactionHash);
      } else if (response?.transactionHash) {
        setTransactionHash(response.transactionHash);
      }

      setStep("success");
      const txHash =
        response?.transaction_hash ||
        response?.transaction?.transactionHash ||
        response?.transactionHash;
      if (txHash) {
        onTransactionComplete(txHash);
      }
    } catch (error) {
      console.error("Transaction error:", error);
      addToast("Transaction failed", "error");
      setStep("select");
    }
  };

  const handleClose = () => {
    setStep("select");
    setSwapData(null);
    setBuyData(null);
    setSellData(null);
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
              <h2 className="text-2xl font-bold text-white">Trade</h2>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Tabs */}
          {step === "select" && (
            <Tabs
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as TradeTab)}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3 bg-gray-800">
                <TabsTrigger
                  value="swap"
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  Swap
                </TabsTrigger>
                <TabsTrigger
                  value="buy"
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  Buy
                </TabsTrigger>
                <TabsTrigger
                  value="sell"
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  Sell
                </TabsTrigger>
              </TabsList>

              <TabsContent value="swap" className="mt-4">
                <TradeSwapModal onContinue={handleSwapContinue} />
              </TabsContent>

              <TabsContent value="buy" className="mt-4">
                <TradeBuyModal onContinue={handleBuyContinue} />
              </TabsContent>

              <TabsContent value="sell" className="mt-4">
                <TradeSellModal onContinue={handleSellContinue} />
              </TabsContent>
            </Tabs>
          )}

          {/* Confirm Transaction */}
          {step === "confirm" && (
            <div className="space-y-6">
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ArrowPathIcon className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Confirm{" "}
                  {activeTab === "swap"
                    ? "Swap"
                    : activeTab === "buy"
                    ? "Buy"
                    : "Sell"}
                </h3>
                <p className="text-gray-400">Review your transaction details</p>
              </div>

              <div className="bg-gray-800 p-4 rounded-lg space-y-3">
                {activeTab === "swap" && swapData && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-400">From:</span>
                      <span className="text-white font-semibold">
                        {swapData.amount} {swapData.fromToken}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">To:</span>
                      <span className="text-white font-semibold">
                        {swapData.estimated} {swapData.toToken}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Type:</span>
                      <span className="text-white font-semibold">
                        {swapData.direction === "cryptoToStable"
                          ? "Crypto → Stable Coin"
                          : "Stable Coin → Crypto"}
                      </span>
                    </div>
                  </>
                )}

                {activeTab === "buy" && buyData && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Country:</span>
                      <span className="text-white font-semibold">
                        {buyData.country}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Amount:</span>
                      <span className="text-white font-semibold">
                        {buyData.amount} {buyData.country}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">You'll Receive:</span>
                      <span className="text-white font-semibold">
                        {buyData.amount} {buyData.stableCoin}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Payment Method:</span>
                      <span className="text-white font-semibold">
                        {buyData.paymentMethod}
                      </span>
                    </div>
                  </>
                )}

                {activeTab === "sell" && sellData && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Country:</span>
                      <span className="text-white font-semibold">
                        {sellData.country}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Selling:</span>
                      <span className="text-white font-semibold">
                        {sellData.amount} {sellData.stableCoin}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">You'll Receive:</span>
                      <span className="text-white font-semibold">
                        {sellData.amount} {sellData.country}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Bank Account:</span>
                      <span className="text-white font-semibold">
                        {sellData.bankAccount?.accountName || ""}{" "}
                        {sellData.bankAccount?.bankName
                          ? "• " + sellData.bankAccount?.bankName
                          : ""}{" "}
                        {sellData.bankAccount?.accountNumber
                          ? "• " + sellData.bankAccount?.accountNumber
                          : ""}
                      </span>
                    </div>
                  </>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-400">Network Fee:</span>
                  <span className="text-white">~$0.50</span>
                </div>
                <div className="border-t border-gray-700 pt-3 flex justify-between">
                  <span className="text-gray-400">Total:</span>
                  <span className="text-white font-bold text-lg">
                    {activeTab === "swap" && swapData
                      ? (parseFloat(swapData.amount || "0") + 0.5).toFixed(2)
                      : activeTab === "buy" && buyData
                      ? (parseFloat(buyData.amount || "0") + 0.5).toFixed(2)
                      : activeTab === "sell" && sellData
                      ? (parseFloat(sellData.amount || "0") + 0.5).toFixed(2)
                      : "0.00"}
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
                  Confirm{" "}
                  {activeTab === "swap"
                    ? "Swap"
                    : activeTab === "buy"
                    ? "Buy"
                    : "Sell"}
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
                {activeTab === "swap"
                  ? "Swap"
                  : activeTab === "buy"
                  ? "Buy"
                  : "Sell"}{" "}
                Queued!
              </h3>
              <p className="text-gray-400 mb-6">
                Your transaction is been processed
              </p>
              <p className="text-gray-400 mb-6">ETA 30mins</p>
              <div className="bg-gray-800 p-4 rounded-lg mb-6">
                <div className="text-3xl font-bold text-purple-400 mb-1">
                  {activeTab === "swap" && swapData
                    ? swapData.estimated
                    : activeTab === "buy" && buyData
                    ? buyData.amount
                    : activeTab === "sell" && sellData
                    ? sellData.amount
                    : "0"}
                </div>
                <div className="text-sm text-gray-400">
                  Successfully Processed
                </div>
                {transactionHash && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="text-sm text-gray-400 mb-2">
                      Transaction ID
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
                          addToast(
                            "Transaction hash copied to clipboard",
                            "success"
                          );
                        }}
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                        title="Copy transaction hash"
                      >
                        <ClipboardIcon className="h-5 w-5" />
                      </button>
                    </div>
                    {/* <a
                      href={`https://sepolia.starkscan.co/tx/${transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-purple-400 hover:text-purple-300 text-sm transition-colors"
                    >
                      View on StarkScan
                      <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-1" />
                    </a> */}
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
}
