import { Transaction } from './transaction.types';

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
  fromCurrency: string;
  toCurrency: string;
  fromAmount?: number;
  toAmount?: number;
  rate?: number;
  provider?: string;
  metadata?: Record<string, any>;
}

export interface SwapQuote {
  fromCurrency: string;
  toCurrency: string;
  fromAmount: number;
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
  fromCurrency: string;
  toCurrency: string;
  amount: number;
  isFromAmount: boolean;
  provider?: string;
}

export interface SwapHistoryQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
  fromCurrency?: string;
  toCurrency?: string;
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
  byCurrencyPair: Record<string, number>;
  dailyVolume: Array<{
    date: string;
    count: number;
    volume: number;
  }>;
}
