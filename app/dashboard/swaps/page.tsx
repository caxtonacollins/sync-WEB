"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/contexts/ToastContext"
import ProtectedRoute from "@/components/ProtectedRoute"
import { SwapOrder } from "@/types/types"
import { ArrowsRightLeftIcon } from "@heroicons/react/24/outline"
import { getSwapOrdersByUserId } from "@/api/routes/swaps"

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return "status-badge status-verified"
    case "pending":
      return "status-badge status-pending"
    case "failed":
      return "status-badge status-rejected"
    default:
      return "status-badge status-pending"
  }
}

export default function SwapOrdersPage() {
  const { user, token } = useAuth()
  const { addToast } = useToast()
  const [swapOrders, setSwapOrders] = useState<SwapOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user && token) {
      fetchSwapOrders()
    }
  }, [user, token])

  const fetchSwapOrders = async () => {
    if (!token || !user) return
    try {
      setLoading(true)
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      const mockData: SwapOrder[] = [
        {
          id: 's1',
          fromCurrency: 'BTC',
          toCurrency: 'USDT',
          fromAmount: 0.5,
          status: 'completed',
          createdAt: new Date().toISOString(),
          rate: 60000,
        },
        {
          id: 's2',
          fromCurrency: 'ETH',
          toCurrency: 'USDC',
          fromAmount: 10,
          status: 'pending',
          createdAt: new Date().toISOString(),
          rate: 3000,
        },
        {
          id: 's3',
          fromCurrency: 'NGN',
          toCurrency: 'USDT',
          fromAmount: 500000,
          status: 'failed',
          createdAt: new Date().toISOString(),
          rate: 1200,
        },
      ];
      setSwapOrders(mockData);
    } catch (error) {
      addToast("Failed to fetch swap orders", "error")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner h-12 w-12"></div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center">
            <ArrowsRightLeftIcon className="h-8 w-8 mr-3 text-green-400" />
            Swap Orders
          </h1>
          <p className="mt-2 text-gray-400">Your complete swap order history.</p>
        </div>

        <div className="card">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    From
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Amount
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
                  <tr key={order.id} className="hover:bg-gray-800 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-300">{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-400">
                      {order.fromCurrency}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-purple-400">
                      {order.toCurrency}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{order.fromAmount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{order.rate}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(order.status)}>{order.status}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
