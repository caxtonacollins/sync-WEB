"use client";

import React, { useState } from "react";
import { useToast } from "@/contexts/ToastContext";
import { BoltIcon, QrCodeIcon } from "@heroicons/react/24/outline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWalletData } from "@/hooks/useWalletData";
import { UnifiedWalletCard } from "@/components/wallet/UnifiedWalletCard";
import { ActionButtons } from "@/components/wallet/ActionButtons";
import { CurrencySelector } from "@/components/wallet/CurrencySelector";
import { WalletVisibilityProvider } from "@/contexts/WalletVisibilityContext";
import TransferModal from "@/components/transfer/TransferModal";
import ManageLiquidityModal from "@/components/modals/ManageLiquidityModal";
import ViewSettlementsModal from "@/components/modals/ViewSettlementsModal";
import GenerateQRModal from "@/components/modals/GenerateQRModal";
import ScanQRModal from "@/components/modals/ScanQRModal";
import PaymentModal from "./modals/PaymentModal";

export default function HybridPaymentDashboard() {
  const { addToast } = useToast();
  const { data: walletData, isLoading } = useWalletData();

  // Modal states
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showBridgeModal, setShowBridgeModal] = useState(false);
  const [showManageLiquidityModal, setShowManageLiquidityModal] =
    useState(false);
  const [showSettlementsModal, setShowSettlementsModal] = useState(false);
  const [showGenerateQRModal, setShowGenerateQRModal] = useState(false);
  const [showScanQRModal, setShowScanQRModal] = useState(false);

  const initiatePayment = () => {
    setShowTransferModal(true);
  };

  const initiateSwap = () => {
    addToast("Swap feature coming soon!", "info");
  };

  const initiateFund = () => {
    addToast("Fund feature coming soon!", "info");
  };

  const handleMore = () => {
    // This will be handled by the ActionButtons component's dropdown
  };

  if (isLoading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="flex items-center justify-between mb-2">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold text-white bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Loading Wallet...
            </h2>
          </div>
        </div>
        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700/50 animate-pulse">
          <CardContent className="pt-6">
            <div className="h-32 bg-slate-700 rounded-lg" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <WalletVisibilityProvider>
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
          <Badge
            variant="outline"
            className="border-purple-500 text-purple-400 animate-bounce"
          >
            <BoltIcon className="h-4 w-4 mr-1" />
            Instant Settlement
          </Badge>
        </div>

        {/* Unified Wallet Card */}
        <UnifiedWalletCard
          fiatBalances={walletData?.fiatBalances || []}
          cryptoBalances={walletData?.cryptoBalances || []}
          totalValueUSD={walletData?.totalValueUSD || 0}
          totalValueNGN={walletData?.totalValueNGN || 0}
        />

        {/* Action Buttons Section */}
        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <ActionButtons
              onFund={initiateFund}
              onSend={initiatePayment}
              onSwap={initiateSwap}
              onMore={handleMore}
              showBridge={true}
            />
          </CardContent>
        </Card>

        {/* Currency Selector & Portfolio Overview */}
        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white">Portfolio Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <CurrencySelector
              totalValueUSD={walletData?.totalValueUSD || 0}
              totalValueNGN={walletData?.totalValueNGN || 0}
              fiatCurrencies={
                walletData?.fiatBalances.map((f) => f.currency) || ["NGN"]
              }
            />
          </CardContent>
        </Card>

        {/* QR Payment System */}
        <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
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
              <div className="text-center p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors">
                <div className="text-2xl font-bold text-white">📱</div>
                <div className="text-sm text-white font-semibold mt-2">
                  QR Code
                </div>
                <div className="text-xs text-gray-400">Instant payments</div>
              </div>
              <div className="text-center p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors">
                <div className="text-2xl font-bold text-white">⚡</div>
                <div className="text-sm text-white font-semibold mt-2">
                  StarkNet
                </div>
                <div className="text-xs text-gray-400">Low-cost rollups</div>
              </div>
              <div className="text-center p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors">
                <div className="text-2xl font-bold text-white">🔐</div>
                <div className="text-sm text-white font-semibold mt-2">
                  ZKPs
                </div>
                <div className="text-xs text-gray-400">Privacy protection</div>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
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
    </WalletVisibilityProvider>
  );
}
