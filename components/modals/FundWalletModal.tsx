import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { flutterwaveApi } from '@/api/routes/flutterwave';
import { useAuth } from '@/contexts/AuthContext';
import { launchFlutterwave } from '@/lib/flutterwave';

declare global {
  interface Window {
    FlutterwaveCheckout: any;
  }
}

interface FundWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function FundWalletModal({ isOpen, onClose, onSuccess }: FundWalletModalProps) {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { token } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const amountNumber = parseFloat(amount);
    if (isNaN(amountNumber) || amountNumber < 100) {
      toast({
        title: 'Invalid amount',
        description: 'Please enter a valid amount (minimum 100 NGN)',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      if (!token) {
        throw new Error('User is not authenticated');
      }
      // Initialize payment with the backend
      const response = await flutterwaveApi.initializePayment({
        amount: amountNumber,
        currency: 'NGN',
      }, token);

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to initialize payment');
      }

      const { publicKey, txRef, amount: paymentAmount, customer, customizations } = response.data;

      // Initialize Flutterwave payment using the launchFlutterwave function
      await launchFlutterwave({
        tx_ref: txRef,
        amount: paymentAmount,
        currency: 'NGN',
        payment_options: 'card,banktransfer,ussd',
        redirect_url: '', // You can specify a redirect URL if needed
        customer: {
          email: customer.email,
          phone_number: customer.phone,
          name: customer.name,
        },
        customizations: {
          title: customizations.title,
          description: customizations.description,
          logo: customizations.logo,
        },
        callback: async (response: any) => {
          if (response.status === 'successful') {
            try {
              // Verify the payment with your backend
              const verification = await flutterwaveApi.verifyPayment(response.transaction_id, token);
              if (verification.success) {
                toast({
                  title: 'Payment successful',
                  description: 'Your wallet has been funded successfully',
                });
                onSuccess?.();
              } else {
                throw new Error(verification.message || 'Payment verification failed');
              }
            } catch (error) {
              console.error('Payment verification error:', error);
              toast({
                title: 'Payment verification failed',
                description: error instanceof Error ? error.message : 'An error occurred while verifying your payment',
                variant: 'destructive',
              });
            }
          } else {
            toast({
              title: 'Payment cancelled',
              description: 'Your payment was not completed',
              variant: 'destructive',
            });
          }
          onClose();
        },
        onclose: () => {
          // Handle when the user closes the modal without completing the payment
          onClose();
        },
      });
    } catch (error) {
      console.error('Payment initialization error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to initialize payment',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Fund Your Wallet</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (NGN)</Label>
            <Input
              id="amount"
              type="number"
              min="100"
              step="1"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <p className="text-sm text-muted-foreground">Minimum amount: ₦100</p>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Proceed to Payment
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
