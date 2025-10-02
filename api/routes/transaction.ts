import axios from "axios";

export const getUserSwapOrders = async (userId: string, token: string) => {
  const response = await axios.get(
    `${process.env.BACKEND_URL}/user/${userId}/swap-orders`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const getTxByUser = async (userId: string, token: string) => {
  const response = await axios.get(
    `${process.env.BACKEND_URL}/tx/user/${userId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const getAllTransactions = async (
  token: string,
  params: {
    userId?: string;
    status?: string;
    type?: string;
    currency?: string;
    page?: number;
    limit?: number;
  } = {}
) => {
  const response = await axios.get(`${process.env.BACKEND_URL}/tx`, {
    headers: { Authorization: `Bearer ${token}` },
    params, // axios will serialize into ?key=value&...
  });
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
