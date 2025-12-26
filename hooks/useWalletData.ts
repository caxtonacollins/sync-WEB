import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { getAllUserTransactions } from "@/api/routes/transaction";
import { getWalletSummary } from "@/api/routes/wallet";
import WalletAPI from "@/api/routes/crypto-accounts";
import { WalletBalance } from "@/types";

export interface UnifiedWalletData {
  userId: string;
  cryptoBalances: WalletBalance[];
  totalValueUSD: number;
  totalValueNGN: number;
}

export interface WalletTransaction {
  id: string;
  type: "fiat" | "crypto";
  tokenSymbol: string;
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
      
      if (!data || !data.cryptoBalances) {
        throw new Error("Invalid wallet data received");
      }

      const transformedData: UnifiedWalletData = {
        ...data,
        cryptoBalances: data.cryptoBalances?.map(balance => ({
          ...balance,
          available: parseFloat(balance.balance) || 0,
          accountId: balance.walletId,
          accountNumber: balance.address,
          tokenSymbol: balance.tokenSymbol || 'sNGN',
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
          type: (tx.type === 'fiat' || tx.type === 'crypto' ? tx.type : 'crypto') as 'fiat' | 'crypto',
          tokenSymbol: tx.tokenSymbol || 'N/A',
          amount: tx.amount,
          status: tx.status,
          reference: tx.reference,
          createdAt: tx.createdAt,
          metadata: {
            ...tx.metadata,
            type: tx.type,
            tokenSymbol: tx.tokenSymbol,
          },
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
