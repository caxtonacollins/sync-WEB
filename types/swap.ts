import { Transaction } from './transaction';

export interface SwapOrder {
  id: string;
  userId: string;
  fromCurrency: string;
  toCurrency: string;
  fromAmount: number;
  toAmount: number;
  rate: number;
  fee: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  type: 'FIAT_TO_CRYPTO' | 'CRYPTO_TO_FIAT' | 'CRYPTO_TO_CRYPTO';
  provider: string;
  providerOrderId?: string;
  metadata?: Record<string, any>;
  transactions?: Transaction[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface CreateSwapOrderRequest {
  from: string;
  to: string;
  amount?: number;
  rate?: number;
  provider?: string;
  metadata?: Record<string, any>;
}

export interface SwapQuote {
  from: string;
  to: string;
  amount: number;
  toAmount: number;
  rate: number;
  fee: number;
  netAmount: number;
  provider: string;
  estimatedTime?: number; // in seconds
  minAmount?: number;
  maxAmount?: number;
}

export interface SwapQuoteRequest {
  from: string;
  to: string;
  amount: number;
  isFromAmount: boolean;
  provider?: string;
}

export interface SwapHistoryQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
  from?: string;
  to?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SwapStats {
  totalSwaps: number;
  totalVolume: number;
  totalFees: number;
  successRate: number;
  byStatus: Record<string, number>;
  bySymbolPair: Record<string, number>;
  dailyVolume: Array<{
    date: string;
    count: number;
    volume: number;
  }>;
}
