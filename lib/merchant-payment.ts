export interface QRCodeData {
  id: string;
  merchantId: string;
  amount: number;
  symbol: string;
  description: string;
  expiresAt: string; // ISO
  qrCodeData: string;
  isActive: boolean;
  createdAt: string;
}

function randomId(prefix = "qr") {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Very small, local-only merchant payment system helper.
 * - generatePaymentQR: builds a JSON payload and returns a QRCodeData object.
 * This is intentionally simple: signing / server-side reservation should be
 * implemented on the backend for production.
 */
export const merchantPaymentSystem = {
  async generatePaymentQR(
    merchantId: string,
    amount: number,
    symbol: string,
    description: string,
    expiresInMinutes = 30
  ): Promise<QRCodeData> {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + expiresInMinutes * 60 * 1000);

    const payload = {
      id: randomId("qr"),
      merchantId,
      amount,
      symbol,
      description,
      expiresAt: expiresAt.toISOString(),
      createdAt: now.toISOString(),
    } as const;

    // The encoded string placed into the QR. In real world you'd sign this
    // or reference a server-side payment intent id. Keep it compact (JSON).
    const qrCodeData = JSON.stringify(payload);

    return {
      id: payload.id,
      merchantId: payload.merchantId,
      amount: payload.amount,
      symbol: payload.symbol,
      description: payload.description,
      expiresAt: payload.expiresAt,
      qrCodeData,
      isActive: true,
      createdAt: payload.createdAt,
    };
  },
};

export default merchantPaymentSystem;
