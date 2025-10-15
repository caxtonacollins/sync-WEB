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
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
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
      
      return data as UnifiedWalletData;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 15 * 1000, // Refetch every 15 seconds
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
        
        // Use the actual API call to fetch transactions
        const response = await getAllUserTransactions(token, {
          userId: userId || user?.id || '',
          limit: 50, // Adjust based on your needs
        });
        
        // Transform the API response to match our WalletTransaction interface
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
        throw error; // Let React Query handle the error
      }
    },
    enabled: !!user?.id, // Only run the query if we have a user ID
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  });
};
