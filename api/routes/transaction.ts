import { api } from "@/lib/api-client";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
interface TransactionMetadata {
  provider?: string;
  description?: string;
  paymentMethod?: string;
  txHash?: string;
  network?: string;
}

interface TransactionResponse {
  id: string;
  userId: string;
  type: string;
  status: string;
  amount: number;
  currency: string;
  fee: number;
  netAmount: number;
  reference: string;
  metadata: TransactionMetadata;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  cryptoWalletId: string | null;
  swapOrderId: string | null;
}

export interface TransactionListResponse {
  data: TransactionResponse[];
  meta: {
    page: string;
    limit: string;
    total: number;
  };
}

export const getAllTransactions = async (
  token: string,
  params: {
    userId?: string;
    status?: string;
    type?: string;
    currency?: string;
    page?: number;
    limit?: number;
    fromDate?: string;
    toDate?: string;
  } = {}
) => {
  const response = await api.get("/tx", {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });
  return response.data;
};

export const getAllUserTransactions = async (
  token: string,
  params: {
    userId?: string;
    status?: string;
    type?: string;
    currency?: string;
    page?: number;
    limit?: number;
    fromDate?: string;
    toDate?: string;
  } = {}
): Promise<TransactionListResponse> => {
  if (!params.userId) {
    throw new Error("userId is required");
  }

  const { userId, ...queryParams } = params;

  const response = await api.get<TransactionListResponse>(
    `/tx/user/${userId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      params: queryParams,
    }
  );
  return response.data;
};

export const getTransactionById = async (txId: string, token: string) => {
  const response = await api.get(`/tx/${txId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateTransaction = async (
  txId: string,
  txData: any,
  token: string
) => {
  const response = await api.patch(`/tx/${txId}`, txData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { transaction_id, tx_ref } = req.body;

  if (!transaction_id || !tx_ref) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Call your backend API to verify the transaction
    const response = await api.post('/transactions/verify-flutterwave', {
      transaction_id,
      tx_ref
    });

    if (!response.data.success) {
      return res.status(400).json({
        success: false,
        message: response.data.message || 'Failed to verify transaction'
      });
    }

    return res.status(200).json({
      success: true,
      data: response.data
    });
  } catch (error) {
    console.error('Error verifying transaction:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}
