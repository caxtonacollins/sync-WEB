"use client";

import React, { useState, useEffect } from 'react';
import { useToast } from "@/contexts/ToastContext";
import {
  CreditCardIcon,
  CurrencyDollarIcon,
  QrCodeIcon,
  BoltIcon,
  ChevronDownIcon,
  ClipboardDocumentIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatAddress, formatCurrency } from "@/lib/utils/formatters";
import TransferModal from "@/components/transfer/TransferModal";
import ManageLiquidityModal from "@/components/modals/ManageLiquidityModal";
import ViewSettlementsModal from "@/components/modals/ViewSettlementsModal";
import GenerateQRModal from "@/components/modals/GenerateQRModal";
import ScanQRModal from "@/components/modals/ScanQRModal";
import { useWalletData } from "@/hooks/useWalletData";
import PaymentModal from "./modals/PaymentModal";
import { Badge } from './ui/badge';

export default function HybridPaymentDashboard() {
  const { addToast } = useToast();

  const { data: walletData } = useWalletData();

  // Modal states
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showBridgeModal, setShowBridgeModal] = useState(false);
  const [showManageLiquidityModal, setShowManageLiquidityModal] = useState(false);
  const [showSettlementsModal, setShowSettlementsModal] = useState(false);
  const [showGenerateQRModal, setShowGenerateQRModal] = useState(false);
  const [showScanQRModal, setShowScanQRModal] = useState(false);

  // Dropdown states
  const [showFiatDropdown, setShowFiatDropdown] = useState(false);
  const [showCryptoDropdown, setShowCryptoDropdown] = useState(false);
  const [selectedFiat, setSelectedFiat] = useState<any>(null);
  const [selectedCrypto, setSelectedCrypto] = useState<any>(null);



  // Copy states
  const [copiedFiat, setCopiedFiat] = useState(false);
  const [copiedCrypto, setCopiedCrypto] = useState(false);

  // Set default selections when wallet data loads
  useEffect(() => {
    if (walletData?.fiatBalances && !selectedFiat) {
      const defaultFiat = walletData.fiatBalances.find(f => f.isDefault) || walletData.fiatBalances[0];
      setSelectedFiat(defaultFiat);
    }
    if (walletData?.cryptoBalances && !selectedCrypto) {
      const defaultCrypto = walletData.cryptoBalances.find(c => c.isDefault) || walletData.cryptoBalances[0];
      setSelectedCrypto(defaultCrypto);
    }
  }, [walletData, selectedFiat, selectedCrypto]);

  const initiatePayment = () => {
    setShowTransferModal(true);
  };

  const toggleBridgeInterface = () => {
    setShowBridgeModal(true);
  };

  const copyToClipboard = async (text: string, type: 'fiat' | 'crypto') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'fiat') {
        setCopiedFiat(true);
        setTimeout(() => setCopiedFiat(false), 2000);
      } else {
        setCopiedCrypto(true);
        setTimeout(() => setCopiedCrypto(false), 2000);
      }
      addToast('Copied to clipboard!', 'success');
    } catch (err) {
      addToast('Failed to copy', 'error');
    }
  };

  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };



  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold text-white bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Hybrid Payment System
          </h2>
          <p className="text-gray-400 text-sm">
            Seamless fiat-to-crypto payments powered by StarkNet
          </p>
        </div>
        <Badge variant="outline" className="border-purple-500 text-purple-400 animate-bounce">
          <BoltIcon className="h-4 w-4 mr-1" />
          Instant Settlement
        </Badge>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 relative z-20">
        {/* Fiat Wallet with Dropdown */}
        <Card className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border-blue-700/50 backdrop-blur-sm hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 transform">
          <CardHeader className="pb-3">
            <CardTitle className="text-blue-400 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <CreditCardIcon className="h-5 w-5" />
                </div>
                <span className="font-bold text-xl">Fiat Wallet</span>
              </div>
              {selectedFiat && (
                <Badge variant="outline" className="border-blue-500 text-blue-300 text-xs animate-fade-in">
                  {selectedFiat.bankName?.toUpperCase()}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <button
                onClick={() => setShowFiatDropdown(!showFiatDropdown)}
                className="w-full flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors mb-3"
              >
                <div className="text-left">
                  <div className="text-2xl font-bold text-white">
                    {selectedFiat ? `${selectedFiat.currency} ${selectedFiat.balance.toLocaleString()}` : '₦0.00'}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {selectedFiat?.accountNumber ? `Acc: ${selectedFiat.accountNumber.slice(-6)}` : 'No account'}
                  </p>
                </div>
                <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform ${showFiatDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Fiat Dropdown */}
              {showFiatDropdown && walletData?.fiatBalances && (
                <div className="absolute z-[100] w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {walletData.fiatBalances.map((fiat, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedFiat(fiat);
                        setShowFiatDropdown(false);
                      }}
                      className="w-full flex items-center justify-between p-3 hover:bg-gray-700 transition-colors border-b border-gray-700 last:border-0"
                    >
                      <div className="text-left">
                        <div className="text-sm font-semibold text-white">
                          {fiat.currency} {fiat.balance.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-400">
                          {fiat.bankName} • {fiat.accountNumber}
                        </div>
                      </div>
                      {fiat.isDefault && (
                        <Badge className="bg-blue-900 text-blue-300 text-xs">Default</Badge>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Copy Account Number */}
            {selectedFiat?.accountNumber && (
              <button
                onClick={() => copyToClipboard(selectedFiat.accountNumber, 'fiat')}
                className="w-full flex items-center justify-center gap-2 p-2 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors mb-3 text-sm text-gray-300"
              >
                {copiedFiat ? (
                  <>
                    <ClipboardDocumentCheckIcon className="h-4 w-4 text-green-400" />
                    <span className="text-green-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <ClipboardDocumentIcon className="h-4 w-4" />
                    <span>Copy Account Number</span>
                  </>
                )}
              </button>
            )}

            <Button
              size="sm"
              className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/50 transform hover:scale-[1.02]"
              onClick={initiatePayment}
            >
              Make Payment
            </Button>
          </CardContent>
        </Card>

        {/* Crypto Wallet with Dropdown */}
        <Card className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border-purple-700/50 backdrop-blur-sm hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 transform">
          <CardHeader className="pb-3">
            <CardTitle className="text-purple-400 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <CurrencyDollarIcon className="h-5 w-5" />
                </div>
                <span className="font-bold text-xl">Crypto Wallet</span>
              </div>
              {selectedCrypto && (
                <Badge variant="outline" className="border-purple-500 text-purple-300 text-xs animate-fade-in">
                  {selectedCrypto.network?.toUpperCase() || 'STARKNET'}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <button
                onClick={() => setShowCryptoDropdown(!showCryptoDropdown)}
                className="w-full flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors mb-3"
              >
                <div className="text-left">
                  <div className="text-2xl font-bold text-white">
                    {selectedCrypto ? formatCurrency(selectedCrypto.balance, selectedCrypto.currency) : formatCurrency(0, 'USD')}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {selectedCrypto?.address ? formatAddress(selectedCrypto.address) : 'No address'}
                  </p>
                </div>
              </button>

              {/* Crypto Dropdown */}
              {showCryptoDropdown && walletData?.cryptoBalances && (
                <div className="absolute z-[100] w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {walletData.cryptoBalances.map((crypto, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedCrypto(crypto);
                        setShowCryptoDropdown(false);
                      }}
                      className="w-full flex items-center justify-between p-3 hover:bg-gray-700 transition-colors border-b border-gray-700 last:border-0"
                    >
                      <div className="text-left">
                        <div className="text-sm font-semibold text-white">
                          {formatCurrency(crypto.balance, crypto.currency)}
                        </div>
                        <div className="text-xs text-gray-400">
                          {crypto.network?.toUpperCase()} • {crypto.address ? formatAddress(crypto.address) : 'N/A'}
                        </div>
                      </div>
                      {crypto.isDefault && (
                        <Badge className="bg-purple-900 text-purple-300 text-xs">Default</Badge>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Copy Token Address */}
            {selectedCrypto?.address && (
              <button
                onClick={() => copyToClipboard(selectedCrypto.address, 'crypto')}
                className="w-full flex items-center justify-center gap-2 p-2 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors mb-3 text-sm text-gray-300"
              >
                {copiedCrypto ? (
                  <>
                    <ClipboardDocumentCheckIcon className="h-4 w-4 text-green-400" />
                    <span className="text-green-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <ClipboardDocumentIcon className="h-4 w-4" />
                    <span>Copy Token Address</span>
                  </>
                )}
              </button>
            )}

            <Button
              size="sm"
              className="w-full bg-purple-600 hover:bg-purple-700 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/50 transform hover:scale-[1.02]"
              onClick={toggleBridgeInterface}
            >
              Bridge Liquidity
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* QR Payment System */}
      <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 mt-8">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <QrCodeIcon className="h-5 w-5 text-purple-400" />
            </div>
            <span className="font-bold">QR Payment System</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">QR Code</div>
              <div className="text-sm text-gray-400">Instant payments</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">StarkNet</div>
              <div className="text-sm text-gray-400">Low-cost rollups</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">ZKPs</div>
              <div className="text-sm text-gray-400">Privacy protection</div>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button
              className="flex-1 bg-purple-600 hover:bg-purple-700 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/50 transform hover:scale-[1.02]"
              onClick={() => setShowGenerateQRModal(true)}
            >
              Generate QR Code
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700 transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02]"
              onClick={() => setShowScanQRModal(true)}
            >
              Scan QR Code
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* All Modals */}
      <TransferModal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
      />
      <PaymentModal
        isOpen={showBridgeModal}
        onClose={() => setShowBridgeModal(false)}
        onTransactionComplete={(txHash) => {
          addToast(`Transaction sent: ${txHash.slice(0, 10)}...`, "info");
        }}
      />
      <ManageLiquidityModal
        isOpen={showManageLiquidityModal}
        onClose={() => setShowManageLiquidityModal(false)}
      />
      <ViewSettlementsModal
        isOpen={showSettlementsModal}
        onClose={() => setShowSettlementsModal(false)}
      />
      <GenerateQRModal
        isOpen={showGenerateQRModal}
        onClose={() => setShowGenerateQRModal(false)}
      />
      <ScanQRModal
        isOpen={showScanQRModal}
        onClose={() => setShowScanQRModal(false)}
      />
    </div>
  );
}
