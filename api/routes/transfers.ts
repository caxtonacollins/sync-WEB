import { api } from "@/lib/api-client";

export interface CreateTransferPayload {
  toAddress: string;
  amount: number;
  tokenSymbol: string;
}

export const transferToken = async (
  payload: CreateTransferPayload,
  token: string
) => {
  try {
    const response = await api.post("/token/transfer-token", payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};