// Enhanced Payment Processor
// Integrates liquidity bridging, merchant payments, and SYNCPAY token system

import { liquidityBridge, LiquidityPool } from "./liquidity-bridge";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Helper to get the auth token (implement this based on your auth solution)
const getAuthToken = () => {
  // TODO: Replace with your actual token retrieval logic
  return localStorage.getItem('authToken');
};

const api = {
  post: async (endpoint: string, body: any) => {
    const token = getAuthToken();
    const response = await fetch(`${BACKEND_URL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }

    return response.json();
  },
};
import { syncpayTokenSystem } from "./syncpay-token";

export interface PaymentProcessorConfig {
  enableAutoBridging: boolean;
  enableSyncPayDiscounts: boolean;
  enableInstantSettlement: boolean;
  defaultSettlementNetwork: "starknet" | "ethereum" | "bitcoin";
}

export interface PaymentResult {
  success: boolean;
  transactionId: string;
  amount: number;
  currency: string;
  fee: number;
  discountApplied: number;
  method: "fiat" | "crypto" | "bridged";
  settlementTime: number; // in milliseconds
  error?: string;
}

export interface UserWallet {
  userId: string;
  fiatBalance: number;
  fiatCurrency: string;
  cryptoWallets: Array<{
    id: string;
    currency: string;
    balance: number;
    network: string;
  }>;
}

export class PaymentProcessor {
  private config: PaymentProcessorConfig;

  constructor(config: PaymentProcessorConfig) {
    this.config = config;
  }

  /**
   * Process a payment with automatic liquidity bridging
   */
  async processPayment(
    userId: string,
    amount: number,
    currency: string,
    userWallet: UserWallet,
    description: string = "",
    merchantId?: string
  ): Promise<PaymentResult> {
    const startTime = Date.now();

    try {
      // Check if payment can be made with fiat
      if (userWallet.fiatBalance >= amount) {
        return await this.processFiatPayment(
          userId,
          amount,
          currency,
          description,
          startTime
        );
      }

      // If auto-bridging is enabled, try to bridge from crypto
      if (this.config.enableAutoBridging) {
        return await this.processBridgedPayment(
          userId,
          amount,
          currency,
          userWallet,
          description,
          startTime
        );
      }

      throw new Error("Insufficient funds and auto-bridging is disabled");
    } catch (error) {
      return {
        success: false,
        transactionId: "",
        amount,
        currency,
        fee: 0,
        discountApplied: 0,
        method: "fiat",
        settlementTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Process a fiat payment
   */
  private async processFiatPayment(
    userId: string,
    amount: number,
    currency: string,
    description: string,
    startTime: number
  ): Promise<PaymentResult> {
    const baseFee = this.calculateBaseFee(amount);
    const discount = this.config.enableSyncPayDiscounts
      ? syncpayTokenSystem.getFeeDiscount(userId)
      : null;

    const finalFee = discount
      ? syncpayTokenSystem.applyFeeDiscount(baseFee, userId)
      : baseFee;

    // Simulate fiat payment processing
    await this.simulatePaymentProcessing(500);

    return {
      success: true,
      transactionId: `fiat_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`,
      amount,
      currency,
      fee: finalFee,
      discountApplied: discount ? baseFee - finalFee : 0,
      method: "fiat",
      settlementTime: Date.now() - startTime,
    };
  }

  /**
   * Process a payment with automatic liquidity bridging
   */
  private async processBridgedPayment(
    userId: string,
    amount: number,
    currency: string,
    userWallet: UserWallet,
    description: string,
    startTime: number
  ): Promise<PaymentResult> {
    // Find the best crypto wallet to use for bridging
    const bestWallet = this.findBestCryptoWallet(
      userWallet.cryptoWallets,
      currency
    );
    if (!bestWallet) {
      throw new Error("No suitable crypto wallet found for bridging");
    }

    // Calculate bridging requirements
    const bridgeCalculation = liquidityBridge.calculateCryptoNeeded(
      amount,
      bestWallet.currency,
      currency
    );

    if (!bridgeCalculation) {
      throw new Error("No liquidity pool available for this conversion");
    }

    if (bestWallet.balance < bridgeCalculation.totalCost) {
      throw new Error("Insufficient crypto balance for bridging");
    }

    // Execute the bridge transaction
    const bridgeTransaction = await liquidityBridge.executeBridge(
      userId,
      amount,
      bestWallet.currency,
      currency
    );

    // Calculate fees and discounts
    const baseFee = bridgeCalculation.fee;
    const discount = this.config.enableSyncPayDiscounts
      ? syncpayTokenSystem.getFeeDiscount(userId)
      : null;

    const finalFee = discount
      ? syncpayTokenSystem.applyFeeDiscount(baseFee, userId)
      : baseFee;

    return {
      success: true,
      transactionId: bridgeTransaction.id,
      amount,
      currency,
      fee: finalFee,
      discountApplied: discount ? baseFee - finalFee : 0,
      method: "bridged",
      settlementTime: Date.now() - startTime,
    };
  }

  /**
   * Find the best crypto wallet for bridging
   */
  private findBestCryptoWallet(
    cryptoWallets: UserWallet["cryptoWallets"],
    targetCurrency: string
  ): UserWallet["cryptoWallets"][0] | null {
    // Prioritize wallets with sufficient balance
    const suitableWallets = cryptoWallets.filter(
      (wallet) => wallet.balance > 0
    );

    if (suitableWallets.length === 0) return null;

    // Find the best liquidity pool for each wallet
    let bestWallet = null;
    let bestRate = 0;

    for (const wallet of suitableWallets) {
      const calculation = liquidityBridge.calculateCryptoNeeded(
        1000, // Test amount
        wallet.currency,
        targetCurrency
      );

      if (calculation && calculation.rate > bestRate) {
        bestRate = calculation.rate;
        bestWallet = wallet;
      }
    }

    return bestWallet;
  }

  /**
   * Calculate base fee for a transaction
   */
  private calculateBaseFee(amount: number): number {
    // Simple fee structure: 0.5% of transaction amount
    return amount * 0.005;
  }

  /**
   * Simulate payment processing
   */
  private async simulatePaymentProcessing(delay: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, delay);
    });
  }

  /**
   * Get payment processor configuration
   */
  getConfig(): PaymentProcessorConfig {
    return { ...this.config };
  }

  /**
   * Update payment processor configuration
   */
  updateConfig(newConfig: Partial<PaymentProcessorConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Get available liquidity pools
   */
  getAvailableLiquidityPools(): LiquidityPool[] {
    return liquidityBridge.getAvailablePools();
  }

  /**
   * Get user's SyncPAY token information
   */
  getUserSyncPayInfo(userId: string) {
    return {
      balance: syncpayTokenSystem.getUserBalance(userId),
      stakingPositions: syncpayTokenSystem.getUserStakingPositions(userId),
      feeDiscount: syncpayTokenSystem.getFeeDiscount(userId),
      tokenInfo: syncpayTokenSystem.getTokenInfo(),
    };
  }

  /**
   * Execute a swap (Token <> Fiat)
   */
  async executeSwap(swapData: {
    fromCurrency: string;
    toCurrency: string;
    fromAmount: number;
    toAmount: number;
    rate: number;
    userId: string;
    reference: string;
  }) {
    return api.post('swap-order/execute', swapData);
  }

  /**
   * Transfer a token to another address
   */
  async transferToken(transferData: {
    toAddress: string;
    amount: number;
    token: string;
  }) {
    return api.post('transfer/token', transferData);
  }

  /**
   * Transfer fiat to another user
   */
  async transferFiat(transferData: {
    recipientEmail: string;
    amount: number;
    currency: string;
  }) {
    return api.post('tx/fiat', transferData);
  }
}

// Export default configuration
export const defaultPaymentProcessorConfig: PaymentProcessorConfig = {
  enableAutoBridging: true,
  enableSyncPayDiscounts: true,
  enableInstantSettlement: true,
  defaultSettlementNetwork: "starknet",
};

// Export singleton instance
export const paymentProcessor = new PaymentProcessor(
  defaultPaymentProcessorConfig
);
