"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { TrendingUpIcon } from "lucide-react";
import { getAllTransactions } from "@/api/routes/transaction";

interface Transaction {
  id: string;
  amount: number;
  type: string;
  createdAt: string;
  status: string;
  currency: string;
}

export default function TransactionsPage() {
  const { token } = useAuth();
  const { addToast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState<{
    status?: string;
    type?: string;
    currency?: string;
    page?: number;
    limit?: number;
  }>({
    status: "all",
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    if (token) {
      fetchTransactions();
    }
  }, [token, filter]);

  const fetchTransactions = async () => {
    if (!token) return;
    try {
      setLoading(true);

      const data = await getAllTransactions(token, {
        userId: sessionStorage.getItem("userId") || "",
        status: filter.status !== "all" ? filter.status : undefined,
        type: filter.type,
        currency: filter.currency,
        page: filter.page,
        limit: filter.limit,
      });

      setTransactions(data);
    } catch (error) {
      addToast("Failed to fetch transactions", "error");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return "status-badge status-verified";
      case "pending":
        return "status-badge status-pending";
      case "failed":
        return "status-badge status-rejected";
      default:
        return "status-badge status-pending";
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

            {/* 🔽 Filter Controls */}
            <div className="mb-6 flex items-center gap-4">
              <label
                htmlFor="status"
                className="text-gray-300 text-sm font-medium"
              >
                Filter by Status:
              </label>
              <select
                id="status"
                value={filter.status}
                onChange={(e) =>
                  setFilter((prev) => ({ ...prev, status: e.target.value }))
                }
                className="bg-gray-800 text-gray-200 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="loading-spinner h-12 w-12"></div>
              </div>
            ) : (
              <div className="card">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Transaction ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Currency
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {transactions && transactions.length > 0 ? (
                        transactions.map((transaction) => (
                          <tr
                            key={transaction.id}
                            className="hover:bg-gray-800 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-300">
                              {transaction.id}
                            </td>
                            <td
                              className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${transaction.amount > 0
                                  ? "text-green-400"
                                  : "text-red-400"
                                }`}
                            >
                              {new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: transaction.currency,
                              }).format(Math.abs(transaction.amount))}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 capitalize">
                              {transaction.type}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={getStatusBadge(transaction.status)}
                              >
                                {transaction.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {new Date(
                                transaction.createdAt
                              ).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-300 font-semibold">
                              {transaction.currency}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-6 py-4 text-center text-gray-400">
                            No recent transactions.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
