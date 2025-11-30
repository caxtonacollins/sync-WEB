import { useFlutterwave } from 'flutterwave-react-v3';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';

interface FlutterwavePaymentButtonProps {
  amount: number;
  currency?: string;
  onSuccess: (response: any) => void;
  onClose: () => void;
  buttonText?: string;
  className?: string;
}

export default function FlutterwavePaymentButton({
  amount,
  currency = 'NGN',
  onSuccess,
  onClose,
  buttonText = 'Pay Now',
  className = '',
}: FlutterwavePaymentButtonProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const config = {
    public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY || '',
    tx_ref: Date.now().toString(),
    amount,
    currency,
    payment_options: 'card,ussd,account,banktransfer',
    customer: {
      email: user?.email || '',
      phone_number: user?.phoneNumber || '',
      name: user?.firstName + ' ' + user?.lastName || '',
    },
    customizations: {
      title: 'Sync Payment',
      description: 'Fund your Sync wallet',
      logo: '/logo.png',
    },
  };

  const handlePayment = useFlutterwave(config);

  const handlePaymentCallback = async (response: any) => {
    setIsLoading(true);
    try {
      // Verify the transaction with your backend
      const res = await fetch('/api/transactions/verify-flutterwave', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transaction_id: response.transaction_id,
          tx_ref: response.tx_ref,
        }),
      });

      const data = await res.json();

      if (data.success) {
        onSuccess(data);
      } else {
        throw new Error(data.message || 'Payment verification failed');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      toast({
        title: 'Payment verification failed',
        description: 'Please contact support.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={() => handlePayment({
        ...config,
        callback: (response) => handlePaymentCallback(response),
        onClose: () => onClose(),
      })}
      disabled={isLoading}
      className={`${className} ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
    >
      {isLoading ? 'Processing...' : buttonText}
    </button>
  );
}