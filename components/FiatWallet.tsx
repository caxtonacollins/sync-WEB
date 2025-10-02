'use client';

import React, { useEffect, useState } from 'react';
import { FiatAccount } from '@/data/types';
import { getFiatAccountsByUserId } from '@/data/accounts';
import { useAuth } from '@/contexts/AuthContext';
import { Banknote, Plus, ArrowDown, ArrowUp } from 'lucide-react';
import Link from 'next/link';

const FiatWallet = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<FiatAccount[]>([]);
  const [totalBalance, setTotalBalance] = useState(0); // Assuming a way to get this
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      try {
        const userAccounts = getFiatAccountsByUserId(user.id);
        setAccounts(userAccounts);
        // Note: Balance is not in the schema, so we're showing a placeholder value.
        // In a real app, you'd fetch this from an API.
        setTotalBalance(50000); // Placeholder balance
      } catch (error) {
        console.error('Error loading fiat accounts:', error);
      } finally {
        setLoading(false);
      }
    }
  }, [user]);

  if (loading) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg animate-pulse">
        <div className="h-8 bg-gray-700 rounded w-1/3"></div>
        <div className="mt-4 space-y-2">
          <div className="h-12 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1a1f2b] p-6 rounded-2xl text-white font-sans">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-300">Fiat Accounts</h2>

      </div>

      <div className="mb-6">
        <p className="text-gray-400 text-sm">Total Balance</p>
        <p className="text-3xl font-bold">
          {totalBalance.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' })}
        </p>
      </div>

      <div className="space-y-3">
        <h3 className="text-md font-semibold text-gray-300 mb-2">Your Accounts</h3>
        {accounts.map((account) => (
          <div key={account.id} className="flex items-center justify-between p-3 bg-[#2d3344] rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-gray-700 rounded-full mr-3">
                <Banknote size={20} className="text-gray-400" />
              </div>
              <div>
                <p className="font-semibold text-md">{account.bankName}</p>
                <p className="text-xs text-gray-400">{account.accountNumber}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-md">{account.accountName}</p>
              {account.isDefault && (
                <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">Default</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FiatWallet;

