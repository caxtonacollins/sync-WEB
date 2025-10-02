"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/contexts/ToastContext"
import Layout from "@/components/Layout"
import ProtectedRoute from "@/components/ProtectedRoute"
import { BanknotesIcon, PlusIcon } from "@heroicons/react/24/outline"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { addFiatAccount, getFiatAccounts } from "@/api/routes/account"

interface FiatAccount {
  id: string
  currency: string
  balance: number
  accountNumber: string
  accountName: string
  bankName: string | null
}

export default function FiatAccountsPage() {
  const { token } = useAuth()
  const { addToast } = useToast()
  const [fiatAccounts, setFiatAccounts] = useState<FiatAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newAccount, setNewAccount] = useState({
    bankName: "",
    accountName: "",
    accountNumber: "",
    currency: "NGN", // Default currency
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (token) {
      fetchFiatAccounts()
    }
  }, [token])

  const fetchFiatAccounts = async () => {
    if (!token) return;

    const userId = localStorage.getItem("userId");
    if (!userId) {
      addToast("User ID not found. Please log in again.", "error");
      return;
    }
    
    try {
      setLoading(true);
      const data = await getFiatAccounts(token, userId);
      setFiatAccounts(data);
    } catch (error) {
      addToast("Failed to fetch fiat accounts", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewAccount((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setIsSubmitting(true);
    try {
      await addFiatAccount(newAccount, token);
      addToast("Account added successfully!", "success");
      fetchFiatAccounts(); // Refresh the list
      setIsModalOpen(false); // Close modal
      setNewAccount({ bankName: "", accountName: "", accountNumber: "", currency: "NGN" }); // Reset form
    } catch (error) {
      addToast("Failed to add account. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-white flex items-center">
                <BanknotesIcon className="h-8 w-8 mr-3 text-yellow-400" />
                Fiat Accounts
              </h1>
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add New Account
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add New Fiat Account</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="bankName" className="text-right">
                          Bank Name
                        </Label>
                        <Input id="bankName" name="bankName" value={newAccount.bankName} onChange={handleInputChange} className="col-span-3" required />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="accountName" className="text-right">
                          Account Name
                        </Label>
                        <Input id="accountName" name="accountName" value={newAccount.accountName} onChange={handleInputChange} className="col-span-3" required />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="accountNumber" className="text-right">
                          Account Number
                        </Label>
                        <Input id="accountNumber" name="accountNumber" value={newAccount.accountNumber} onChange={handleInputChange} className="col-span-3" required />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="currency" className="text-right">
                          Currency
                        </Label>
                        <Input id="currency" name="currency" value={newAccount.currency} onChange={handleInputChange} className="col-span-3" required />
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="button" variant="secondary">
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Adding..." : "Add Account"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="loading-spinner h-12 w-12"></div>
              </div>
            ) : (
              <div className="card">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Bank</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Account Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Account Number</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Currency</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {fiatAccounts.map((account) => (
                        <tr key={account.id} className="hover:bg-gray-800 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{account.bankName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{account.accountName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-300">{account.accountNumber}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-yellow-400">{account.currency}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-400">
                            {new Intl.NumberFormat("en-NG", { style: "currency", currency: account.currency }).format(account.balance)}
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
  )
}
