"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ArrowPathIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getUserSwapOrders, SwapOrderListResponse } from "@/api/routes/swaps";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { SwapTableSkeleton } from "@/components/skeletons/SwapTableSkeleton";

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export default function SwapsPage() {
  const { token, user } = useAuth();
  const { addToast } = useToast();
  const [swapOrders, setSwapOrders] = useState<SwapOrderListResponse>({
    data: [],
    page: 1,
    limit: 10,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    fromDate: undefined as Date | undefined,
    toDate: undefined as Date | undefined,
    status: "all",
    fromCurrency: "",
    toCurrency: "",
    page: 1,
    limit: 10,
  });

  const statusOptions = ["all", "completed", "pending", "failed"];
  const currencyOptions = ["USD", "NGN", "ETH", "USDT", "USDC"];

  useEffect(() => {
    if (token) {
      fetchSwapOrders();
    }
  }, [token]);

  const fetchSwapOrders = async () => {
    const userId = user ? user.id : null;

    if (!token || !userId) return;
    try {
      setLoading(true);
      const response: SwapOrderListResponse = await getUserSwapOrders(token, {
        userId,
        status: filters.status !== "all" ? filters.status : undefined,
        fromCurrency: filters.fromCurrency || undefined,
        toCurrency: filters.toCurrency || undefined,
        page: filters.page,
        limit: filters.limit,
        fromDate: filters.fromDate?.toISOString(),
        toDate: filters.toDate?.toISOString(),
      });
      setSwapOrders(response as unknown as SwapOrderListResponse);
    } catch (error) {
      addToast("Failed to fetch swap orders", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && user?.id) {
      fetchSwapOrders();
    }
  }, [token, filters, user?.id]);

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
          <div className="space-y-4">
            <div className="flex items-center justify-between">
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

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="flex flex-col space-y-2">
                <label className="text-sm text-gray-400">From Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.fromDate ? (
                        format(filters.fromDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filters.fromDate}
                      onSelect={(date) =>
                        setFilters((prev) => ({ ...prev, fromDate: date }))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-sm text-gray-400">To Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.toDate ? (
                        format(filters.toDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filters.toDate}
                      onSelect={(date) =>
                        setFilters((prev) => ({ ...prev, toDate: date }))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-sm text-gray-400">Status</label>
                <Select
                  value={filters.status}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-sm text-gray-400">From Currency</label>
                <Select
                  value={filters.fromCurrency}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, fromCurrency: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencyOptions.map((currency) => (
                      <SelectItem key={currency} value={currency}>
                        {currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-sm text-gray-400">To Currency</label>
                <Select
                  value={filters.toCurrency}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, toCurrency: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencyOptions.map((currency) => (
                      <SelectItem key={currency} value={currency}>
                        {currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {loading ? (
            <SwapTableSkeleton />
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
                    {swapOrders.data.map((order) => (
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

              {/* Pagination Controls */}
              <div className="mt-4 flex items-center justify-between px-4 py-3 sm:px-6">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-400">Items per page</span>
                  <Select
                    value={filters.limit.toString()}
                    onValueChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        limit: parseInt(value),
                        page: 1, // Reset to first page when changing limit
                      }))
                    }
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PAGE_SIZE_OPTIONS.map((size) => (
                        <SelectItem key={size} value={size.toString()}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-400">
                    Page {filters.page} of{" "}
                    {Math.ceil(swapOrders.total / filters.limit)}
                  </span>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          page: Math.max(1, prev.page - 1),
                        }))
                      }
                      disabled={filters.page <= 1}
                    >
                      <ChevronLeftIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          page: prev.page + 1,
                        }))
                      }
                      disabled={
                        filters.page >=
                        Math.ceil(swapOrders.total / filters.limit)
                      }
                    >
                      <ChevronRightIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
