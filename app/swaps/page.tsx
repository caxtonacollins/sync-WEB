"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ArrowPathIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getUserSwapOrders } from "@/api/routes/transaction";

interface SwapOrder {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  fromAmount: number;
  toAmount: number;
  rate: number;
  status: string;
  createdAt: string;
}

export default function SwapsPage() {
  const { token } = useAuth();
  const { addToast } = useToast();
  const [swapOrders, setSwapOrders] = useState<SwapOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchSwapOrders();
    }
  }, [token]);

  const fetchSwapOrders = async () => {
    const userId = localStorage.getItem("userId") || "";
    if (!token) return;
    try {
      setLoading(true);
      const data = await getUserSwapOrders(userId, token);
      setSwapOrders(data);
    } catch (error) {
      addToast("Failed to fetch swap orders", "error");
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
        <div className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-white flex items-center">
                <ArrowPathIcon className="h-8 w-8 mr-3 text-cyan-400" />
                Swap History
              </h1>
              <Link href="/swap/new">
                <Button>
                  <PlusIcon className="h-5 w-5 mr-2" />
                  New Swap
                </Button>
              </Link>
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
                          From
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          To
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Rate
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {swapOrders.map((order) => (
                        <tr
                          key={order.id}
                          className="hover:bg-gray-800 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-400">
                            {order.fromAmount} {order.fromCurrency}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-400">
                            {order.toAmount} {order.toCurrency}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            1 {order.fromCurrency} = {order.rate}{" "}
                            {order.toCurrency}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={getStatusBadge(order.status)}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
