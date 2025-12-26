import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { Transaction } from "@/types/transaction";
import { TransactionTableRowSkeleton } from "./skeletons/TransactionTableRowSkeleton";
import Link from "next/link";
import { format } from "date-fns";

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
const TRANSACTION_TYPES = ["all", "deposit", "withdrawal", "swap", "transfer"];
const CURRENCIES = ["all", "USD", "NGN", "ETH", "USDC"];
const STATUS_OPTIONS = ["all", "completed", "pending", "failed"];

interface TransactionTableProps {
  transactions: Transaction[];
  loading: boolean;
  filters: {
    fromDate?: Date;
    toDate?: Date;
    status: string;
    type: string;
    symbol: string;
    page: number;
    limit: number;
  };
  totalTransactions: number;
  onFilterChange: (newFilters: any) => void;
}

export function TransactionTable({
  transactions,
  loading,
  filters,
  totalTransactions,
  onFilterChange,
}: TransactionTableProps) {
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
    <div className="space-y-8">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
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
                  onFilterChange({ ...filters, fromDate: date })
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
                  onFilterChange({ ...filters, toDate: date })
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
              onFilterChange({ ...filters, status: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((status) => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm text-gray-400">Type</label>
          <Select
            value={filters.type}
            onValueChange={(value) =>
              onFilterChange({ ...filters, type: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {TRANSACTION_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm text-gray-400">Currency</label>
          <Select
            value={filters.symbol}
            onValueChange={(value) =>
              onFilterChange({ ...filters, symbol: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select symbol" />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map((symbol) => (
                <SelectItem key={symbol} value={symbol}>
                  {symbol}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
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
                  symbol
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading ? (
                Array.from({ length: filters.limit }).map((_, i) => (
                  <TransactionTableRowSkeleton key={i} />
                ))
              ) : transactions && transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="hover:bg-gray-800 transition-colors"
                  >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-300">
                      {transaction.metadata?.txHash ? (
                        <Link
                          href={`https://voyager.online/tx/${transaction.metadata.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline"
                        >
                          {transaction.metadata.txHash.slice(0, 8)}...
                          {transaction.metadata.txHash.slice(-6)}
                        </Link>
                      ) : (
                        <span>{transaction.id.slice(0, 13)}...</span>
                      )}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                        transaction.amount > 0
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {Math.abs(transaction.amount / Math.pow(10, 18)).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 capitalize">
                      {transaction.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(transaction.status)}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300 font-semibold">
                      {transaction.symbol}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-gray-400"
                  >
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400">Items per page</span>
            <Select
              value={filters.limit.toString()}
              onValueChange={(value) =>
                onFilterChange({
                  ...filters,
                  limit: parseInt(value),
                  page: 1,
                })
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
              {Math.ceil(totalTransactions / filters.limit)}
            </span>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  onFilterChange({
                    ...filters,
                    page: Math.max(1, filters.page - 1),
                  })
                }
                disabled={filters.page <= 1}
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  onFilterChange({
                    ...filters,
                    page: filters.page + 1,
                  })
                }
                disabled={
                  filters.page >= Math.ceil(totalTransactions / filters.limit)
                }
              >
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
