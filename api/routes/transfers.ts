import api from "../index";

export interface CreateTransferPayload {
  toAddress: string;
  amount: number;
  token: string;
}

export const transferToken = async (payload: CreateTransferPayload) => {
  try {
    const response = await api.post("/transfer/token", payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const transferFiat = async (payload: CreateTransferPayload) => {
  try {
    const response = await api.post("/transfer/fiat", payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};
