export interface FiatAccount {
  id: string;
  userId: string;
  provider: string;
  accountNumber: string;
  accountName: string;
  bankName?: string;
  bankCode?: string;
  balance: number;
  availableBalance?: number;
  ledgerBalance?: number;
  currency: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  verifiedAt?: string;
  contractCode?: string;
  accountReference?: string;
  reservationReference?: string;
  reservedAccountType?: string;
  collectionChannel?: string;
  customerEmail?: string;
  customerName?: string;
  accounts?: any;
}

export interface CreateFiatAccountRequest {
  currency: string;
  provider: string;
  metadata?: Record<string, any>;
}

export interface UpdateFiatAccountRequest {
  isDefault?: boolean;
  isActive?: boolean;
  metadata?: Record<string, any>;
}

export interface FiatTransactionRequest {
  accountId: string;
  amount: number;
  currency: string;
  reference?: string;
  metadata?: Record<string, any>;
}

export interface FiatTransferRequest {
  sourceAccountId: string;
  destinationAccountId: string;
  amount: number;
  currency: string;
  reference?: string;
  metadata?: Record<string, any>;
}
