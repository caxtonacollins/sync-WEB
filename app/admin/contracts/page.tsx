"use client";

import { useState, useEffect } from "react";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import {
  CubeIcon,
  CogIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
  BanknotesIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ContractInfo {
  address: string;
  type: string;
  status: "active" | "inactive";
  owner: string;
  classHash?: string;
}

interface EventListenerStatus {
  isConnected: boolean;
  activeSubscriptions: number;
  subscriptionIds: string[];
}

export default function ContractsPage() {
  const { token } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [contracts, setContracts] = useState<ContractInfo[]>([]);
  const [eventListenerStatus, setEventListenerStatus] = useState<EventListenerStatus | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "factory" | "liquidity" | "events">("overview");

  // Form states
  const [newClassHash, setNewClassHash] = useState("");
  const [newOwnerAddress, setNewOwnerAddress] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");
  const [oracleAddress, setOracleAddress] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadContractData();
    loadEventListenerStatus();
  }, []);

  const loadContractData = async () => {
    try {
      setLoading(true);
      
      // Mock contract data - replace with actual API calls
      const mockContracts: ContractInfo[] = [
        {
          address: process.env.NEXT_PUBLIC_ACCOUNT_FACTORY_ADDRESS || "0x...",
          type: "Account Factory",
          status: "active",
          owner: process.env.NEXT_PUBLIC_DEPLOYER_ADDRESS || "0x...",
          classHash: "0x...",
        },
        {
          address: process.env.NEXT_PUBLIC_LIQUIDITY_CONTRACT_ADDRESS || "0x...",
          type: "Liquidity Pool",
          status: "active",
          owner: process.env.NEXT_PUBLIC_DEPLOYER_ADDRESS || "0x...",
        },
        {
          address: process.env.NEXT_PUBLIC_SYNC_TOKEN_ADDRESS || "0x...",
          type: "SYNC Token",
          status: "active",
          owner: process.env.NEXT_PUBLIC_DEPLOYER_ADDRESS || "0x...",
        },
      ];
      
      setContracts(mockContracts);
    } catch (error) {
      addToast("Failed to load contract data", "error");
    } finally {
      setLoading(false);
    }
  };

  const loadEventListenerStatus = async () => {
    try {
      const response = await fetch(`${process.env.BACKEND_URL}/contract/event-listener/subscriptions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEventListenerStatus(data);
      }
    } catch (error) {
      console.error("Failed to load event listener status:", error);
    }
  };

  const handleUpgradeAccountFactory = async () => {
    if (!newClassHash) {
      addToast("Please enter a class hash", "error");
      return;
    }

    try {
      setProcessing(true);
      const response = await fetch(`${process.env.BACKEND_URL}/contract/upgrade-account-factory`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ classHash: newClassHash }),
      });

      if (response.ok) {
        addToast("Account factory upgraded successfully", "success");
        setNewClassHash("");
        loadContractData();
      } else {
        throw new Error("Upgrade failed");
      }
    } catch (error) {
      addToast("Failed to upgrade account factory", "error");
    } finally {
      setProcessing(false);
    }
  };

  const handleTransferFactoryOwnership = async () => {
    if (!newOwnerAddress) {
      addToast("Please enter a new owner address", "error");
      return;
    }

    try {
      setProcessing(true);
      const response = await fetch(`${process.env.BACKEND_URL}/contract/transfer-ownership`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newOwnerAddress }),
      });

      if (response.ok) {
        addToast("Ownership transferred successfully", "success");
        setNewOwnerAddress("");
        loadContractData();
      } else {
        throw new Error("Transfer failed");
      }
    } catch (error) {
      addToast("Failed to transfer ownership", "error");
    } finally {
      setProcessing(false);
    }
  };

  const handleAddSupportedToken = async () => {
    if (!tokenSymbol || !tokenAddress) {
      addToast("Please enter both token symbol and address", "error");
      return;
    }

    try {
      setProcessing(true);
      const response = await fetch(`${process.env.BACKEND_URL}/contract/add-supported-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ symbol: tokenSymbol, address: tokenAddress }),
      });

      if (response.ok) {
        addToast("Token added successfully", "success");
        setTokenSymbol("");
        setTokenAddress("");
        addToast("Token added successfully", "success");
      } else {
        throw new Error("Failed to add token");
      }
    } catch (error) {
      addToast("Failed to add supported token", "error");
    } finally {
      setProcessing(false);
    }
  };

  const handleUpgradeLiquidityContract = async () => {
    if (!newClassHash) {
      addToast("Please enter a class hash", "error");
      return;
    }

    try {
      setProcessing(true);
      const response = await fetch(`${process.env.BACKEND_URL}/contract/upgrade-liquidity-contract`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ classHash: newClassHash }),
      });

      if (response.ok) {
        addToast("Liquidity contract upgraded successfully", "success");
        setNewClassHash("");
        loadContractData();
        addToast("Liquidity contract upgraded successfully", "success");
      } else {
        throw new Error("Upgrade failed");
      }
    } catch (error) {
      addToast("Failed to upgrade liquidity contract", "error");
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  const handleUpdateOracleAddress = async () => {
    if (!oracleAddress) {
      addToast("Please enter oracle address", "error");
      return;
    }

    try {
      setProcessing(true);
      const response = await fetch(`${process.env.BACKEND_URL}/contract/upgrade-pragma-oracle-address`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ contractAddress: oracleAddress }),
      });

      if (response.ok) {
        addToast("Oracle address updated successfully", "success");
        setOracleAddress("");
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      addToast("Failed to update oracle address", "error");
    } finally {
      setProcessing(false);
    }
  };

  const handleUnsubscribeAll = async () => {
    try {
      setProcessing(true);
      const response = await fetch(`${process.env.BACKEND_URL}/contract/event-listener/unsubscribe-all`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        addToast("Unsubscribed from all events", "success");
        loadEventListenerStatus();
      } else {
        throw new Error("Unsubscribe failed");
      }
    } catch (error) {
      addToast("Failed to unsubscribe", "error");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <AdminProtectedRoute>
        <AdminLayout>
          <div className="flex items-center justify-center h-64">
            <div className="loading-spinner h-12 w-12"></div>
          </div>
        </AdminLayout>
      </AdminProtectedRoute>
    );
  }

  return (
    <AdminProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center">
                <CubeIcon className="h-8 w-8 mr-3 text-purple-400" />
                Contract Management
              </h1>
              <p className="mt-2 text-gray-400">
                Manage StarkNet smart contracts and configurations
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-2 border-b border-gray-700">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === "overview"
                  ? "text-purple-400 border-b-2 border-purple-400"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("factory")}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === "factory"
                  ? "text-purple-400 border-b-2 border-purple-400"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              Account Factory
            </button>
            <button
              onClick={() => setActiveTab("liquidity")}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === "liquidity"
                  ? "text-purple-400 border-b-2 border-purple-400"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              Liquidity Pool
            </button>
            <button
              onClick={() => setActiveTab("events")}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === "events"
                  ? "text-purple-400 border-b-2 border-purple-400"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              Event Listener
            </button>
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contracts.map((contract, index) => (
                  <Card key={index} className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center justify-between">
                        <span>{contract.type}</span>
                        <Badge
                          className={
                            contract.status === "active"
                              ? "bg-green-900 text-green-400 border-green-700"
                              : "bg-red-900 text-red-400 border-red-700"
                          }
                        >
                          {contract.status}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-400">Address</p>
                        <p className="text-sm text-white font-mono break-all">
                          {contract.address}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Owner</p>
                        <p className="text-sm text-white font-mono break-all">
                          {contract.owner}
                        </p>
                      </div>
                      {contract.classHash && (
                        <div>
                          <p className="text-xs text-gray-400">Class Hash</p>
                          <p className="text-sm text-white font-mono break-all">
                            {contract.classHash}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Account Factory Tab */}
          {activeTab === "factory" && (
            <div className="space-y-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <ArrowPathIcon className="h-5 w-5 mr-2 text-purple-400" />
                    Upgrade Account Factory
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      New Class Hash
                    </label>
                    <input
                      type="text"
                      value={newClassHash}
                      onChange={(e) => setNewClassHash(e.target.value)}
                      placeholder="0x..."
                      className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <button
                    onClick={handleUpgradeAccountFactory}
                    disabled={processing}
                    className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white rounded-lg transition-colors flex items-center justify-center"
                  >
                    {processing ? (
                      <div className="loading-spinner h-5 w-5"></div>
                    ) : (
                      <>
                        <ArrowPathIcon className="h-5 w-5 mr-2" />
                        Upgrade Contract
                      </>
                    )}
                  </button>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <ShieldCheckIcon className="h-5 w-5 mr-2 text-orange-400" />
                    Transfer Ownership
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      New Owner Address
                    </label>
                    <input
                      type="text"
                      value={newOwnerAddress}
                      onChange={(e) => setNewOwnerAddress(e.target.value)}
                      placeholder="0x..."
                      className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <button
                    onClick={handleTransferFactoryOwnership}
                    disabled={processing}
                    className="w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 text-white rounded-lg transition-colors flex items-center justify-center"
                  >
                    {processing ? (
                      <div className="loading-spinner h-5 w-5"></div>
                    ) : (
                      <>
                        <ShieldCheckIcon className="h-5 w-5 mr-2" />
                        Transfer Ownership
                      </>
                    )}
                  </button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Liquidity Pool Tab */}
          {activeTab === "liquidity" && (
            <div className="space-y-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <BanknotesIcon className="h-5 w-5 mr-2 text-green-400" />
                    Add Supported Token
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Token Symbol
                    </label>
                    <input
                      type="text"
                      value={tokenSymbol}
                      onChange={(e) => setTokenSymbol(e.target.value)}
                      placeholder="STRK, ETH, USDC..."
                      className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Token Address
                    </label>
                    <input
                      type="text"
                      value={tokenAddress}
                      onChange={(e) => setTokenAddress(e.target.value)}
                      placeholder="0x..."
                      className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <button
                    onClick={handleAddSupportedToken}
                    disabled={processing}
                    className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg transition-colors flex items-center justify-center"
                  >
                    {processing ? (
                      <div className="loading-spinner h-5 w-5"></div>
                    ) : (
                      <>
                        <BanknotesIcon className="h-5 w-5 mr-2" />
                        Add Token
                      </>
                    )}
                  </button>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <ArrowPathIcon className="h-5 w-5 mr-2 text-purple-400" />
                    Upgrade Liquidity Contract
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      New Class Hash
                    </label>
                    <input
                      type="text"
                      value={newClassHash}
                      onChange={(e) => setNewClassHash(e.target.value)}
                      placeholder="0x..."
                      className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <button
                    onClick={handleUpgradeLiquidityContract}
                    disabled={processing}
                    className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white rounded-lg transition-colors flex items-center justify-center"
                  >
                    {processing ? (
                      <div className="loading-spinner h-5 w-5"></div>
                    ) : (
                      <>
                        <ArrowPathIcon className="h-5 w-5 mr-2" />
                        Upgrade Contract
                      </>
                    )}
                  </button>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <CogIcon className="h-5 w-5 mr-2 text-blue-400" />
                    Update Oracle Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Pragma Oracle Address
                    </label>
                    <input
                      type="text"
                      value={oracleAddress}
                      onChange={(e) => setOracleAddress(e.target.value)}
                      placeholder="0x..."
                      className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    onClick={handleUpdateOracleAddress}
                    disabled={processing}
                    className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors flex items-center justify-center"
                  >
                    {processing ? (
                      <div className="loading-spinner h-5 w-5"></div>
                    ) : (
                      <>
                        <CogIcon className="h-5 w-5 mr-2" />
                        Update Oracle
                      </>
                    )}
                  </button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Event Listener Tab */}
          {activeTab === "events" && (
            <div className="space-y-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <span className="flex items-center">
                      <CogIcon className="h-5 w-5 mr-2 text-blue-400" />
                      Event Listener Status
                    </span>
                    {eventListenerStatus?.isConnected ? (
                      <CheckCircleIcon className="h-6 w-6 text-green-400" />
                    ) : (
                      <XCircleIcon className="h-6 w-6 text-red-400" />
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-900 rounded-lg">
                      <p className="text-sm text-gray-400">Connection Status</p>
                      <p className="text-lg font-semibold text-white mt-1">
                        {eventListenerStatus?.isConnected ? "Connected" : "Disconnected"}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-900 rounded-lg">
                      <p className="text-sm text-gray-400">Active Subscriptions</p>
                      <p className="text-lg font-semibold text-white mt-1">
                        {eventListenerStatus?.activeSubscriptions || 0}
                      </p>
                    </div>
                  </div>

                  {eventListenerStatus?.subscriptionIds && eventListenerStatus.subscriptionIds.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-300 mb-2">Subscription IDs</p>
                      <div className="space-y-2">
                        {eventListenerStatus.subscriptionIds.map((id, index) => (
                          <div key={index} className="p-2 bg-gray-900 rounded text-sm text-white font-mono">
                            {id}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleUnsubscribeAll}
                    disabled={processing || !eventListenerStatus?.activeSubscriptions}
                    className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded-lg transition-colors flex items-center justify-center"
                  >
                    {processing ? (
                      <div className="loading-spinner h-5 w-5"></div>
                    ) : (
                      <>
                        <XCircleIcon className="h-5 w-5 mr-2" />
                        Unsubscribe All
                      </>
                    )}
                  </button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </AdminLayout>
    </AdminProtectedRoute>
  );
}
