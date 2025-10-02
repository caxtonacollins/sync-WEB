"use client"

import { useState, useEffect } from "react"
import Layout from "@/components/Layout"
import ProtectedRoute from "@/components/ProtectedRoute"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/contexts/ToastContext"
import { ArrowRightLeftIcon } from "lucide-react"
import { getWallets } from "@/api/routes/account"

interface Wallet {
  id: string
  currency: string
  balance: number
  type: 'fiat' | 'crypto'
}

export default function NewSwapPage() {
  const { token } = useAuth()
  const { addToast } = useToast()
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [fromWallet, setFromWallet] = useState<string>("")
  const [toWallet, setToWallet] = useState<string>("")
  const [fromAmount, setFromAmount] = useState<string>("")
  const [toAmount, setToAmount] = useState<string>("")
  const [rate, setRate] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      fetchWallets()
    }
  }, [token])

  useEffect(() => {
    // Mock rate calculation
    if (fromWallet && toWallet) {
      // In a real app, fetch this from an API
      const mockRate = Math.random() * 100
      setRate(mockRate)
    }
  }, [fromWallet, toWallet])

  useEffect(() => {
    if (fromAmount && rate) {
      setToAmount((parseFloat(fromAmount) * rate).toFixed(2))
    } else {
      setToAmount("")
    }
  }, [fromAmount, rate])

  const fetchWallets = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const userId = localStorage.getItem("userId") || ""
      if (!userId) {
        throw new Error("User not logged in");
      };
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      const mockData: Wallet[] = [
        {
          id: 'fiat-1',
          currency: 'NGN',
          balance: 50000,
          type: 'fiat',
        },
        {
          id: 'crypto-1',
          currency: 'BTC',
          balance: 0.5,
          type: 'crypto',
        },
        {
          id: 'crypto-2',
          currency: 'ETH',
          balance: 2.5,
          type: 'crypto',
        },
      ];
      setWallets(mockData);
    } catch (error) {
      addToast("Failed to load your wallets.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Logic to execute the swap
    addToast("Swap functionality not yet implemented.", "info")
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="py-8">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white flex items-center">
                <ArrowRightLeftIcon className="h-8 w-8 mr-3 text-cyan-400" />
                New Currency Swap
              </h1>
            </div>

            <div className="card p-8">
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {/* From Wallet */}
                  <div>
                    <Label htmlFor="fromWallet">From</Label>
                    <Select onValueChange={setFromWallet} value={fromWallet}>
                      <SelectTrigger id="fromWallet">
                        <SelectValue placeholder="Select a wallet to swap from" />
                      </SelectTrigger>
                      <SelectContent>
                        {wallets.map((wallet) => (
                          <SelectItem key={wallet.id} value={wallet.id}>
                            {wallet.currency} - {wallet.balance.toFixed(2)} ({wallet.type})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* To Wallet */}
                  <div>
                    <Label htmlFor="toWallet">To</Label>
                    <Select onValueChange={setToWallet} value={toWallet}>
                      <SelectTrigger id="toWallet">
                        <SelectValue placeholder="Select a wallet to swap to" />
                      </SelectTrigger>
                      <SelectContent>
                        {wallets
                          .filter((w) => w.id !== fromWallet) // Can't swap to the same wallet
                          .map((wallet) => (
                            <SelectItem key={wallet.id} value={wallet.id}>
                              {wallet.currency} ({wallet.type})
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Amount */}
                  <div>
                    <Label htmlFor="fromAmount">Amount to Swap</Label>
                    <Input
                      id="fromAmount"
                      type="number"
                      value={fromAmount}
                      onChange={(e) => setFromAmount(e.target.value)}
                      placeholder="0.00"
                    />
                  </div>

                  {/* Rate & Estimated Amount */}
                  {rate && fromAmount && (
                    <div className="bg-gray-800 p-4 rounded-lg text-sm">
                      <p className="text-gray-400">
                        Exchange Rate: <span className="font-semibold text-white">1 {wallets.find(w => w.id === fromWallet)?.currency} ≈ {rate.toFixed(4)} {wallets.find(w => w.id === toWallet)?.currency}</span>
                      </p>
                      <p className="text-gray-400 mt-2">
                        You will receive approximately: <span className="font-semibold text-green-400 text-lg">{toAmount} {wallets.find(w => w.id === toWallet)?.currency}</span>
                      </p>
                    </div>
                  )}

                </div>

                <div className="mt-8">
                  <Button type="submit" className="w-full" disabled={isSubmitting || !fromWallet || !toWallet || !fromAmount}>
                    {isSubmitting ? "Swapping..." : "Swap Now"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  )
}
