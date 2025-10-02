"use client"

import { Transaction } from "@/data/types"
import Link from "next/link"
import { TrendingUpIcon } from "lucide-react"

interface RecentTransactionsProps {
  transactions: Transaction[] | null
}

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

export default function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white flex items-center">
          <TrendingUpIcon className="h-5 w-5 mr-2 text-blue-400" />
          Recent Transactions
        </h3>
        <Link href="/dashboard/transactions">
          <span className="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors">
            View All
          </span>
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-800">
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
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {transactions && transactions.length > 0 ? (
              transactions.slice(0, 5).map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-800 transition-colors">
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                      transaction.amount > 0 ? "text-green-400" : "text-red-400"
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
                    <span className={getStatusBadge(transaction.status)}>{transaction.status}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {new Date(transaction.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-400">
                  No recent transactions.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
