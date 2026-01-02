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
import { transferToken } from "@/api/routes/transfers";
import { useWalletBalances } from "@/hooks/use-wallet-balances";
import { getTokenIcon } from "@/lib/tokenIcons";

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransactionComplete: (txHash: string) => void;
}

const TransferModal: React.FC<TransferModalProps> = ({
  isOpen,
  onClose,
  onTransactionComplete,
}) => {
  const { addToast } = useToast();
  const { token } = useAuth();
  const [transferType, setTransferType] = useState<
    "tokenToToken" | "fiatToFiat"
  >("tokenToToken");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedToken, setSelectedToken] = useState("USDC/USD");
  const [step, setStep] = useState<
    "select" | "confirm" | "processing" | "success"
  >("select");
  const [transactionHash, setTransactionHash] = useState<string>("");
  const [showTokenDropdown, setShowTokenDropdown] = useState(false);

  const { data: walletData, isLoading: isLoadingWallets } = useWalletBalances();

  const availableToken = useMemo(
    () =>
      walletData?.cryptoBalances.map((balance) => ({
        id: `${balance.tokenSymbol}/USD`,
        name: balance.tokenSymbol,
        balance: balance.balance,
        isActive: true,
      })).sort((a, b) => {
        const priorityOrder = ['USDC', 'ETH'];
        const aPriority = priorityOrder.indexOf(a.name || '');
        const bPriority = priorityOrder.indexOf(b.name || '');
        if (aPriority !== -1 && bPriority !== -1) {
          return aPriority - bPriority;
        }
        if (aPriority !== -1) return -1;
        if (bPriority !== -1) return 1;
        return 0;
      }) || [],
    [walletData]
  );

  const handleContinue = () => {
    if (!amount || parseFloat(amount) <= 0) {
      addToast("Please enter a valid amount", "error");
      return;
    }
    if (!recipientAddress) {
      addToast("Please enter a recipient address", "error");
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
      const payload = {
        toAddress: recipientAddress,
        amount: parseFloat(amount),
        tokenSymbol: selectedToken.split("/")[0]
      };

      response = await transferToken(payload, token);

      if (response?.transaction_hash) {
        setTransactionHash(response.transaction_hash);
      } else if (response?.transaction?.transactionHash) {
        setTransactionHash(response.transaction.transactionHash);
      }
      setStep("success");
      const txHash = response?.transaction_hash || response?.transaction?.transactionHash;
      if (txHash) {
        onTransactionComplete(txHash);
        addToast("Transaction submitted!", "success");
      } else {
        addToast("Transaction successful!", "success");
      }
      handleClose();
    } catch (error) {
      addToast("Transaction failed", "error");
      setStep("select");
      handleClose();
    }
  };

  const handleClose = () => {
    setStep("select");
    setAmount("");
    setRecipientAddress("");
    setTransactionHash("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <Card className="bg-gray-900 border-gray-700 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <ArrowPathIcon className="h-6 w-6 text-purple-400 mr-2" />
              <h2 className="text-2xl font-bold text-white">Transfer Tokens</h2>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {step === "select" && (
            <div className="space-y-6">
                <>
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
                            {selectedToken && (
                              <img
                                src={getTokenIcon(availableToken.find((t) => t.id === selectedToken)?.name || '')}
                                alt={availableToken.find((t) => t.id === selectedToken)?.name || 'Token'}
                                className="h-6 w-6 rounded-full"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = '/images/tokens/default-token.png';
                                }}
                              />
                            )}
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
                </>

              <div>
                <label className="text-sm font-medium text-gray-400 mb-2 block">
                  Transfer amount
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white text-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <Button
                onClick={handleContinue}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg"
              >
                Continue
              </Button>
            </div>
          )}

          {step === "confirm" && (
            <div className="space-y-6">
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ArrowPathIcon className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Confirm Transfer
                </h3>
                <p className="text-gray-400">Review your transaction details</p>
              </div>

              <div className="bg-gray-800 p-4 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Recipient:</span>
                  <span className="text-white font-semibold">{`${recipientAddress.slice(0, 6)}...${recipientAddress.slice(-6)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Amount:</span>
                  <span className="text-white font-semibold">{amount} {selectedToken.split('/')[0]}</span>
                </div>
                <div className="border-t border-gray-700 pt-3 flex justify-between">
                  <span className="text-gray-400">Total:</span>
                  <span className="text-white font-bold text-lg">
                    {amount}
                  </span>
                </div>
              </div>

              <Button
                onClick={confirmTransaction}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg"
              >
                Confirm & Transfer
              </Button>
              <Button
                onClick={() => setStep("select")}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white py-4"
              >
                Back
              </Button>
            </div>
          )}

          {step === "success" && (
            <div className="text-center py-10">
                <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Transfer Successful!</h3>
                <p className="text-gray-400 mb-4">Your funds have been sent.</p>
                <div className="bg-gray-800 p-4 rounded-lg space-y-2 text-left">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Transaction Hash:</span>
                        <div className="flex items-center">
                            <span className="text-white font-mono text-xs">{`${transactionHash.slice(0, 10)}...${transactionHash.slice(-8)}`}</span>
                            <button onClick={() => navigator.clipboard.writeText(transactionHash)} className="ml-2 text-gray-400 hover:text-white">
                                <ClipboardIcon className="h-4 w-4" />
                            </button>
                            <a href={`https://starkscan.co/tx/${transactionHash}`} target="_blank" rel="noopener noreferrer" className="ml-2 text-gray-400 hover:text-white">
                                <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                            </a>
                        </div>
                    </div>
                </div>
                <Button onClick={handleClose} className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 mt-6">
                    Done
                </Button>
            </div>
        )}

        </CardContent>
      </Card>
    </div>
  );
};

export default TransferModal;
