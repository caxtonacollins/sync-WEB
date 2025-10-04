import axios from "axios";
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
  fiatAccountId: string | null;
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
  const response = await axios.get(`${process.env.BACKEND_URL}/tx`, {
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

  const response = await axios.get<TransactionListResponse>(
    `${process.env.BACKEND_URL}/tx/user/${userId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      params: queryParams,
    }
  );
  return response.data;
};

export const getTransactionById = async (txId: string, token: string) => {
  const response = await axios.get(`${process.env.BACKEND_URL}/tx/${txId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateTransaction = async (
  txId: string,
  txData: any,
  token: string
) => {
  const response = await axios.patch(
    `${process.env.BACKEND_URL}/tx/${txId}`,
    txData,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};
