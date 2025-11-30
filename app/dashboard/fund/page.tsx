import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import Head from 'next/head';
import FlutterwavePaymentButton from '@/components/payment/FlutterwavePaymentButton';
import { toast } from '@/components/ui/use-toast';
import DashboardLayout from '../layout';
import { useWalletSummary } from '@/hooks/api/useWallet';

export default function FundWalletPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [amount, setAmount] = useState<number | string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePaymentSuccess = async (response: any) => {
    setIsProcessing(true);
    try {
      // Refresh wallet balance
      await useWalletSummary();

      toast({
        title: 'Payment successful',
        description: 'Your wallet has been funded successfully.',
        variant: 'default',
      });
      router.push('/dashboard/transactions');
    } catch (error) {
      console.error('Error updating wallet after payment:', error);
      toast({
        title: 'Error updating wallet',
        description: 'There was an error updating your wallet. Please contact support.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentClose = () => {
    // Handle modal close if needed
    console.log('Payment modal closed');
  };

  return (
    <DashboardLayout>
      <Head>
        <title>Fund Wallet | Sync</title>
      </Head>

      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Fund Your Wallet</h1>

        <div className="mb-6">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
            Amount to Fund (NGN)
          </label>
          <input
            type="number"
            id="amount"
            min="100"
            step="100"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter amount"
            disabled={isProcessing}
          />
          <p className="mt-1 text-sm text-gray-500">Minimum amount: ₦100</p>
        </div>

        <div className="mt-8">
          <FlutterwavePaymentButton
            amount={Number(amount) || 0}
            onSuccess={handlePaymentSuccess}
            onClose={handlePaymentClose}
            buttonText={isProcessing ? 'Processing...' : 'Proceed to Payment'}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Other Payment Methods</h2>
          <button
            type="button"
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-6 rounded-md transition-colors"
            onClick={() => toast({
              title: 'Coming soon!',
              description: 'Bank transfer is not available yet. Please try again later.',
              variant: 'default',
            })}
          >
            Bank Transfer
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}