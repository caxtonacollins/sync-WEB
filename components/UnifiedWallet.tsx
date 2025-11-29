"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import {
  Wallet,
  CreditCard,
  Coins,
  ArrowUpDown,
  Plus,
  Eye,
  EyeOff,
  TrendingUp,
  TrendingDown,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWalletData, useWalletSummary, useWalletTransactions, WalletTransaction } from "@/hooks/useWalletData";
import { formatNumber, formatTokenAmount } from "@/lib/utils/formatters";
import { useExchangeRates } from "@/hooks/use-exchange-rates";


const UnifiedWallet = () => {
  const { isProvisioning, user } = useAuth();
  const { addToast } = useToast();
  const [showBalances, setShowBalances] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const {
    data: metrics,
    isLoading,
    error,
    refetch: refetchWalletSummary
  } = useWalletSummary();
  const { data: exchangeRates } = useExchangeRates()
  const ngnToUsdRate = exchangeRates?.find((rate: any) => rate.fiatSymbol === "NGN" && rate.tokenSymbol === "USD")?.rate
  // Currency toggle state (NGN or USD)
  const [displayCurrency, setDisplayCurrency] = useState<'NGN' | 'USD'>('NGN');
  const getPortfolioValue = () => {
    if (!metrics) return 0;
    if (displayCurrency === 'NGN') {
      return metrics.totalBalanceNGN;
    } else {
      return metrics.totalBalanceUSD;
    }
  };

  // Use the wallet data and transactions hooks
  const {
    data: walletData,
    isLoading: isLoadingWallet,
    error: walletError,
    refetch: refetchWalletData
  } = useWalletData();

  const { 
    data: transactions = [],
    isLoading: isLoadingTransactions,
    error: transactionsError,
    refetch: refetchTransactions
  } = useWalletTransactions();

  // Handle errors
  useEffect(() => {
    if (walletError) {
      console.error("Failed to load wallet data:", walletError);
      addToast("Failed to load wallet data", "error");
    }

    if (error) {
      addToast("Unable to load payment system data", "error");
    }

    if (transactionsError) {
      console.error("Failed to load transactions:", transactionsError);
      addToast("Failed to load transactions", "error");
    }
  }, [walletError, transactionsError, addToast, error]);

  // Slice transactions for display (first 2 for overview, all for transactions tab)
  const recentTransactions = useMemo(() => transactions.slice(0, 2), [transactions]);

  const loading = isLoadingWallet || isLoadingTransactions || !walletData || isProvisioning;

  // Refetch function that can be called manually
  const handleRefresh = async () => {
    await Promise.all([refetchWalletData(), refetchTransactions()]);
    addToast("Wallet data refreshed", "success");
  };

  const handleBridgeLiquidity = () => {
    addToast("Liquidity bridge feature coming soon!", "info");
  };

  const handleAddFunds = (type: "fiat" | "crypto") => {
    addToast(`Add ${type} funds feature coming soon!`, "info");
  };

  const formatCurrency = (amount: number, currency: string) => {
    const formattedAmount = formatTokenAmount(amount, 2);
    if (currency === "NGN") {
      return `₦${formattedAmount}`;
    } else if (currency === "USD") {
      return `$${formattedAmount}`;
    }
    return `${formattedAmount} ${currency}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-900 text-green-400";
      case "pending":
        return "bg-yellow-900 text-yellow-400";
      case "failed":
        return "bg-red-900 text-red-400";
      default:
        return "bg-gray-900 text-gray-400";
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-gray-800 p-6 rounded-2xl animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-12 bg-gray-700 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-gray-800 p-6 rounded-2xl animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-1/3 mb-4"></div>
              <div className="h-8 bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if ((isLoading && !metrics) || isProvisioning) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-800/50 p-6 rounded-xl animate-pulse backdrop-blur-sm">
              <div className="h-4 bg-gray-700 rounded w-1/3 mb-4"></div>
              <div className="h-8 bg-gray-700 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!metrics) return null;

  if (walletError || transactionsError) {
    return (
      <div className="text-center p-6 bg-red-900/20 border border-red-700 rounded-lg">
        <h3 className="text-lg font-medium text-red-400 mb-2">Failed to load wallet data</h3>
        <p className="text-red-300 mb-4">
          {walletError?.message || transactionsError?.message || 'An unknown error occurred'}
        </p>
        <Button 
          onClick={() => {
            if (walletError) refetchWalletData();
            if (transactionsError) refetchTransactions();
          }}
          variant="outline"
          className="border-red-500 text-red-400 hover:bg-red-900/50"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  if (!walletData) return null;

  return (
    <div className="space-y-6">
      {/* Total Portfolio Value with Currency Toggle */}
      <Card className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-700/50 backdrop-blur-sm hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 transform hover:scale-[1.02]">
        <CardContent className="pt-8 pb-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4 relative">
              <h3 className="text-2xl font-bold text-white">
                Total Portfolio Value
              </h3>
              <button
                onClick={() => setShowBalances(!showBalances)}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-gray-700/50 transition-colors"
                aria-label={showBalances ? 'Hide balances' : 'Show balances'}
              >
                {showBalances ? (
                  <EyeOff className="h-5 w-5 text-gray-300" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
              {/* Currency Toggle */}
              <div className="flex bg-gray-800/50 rounded-lg p-1 border border-gray-700">
                <button
                  onClick={() => setDisplayCurrency('NGN')}
                  className={`px-4 py-1.5 rounded text-sm font-medium transition-all duration-200 ${displayCurrency === 'NGN'
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                    }`}
                >
                  NGN
                </button>
                <button
                  onClick={() => setDisplayCurrency('USD')}
                  className={`px-4 py-1.5 rounded text-sm font-medium transition-all duration-200 ${displayCurrency === 'USD'
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                    }`}
                >
                  USD
                </button>
              </div>
            </div>
            <div className="text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-6 animate-fade-in">
              {!showBalances ? '••••••' : (
                <>
                  {displayCurrency === 'NGN' ? '₦' : '$'}
                  {(displayCurrency === 'USD' && !ngnToUsdRate) ? '...' : formatNumber(
                    displayCurrency === 'NGN' ? metrics?.totalBalanceNGN || 0 : metrics?.totalBalanceUSD || 0,
                    2
                  )}
                </>
              )}
            </div>
            <div className="text-sm text-gray-400 mb-6">
              Fiat + Crypto + SYNC Staking
            </div>
            <div className="mt-6 flex justify-center gap-6 text-xs flex-wrap">
              <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-700">
                <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
                <span className="text-gray-300 font-medium">
                  Fiat: {!showBalances ? '••••' : (
                    <>
                      {displayCurrency === 'NGN' ? '₦' : '$'}
                      {displayCurrency === 'NGN'
                        ? formatNumber(metrics?.totalBalanceNGN || 0, 2)
                        : ngnToUsdRate
                          ? formatNumber((metrics?.totalBalanceNGN || 0) / ngnToUsdRate, 2)
                          : '...'}
                    </>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-700">
                <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse"></div>
                <span className="text-gray-300 font-medium">
                  Crypto: {!showBalances ? '••••' : `$${formatNumber(metrics?.totalBalanceUSD || 0, 2)}`}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-700">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-gray-300 font-medium">
                  SYNC: {!showBalances ? '••••' : formatNumber(metrics?.syncTokenBalance || 0, 2)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Wallet Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-800">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-purple-600"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger value="fiat" className="data-[state=active]:bg-blue-600">
            Fiat
          </TabsTrigger>
          <TabsTrigger
            value="crypto"
            className="data-[state=active]:bg-green-600"
          >
            Crypto
          </TabsTrigger>
        </TabsList>

        {/* Wallet Address with Copy Button - Only shown in Crypto tab */}
        {activeTab === 'crypto' && user?.starknetAccountAddress && (
          <div className="flex items-center justify-center mt-2 text-sm">
            <div className="flex items-center bg-gray-800/50 px-3 py-1.5 rounded-lg border border-gray-700">
              <span className="text-gray-300 font-mono text-xs">
                {user.starknetAccountAddress}
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(user.starknetAccountAddress!);
                  addToast('Wallet address copied!', 'success');
                }}
                className="ml-2 text-gray-400 hover:text-white transition-colors"
                aria-label="Copy wallet address"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </button>
            </div>
          </div>
        )}

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fiat Summary */}
            <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 border-blue-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-blue-400 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Fiat Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white mb-2">
                  {showBalances
                    ? formatCurrency(
                        walletData.fiatBalances.reduce(
                          (sum, b) => sum + b.balance,
                          0
                        ),
                        "NGN"
                      )
                    : "••••••"}
                </div>
                <p className="text-sm text-gray-400 mb-3">
                  {walletData.fiatBalances.length} account(s)
                </p>
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => handleAddFunds("fiat")}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Funds
                </Button>
              </CardContent>
            </Card>

            {/* Crypto Summary */}
            <Card className="bg-gradient-to-br from-green-900/20 to-green-800/20 border-green-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-green-400 flex items-center">
                  <Coins className="h-5 w-5 mr-2" />
                  Crypto Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white mb-2">
                  {showBalances
                    ? formatCurrency(
                        walletData.cryptoBalances.reduce(
                          (sum, b) => sum + b.balance * 800,
                          0
                        ),
                        "USD"
                      )
                    : "••••••"}
                </div>
                <p className="text-sm text-gray-400 mb-3">
                  {walletData.cryptoBalances.length} wallet(s)
                </p>
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => handleAddFunds("crypto")}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Token
                  {/* should open a modal to select which token address to copy or share.... showing all the list of tokens in the wallet, balance, market value and network */}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Liquidity Bridge */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <ArrowUpDown className="h-5 w-5 mr-2 text-purple-400" />
                Liquidity Bridge
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-4">
                Seamlessly convert between fiat and crypto using our automated
                liquidity bridge.
              </p>
              <Button
                className="w-full bg-purple-600 hover:bg-purple-700"
                onClick={handleBridgeLiquidity}
              >
                Bridge Liquidity
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fiat" className="space-y-4">
          {walletData.fiatBalances.map((balance, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-900/20 rounded-full mr-3">
                      <CreditCard className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">
                        {balance.currency} Account
                      </p>
                      <p className="text-sm text-gray-400">
                        {balance.provider}
                      </p>
                      {balance.isDefault && (
                        <Badge className="mt-1 bg-blue-900 text-blue-400">
                          Default
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-white">
                      {showBalances
                        ? formatCurrency(balance.balance, balance.currency)
                        : "••••••"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="crypto" className="space-y-4">
          {walletData.cryptoBalances.map((balance, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-900/20 rounded-full mr-3">
                      <Coins className="h-5 w-5 text-green-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">
                        {balance.currency}
                      </p>
                      <p className="text-sm text-gray-400">{balance.network}</p>
                      {balance.isDefault && (
                        <Badge className="mt-1 bg-green-900 text-green-400">
                          Default
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-white">
                      {showBalances
                        ? formatCurrency(balance.balance, balance.currency)
                        : "••••••"}
                    </p>
                    <p className="text-sm text-gray-400">
                      {showBalances
                        ? formatCurrency(balance.balance * 800, "NGN")
                        : "••••••"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Recent Transactions */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentTransactions.map((tx: WalletTransaction) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg"
              >
                <div className="flex items-center">
                  <div className="p-2 bg-gray-600 rounded-full mr-3">
                    {tx.type === "fiat" ? (
                      <CreditCard className="h-4 w-4 text-blue-400" />
                    ) : (
                      <Coins className="h-4 w-4 text-green-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-white">
                      {formatCurrency(tx.amount, tx.currency)}
                    </p>
                    <p className="text-sm text-gray-400">{tx.reference}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={getStatusColor(tx.status)}>
                    {tx.status}
                  </Badge>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(tx.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnifiedWallet;
