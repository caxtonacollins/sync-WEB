import { api } from "@/lib/api-client";

export interface InitializePaymentParams {
  amount: number;
  currency?: string;
  paymentMethod?: string;
}

export interface InitializePaymentResponse {
  success: boolean;
  status: string;
  message: string;
  data?: {
    publicKey: string;
    txRef: string;
    amount: number;
    currency: string;
    customer: {
      email: string;
      name: string;
      phone: string;
    };
    customizations: {
      title: string;
      description: string;
      logo: string;
    };
  };
}

export const flutterwaveApi = {
  initializePayment: async (params: InitializePaymentParams, token: string): Promise<InitializePaymentResponse> => {
    const response = await api.post<InitializePaymentResponse>(
      '/flutterwave/initialize-payment',
      params,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      },
    );
    return response.data;
  },
  
  verifyPayment: async (transactionId: string, token: string): Promise<any> => {
    const response = await api.post('/flutterwave/verify', {
      transaction_id: transactionId,
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  },
};
