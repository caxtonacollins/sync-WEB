import { CryptoWallet } from './crypto';

export interface WalletSummary {
  cryptoValueUSD: number;
  syncTokenBalance: number;
  stakedSyncTokens: number;
  totalPortfolioValueNGN: number;
  transactionFeeDiscount: number;
  activeLiquidityPools: number;
  dailySettlementCount: number;
}

export interface WalletStats {
  totalCryptoWallets: number;
  totalCryptoBalance: number;
  activeWallets: number;
  suspendedWallets: number;
  totalTransactions: number;
  totalVolume: number;
}

export interface WalletOverview {
  cryptoWallets: CryptoWallet[];
  summary: WalletSummary;
  stats: WalletStats;
}

export interface WalletBalance {
  tokenSymbol: string;
  available: number;
  accountId?: string;
  accountNumber?: string;
  bankName?: string;
  walletId?: string;
  provider?: string;
  network?: string;
  priceChange24h?: number;
  address?: string;
  isDefault: boolean;
}

export interface UnifiedWalletCardProps {
  cryptoBalances: WalletBalance[];
  totalValueUSD?: number;
  totalValueNGN?: number;
}

export interface WalletTransactionRequest {
  walletId: string;
  walletType: 'fiat' | 'crypto';
  page?: number;
  limit?: number;
  type?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
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

