import { api } from "@/lib/api-client";
import { useMutation, useQuery } from "@tanstack/react-query";

export interface PaymentRequest {
  type: string;
  recipient: string;
  recipientName: string;
  amount: number;
  currency: string;
  description: string;
  timestamp: number;
  network: string;
}

export interface PaymentResponse {
  id: string;
  status: string;
  transactionHash?: string;
  error?: string;
}

export const useDecodeQR = () => {
  return useMutation({
    mutationFn: async (qrData: string) => {
      const { data } = await api.post<PaymentRequest>("/payments/decode-qr", {
        qrData,
      });
      return data;
    },
  });
};

export const useDecodePaymentCode = () => {
  return useMutation({
    mutationFn: async (code: string) => {
      const { data } = await api.post<PaymentRequest>("/payments/decode-code", {
        code,
      });
      return data;
    },
  });
};

export const useProcessPayment = () => {
  return useMutation({
    mutationFn: async (payment: PaymentRequest) => {
      const { data } = await api.post<PaymentResponse>(
        "/payments/process",
        payment
      );
      return data;
    },
  });
};
