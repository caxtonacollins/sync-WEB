"use client";

import { useState, useEffect } from "react";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  UsersIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatsCard from "@/components/admin/StatsCard";

export default function AnalyticsPage() {
  const { token } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("7d");

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      addToast("Failed to load analytics", "error");
    } finally {
      setLoading(false);
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
                <ChartBarIcon className="h-8 w-8 mr-3 text-blue-400" />
                Analytics Dashboard
              </h1>
              <p className="mt-2 text-gray-400">
                System performance metrics and insights
              </p>
            </div>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </div>

          {/* Growth Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="User Growth"
              value="+12.5%"
              icon={UsersIcon}
              description="vs previous period"
              trend={{ value: 12.5, isPositive: true }}
              colorClass="from-blue-900/20 to-blue-800/20 border-blue-700"
            />
            <StatsCard
              title="Transaction Volume"
              value="+18.3%"
              icon={CreditCardIcon}
              description="vs previous period"
              trend={{ value: 18.3, isPositive: true }}
              colorClass="from-green-900/20 to-green-800/20 border-green-700"
            />
            <StatsCard
              title="Revenue"
              value="+9.7%"
              icon={ArrowTrendingUpIcon}
              description="vs previous period"
              trend={{ value: 9.7, isPositive: true }}
              colorClass="from-purple-900/20 to-purple-800/20 border-purple-700"
            />
            <StatsCard
              title="Active Users"
              value="+15.2%"
              icon={UsersIcon}
              description="vs previous period"
              trend={{ value: 15.2, isPositive: true }}
              colorClass="from-orange-900/20 to-orange-800/20 border-orange-700"
            />
          </div>

          {/* Charts Placeholder */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">
                  Transaction Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-400">
                  Here na for Chart
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">User Acquisition</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-400">
                  Here na for Chart
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Performers */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Top Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                  <span className="text-sm text-gray-300">
                    Peak Transaction Hour
                  </span>
                  <span className="text-sm font-semibold text-white">
                    2:00 PM - 3:00 PM
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                  <span className="text-sm text-gray-300">
                    Average Transaction Value
                  </span>
                  <span className="text-sm font-semibold text-white">
                    ₦45,230
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                  <span className="text-sm text-gray-300">
                    User Retention Rate
                  </span>
                  <span className="text-sm font-semibold text-white">
                    87.3%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </AdminProtectedRoute>
  );
}
