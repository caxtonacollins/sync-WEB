"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import {
  Coins,
  Plus,
  Eye,
  EyeOff,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWalletData, useWalletSummary, useWalletTransactions } from "@/hooks/useWalletData";
import { WalletTransaction } from "@/types/wallet";
import { formatAddress, formatNumber, formatTokenAmount } from "@/lib/utils/formatters";
import { getTokenIcon } from "@/lib/tokenIcons";

const UnifiedWallet: React.FC = () => {
  // State and hooks
  const [showBalances, setShowBalances] = useState(true);
  const { isProvisioning, user } = useAuth();
  const { addToast } = useToast();
  
  // Wallet data hooks
  const { 
    data: walletData, 
    isLoading: isLoadingWallet, 
    error: walletError, 
    refetch: refetchWalletData 
  } = useWalletData();
  
  const { 
    data: metrics, 
    isLoading, 
    error, 
    refetch: refetchWalletSummary 
  } = useWalletSummary();
  
  const { 
    data: transactions = [], 
    isLoading: isLoadingTransactions, 
    error: transactionsError, 
    refetch: refetchTransactions 
  } = useWalletTransactions();

  // Filter transactions to only show crypto transactions
  const recentTransactions = useMemo(() => {
    return transactions.filter((tx: WalletTransaction) => tx.type === 'crypto').slice(0, 2);
  }, [transactions]);

  const loading = isLoadingWallet || isLoadingTransactions || !walletData || isProvisioning;

  // Handle errors
  useEffect(() => {
    if (walletError) {
      console.error("Failed to load wallet data:", walletError);
      addToast("Failed to load wallet data", "error");
    }

    if (error) {
      addToast("Unable to load wallet summary", "error");
    }

    if (transactionsError) {
      console.error("Failed to load transactions:", transactionsError);
      addToast("Failed to load transactions", "error");
    }
  }, [walletError, error, transactionsError, addToast]);

  const formatCurrency = (amount: number, currency: string) => {
    const formattedAmount = formatTokenAmount(amount, 2);
    return `${formattedAmount} ${currency.toUpperCase()}`;
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

  if (loading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-gray-800/50 p-6 rounded-xl animate-pulse backdrop-blur-sm"
            >
              <div className="h-4 bg-gray-700 rounded w-1/3 mb-4"></div>
              <div className="h-8 bg-gray-700 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!walletData || !metrics) return null;

  if (walletError || error || transactionsError) {
    return (
      <div className="text-center p-6 bg-red-900/20 border border-red-700 rounded-lg">
        <h3 className="text-lg font-medium text-red-400 mb-2">
          Failed to load wallet data
        </h3>
        <p className="text-red-300 mb-4">
          {walletError?.message ||
            transactionsError?.message ||
            "An unknown error occurred"}
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


  return (
    <div className="space-y-6">
      {/* Total Portfolio Value */}
      <Card className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-700/50 backdrop-blur-sm hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 transform hover:scale-[1.02]">
        <CardContent className="pt-8 pb-8">
          <div className="text-center space-y-4">
            <h3 className="text-lg md:text-xl font-bold text-white">
              Total Portfolio Value
            </h3>
            
            <div className="relative">
              <div className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-2 animate-fade-in">
                {!showBalances
                  ? "••••••"
                  : formatCurrency(metrics?.totalBalanceUSD || 0, "USD")}
              </div>
              <div className="text-sm text-gray-400">Crypto Assets</div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => setShowBalances(!showBalances)}
                className="p-1.5 rounded-full hover:bg-gray-700/50 transition-colors"
                aria-label={showBalances ? "Hide balances" : "Show balances"}
              >
                {showBalances ? (
                  <EyeOff className="h-5 w-5 text-gray-300" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>

            <div className="mt-4 flex justify-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 bg-gray-800/50 px-3 py-1.5 rounded-lg border border-gray-700">
                <div className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse"></div>
                <span className="text-xs text-gray-300">
                  Total: {" "}
                  {!showBalances
                    ? "••••"
                    : formatCurrency(metrics?.totalBalanceUSD || 0, "USD")}
                </span>
              </div>
              {metrics?.syncTokenBalance !== undefined && (
                <div className="flex items-center gap-2 bg-gray-800/50 px-3 py-1.5 rounded-lg border border-gray-700">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-xs text-gray-300">
                    SYNC: {" "}
                    {!showBalances
                      ? "••••"
                      : formatNumber(metrics.syncTokenBalance, 2)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Wallet Tabs */}
      <Tabs value="tokens" className="w-full">
        <TabsList className="grid w-full grid-cols-1 bg-gray-800">
          <TabsTrigger value="tokens" className="data-[state=active]:bg-purple-600">
            My Tokens
          </TabsTrigger>
        </TabsList>

        {/* Wallet Address with Copy Button */}
        {user?.starknetAccountAddress && (
          <div className="flex items-center justify-center mt-2 text-sm">
            <div className="flex items-center bg-gray-800/50 px-3 py-1.5 rounded-lg border border-gray-700">
              <span className="text-gray-300 font-mono text-xs">
                Copy: {formatAddress(user.starknetAccountAddress, 5)}
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(user.starknetAccountAddress!);
                  addToast("Wallet address copied!", "success");
                }}
                className="ml-2 text-gray-400 hover:text-white transition-colors"
                aria-label="Copy wallet address"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </button>
            </div>
          </div>
        )}

        <TabsContent value="tokens" className="space-y-4">
          {walletData.cryptoBalances.map((balance, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src={getTokenIcon(balance.currency)}
                      alt={balance.currency}
                      className="h-8 w-8 rounded-full mr-3"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/images/tokens/default-token.png";
                      }}
                    />
                    <div>
                      <p className="font-semibold text-white">
                        {balance.currency}
                      </p>
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
                        ? formatTokenAmount(balance.available, 2)
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
                   
                      <img
                        src={getTokenIcon(tx.currency)}
                        alt={tx.currency}
                        className="h-5 w-5 rounded-full"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/images/tokens/default-token.png";
                        }}
                      />
                    
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
