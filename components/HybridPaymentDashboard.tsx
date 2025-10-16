"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import {
  CreditCardIcon,
  CurrencyDollarIcon,
  QrCodeIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
  BoltIcon,
} from "@heroicons/react/24/outline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { paymentProcessor } from "@/lib/payment-processor";
import { liquidityBridge } from "@/lib/liquidity-bridge";
import TransferModal from "@/components/transfer/TransferModal";
import BridgeLiquidityModal from "@/components/modals/BridgeLiquidityModal";
import StakeSyncModal from "@/components/modals/StakeSyncModal";
import ManageLiquidityModal from "@/components/modals/ManageLiquidityModal";
import ViewSettlementsModal from "@/components/modals/ViewSettlementsModal";
import GenerateQRModal from "@/components/modals/GenerateQRModal";
import ScanQRModal from "@/components/modals/ScanQRModal";
import { useWalletSummary } from "@/hooks/useWalletData";
import PaymentModal from "./modals/PaymentModal";

interface PaymentSystemMetrics {
  fiatBalanceNGN: number;
  cryptoValueUSD: number;
  syncTokenBalance: number;
  stakedSyncTokens: number;
  totalPortfolioValueNGN: number;
  transactionFeeDiscount: number;
  activeLiquidityPools: number;
  dailySettlementCount: number;
}

export default function HybridPaymentDashboard() {
  const { user } = useAuth();
  const { addToast } = useToast();
  
  // Use the wallet summary hook
  const { 
    data: metrics, 
    isLoading, 
    error,
    refetch: refetchWalletSummary 
  } = useWalletSummary();

  // Modal states
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showBridgeModal, setShowBridgeModal] = useState(false);
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [showManageLiquidityModal, setShowManageLiquidityModal] = useState(false);
  const [showSettlementsModal, setShowSettlementsModal] = useState(false);
  const [showGenerateQRModal, setShowGenerateQRModal] = useState(false);
  const [showScanQRModal, setShowScanQRModal] = useState(false);

  // Handle error state
  React.useEffect(() => {
    if (error) {
      addToast("Unable to load payment system data", "error");
    }
  }, [error, addToast]);

  const initiatePayment = () => {
    setShowTransferModal(true);
  };

  const toggleBridgeInterface = () => {
    setShowBridgeModal(true);
  };

  const openStakingInterface = () => {
    setShowStakeModal(true);
  };

  if (isLoading && !metrics) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-800 p-6 rounded-xl animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-1/3 mb-4"></div>
              <div className="h-8 bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Hybrid Payment System
          </h2>
          <p className="text-gray-400">
            Seamless fiat-to-crypto payments powered by StarkNet
          </p>
        </div>
        <Badge variant="outline" className="border-purple-500 text-purple-400">
          <BoltIcon className="h-4 w-4 mr-1" />
          Instant Settlement
        </Badge>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Fiat Wallet */}
        <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 border-blue-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-blue-400 flex items-center">
              <CreditCardIcon className="h-5 w-5 mr-2" />
              Fiat Wallet
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              ₦{metrics.fiatBalanceNGN.toLocaleString()}
            </div>
            <p className="text-sm text-gray-400">
              Available for instant payments
            </p>
            <Button
              size="sm"
              className="mt-3 bg-blue-600 hover:bg-blue-700"
              onClick={initiatePayment}
            >
              Make Payment
            </Button>
          </CardContent>
        </Card>

        {/* Swap/Bridge */}
        <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 border-purple-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-purple-400 flex items-center">
              <CurrencyDollarIcon className="h-5 w-5 mr-2" />
              Swap/Bridge
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              ${metrics.cryptoValueUSD.toLocaleString()}
            </div>
            <p className="text-sm text-gray-400">Auto-bridging enabled</p>
            <Button
              size="sm"
              className="mt-3 bg-purple-600 hover:bg-purple-700"
              onClick={toggleBridgeInterface}
            >
              Bridge Liquidity
            </Button>
          </CardContent>
        </Card>

        {/* SYNC Token */}
        <Card className="bg-gradient-to-br from-green-900/20 to-green-800/20 border-green-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-green-400 flex items-center">
              <ShieldCheckIcon className="h-5 w-5 mr-2" />
              SYNC Token
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {metrics.syncTokenBalance.toLocaleString()} SYNC
            </div>
            <p className="text-sm text-gray-400">
              {metrics.transactionFeeDiscount}% fee discount
            </p>
            <Button
              size="sm"
              className="mt-3 bg-green-600 hover:bg-green-700"
              onClick={openStakingInterface}
            >
              Stake SYNC
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Features */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Liquidity Bridge Status */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <ArrowPathIcon className="h-5 w-5 mr-2 text-blue-400" />
              Liquidity Bridge
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Available Pools:</span>
              <span className="text-white font-semibold">
                {metrics.activeLiquidityPools}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Auto-bridging:</span>
              <Badge className="bg-green-900 text-green-400">Enabled</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Network:</span>
              <Badge className="bg-purple-900 text-purple-400">StarkNet</Badge>
            </div>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={() => setShowManageLiquidityModal(true)}
            >
              Manage Liquidity
            </Button>
          </CardContent>
        </Card>

        {/* Instant Settlement */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <BoltIcon className="h-5 w-5 mr-2 text-yellow-400" />
              Instant Settlement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Settlements Today:</span>
              <span className="text-white font-semibold">
                {metrics.dailySettlementCount}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Average Time:</span>
              <span className="text-white font-semibold">1.2s</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Success Rate:</span>
              <Badge className="bg-green-900 text-green-400">99.8%</Badge>
            </div>
            <Button
              className="w-full bg-yellow-600 hover:bg-yellow-700"
              onClick={() => setShowSettlementsModal(true)}
            >
              View Settlements
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Merchant Payment System */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <QrCodeIcon className="h-5 w-5 mr-2 text-purple-400" />
            Merchant Payment System
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
          <div className="flex space-x-2">
            <Button
              className="flex-1 bg-purple-600 hover:bg-purple-700"
              onClick={() => setShowGenerateQRModal(true)}
            >
              Generate QR Code
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
              onClick={() => setShowScanQRModal(true)}
            >
              Scan QR Code
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Total Portfolio Value */}
      <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-700">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">
              Total Portfolio Value
            </div>
            <div className="text-4xl font-bold text-purple-400 mb-4">
              ₦{metrics.totalPortfolioValueNGN.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">
              Fiat + Crypto + SYNC Staking
            </div>
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
      />
      <StakeSyncModal
        isOpen={showStakeModal}
        onClose={() => setShowStakeModal(false)}
        availableBalance={metrics.syncTokenBalance}
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
