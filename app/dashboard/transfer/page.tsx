'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function TransferPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    amount: '',
    recipient: '',
    description: '',
    currency: 'USD',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
      // TODO: Implement actual transfer logic
      console.log('Transfer submitted:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addToast('Transfer initiated successfully!', 'success');
      router.push('/dashboard');
    } catch (error) {
      console.error('Transfer failed:', error);
      addToast('Transfer failed. Please try again.', 'error');
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
        <h1 className="text-2xl font-bold text-white">Transfer Funds</h1>
      </div>
      
      <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">
                Amount
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
                  className="bg-gray-700 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 block w-full pl-7 pr-12 sm:text-sm border-gray-600 rounded-md"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center">
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="focus:ring-purple-500 focus:border-purple-500 h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-400 sm:text-sm rounded-r-md"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="recipient" className="block text-sm font-medium text-gray-300 mb-1">
                Recipient
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="recipient"
                  id="recipient"
                  value={formData.recipient}
                  onChange={handleChange}
                  className="bg-gray-700 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-600 rounded-md p-2"
                  placeholder="Email, phone, or account number"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                Description (Optional)
              </label>
              <div className="mt-1">
                <textarea
                  name="description"
                  id="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  className="bg-gray-700 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-600 rounded-md p-2"
                  placeholder="Add a note about this transfer"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Processing...' : 'Transfer Money'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
