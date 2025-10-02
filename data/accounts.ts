import { FiatAccount, CryptoWallet } from './types';
import { currentUserId } from './users';

export const fiatAccounts: FiatAccount[] = [
  {
    id: 'fiat_acct_1',
    userId: currentUserId,
    provider: 'monnify',
    accountNumber: '0123456789',
    accountName: 'Alex Johnson',
    bankName: 'Sterling Bank',
    currency: 'NGN',
    isDefault: true,
    isActive: true,
    createdAt: '2023-05-10T10:00:00Z',
    updatedAt: '2023-09-01T10:00:00Z',
  },
  {
    id: 'fiat_acct_2',
    userId: 'a8b2c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6', // Sarah Williams
    provider: 'paystack',
    accountNumber: '9876543210',
    accountName: 'Sarah Williams',
    bankName: 'GTBank',
    currency: 'NGN',
    isDefault: true,
    isActive: true,
    createdAt: '2023-06-15T12:00:00Z',
    updatedAt: '2023-08-22T14:00:00Z',
  },
];

export const cryptoWallets: CryptoWallet[] = [
  {
    id: 'crypto_wlt_1',
    userId: currentUserId,
    network: 'bitcoin',
    address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    currency: 'BTC',
    isDefault: true,
    isActive: true,
    createdAt: '2023-07-20T16:00:00Z',
    updatedAt: '2023-07-20T16:00:00Z',
  },
  {
    id: 'crypto_wlt_2',
    userId: currentUserId,
    network: 'ethereum',
    address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    currency: 'ETH',
    isDefault: false,
    isActive: true,
    createdAt: '2023-08-01T11:00:00Z',
    updatedAt: '2023-08-01T11:00:00Z',
  },
];

export const getFiatAccountsByUserId = (userId: string) => {
  return fiatAccounts.filter(account => account.userId === userId);
};

export const getCryptoWalletsByUserId = (userId: string) => {
  return cryptoWallets.filter(wallet => wallet.userId === userId);
};

export const getAllAccountsByUserId = (userId: string) => {
  const fiat = getFiatAccountsByUserId(userId);
  const crypto = getCryptoWalletsByUserId(userId);
  return [...fiat, ...crypto];
};

export const getAccountById = (accountId: string) => {
  const allAccounts = [...fiatAccounts, ...cryptoWallets];
  return allAccounts.find(account => account.id === accountId);
};

