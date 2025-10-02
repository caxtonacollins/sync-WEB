import { Transaction } from "@/data/types";
import { getAllAccountsByUserId } from "@/data/accounts";
import { FiatAccount, CryptoWallet } from '@/data/types';
import { getRecentTransactions } from "@/data/transactions";

interface DashboardData {
  transactions: Transaction[];
  swapOrders: any[];
  fiatAccounts: any[];
  cryptoWallets: any[];
}

export const getDashboardData = async (userId: string): Promise<DashboardData> => {
  try {
    const accounts = getAllAccountsByUserId(userId);
    
    const fiatAccounts = accounts.filter((account): account is FiatAccount => 
      'provider' in account
    );
    
    const cryptoWallets = accounts.filter((account): account is CryptoWallet => 
      'network' in account
    );
    
    const transactions = getRecentTransactions(userId, 5);
    
    const swapOrders: any[] = [];
    
    return {
      transactions,
      swapOrders,
      fiatAccounts,
      cryptoWallets
    };
  } catch (error) {
    console.error("Error in mock getDashboardData:", error);
    throw error;
  }
};
