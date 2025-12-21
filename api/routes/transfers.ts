import { api } from "@/lib/api-client";

export interface CreateTransferPayload {
  toAddress: string;
  amount: number;
  token: string;
}

export const transferToken = async (
  payload: CreateTransferPayload,
  token: string
) => {
  try {
    const response = await api.post("/transfer/token", payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};