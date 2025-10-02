import { Transaction } from './types';
import { currentUserId } from './users';
import { fiatAccounts, cryptoWallets } from './accounts';

const alexFiatAccount = fiatAccounts.find(acc => acc.userId === currentUserId);
const alexBtcWallet = cryptoWallets.find(w => w.userId === currentUserId && w.currency === 'BTC');
const alexEthWallet = cryptoWallets.find(w => w.userId === currentUserId && w.currency === 'ETH');

export const transactions: Transaction[] = [
  {
    id: 'txn_1',
    userId: currentUserId,
    fiatAccountId: alexFiatAccount?.id,
    type: 'deposit',
    status: 'completed',
    amount: 50000,
    currency: 'NGN',
    fee: 100,
    netAmount: 49900,
    reference: 'DEPOSIT_REF_123',
    createdAt: '2023-09-25T10:00:00Z',
    updatedAt: '2023-09-25T10:00:00Z',
    completedAt: '2023-09-25T10:01:00Z',
  },
  {
    id: 'txn_2',
    userId: currentUserId,
    cryptoWalletId: alexBtcWallet?.id,
    type: 'withdrawal',
    status: 'completed',
    amount: 0.01,
    currency: 'BTC',
    fee: 0.0001,
    netAmount: 0.0099,
    reference: 'WITHDRAW_BTC_456',
    createdAt: '2023-09-24T15:30:00Z',
    updatedAt: '2023-09-24T15:30:00Z',
    completedAt: '2023-09-24T15:35:00Z',
  },
  {
    id: 'txn_3',
    userId: currentUserId,
    type: 'swap',
    status: 'completed',
    amount: 0.05, // Amount is context-dependent for swaps
    currency: 'BTC',
    fee: 5,
    netAmount: 0.05, // Simplified for dummy data
    reference: 'SWAP_REF_789',
    createdAt: '2023-09-23T11:00:00Z',
    updatedAt: '2023-09-23T11:00:00Z',
    completedAt: '2023-09-23T11:02:00Z',
    cryptoWalletId: alexBtcWallet?.id, // Can be source or destination
    swapOrderId: 'swap_1',
  },
  {
    id: 'txn_4',
    userId: currentUserId,
    fiatAccountId: alexFiatAccount?.id,
    type: 'transfer',
    status: 'pending',
    amount: 15000,
    currency: 'NGN',
    fee: 25,
    netAmount: 14975,
    reference: 'TRANSFER_REF_101',
    createdAt: '2023-09-26T09:00:00Z',
    updatedAt: '2023-09-26T09:00:00Z',
  },
];

export const getTransactionsByUserId = (userId: string) => {
  return transactions
    .filter(tx => tx.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const getTransactionsByWalletId = (walletId: string) => {
  return transactions
    .filter(tx => tx.cryptoWalletId === walletId || tx.fiatAccountId === walletId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const getRecentTransactions = (userId: string, limit = 5) => {
  return getTransactionsByUserId(userId).slice(0, limit);
};

