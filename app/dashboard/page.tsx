"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import { Transaction } from "@/data/types";
import RecentTransactions from "@/components/RecentTransactions";
import DashboardActions from '@/components/DashboardActions';
import HybridPaymentDashboard from '@/components/HybridPaymentDashboard';
import UnifiedWallet from '@/components/UnifiedWallet';
import { getDashboardData } from "@/api/routes/user";

export default function DashboardOverviewPage() {
  const { user, token } = useAuth();
  const { addToast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user?.id || !token) return;

    try {
      setLoading(true);
      const data = await getDashboardData(user.id, token);
      setTransactions(data.transactions);
    } catch (error) {
      console.error("Dashboard data error:", error);
      addToast("Failed to load dashboard data", "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="space-y-8">
            {/* Placeholder for header */}
            <div className="h-10 bg-gray-800 rounded-md w-1/3 animate-pulse"></div>
            {/* Placeholders for wallets */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-2 h-64 bg-gray-800 rounded-2xl animate-pulse"></div>
              <div className="lg:col-span-3 h-64 bg-gray-800 rounded-2xl animate-pulse"></div>
            </div>
            {/* Placeholder for transactions */}
            <div className="h-48 bg-gray-800 rounded-2xl animate-pulse"></div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-8">
       

          {/* Hybrid Payment System Overview */}
          <HybridPaymentDashboard />

          <DashboardActions />

          {/* <UnifiedWallet /> */}

        </div>
      </Layout>
    </ProtectedRoute>
  );
}


