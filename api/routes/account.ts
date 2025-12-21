import { api } from "@/lib/api-client";

export const addCryptoWallet = async (walletData: any, token: string) => {
  const response = await api.post(`/user/crypto-wallets`, walletData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getCryptoWallets = async (userId: string, token: string) => {
  const response = await api.get(`/user/${userId}/crypto-wallets`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log("Crypto wallets response:", response.data);
  return response.data;
};

export const getWallets = async (userId: string, token: string) => {
  try {
    const [cryptoWallets] = await Promise.all([
      getCryptoWallets(userId, token),
    ]);

    return cryptoWallets;
  } catch (error) {
    console.error("Failed to fetch wallets:", error);
    return [];
  }
};
