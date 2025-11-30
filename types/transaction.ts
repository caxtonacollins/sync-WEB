export interface TransactionMetadata {
  provider?: string;
  description?: string;
  paymentMethod?: string;
  txHash?: string;
  network?: string;
  blockNumber?: string;
  fromAddress?: string;
  toAddress?: string;
  gasUsed?: string;
  gasPrice?: string;
  nonce?: number;
  confirmations?: number;
  [key: string]: any; // Allow for additional metadata
}

export interface Transaction {
  id: string;
  userId: string;
  type: string;
  status: string;
  amount: number;
  currency: string;
  fee: number;
  netAmount: number;
  reference: string;
  metadata?: TransactionMetadata;
  createdAt: string;
  updatedAt: string;
  completedAt?: string | null;
  fiatAccountId?: string | null;
  cryptoWalletId?: string | null;
  swapOrderId?: string | null;
  blockNumber?: string;
  transactionHash?: string;
}

export interface TransactionQueryParams {
  page?: number;
  limit?: number;
  type?: string;
  status?: string;
  currency?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface TransactionResponse {
  data: Transaction[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface TransactionStats {
  totalTransactions: number;
  totalVolume: number;
  totalFees: number;
  successRate: number;
  byType: Record<string, number>;
  byStatus: Record<string, number>;
  byCurrency: Record<string, number>;
  dailyVolume: Array<{
    date: string;
    count: number;
    volume: number;
  }>;
}
