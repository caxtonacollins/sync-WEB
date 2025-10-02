'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function DepositPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    amount: '',
    paymentMethod: 'bank',
    accountNumber: '',
    routingNumber: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // TODO: Implement actual deposit logic
      console.log('Deposit submitted:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addToast('Deposit initiated successfully!', 'success');
      router.push('/dashboard');
    } catch (error) {
      console.error('Deposit failed:', error);
      addToast('Deposit failed. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => router.back()} 
          className="mr-4 p-1 hover:bg-gray-700 rounded-full"
          aria-label="Go back"
        >
          <ArrowLeftIcon className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-bold text-white">Deposit Funds</h1>
      </div>
      
      <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">
                Amount to Deposit
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  name="amount"
                  id="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="bg-gray-700 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 block w-full pl-7 pr-12 sm:text-sm border-gray-600 rounded-md p-2"
                  placeholder="0.00"
                  step="0.01"
                  min="1"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-300 mb-1">
                Payment Method
              </label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-gray-700 border-gray-600 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
              >
                <option value="bank">Bank Transfer</option>
                <option value="card" disabled>Credit/Debit Card (Coming Soon)</option>
                <option value="crypto" disabled>Crypto (Coming Soon)</option>
              </select>
            </div>

            {formData.paymentMethod === 'bank' && (
              <>
                <div>
                  <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-300 mb-1">
                    Account Number
                  </label>
                  <input
                    type="text"
                    name="accountNumber"
                    id="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleChange}
                    className="bg-gray-700 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-600 rounded-md p-2"
                    placeholder="Enter account number"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="routingNumber" className="block text-sm font-medium text-gray-300 mb-1">
                    Routing Number
                  </label>
                  <input
                    type="text"
                    name="routingNumber"
                    id="routingNumber"
                    value={formData.routingNumber}
                    onChange={handleChange}
                    className="bg-gray-700 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-600 rounded-md p-2"
                    placeholder="Enter routing number"
                    required
                  />
                </div>
              </>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Processing...' : 'Deposit Funds'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
