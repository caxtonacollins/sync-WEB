"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/contexts/ToastContext"
import ProtectedRoute from "@/components/ProtectedRoute"
import { getFiatAccountsByUserId } from "@/api/routes/fiat-accounts"
import { FiatAccount } from "@/types/types"
import { BanknotesIcon } from "@heroicons/react/24/outline"

export default function FiatAccountsPage() {
  const { user, token } = useAuth()
  const { addToast } = useToast()
  const [fiatAccounts, setFiatAccounts] = useState<FiatAccount[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user && token) {
      fetchFiatAccounts()
    }
  }, [user, token])

  const fetchFiatAccounts = async () => {
    if (!token || !user) return
    try {
      setLoading(true)
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      const mockData: FiatAccount[] = [
        {
          id: '1',
          // userId: user.id,
          accountName: 'Savings Account',
          accountNumber: '1234567890',
          bankName: 'Zenith Bank',
          balance: 50000,
          currency: 'NGN',
          // isDefault: true,
        },
        {
          id: '2',
          // userId: user.id,
          accountName: 'Current Account',
          accountNumber: '0987654321',
          bankName: 'GTBank',
          balance: 120000,
          currency: 'NGN',
          // isDefault: false,
        },
      ];
      setFiatAccounts(mockData);
    } catch (error) {
      addToast("Failed to fetch fiat accounts", "error")
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
            <BanknotesIcon className="h-8 w-8 mr-3 text-yellow-400" />
            Fiat Accounts
          </h1>
          <p className="mt-2 text-gray-400">Your connected bank accounts.</p>
        </div>

        <div className="card">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Account Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Account Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Bank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Balance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Currency
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {fiatAccounts.map((account) => (
                  <tr key={account.id} className="hover:bg-gray-800 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-white">
                      {account.accountName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-mono">
                      {account.accountNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {account.bankName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-400">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: account.currency,
                      }).format(account.balance)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {account.currency}
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
