import api from "../index";

export interface CreateTransferPayload {
  toAddress: string;
  amount: number;
  token: string;
}

export const transferToken = async (token: string, payload: CreateTransferPayload) => {
  try {
    const response = await api.post("/transfer/token", payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const transferFiat = async (token: string, payload: CreateTransferPayload) => {
  try {
    const response = await api.post("/transfer/fiat", payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
