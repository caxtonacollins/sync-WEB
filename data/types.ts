// Type definitions for our dummy data
// Enums based on Prisma Schema
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  SYSTEM = 'SYSTEM',
}

export enum VerificationStatus {
  UNVERIFIED = 'UNVERIFIED',
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
}

export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  CLOSED = 'CLOSED',
  RESTRICTED = 'RESTRICTED',
}

// Model Interfaces
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: UserRole;
  status: AccountStatus;
  verificationStatus: VerificationStatus;
  createdAt: string; // Using string for ISO date format
  updatedAt: string;
  lastLogin?: string;
  // KYC Info
  dateOfBirth?: string;
  address?: string;
  country?: string;
}

export interface FiatAccount {
  id: string;
  userId: string;
  provider: string;
  accountNumber: string;
  accountName: string;
  bankName?: string;
  currency: string;
  balance?: number;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CryptoWallet {
  id: string;
  userId: string;
  network: string; // e.g., 'bitcoin', 'ethereum'
  address: string;
  currency: string; // e.g., 'BTC', 'ETH'
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'deposit' | 'withdrawal' | 'swap' | 'transfer';
  status: 'pending' | 'completed' | 'failed' | 'reversed';
  amount: number;
  currency: string;
  fee: number;
  netAmount: number;
  reference: string;
  metadata?: any; // JSON can be represented as any/Record<string, unknown>
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  fiatAccountId?: string;
  cryptoWalletId?: string;
  swapOrderId?: string;
}

export interface SwapOrder {
  id: string;
  userId: string;
  fromCurrency: string;
  toCurrency: string;
  fromAmount: number;
  toAmount: number;
  rate: number;
  fee: number;
  status: 'pending' | 'completed' | 'failed' | 'partial';
  reference: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

// This is for market data, separate from a user's wallet
export interface CryptoAsset {
  id: string; // e.g., 'bitcoin'
  symbol: string; // e.g., 'BTC'
  name: string;
  image: string;
  price: number; // Current price in USD
  change24h: number; // Percentage change
  marketCap: number;
  // User-specific data, can be added when fetching user portfolio
  balance?: number; // Amount of the asset the user owns
  value?: number; // USD value of the user's balance
}
