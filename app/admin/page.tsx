"use client";

import { useEffect, useState } from "react";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";
import StatsCard from "@/components/admin/StatsCard";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import {
  UsersIcon,
  CreditCardIcon,
  BanknotesIcon,
  ArrowTrendingUpIcon,
  ShieldCheckIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalTransactions: number;
  transactionVolume: number;
  totalWallets: number;
  pendingKYC: number;
  systemHealth: string;
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
  }>;
}

export default function AdminDashboardPage() {
  const { token } = useAuth();
  const { addToast } = useToast();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Mock data - replace with actual API call
      const mockStats: DashboardStats = {
        totalUsers: 1247,
        activeUsers: 892,
        totalTransactions: 5432,
        transactionVolume: 45000000,
        totalWallets: 2340,
        pendingKYC: 34,
        systemHealth: "Excellent",
        recentActivity: [
          {
            id: "1",
            type: "user_registration",
            description: "New user registered: john.doe@example.com",
            timestamp: new Date().toISOString(),
          },
          {
            id: "2",
            type: "transaction",
            description: "Large transaction processed: ₦500,000",
            timestamp: new Date(Date.now() - 300000).toISOString(),
          },
          {
            id: "3",
            type: "kyc_verification",
            description: "KYC approved for user ID: abc-123",
            timestamp: new Date(Date.now() - 600000).toISOString(),
          },
        ],
      };
      
      setStats(mockStats);
    } catch (error) {
      addToast("Failed to load dashboard statistics", "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminProtectedRoute>
        <AdminLayout>
          <div className="space-y-6">
            <div className="h-10 bg-gray-800 rounded w-1/3 animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-32 bg-gray-800 rounded-xl animate-pulse"></div>
              ))}
            </div>
          </div>
        </AdminLayout>
      </AdminProtectedRoute>
    );
  }

  return (
    <AdminProtectedRoute>
      <AdminLayout>
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="mt-2 text-gray-400">
                System overview and key performance metrics
              </p>
            </div>
            <Badge className="bg-green-900 text-green-400 border border-green-700">
              {stats?.systemHealth}
            </Badge>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatsCard
              title="Total Users"
              value={stats?.totalUsers.toLocaleString() || "0"}
              icon={UsersIcon}
              description={`${stats?.activeUsers.toLocaleString()} active`}
              trend={{ value: 12.5, isPositive: true }}
              colorClass="from-blue-900/20 to-blue-800/20 border-blue-700"
            />
            <StatsCard
              title="Total Transactions"
              value={stats?.totalTransactions.toLocaleString() || "0"}
              icon={CreditCardIcon}
              description="All-time transactions"
              trend={{ value: 8.3, isPositive: true }}
              colorClass="from-purple-900/20 to-purple-800/20 border-purple-700"
            />
            <StatsCard
              title="Transaction Volume"
              value={`₦${(stats?.transactionVolume || 0).toLocaleString()}`}
              icon={ArrowTrendingUpIcon}
              description="Total value processed"
              trend={{ value: 15.7, isPositive: true }}
              colorClass="from-green-900/20 to-green-800/20 border-green-700"
            />
            <StatsCard
              title="Total Wallets"
              value={stats?.totalWallets.toLocaleString() || "0"}
              icon={BanknotesIcon}
              description="Fiat + Crypto wallets"
              colorClass="from-orange-900/20 to-orange-800/20 border-orange-700"
            />
            <StatsCard
              title="Pending KYC"
              value={stats?.pendingKYC || "0"}
              icon={ShieldCheckIcon}
              description="Awaiting verification"
              colorClass="from-yellow-900/20 to-yellow-800/20 border-yellow-700"
            />
            <StatsCard
              title="System Uptime"
              value="99.9%"
              icon={ClockIcon}
              description="Last 30 days"
              colorClass="from-teal-900/20 to-teal-800/20 border-teal-700"
            />
          </div>

          {/* Recent Activity */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start space-x-3 p-3 bg-gray-900 rounded-lg border border-gray-700"
                  >
                    <div className="flex-1">
                      <p className="text-sm text-white">{activity.description}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-xs border-gray-600 text-gray-400"
                    >
                      {activity.type.replace("_", " ")}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button className="p-4 bg-gray-900 hover:bg-gray-700 rounded-lg border border-gray-700 transition-colors text-left">
                  <UsersIcon className="h-6 w-6 text-blue-400 mb-2" />
                  <div className="text-sm font-medium text-white">Manage Users</div>
                </button>
                <button className="p-4 bg-gray-900 hover:bg-gray-700 rounded-lg border border-gray-700 transition-colors text-left">
                  <CreditCardIcon className="h-6 w-6 text-purple-400 mb-2" />
                  <div className="text-sm font-medium text-white">View Transactions</div>
                </button>
                <button className="p-4 bg-gray-900 hover:bg-gray-700 rounded-lg border border-gray-700 transition-colors text-left">
                  <ShieldCheckIcon className="h-6 w-6 text-green-400 mb-2" />
                  <div className="text-sm font-medium text-white">Review KYC</div>
                </button>
                <button className="p-4 bg-gray-900 hover:bg-gray-700 rounded-lg border border-gray-700 transition-colors text-left">
                  <ClockIcon className="h-6 w-6 text-orange-400 mb-2" />
                  <div className="text-sm font-medium text-white">Audit Logs</div>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </AdminProtectedRoute>
  );
}
