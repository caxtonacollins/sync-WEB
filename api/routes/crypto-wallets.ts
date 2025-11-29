import { api } from "@/lib/api-client";

export const getCryptoWalletsByUserId = async (
  userId: string,
  token: string
) => {
  try {
    const response = await api.get(`/user/${userId}/crypto-wallets`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching crypto wallets:", error);
    throw error;
  }
};
