export interface TransactionMetadata {
  provider?: string;
  description?: string;
  paymentMethod?: string;
  txHash?: string;
  network?: string;
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
  metadata: TransactionMetadata;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  fiatAccountId: string | null;
  cryptoWalletId: string | null;
  swapOrderId: string | null;
}

export interface SwapOrder {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  fromAmount: number;
  status: string;
  createdAt: string;
  rate: number;
}

export interface FiatAccount {
  id: string;
  currency: string;
  balance: number;
  accountNumber: string;
  accountName: string;
  bankName: string | null;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "USER" | "ADMIN";
  status: "ACTIVE" | "SUSPENDED" | "CLOSED" | "RESTRICTED";
  phoneNumber?: string;
  address?: string;
  password: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  idType?: string;
  idNumber?: string;
  verificationStatus: "UNVERIFIED" | "PENDING" | "VERIFIED" | "REJECTED";
  createdAt: string;
}

export interface CryptoWallet {
  id: string;
  currency: string;
  balance: number;
  address: string;
  network: string;
}
