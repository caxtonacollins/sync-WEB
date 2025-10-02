"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getDashboardData } from "@/api/mock/dashboard";
import { Transaction } from "@/data/types";
import RecentTransactions from "@/components/RecentTransactions";
import DashboardActions from '@/components/DashboardActions';
import FiatWallet from '@/components/FiatWallet';
import CryptoWallet from '@/components/CryptoWallet';

export default function DashboardOverviewPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const data = await getDashboardData(user.id);
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
    );
  }

  return (
    <ProtectedRoute>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Welcome back, {user?.firstName}
          </h1>
          <p className="mt-2 text-gray-400">
            Here's a snapshot of your financial world.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          <div className="lg:col-span-2">
            <FiatWallet />
          </div>
          <div className="lg:col-span-3">
            <CryptoWallet />
          </div>
        </div>

        <DashboardActions />
        
        <RecentTransactions transactions={transactions} />
      </div>
    </ProtectedRoute>
  );
}


