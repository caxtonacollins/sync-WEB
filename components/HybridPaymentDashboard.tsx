"use client";

import React, { useState } from "react";
import { useToast } from "@/contexts/ToastContext";
import { ArrowPathIcon, ArrowUpOnSquareIcon, BoltIcon, QrCodeIcon, RectangleStackIcon } from "@heroicons/react/24/outline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWalletData } from "@/hooks/useWalletData";
import { UnifiedWalletCard } from "@/components/wallet/UnifiedWalletCard";
import { ActionButtons } from "@/components/wallet/ActionButtons";
import { CurrencySelector } from "@/components/wallet/CurrencySelector";
import { WalletVisibilityProvider } from "@/contexts/WalletVisibilityContext";
import ManageLiquidityModal from "@/components/modals/ManageLiquidityModal";
import ViewSettlementsModal from "@/components/modals/ViewSettlementsModal";
import GenerateQRModal from "@/components/modals/GenerateQRModal";
import ScanQRModal from "@/components/modals/ScanQRModal";
import SwapModal from "@/components/modals/SwapModal";
import TransferModal from "@/components/modals/TransferModal";
import { FundWalletModal } from "./modals/FundWalletModal";

export default function HybridPaymentDashboard() {
  const { addToast } = useToast();
  const { data: walletData, isLoading } = useWalletData();

  // Modal states
  const [isFundModalOpen, setIsFundModalOpen] = useState(false);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [showManageLiquidityModal, setShowManageLiquidityModal] =
    useState(false);
  const [showSettlementsModal, setShowSettlementsModal] = useState(false);
  const [showGenerateQRModal, setShowGenerateQRModal] = useState(false);
  const [showScanQRModal, setShowScanQRModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);

  const initiateSwap = () => {
    setShowSwapModal(true);
  };

  const initiateFund = () => {
    setIsFundModalOpen(true);

  };

  const handleFundSuccess = () => {
    // Refresh wallet data or show success message
    setIsFundModalOpen(false);
  };

  const initiateTransfer = () => {
    setShowTransferModal(true);
  };

  const handleMore = () => {
  };

  if (isLoading) {
    return (
      <div className="space-y-8 animate-fade-in">

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
        {/* Unified Wallet Card */}
        <UnifiedWalletCard
          fiatBalances={walletData?.fiatBalances || []}
          cryptoBalances={walletData?.cryptoBalances || []}
          totalValueUSD={walletData?.totalValueUSD || 0}
          totalValueNGN={walletData?.totalValueNGN || 0}
        />

        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-8"> */}


        {/* Currency Selector & Portfolio Overview */}
        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700/50 pt-6">
          <CardContent className="space-y-6">
            <CurrencySelector
              totalValueUSD={walletData?.totalValueUSD || 0}
              totalValueNGN={walletData?.totalValueNGN || 0}
              fiatCurrencies={
                walletData?.fiatBalances.map((f) => f.currency) || ["NGN"]
              }
            />
            <ActionButtons
              onFund={initiateFund}
              onSwap={initiateSwap}
              onTransfer={initiateTransfer}
              onMore={handleMore}
              showBridge={true}
            />
          </CardContent>
        </Card>

        {/* QR Payment System */}
        <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <QrCodeIcon className="h-10 w-10 text-purple-400" />
              </div>
              <span className="font-bold">QR Payment System</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
      </div>

        {/* All Modals */}
      <FundWalletModal
        isOpen={isFundModalOpen}
        onClose={() => setIsFundModalOpen(false)}
        onSuccess={handleFundSuccess}
      />
      <SwapModal
        isOpen={showSwapModal}
        onClose={() => setShowSwapModal(false)}
          onTransactionComplete={(txHash) => {
            addToast(`swap completed: ${txHash.slice(0, 10)}...`, "success");
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
      <TransferModal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        onTransactionComplete={(txHash) => {
          addToast(`Transfer completed: ${txHash.slice(0, 10)}...`, "success");
        }}
      />
      {/* </div> */}
    </WalletVisibilityProvider>
  );
}
