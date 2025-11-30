import { Transaction } from './transaction';

export interface CryptoWallet {
  id: string;
  userId: string;
  network: string;
  address: string;
  encryptedPrivateKey: string;
  currency: string;
  balance: number;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  transactions?: Transaction[];
}

export interface CreateCryptoWalletRequest {
  network: string;
  currency: string;
  privateKey?: string; // Optional, will generate if not provided
  isDefault?: boolean;
  metadata?: Record<string, any>;
}

export interface UpdateCryptoWalletRequest {
  isDefault?: boolean;
  isActive?: boolean;
  metadata?: Record<string, any>;
}

export interface CryptoTransactionRequest {
  walletId: string;
  toAddress: string;
  amount: number;
  currency: string;
  network: string;
  gasPrice?: string;
  gasLimit?: string;
  nonce?: number;
  data?: string;
  reference?: string;
  metadata?: Record<string, any>;
}

export interface CryptoTransferRequest {
  sourceWalletId: string;
  destinationAddress: string;
  amount: number;
  currency: string;
  network: string;
  reference?: string;
  metadata?: Record<string, any>;
}

export interface TokenInfo {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI?: string;
  balance?: string;
  priceInUsd?: number;
  valueInUsd?: number;
  priceChange24h?: number;
}

export interface NetworkInfo {
  id: string;
  name: string;
  chainId: number;
  rpcUrl: string;
  blockExplorerUrl: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  isTestnet: boolean;
  isActive: boolean;
  icon?: string;
}
