"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { TrendingUpIcon } from "lucide-react";
import { getAllUserTransactions, TransactionListResponse } from "@/api/routes/transaction";
import { TransactionTable } from "@/components/TransactionTable";
import { TransactionTableSkeleton } from "@/components/skeletons/TransactionTableSkeleton";
import { Transaction } from "@/types/types";

export default function TransactionsPage() {
  const { token, user } = useAuth();
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
    if (token && user?.id) {
      fetchTransactions();
    }
  }, [token, user?.id]);

  useEffect(() => {
    if (token && user?.id) {
      fetchTransactions();
    }
  }, [token, user?.id, filters]);

  const fetchTransactions = async () => {
    if (!token || !user?.id) return;

    try {
      setLoading(true);

      const response: TransactionListResponse = await getAllUserTransactions(token, {
        userId: user.id,
        status: filters.status !== "all" ? filters.status : undefined,
        type: filters.type !== "all" ? filters.type : undefined,
        currency: filters.currency !== "all" ? filters.currency : undefined,
        page: filters.page,
        limit: filters.limit,
        fromDate: filters.fromDate?.toISOString(),
        toDate: filters.toDate?.toISOString(),
      });

      setTransactions(response.data as unknown as Transaction[]);
      setTotalTransactions(response.meta?.total || response.data.length);
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
