import axios from "axios";

export interface SwapOrderResponse {
  id: string;
  userId: string;
  fromCurrency: string;
  toCurrency: string;
  fromAmount: number;
  toAmount: number;
  rate: number;
  fee: number;
  status: string;
  reference: string;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

export interface SwapOrderListResponse {
  data: SwapOrderResponse[];
  page: number;
  limit: number;
  total: number;
}

export const getUserSwapOrders = async (
  token: string,
  params: {
    userId?: string;
    status?: string;
    fromCurrency?: string;
    toCurrency?: string;
    page?: number;
    limit?: number;
    fromDate?: string;
    toDate?: string;
  } = {}
): Promise<SwapOrderListResponse> => {
  if (!params.userId) {
    throw new Error("userId is required");
  }

  const response = await axios.get<SwapOrderListResponse>(
    `${process.env.BACKEND_URL}/swap-order`,
    {
      headers: { Authorization: `Bearer ${token}` },
      // Include userId so backend filters by current user
      params,
    }
  );
  return response.data;
};

export const getSwapOrdersByUserId = async (userId: string, token: string) => {
  try {
    const response = await axios.get(`/user/${userId}/swap-orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching swap orders:", error);
    throw error;
  }
};
