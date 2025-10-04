"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { TrendingUpIcon } from "lucide-react";
import { getAllUserTransactions } from "@/api/routes/transaction";
import { TransactionTable } from "@/components/TransactionTable";
import { TransactionTableSkeleton } from "@/components/skeletons/TransactionTableSkeleton";
import { Transaction } from "@/types/types";

export default function TransactionsPage() {
  const { token } = useAuth();
  const { addToast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalTransactions, setTotalTransactions] = useState(0);

  const [filters, setFilters] = useState({
    fromDate: undefined as Date | undefined,
    toDate: undefined as Date | undefined,
    status: "all",
    type: "all",
    currency: "all",
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    if (token) {
      fetchTransactions();
    }
  }, [token, filters]);

  const fetchTransactions = async () => {
    if (!token) return;

    const user = localStorage.getItem("user");
    const userId = user ? JSON.parse(user).id : null;

    if (!userId) {
      addToast("User ID not found", "error");
      return;
    }

    try {
      setLoading(true);
      const { data: responseData } = await getAllUserTransactions(token, {
        userId,
        status: filters.status !== "all" ? filters.status : undefined,
        type: filters.type !== "all" ? filters.type : undefined,
        currency: filters.currency !== "all" ? filters.currency : undefined,
        page: filters.page,
        limit: filters.limit,
        fromDate: filters.fromDate?.toISOString(),
        toDate: filters.toDate?.toISOString(),
      });

      setTransactions(responseData);
      setTotalTransactions(responseData.length);
    } catch (error: any) {
      addToast(error?.message || "Failed to fetch transactions", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white flex items-center">
              <TrendingUpIcon className="h-8 w-8 mr-3 text-blue-400" />
              Transaction History
            </h1>
          </div>

          {loading ? (
            <TransactionTableSkeleton />
          ) : (
            <TransactionTable
              transactions={transactions}
              loading={loading}
              filters={filters}
              totalTransactions={totalTransactions}
              onFilterChange={setFilters}
            />
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
