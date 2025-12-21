"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { useWalletStats } from "@/hooks/api";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  BanknotesIcon,
  MagnifyingGlassIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StatsCard from "@/components/admin/StatsCard";

export default function WalletManagementPage() {
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: stats, isLoading, isError } = useWalletStats();

  useEffect(() => {
    if (isError) {
      addToast("Failed to load wallet statistics", "error");
    }
  }, [isError, addToast]);

  if (isLoading) {
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
                <BanknotesIcon className="h-8 w-8 mr-3 text-green-400" />
                Wallet Management
              </h1>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatsCard
              title="Total Crypto Wallets"
              value={stats?.totalCryptoWallets.toLocaleString() || "0"}
              icon={CurrencyDollarIcon}
              description="StarkNet wallets"
              colorClass="from-purple-900/20 to-purple-800/20 border-purple-700"
            />
            <StatsCard
              title="Total Crypto Value"
              value={`$${(stats?.totalCryptoBalance || 0).toLocaleString()}`}
              icon={CurrencyDollarIcon}
              description="USD equivalent"
              colorClass="from-orange-900/20 to-orange-800/20 border-orange-700"
            />
            <StatsCard
              title="Active Wallets"
              value={stats?.activeWallets.toLocaleString() || "0"}
              icon={BanknotesIcon}
              description="Currently active"
              colorClass="from-teal-900/20 to-teal-800/20 border-teal-700"
            />
            <StatsCard
              title="Suspended Wallets"
              value={stats?.suspendedWallets.toLocaleString() || "0"}
              icon={BanknotesIcon}
              description="Pending review"
              colorClass="from-red-900/20 to-red-800/20 border-red-700"
            />
          </div>

          {/* Wallet Overview */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Wallet Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-purple-900/50 rounded-lg flex items-center justify-center">
                      <CurrencyDollarIcon className="h-6 w-6 text-purple-400" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">
                        Crypto Wallets (STRK)
                      </div>
                      <div className="text-xs text-gray-400">
                        StarkNet Network
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-white">
                      {stats?.totalCryptoWallets.toLocaleString()}
                    </div>
                    <Badge className="bg-purple-900 text-purple-400 border-purple-700 mt-1">
                      34.1%
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">
                Recent Wallet Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    id: 1,
                    type: "Crypto Deposit",
                    user: "john.doe@example.com",
                    time: "2 minutes ago",
                    amount: "$500",
                  },
                ].map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-3 bg-gray-900 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="text-sm font-medium text-white">
                        {activity.type}
                      </div>
                      <div className="text-xs text-gray-400">
                        {activity.user} · {activity.time}
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-white">
                      {activity.amount}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </AdminProtectedRoute>
  );
}
