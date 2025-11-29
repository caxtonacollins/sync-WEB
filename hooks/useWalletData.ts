import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { getAllUserTransactions } from "@/api/routes/transaction";
import { getWalletSummary } from "@/api/routes/wallet";
import WalletAPI from "@/api/routes/fiat-accounts";

interface WalletBalance {
  currency: string;
  balance: number;
  accountId?: string;
  accountNumber?: string;
  bankName?: string;
  walletId?: string;
  provider?: string;
  network?: string;
  address?: string;
  isDefault: boolean;
}

export interface UnifiedWalletData {
  userId: string;
  fiatBalances: WalletBalance[];
  cryptoBalances: WalletBalance[];
  totalValueUSD: number;
  totalValueNGN: number;
}

export interface WalletTransaction {
  id: string;
  type: "fiat" | "crypto";
  currency: string;
  amount: number;
  status: string;
  reference: string;
  createdAt: string;
  metadata?: {
    provider?: string;
    description?: string;
    paymentMethod?: string;
    txHash?: string;
    network?: string;
    [key: string]: any;
  };
}

export const useWalletSummary = () => {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: ['walletSummary'],
    queryFn: async () => {
      if (!token) throw new Error('No authentication token found');
      return await getWalletSummary(token);
    },
    staleTime: 5 * 60000,
    refetchInterval: 30 * 1000,
  });
};

export const useWalletData = () => {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: ['walletData'],
    queryFn: async () => {
      if (!token) throw new Error('No authentication token found');
      const data = await WalletAPI.getBalance(token);
      
      if (!data || !data.fiatBalances || !data.cryptoBalances) {
        throw new Error("Invalid wallet data received");
      }
      
      // Transform the data to match UnifiedWalletData
      const transformedData: UnifiedWalletData = {
        ...data,
        fiatBalances: data.fiatBalances.map(balance => ({
          ...balance,
          balance: parseFloat(balance.balance) || 0,
          accountNumber: balance.accountId, // Map accountId to accountNumber if needed
          walletId: balance.accountId // Map accountId to walletId if needed
        })),
        cryptoBalances: data.cryptoBalances?.map(balance => ({
          ...balance,
          balance: parseFloat(balance.balance) || 0,
          accountId: balance.walletId, // Map walletId to accountId if needed
          accountNumber: balance.address // Map address to accountNumber if needed
        })) || [],
        totalValueUSD: parseFloat(data.totalValueUSD as any) || 0,
        totalValueNGN: parseFloat((data as any).totalValueNGN || '0') || 0
      };
      
      return transformedData;
    },
    staleTime: 5 * 60000,
    refetchInterval: 15 * 1000,
  });
};

export const useWalletTransactions = (userId?: string) => {
  const { user, token } = useAuth();
  const { addToast } = useToast();
  
  return useQuery<WalletTransaction[]>({
    queryKey: ['walletTransactions', userId || user?.id],
    queryFn: async () => {
      try {
        if (!token) {
          throw new Error('No authentication token found');
        }
        
        const response = await getAllUserTransactions(token, {
          userId: userId || user?.id || '',
          limit: 50,
        });
        
        return response.data.map(tx => ({
          id: tx.id,
          type: tx.type as 'fiat' | 'crypto',
          currency: tx.currency,
          amount: tx.amount,
          status: tx.status,
          reference: tx.reference,
          createdAt: tx.createdAt,
          metadata: tx.metadata,
        }));
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
        addToast('Failed to load transactions', 'error');
        throw error;
      }
    },
    enabled: !!user?.id,
    staleTime: 2 * 60000,
    refetchOnWindowFocus: false,
  });
};
