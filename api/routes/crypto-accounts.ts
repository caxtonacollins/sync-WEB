import { api } from "@/lib/api-client";

export interface FiatAccount {
  id: string;
  name: string;
  accountNumber: string;
  balance: string;
  tokenSymbol: string;
  initials: string;
  isDefault: boolean;
}

interface UnifiedWalletBalance {
  userId: string;
  cryptoBalances: {
    tokenSymbol?: string;
    balance: string;
    walletId: string;
    network: string;
    address: string;
    isDefault: boolean;
  }[];
  totalValueUSD: string;
  totalValueNGN: string;
}

class WalletAPI {
  /**
   * Get fiat accounts for the authenticated user
   */
  static async getFiatAccounts(token: string): Promise<FiatAccount[]> {
    const response = await api.get(`/wallet/fiat-accounts`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }

  static async getBalance(token: string): Promise<UnifiedWalletBalance> {
    const response = await api.get(`/wallet/balance`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }
}

export default WalletAPI;
