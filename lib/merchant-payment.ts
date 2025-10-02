// Merchant Payment System
// Handles QR code generation, instant settlements, and merchant integration

export interface Merchant {
  id: string;
  name: string;
  businessName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  settlementPreference: 'fiat' | 'crypto' | 'both';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentQR {
  id: string;
  merchantId: string;
  amount: number;
  currency: string;
  description: string;
  expiresAt: string;
  qrCodeData: string;
  isActive: boolean;
  createdAt: string;
}

export interface PaymentRequest {
  id: string;
  merchantId: string;
  userId: string;
  amount: number;
  currency: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'expired';
  paymentMethod: 'fiat' | 'crypto' | 'auto';
  qrCodeId: string;
  createdAt: string;
  completedAt?: string;
  transactionHash?: string;
}

export interface SettlementPreference {
  merchantId: string;
  preferredCurrency: string;
  preferredNetwork: 'starknet' | 'ethereum' | 'bitcoin';
  autoConvert: boolean;
  minimumAmount: number;
}

export class MerchantPaymentSystem {
  private merchants: Merchant[] = [];
  private paymentQRs: PaymentQR[] = [];
  private paymentRequests: PaymentRequest[] = [];
  private settlementPreferences: SettlementPreference[] = [];

  /**
   * Register a new merchant
   */
  async registerMerchant(merchantData: Omit<Merchant, 'id' | 'createdAt' | 'updatedAt'>): Promise<Merchant> {
    const merchant: Merchant = {
      id: `merchant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...merchantData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.merchants.push(merchant);
    return merchant;
  }

  /**
   * Generate a payment QR code for a merchant
   */
  async generatePaymentQR(
    merchantId: string,
    amount: number,
    currency: string,
    description: string,
    expiresInMinutes: number = 30
  ): Promise<PaymentQR> {
    const merchant = this.merchants.find(m => m.id === merchantId);
    if (!merchant) {
      throw new Error('Merchant not found');
    }

    const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);
    const qrData = this.generateQRData(merchantId, amount, currency, description);

    const paymentQR: PaymentQR = {
      id: `qr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      merchantId,
      amount,
      currency,
      description,
      expiresAt: expiresAt.toISOString(),
      qrCodeData: qrData,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    this.paymentQRs.push(paymentQR);
    return paymentQR;
  }

  /**
   * Process a payment from a QR code
   */
  async processPayment(
    qrCodeId: string,
    userId: string,
    paymentMethod: 'fiat' | 'crypto' | 'auto' = 'auto'
  ): Promise<PaymentRequest> {
    const qrCode = this.paymentQRs.find(qr => qr.id === qrCodeId && qr.isActive);
    if (!qrCode) {
      throw new Error('Invalid or expired QR code');
    }

    if (new Date(qrCode.expiresAt) < new Date()) {
      throw new Error('QR code has expired');
    }

    const paymentRequest: PaymentRequest = {
      id: `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      merchantId: qrCode.merchantId,
      userId,
      amount: qrCode.amount,
      currency: qrCode.currency,
      description: qrCode.description,
      status: 'processing',
      paymentMethod,
      qrCodeId,
      createdAt: new Date().toISOString()
    };

    this.paymentRequests.push(paymentRequest);

    try {
      // Process the payment
      await this.executePayment(paymentRequest);
      
      paymentRequest.status = 'completed';
      paymentRequest.completedAt = new Date().toISOString();
      paymentRequest.transactionHash = this.generateTransactionHash();

      // Deactivate the QR code after successful payment
      qrCode.isActive = false;

      return paymentRequest;
    } catch (error) {
      paymentRequest.status = 'failed';
      throw error;
    }
  }

  /**
   * Execute the actual payment
   */
  private async executePayment(paymentRequest: PaymentRequest): Promise<void> {
    // Simulate payment processing
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate 98% success rate
        if (Math.random() > 0.02) {
          resolve();
        } else {
          reject(new Error('Payment processing failed'));
        }
      }, 1500); // Simulate 1.5-second processing time
    });
  }

  /**
   * Generate QR code data
   */
  private generateQRData(merchantId: string, amount: number, currency: string, description: string): string {
    const qrData = {
      type: 'sync_payment',
      merchantId,
      amount,
      currency,
      description,
      timestamp: Date.now()
    };

    return JSON.stringify(qrData);
  }

  /**
   * Generate a mock transaction hash
   */
  private generateTransactionHash(): string {
    return `0x${Math.random().toString(16).substr(2, 64)}`;
  }

  /**
   * Get merchant by ID
   */
  getMerchant(merchantId: string): Merchant | null {
    return this.merchants.find(m => m.id === merchantId) || null;
  }

  /**
   * Get payment QR by ID
   */
  getPaymentQR(qrCodeId: string): PaymentQR | null {
    return this.paymentQRs.find(qr => qr.id === qrCodeId) || null;
  }

  /**
   * Get payment requests for a merchant
   */
  getMerchantPayments(merchantId: string): PaymentRequest[] {
    return this.paymentRequests.filter(pr => pr.merchantId === merchantId);
  }

  /**
   * Get payment requests for a user
   */
  getUserPayments(userId: string): PaymentRequest[] {
    return this.paymentRequests.filter(pr => pr.userId === userId);
  }

  /**
   * Set merchant settlement preferences
   */
  setSettlementPreference(preference: SettlementPreference): void {
    const existingIndex = this.settlementPreferences.findIndex(
      sp => sp.merchantId === preference.merchantId
    );

    if (existingIndex >= 0) {
      this.settlementPreferences[existingIndex] = preference;
    } else {
      this.settlementPreferences.push(preference);
    }
  }

  /**
   * Get settlement preferences for a merchant
   */
  getSettlementPreference(merchantId: string): SettlementPreference | null {
    return this.settlementPreferences.find(sp => sp.merchantId === merchantId) || null;
  }

  /**
   * Process instant settlement for a merchant
   */
  async processSettlement(paymentRequest: PaymentRequest): Promise<void> {
    const merchant = this.getMerchant(paymentRequest.merchantId);
    if (!merchant) {
      throw new Error('Merchant not found');
    }

    const settlementPreference = this.getSettlementPreference(paymentRequest.merchantId);
    
    // Simulate instant settlement based on merchant preferences
    if (settlementPreference?.preferredNetwork === 'starknet') {
      // Use StarkNet for instant settlement
      await this.simulateStarkNetSettlement(paymentRequest);
    } else {
      // Use traditional settlement
      await this.simulateTraditionalSettlement(paymentRequest);
    }
  }

  /**
   * Simulate StarkNet instant settlement
   */
  private async simulateStarkNetSettlement(paymentRequest: PaymentRequest): Promise<void> {
    // Simulate StarkNet rollup processing
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`StarkNet settlement completed for payment ${paymentRequest.id}`);
        resolve();
      }, 500); // StarkNet is much faster
    });
  }

  /**
   * Simulate traditional settlement
   */
  private async simulateTraditionalSettlement(paymentRequest: PaymentRequest): Promise<void> {
    // Simulate traditional blockchain settlement
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Traditional settlement completed for payment ${paymentRequest.id}`);
        resolve();
      }, 3000); // Traditional settlement is slower
    });
  }
}

// Export singleton instance
export const merchantPaymentSystem = new MerchantPaymentSystem();
