"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/contexts/ToastContext"
import ProtectedRoute from "@/components/ProtectedRoute"
import { CreditCardIcon } from "@heroicons/react/24/outline"
import { Transaction } from "@/data/types"
import { getTransactionsByWalletId } from "@/data/transactions";
import { getAllAccountsByUserId } from "@/data/accounts";
import { FiatAccount, CryptoWallet } from '@/data/types';

const getStatusBadge = (status: string) => {
  switch (status?.toLowerCase()) {
    case "completed":
      return "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
    case "pending":
      return "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800"
    case "failed":
      return "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800"
    default:
      return "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800"
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function TransactionsPage() {
  const { user } = useAuth()
  const { addToast } = useToast()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTransactions()
  }, [user])

  const fetchTransactions = () => {
    try {
      setLoading(true);
      if (!user) return;

      const userAccounts = getAllAccountsByUserId(user.id);
      
      const allTransactions = userAccounts.flatMap((account: FiatAccount | CryptoWallet) => 
        getTransactionsByWalletId(account.id) || []
      );
      
      const sortedTransactions = [...allTransactions].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      setTransactions(sortedTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      addToast("Failed to fetch transactions", "error");
    } finally {
      setLoading(false);
    }
  };

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
            <CreditCardIcon className="h-8 w-8 mr-3 text-blue-400" />
            Transactions
          </h1>
          <p className="mt-2 text-gray-400">Your complete transaction history.</p>
        </div>

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
                {transactions.length > 0 ? (
                  transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-300">
                        {transaction.id.substring(0, 8)}...
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                          transaction.amount > 0 ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {transaction.amount > 0 ? '+' : ''}
                        {transaction.amount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 8
                        })} {transaction.currency}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 capitalize">
                        {transaction.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={getStatusBadge(transaction.status)}>
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {formatDate(transaction.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {transaction.currency}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                      No transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
