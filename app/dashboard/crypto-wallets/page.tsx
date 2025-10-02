"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/contexts/ToastContext"
import ProtectedRoute from "@/components/ProtectedRoute"
import { getCryptoWalletsByUserId } from "@/api/routes/crypto-wallets"
import { CryptoWallet } from "@/types/types"
import { BitcoinIcon } from "lucide-react"

export default function CryptoWalletsPage() {
  const { user, token } = useAuth()
  const { addToast } = useToast()
  const [cryptoWallets, setCryptoWallets] = useState<CryptoWallet[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user && token) {
      fetchCryptoWallets()
    }
  }, [user, token])

  const fetchCryptoWallets = async () => {
    if (!token || !user) return
    try {
      setLoading(true)
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      const mockData: CryptoWallet[] = [
        {
          id: '1',
          address: '0x123...abc',
          network: 'ethereum',
          currency: 'ETH',
          balance: 2.5,
        },
        {
          id: '2',
          address: 'bc1q...xyz',
          network: 'bitcoin',
          currency: 'BTC',
          balance: 0.5,
        },
      ];
      setCryptoWallets(mockData);
    } catch (error) {
      addToast("Failed to fetch crypto wallets", "error")
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
            <BitcoinIcon className="h-8 w-8 mr-3 text-purple-400" />
            Crypto Wallets
          </h1>
          <p className="mt-2 text-gray-400">Your connected cryptocurrency wallets.</p>
        </div>

        <div className="card">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Network
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Currency
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Balance
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {cryptoWallets.map((wallet) => (
                  <tr key={wallet.id} className="hover:bg-gray-800 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-mono">
                      {wallet.address}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 capitalize">
                      {wallet.network}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-white">
                      {wallet.currency}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-400">
                      {wallet.balance} {wallet.currency}
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
