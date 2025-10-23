import { useState, useEffect, useCallback } from "react";
import { formatNumber } from "@/lib/utils/formatters";
import { useSession } from "next-auth/react";
import { getUserSwapOrders, SwapOrderListResponse } from "@/api/routes/swaps";

interface SwapOrdersTableProps {
  userId: string;
}

export default function SwapOrdersTable({ userId }: SwapOrdersTableProps) {
  const { data: session } = useSession();
  const [swapOrders, setSwapOrders] = useState<SwapOrderListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    status: "",
    fromCurrency: "",
    toCurrency: "",
  });

  const fetchSwapOrders = useCallback(async () => {
    if (!session?.accessToken) return;

    try {
      setLoading(true);
      const response = await getUserSwapOrders(session.accessToken, {
        userId,
        page: currentPage,
        limit: 10,
        ...filters,
      });
      setSwapOrders(response);
    } catch (error) {
      console.error("Error fetching swap orders:", error);
    } finally {
      setLoading(false);
    }
  }, [session?.accessToken, userId, currentPage, filters]);

  useEffect(() => {
    fetchSwapOrders();
  }, [fetchSwapOrders]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-300"></div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="mb-4 flex gap-4">
        <select
          className="bg-gray-800 text-white rounded-lg px-3 py-2"
          value={filters.status}
          onChange={(e) => handleFilterChange("status", e.target.value)}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>
        <select
          className="bg-gray-800 text-white rounded-lg px-3 py-2"
          value={filters.fromCurrency}
          onChange={(e) => handleFilterChange("fromCurrency", e.target.value)}
        >
          <option value="">All From Currency</option>
          <option value="NGN">NGN</option>
          <option value="USDC">USDC</option>
        </select>
        <select
          className="bg-gray-800 text-white rounded-lg px-3 py-2"
          value={filters.toCurrency}
          onChange={(e) => handleFilterChange("toCurrency", e.target.value)}
        >
          <option value="">All To Currency</option>
          <option value="NGN">NGN</option>
          <option value="USDC">USDC</option>
        </select>
      </div>

      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              From
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              To
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Rate
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Fee
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-900 divide-y divide-gray-700">
          {swapOrders?.data.map((order) => (
            <tr key={order.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {order.fromAmount.toLocaleString()} {order.fromCurrency}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {formatNumber(order.toAmount, 2)} {order.toCurrency}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {formatNumber(order.rate, 2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {formatNumber(order.fee)} {order.fromCurrency}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    order.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : order.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {order.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {swapOrders && swapOrders.total > 0 && (
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-400">
            Total: {swapOrders.total} orders
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-800 text-white rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-3 py-1 text-gray-300">
              Page {currentPage} of {""}
              {Math.ceil(swapOrders.total / swapOrders.limit)}
            </span>
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={
                currentPage >=
                Math.ceil(swapOrders.total / swapOrders.limit)
              }
              className="px-3 py-1 bg-gray-800 text-white rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
