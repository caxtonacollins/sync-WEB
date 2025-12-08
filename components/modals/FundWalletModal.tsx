import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { flutterwaveApi } from '@/api/routes/flutterwave';
import { FiatAccount } from '@/api/routes/fiat-accounts';
import { useAuth } from '@/contexts/AuthContext';
import { launchFlutterwave } from '@/lib/flutterwave';
import { useWalletData } from '@/hooks/useWalletData';
import { WalletBalance } from '@/types';

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
  const [accounts, setAccounts] = useState<WalletBalance[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);
  const { toast } = useToast();
  const { token, user } = useAuth();
  const { data: walletData, isLoading: isLoadingWallet } = useWalletData();

  // Get the first fiat balance for display
  const primaryFiatBalance = walletData?.fiatBalances?.[0];
  const displayBalance = primaryFiatBalance?.available || 0;
  const displayCurrency = primaryFiatBalance?.currency || 'NGN';

  useEffect(() => {
    if (walletData?.fiatBalances?.length) {
      setAccounts(walletData.fiatBalances);
      setSelectedAccountId(walletData.fiatBalances[0].accountId || '');
    }
  }, [walletData]);

  const selectedAccount = accounts.find(acc => acc.accountId === selectedAccountId);
  const currency = selectedAccount?.currency || 'NGN'; // Default to NGN if no account selected

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAccountId) {
      toast({
        title: 'No account selected',
        description: 'Please select an account to fund',
        variant: 'destructive',
      });
      return;
    }

    const amountNumber = parseFloat(amount);
    const minAmount = 100; // Minimum amount could be dynamic based on currency if needed
    if (isNaN(amountNumber) || amountNumber < minAmount) {
      toast({
        title: 'Invalid amount',
        description: `Please enter a valid amount (minimum ${minAmount} ${currency})`,
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
        currency: currency,
      }, token);

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to initialize payment');
      }

      const { publicKey, txRef, amount: paymentAmount, customer, customizations } = response.data;

      // Initialize Flutterwave payment using the launchFlutterwave function
      await launchFlutterwave({
        tx_ref: txRef,
        amount: paymentAmount,
        currency,
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
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Fund Your Wallet</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isLoadingWallet ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading wallet data...</span>
            </div>
          ) : walletData?.fiatBalances?.length ? (
            <div className="bg-muted/50 p-4 rounded-lg mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Available Balance:</span>
                <span className="font-bold">
                  {displayBalance.toLocaleString(undefined, {
                    style: 'currency',
                    currency: displayCurrency,
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </span>
              </div>
              {walletData.fiatBalances.length > 1 && (
                <p className="text-xs text-muted-foreground mt-1">
                  {walletData.fiatBalances.length - 1} more account{walletData.fiatBalances.length > 2 ? 's' : ''} available
                </p>
              )}
            </div>
          ) : null}

          {isLoadingAccounts ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : accounts.length > 0 ? (
            <>
              <div>
                <Label htmlFor="account">Select Account</Label>
                <Select
                  value={selectedAccountId}
                  onValueChange={setSelectedAccountId}
                  disabled={isLoadingAccounts}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts
                      .filter(account => account.accountId && account.accountId.trim() !== '')
                      .map((account) => (
                        <SelectItem 
                          key={`${account.accountId}-${account.currency}`} 
                          value={account.accountId}
                        >
                          {account.currency} - {account.available}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="amount">Amount ({currency})</Label>
                <Input
                  id="amount"
                  type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={`Enter amount in ${currency}`}
                    min="100"
                    step="0.01"
                    required
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-1">
                    <span>Minimum amount: 100 {currency}</span>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading || !selectedAccountId}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    </>
                  ) : (
                    `Proceed to Payment (${currency})`
                  )}
                </Button>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground">No accounts found. Please create an account first.</p>
                <Button variant="outline" className="mt-4" onClick={onClose}>
                  Close
                </Button>
              </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
