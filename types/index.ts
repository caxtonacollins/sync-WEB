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

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: "ADMIN" | "USER" | "SYSTEM";
  status: "ACTIVE" | "SUSPENDED" | "CLOSED" | "RESTRICTED";
  verificationStatus: "UNVERIFIED" | "PENDING" | "VERIFIED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  bvn?: string;
  nin?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  idType?: string;
  idNumber?: string;
  idFrontImage?: string;
  idBackImage?: string;
  selfieImage?: string;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  loginAttempts: number;
  lockedUntil?: string;
  paymentPinHash?: string;
  paymentPinAttempts: number;
  paymentPinLockedUntil?: string;
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
  metadata?: any;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  blockNumber?: string;
  transactionHash?: string;
  fiatAccountId?: string;
  cryptoWalletId?: string;
  swapOrderId?: string;
}

export interface WalletSummary {
  fiatBalanceNGN: number;
  cryptoValueUSD: number;
  syncTokenBalance: number;
  stakedSyncTokens: number;
  totalPortfolioValueNGN: number;
  transactionFeeDiscount: number;
  activeLiquidityPools: number;
  dailySettlementCount: number;
}

export interface WalletStats {
  totalFiatWallets: number;
  totalCryptoWallets: number;
  totalFiatBalance: number;
  totalCryptoBalance: number;
  activeWallets: number;
  suspendedWallets: number;
}

export interface CryptoWallet {
  id: string;
  userId: string;
  network: string;
  address: string;
  encryptedPrivateKey: string;
  currency: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  transactions?: Transaction[];
}
