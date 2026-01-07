import { SwapType } from "@/enums";
import { api } from "@/lib/api-client";

export interface SwapOrderResponse {
  id: string;
  userId: string;
  from: string;
  to: string;
  fromAmount: number;
  toAmount: number;
  rate: number;
  fee: number;
  status: string;
  reference: string;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  transaction?: {
    transactionHash: string;
  } | null;
}

export interface SwapOrderListResponse {
  data: SwapOrderResponse[];
  page: number;
  limit: number;
  total: number;
}

export interface CreateSwapOrderPayload {
  from: string;
  to: string;
  amount: number;
  rate: number;
  fee?: number;
  status: string;
  userId: string;
  reference: string;
  swapType: SwapType;
  // optional explicit output amount
  toAmount?: number;
  // optional estimated output (backend maps to toAmount if provided)
  estimated?: number;
  // optional alias for input amount if needed by BE
  fromAmount?: number;
}

export const executeSwap = async (
  token: string,
  payload: CreateSwapOrderPayload
) => {
  try {
    const response = await api.post("/swap-order/execute", payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserSwapOrders = async (
  token: string,
  params: {
    userId?: string;
    status?: string;
    from?: string;
    to?: string;
    page?: number;
    limit?: number;
    fromDate?: string;
    toDate?: string;
  } = {}
): Promise<SwapOrderListResponse> => {
  if (!params.userId) {
    throw new Error("userId is required");
  }

  const response = await api.get<SwapOrderListResponse>(`/swap-order`, {
    headers: { Authorization: `Bearer ${token}` },
    // Include userId so backend filters by current user
    params,
  });
  return response.data;
};

export const getSwapOrdersByUserId = async (userId: string, token: string) => {
  try {
    const response = await api.get(`/user/${userId}/swap-orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching swap orders:", error);
    throw error;
  }
};
