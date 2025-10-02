"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import {
  ShieldCheckIcon,
  CurrencyDollarIcon,
  LockClosedIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { syncpayTokenSystem } from "@/lib/syncpay-token";
import { TrendingUpIcon } from "lucide-react";

interface SyncPayStats {
  balance: number;
  stakedAmount: number;
  stakingRewards: number;
  totalEarned: number;
  feeDiscount: number;
  tier: string;
}

export default function SyncPayTokenPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [stats, setStats] = useState<SyncPayStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "staking" | "governance"
  >("overview");
  const [stakeAmount, setStakeAmount] = useState("");
  const [selectedPool, setSelectedPool] = useState("");

  useEffect(() => {
    if (user) {
      loadSyncPayStats();
    }
  }, [user]);

  const loadSyncPayStats = async () => {
    try {
      setLoading(true);

      // Simulate loading SyncPay data
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockStats: SyncPayStats = {
        balance: 2500,
        stakedAmount: 1000,
        stakingRewards: 45.5,
        totalEarned: 125.75,
        feeDiscount: 15,
        tier: "silver",
      };

      setStats(mockStats);
    } catch (error) {
      addToast("Failed to load SyncPay statistics", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleStakeTokens = async () => {
    if (!stakeAmount || !selectedPool) {
      addToast("Please fill in all fields", "error");
      return;
    }

    try {
      // Simulate staking
      await new Promise((resolve) => setTimeout(resolve, 2000));
      addToast("Tokens staked successfully!", "success");
      setStakeAmount("");
      setSelectedPool("");
      loadSyncPayStats();
    } catch (error) {
      addToast("Failed to stake tokens", "error");
    }
  };

  const handleClaimRewards = async () => {
    try {
      // Simulate claiming rewards
      await new Promise((resolve) => setTimeout(resolve, 1000));
      addToast("Rewards claimed successfully!", "success");
      loadSyncPayStats();
    } catch (error) {
      addToast("Failed to claim rewards", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner h-12 w-12"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center">
                  <ShieldCheckIcon className="h-8 w-8 mr-3 text-green-400" />
                  SYNCPAY Token
                </h1>
                <p className="mt-2 text-gray-400">
                  Native token with staking rewards, fee discounts, and
                  governance
                </p>
              </div>
              <Badge className="bg-green-900 text-green-400">
                {stats?.tier.toUpperCase()} TIER
              </Badge>
            </div>

            {/* Navigation Tabs */}
            <div className="flex space-x-1 mb-8">
              {[
                { id: "overview", label: "Overview", icon: ChartBarIcon },
                { id: "staking", label: "Staking", icon: LockClosedIcon },
                { id: "governance", label: "Governance", icon: TrendingUpIcon },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? "bg-green-600 text-white"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  <tab.icon className="h-5 w-5 mr-2" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Overview Tab */}
            {activeTab === "overview" && stats && (
              <div className="space-y-6">
                {/* Main Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="bg-gradient-to-br from-green-900/20 to-green-800/20 border-green-700">
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-white">
                        {stats.balance.toLocaleString()}
                      </div>
                      <p className="text-green-400 text-sm">SYNCPAY Balance</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 border-blue-700">
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-white">
                        {stats.stakedAmount.toLocaleString()}
                      </div>
                      <p className="text-blue-400 text-sm">Staked Amount</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 border-purple-700">
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-white">
                        {stats.stakingRewards.toFixed(2)}
                      </div>
                      <p className="text-purple-400 text-sm">Staking Rewards</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-yellow-900/20 to-yellow-800/20 border-yellow-700">
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-white">
                        {stats.feeDiscount}%
                      </div>
                      <p className="text-yellow-400 text-sm">Fee Discount</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Token Information */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">
                        Token Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Symbol:</span>
                        <span className="text-white font-semibold">
                          SYNCPAY
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Network:</span>
                        <Badge className="bg-purple-900 text-purple-400">
                          StarkNet
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Price:</span>
                        <span className="text-white font-semibold">$0.25</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Market Cap:</span>
                        <span className="text-white font-semibold">$125M</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Benefits</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center">
                        <CurrencyDollarIcon className="h-5 w-5 text-green-400 mr-2" />
                        <span className="text-white">
                          Fee discounts on transactions
                        </span>
                      </div>
                      <div className="flex items-center">
                        <LockClosedIcon className="h-5 w-5 text-blue-400 mr-2" />
                        <span className="text-white">
                          Staking rewards up to 25% APY
                        </span>
                      </div>
                      <div className="flex items-center">
                        <TrendingUpIcon className="h-5 w-5 text-purple-400 mr-2" />
                        <span className="text-white">
                          Governance voting rights
                        </span>
                      </div>
                      <div className="flex items-center">
                        <ShieldCheckIcon className="h-5 w-5 text-yellow-400 mr-2" />
                        <span className="text-white">
                          Enhanced security features
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Staking Tab */}
            {activeTab === "staking" && (
              <div className="space-y-6">
                {/* Staking Pools */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      name: "30-Day Pool",
                      apy: 12,
                      minStake: 1000,
                      lockPeriod: 30,
                    },
                    {
                      name: "90-Day Pool",
                      apy: 18,
                      minStake: 5000,
                      lockPeriod: 90,
                    },
                    {
                      name: "365-Day Pool",
                      apy: 25,
                      minStake: 10000,
                      lockPeriod: 365,
                    },
                  ].map((pool, index) => (
                    <Card key={index} className="bg-gray-800 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-white">
                          {pool.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-green-400">
                            {pool.apy}%
                          </div>
                          <div className="text-gray-400 text-sm">APY</div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Min Stake:</span>
                            <span className="text-white">
                              {pool.minStake.toLocaleString()} SYNCPAY
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Lock Period:</span>
                            <span className="text-white">
                              {pool.lockPeriod} days
                            </span>
                          </div>
                        </div>
                        <Button
                          className="w-full bg-green-600 hover:bg-green-700"
                          onClick={() => setSelectedPool(pool.name)}
                        >
                          Stake Now
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Stake Tokens Form */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Stake SYNCPAY Tokens
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="stakeAmount" className="text-gray-300">
                          Amount to Stake
                        </Label>
                        <Input
                          id="stakeAmount"
                          type="number"
                          value={stakeAmount}
                          onChange={(e) => setStakeAmount(e.target.value)}
                          placeholder="Enter amount"
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="pool" className="text-gray-300">
                          Select Pool
                        </Label>
                        <select
                          id="pool"
                          value={selectedPool}
                          onChange={(e) => setSelectedPool(e.target.value)}
                          className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                        >
                          <option value="">Select a pool</option>
                          <option value="30-Day Pool">
                            30-Day Pool (12% APY)
                          </option>
                          <option value="90-Day Pool">
                            90-Day Pool (18% APY)
                          </option>
                          <option value="365-Day Pool">
                            365-Day Pool (25% APY)
                          </option>
                        </select>
                      </div>
                    </div>
                    <Button
                      onClick={handleStakeTokens}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      Stake Tokens
                    </Button>
                  </CardContent>
                </Card>

                {/* Current Staking Positions */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Your Staking Positions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          pool: "90-Day Pool",
                          amount: 1000,
                          apy: 18,
                          rewards: 45.5,
                          status: "active",
                        },
                        {
                          pool: "30-Day Pool",
                          amount: 500,
                          apy: 12,
                          rewards: 12.25,
                          status: "active",
                        },
                      ].map((position, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-gray-700 rounded-lg"
                        >
                          <div>
                            <div className="text-white font-semibold">
                              {position.pool}
                            </div>
                            <div className="text-gray-400 text-sm">
                              {position.amount.toLocaleString()} SYNCPAY •{" "}
                              {position.apy}% APY
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-green-400 font-semibold">
                              {position.rewards.toFixed(2)} SYNCPAY
                            </div>
                            <Badge
                              className={
                                position.status === "active"
                                  ? "bg-green-900 text-green-400"
                                  : "bg-gray-700 text-gray-400"
                              }
                            >
                              {position.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button
                      onClick={handleClaimRewards}
                      className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                    >
                      Claim All Rewards
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Governance Tab */}
            {activeTab === "governance" && (
              <div className="space-y-6">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Active Proposals
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          title: "Increase staking rewards for 365-day pool",
                          description:
                            "Proposal to increase APY from 25% to 30%",
                          votesFor: 1250,
                          votesAgainst: 320,
                          status: "active",
                        },
                        {
                          title: "Add new liquidity pool for USDC",
                          description:
                            "Create a new liquidity pool for USDC to NGN conversion",
                          votesFor: 890,
                          votesAgainst: 150,
                          status: "active",
                        },
                      ].map((proposal, index) => (
                        <div key={index} className="p-4 bg-gray-700 rounded-lg">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-white font-semibold">
                                {proposal.title}
                              </h3>
                              <p className="text-gray-400 text-sm mt-1">
                                {proposal.description}
                              </p>
                            </div>
                            <Badge className="bg-green-900 text-green-400">
                              Active
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex space-x-4">
                              <div className="text-center">
                                <div className="text-green-400 font-semibold">
                                  {proposal.votesFor}
                                </div>
                                <div className="text-gray-400 text-xs">For</div>
                              </div>
                              <div className="text-center">
                                <div className="text-red-400 font-semibold">
                                  {proposal.votesAgainst}
                                </div>
                                <div className="text-gray-400 text-xs">
                                  Against
                                </div>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Vote For
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-600 text-red-400 hover:bg-red-900"
                              >
                                Vote Against
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
