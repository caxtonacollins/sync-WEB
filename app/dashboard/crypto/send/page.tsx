'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { ArrowLeftIcon, ArrowUpRightIcon } from '@heroicons/react/24/outline';

export default function CryptoSendPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    amount: '',
    recipientAddress: '',
    network: 'ethereum',
    memo: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState({
    fee: '0.0005',
    total: '0.1005',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.recipientAddress) return;
    
    // Calculate transaction details (simplified)
    const amount = parseFloat(formData.amount) || 0;
    const fee = 0.0005; // Example fee
    setTransactionDetails({
      fee: fee.toFixed(6),
      total: (amount + fee).toFixed(6),
    });
    
    setShowConfirmation(true);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // TODO: Implement actual send crypto logic
      console.log('Sending crypto:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      addToast('Transaction submitted successfully!', 'success');
      router.push('/dashboard');
    } catch (error) {
      console.error('Transaction failed:', error);
      addToast('Transaction failed. Please try again.', 'error');
      setShowConfirmation(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showConfirmation) {
    return (
      <div className="max-w-md mx-auto">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => setShowConfirmation(false)}
            className="mr-4 p-1 hover:bg-gray-700 rounded-full"
            aria-label="Go back"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-bold text-white">Confirm Transaction</h1>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg mb-6">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-400">Sending</span>
              <span className="font-mono">{formData.amount} ETH</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">To</span>
              <span className="font-mono text-sm">
                {formData.recipientAddress.substring(0, 10)}...{formData.recipientAddress.substring(formData.recipientAddress.length - 8)}
              </span>
            </div>
            <div className="border-t border-gray-700 my-3"></div>
            <div className="flex justify-between">
              <span className="text-gray-400">Network Fee</span>
              <span className="font-mono">{transactionDetails.fee} ETH</span>
            </div>
            <div className="flex justify-between text-lg font-semibold pt-2">
              <span>Total</span>
              <span className="font-mono">{transactionDetails.total} ETH</span>
            </div>
          </div>
          
          <div className="mt-8 space-y-4">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Processing...' : 'Confirm & Send'}
            </button>
            <button
              onClick={() => setShowConfirmation(false)}
              disabled={isSubmitting}
              className="w-full flex justify-center py-2 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-transparent hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => router.back()} 
          className="mr-4 p-1 hover:bg-gray-700 rounded-full"
          aria-label="Go back"
        >
          <ArrowLeftIcon className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-bold text-white">Send Crypto</h1>
      </div>
      
      <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
        <form onSubmit={handleReview}>
          <div className="space-y-6">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">
                Amount
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="number"
                  name="amount"
                  id="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="bg-gray-700 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 block w-full pl-3 pr-12 sm:text-sm border-gray-600 rounded-md p-2"
                  placeholder="0.00"
                  step="0.000001"
                  min="0.000001"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-400 sm:text-sm">ETH</span>
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-400">
                Available: 1.25 ETH
              </p>
            </div>

            <div>
              <label htmlFor="recipientAddress" className="block text-sm font-medium text-gray-300 mb-1">
                Recipient Address
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="recipientAddress"
                  id="recipientAddress"
                  value={formData.recipientAddress}
                  onChange={handleChange}
                  className="bg-gray-700 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-600 rounded-md p-2 font-mono"
                  placeholder="0x..."
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="network" className="block text-sm font-medium text-gray-300 mb-1">
                Network
              </label>
              <select
                id="network"
                name="network"
                value={formData.network}
                onChange={handleChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-gray-700 border-gray-600 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
              >
                <option value="ethereum">Ethereum (ERC-20)</option>
                <option value="bitcoin" disabled>Bitcoin (Coming Soon)</option>
                <option value="solana" disabled>Solana (Coming Soon)</option>
              </select>
            </div>

            <div>
              <label htmlFor="memo" className="block text-sm font-medium text-gray-300 mb-1">
                Memo (Optional)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="memo"
                  id="memo"
                  value={formData.memo}
                  onChange={handleChange}
                  className="bg-gray-700 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-600 rounded-md p-2"
                  placeholder="Enter a memo (optional)"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={!formData.amount || !formData.recipientAddress || isSubmitting}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowUpRightIcon className="h-5 w-5 mr-2" />
                Review Send
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
