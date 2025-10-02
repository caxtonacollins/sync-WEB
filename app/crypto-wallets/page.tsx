"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { BitcoinIcon } from "lucide-react";
import { PlusIcon } from "@heroicons/react/24/outline";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { addCryptoWallet, getCryptoWallets } from "@/api/routes/account";

export interface CryptoWallet {
  id: string;
  userId: string;
  network: string;
  address: string;
  currency: string;
  balance: number;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}
export default function CryptoWalletsPage() {
  const { token } = useAuth();
  const { addToast } = useToast();
  const [cryptoWallets, setCryptoWallets] = useState<CryptoWallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const currencyOptions = ["BTC", "ETH", "USDC", "STRK"];
  const networkOptions = ["bitcoin", "ethereum", "starknet"];
  const [newWallet, setNewWallet] = useState({
    currency: currencyOptions[0],
    network: networkOptions[0],
    address: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user");
      if (user) {
        setUserId(JSON.parse(user).id);
      }
    }
  }, []);

  useEffect(() => {
    if (token && userId) {
      fetchCryptoWallets();
    }
  }, [token, userId]);

  const fetchCryptoWallets = async () => {
    if (!token || !userId) return;
    try {
      setLoading(true);
      const data = await getCryptoWallets(userId, token);
      setCryptoWallets(data);
    } catch (error) {
      addToast("Failed to fetch crypto wallets", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewWallet((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewWallet((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setIsSubmitting(true);
    try {
      await addCryptoWallet(newWallet, token);
      addToast("Wallet added successfully!", "success");
      fetchCryptoWallets();
      setIsModalOpen(false);
      setNewWallet({ currency: "BTC", network: "Bitcoin", address: "" });
    } catch (error) {
      addToast("Failed to add wallet. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
              <h1 className="text-3xl font-bold text-white flex items-center">
                <BitcoinIcon className="h-8 w-8 mr-3 text-purple-400" />
                Crypto Wallets
              </h1>
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add New Wallet
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add New Crypto Wallet</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="currency" className="text-right">
                          Currency
                        </Label>
                        <select
                          id="currency"
                          name="currency"
                          value={newWallet.currency}
                          onChange={handleSelectChange}
                          className="col-span-3 bg-gray-900 text-white rounded px-2 py-1"
                          required
                        >
                          {currencyOptions.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="network" className="text-right">
                          Network
                        </Label>
                        <select
                          id="network"
                          name="network"
                          value={newWallet.network}
                          onChange={handleSelectChange}
                          className="col-span-3 bg-gray-900 text-white rounded px-2 py-1"
                          required
                        >
                          {networkOptions.map((n) => (
                            <option key={n} value={n}>
                              {n.charAt(0).toUpperCase() + n.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="address" className="text-right">
                          Address
                        </Label>
                        <Input
                          id="address"
                          name="address"
                          value={newWallet.address}
                          onChange={handleInputChange}
                          className="col-span-3"
                          required
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="button" variant="secondary">
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Adding..." : "Add Wallet"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-pulse w-full">
                  <div className="h-8 bg-gray-800 rounded mb-2"></div>
                  <div className="h-8 bg-gray-800 rounded mb-2"></div>
                  <div className="h-8 bg-gray-800 rounded"></div>
                </div>
              </div>
            ) : cryptoWallets.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <span>No crypto wallets found.</span>
                <Button onClick={() => setIsModalOpen(true)} className="mt-4">
                  Add Wallet
                </Button>
              </div>
            ) : (
              <div className="card">
                <div className="overflow-x-auto">
                  <table className="min-w-full" aria-label="Crypto Wallets">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Network
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Currency
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Balance
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Address
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Default
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Created
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {cryptoWallets.map((wallet) => (
                        <tr
                          key={wallet.id}
                          className="hover:bg-gray-800 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {wallet.network}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-purple-400">
                            {wallet.currency}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-400">
                            {wallet.balance ?? "-"}
                          </td>
                          <td className="px-6 py-4 text-sm font-mono text-gray-400 max-w-xs truncate flex items-center gap-2">
                            <span title={wallet.address}>{wallet.address}</span>
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              aria-label="Copy address"
                              onClick={() => {
                                navigator.clipboard.writeText(wallet.address);
                                addToast("Address copied!", "success");
                              }}
                            >
                              Copy
                            </Button>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {wallet.isActive ? (
                              <span className="px-2 py-1 rounded bg-green-900 text-green-400">
                                Active
                              </span>
                            ) : (
                              <span className="px-2 py-1 rounded bg-gray-700 text-gray-400">
                                Inactive
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {wallet.isDefault ? (
                              <span className="px-2 py-1 rounded bg-purple-900 text-purple-400">
                                Default
                              </span>
                            ) : (
                              <span className="px-2 py-1 rounded bg-gray-700 text-gray-400">
                                -
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {new Date(wallet.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-sm flex gap-2">
                            {/* Future: Edit/Delete actions */}
                            <Button
                              type="button"
                              size="sm"
                              variant="destructive"
                              disabled
                            >
                              Delete
                            </Button>
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
