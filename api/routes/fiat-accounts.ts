import axios from "axios";

const API_URL = process.env.BACKEND_URL;

export interface FiatAccount {
  id: string;
  name: string;
  accountNumber: string;
  balance: number;
  currency: string;
  initials: string;
  isDefault: boolean;
}

interface UnifiedWalletBalance {
  userId: string;
  fiatBalances: {
    currency: string;
    balance: number;
    accountId: string;
    provider: string;
    isDefault: boolean;
  }[];
  cryptoBalances: {
    currency: string;
    balance: number;
    walletId: string;
    network: string;
    address: string;
    isDefault: boolean;
  }[];
  totalValueUSD: number;
  totalValueNGN: number;
}

class WalletAPI {
  /**
   * Get fiat accounts for the authenticated user
   */
  static async getFiatAccounts(token: string): Promise<FiatAccount[]> {
    const response = await axios.get(`${API_URL}/wallet/fiat-accounts`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }

  static async getBalance(): Promise<UnifiedWalletBalance> {
    const response = await axios.get(`${API_URL}/wallet/balance`);
    return response.data;
  }
}

export default WalletAPI;
