import { FiatAccount } from './fiat';
import { CryptoWallet } from './crypto';

export interface WalletSummary {
  fiatBalanceNGN: number;
  cryptoValueUSD: number;
  syncTokenBalance: number;
  stakedSyncTokens: number;
  totalPortfolioValueNGN: number;
  transactionFeeDiscount: number;
  activeLiquidityPools: number;
  dailySettlementCount: number;
}

export interface WalletStats {
  totalFiatWallets: number;
  totalCryptoWallets: number;
  totalFiatBalance: number;
  totalCryptoBalance: number;
  activeWallets: number;
  suspendedWallets: number;
  totalTransactions: number;
  totalVolume: number;
}

export interface WalletOverview {
  fiatAccounts: FiatAccount[];
  cryptoWallets: CryptoWallet[];
  summary: WalletSummary;
  stats: WalletStats;
}

export interface WalletBalance {
  currency: string;
  available: number;
  isDefault: boolean;
  accountId: string;
  lockedBalance?: number;
  valueInFiat?: number;
  fiatCurrency?: string;
  priceChange24h?: number;
  icon?: string;
  network?: string;
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
