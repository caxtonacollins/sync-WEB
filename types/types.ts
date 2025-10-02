export interface Transaction {
  id: string;
  amount: number;
  type: string;
  createdAt: string;
  status: string;
  currency: string;
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
  role: "user" | "admin";
  status: "ACTIVE" | "SUSPENDED" | "CLOSED" | "RESTRICTED";
  phoneNumber?: string;
  address?: string;
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
