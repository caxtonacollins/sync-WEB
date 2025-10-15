import api from "../index";

export const addFiatAccount = async (accountData: any, token: string) => {
  const response = await api.post(`/user/fiat-accounts`, accountData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const addCryptoWallet = async (walletData: any, token: string) => {
  const response = await api.post(`/user/crypto-wallets`, walletData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export const getFiatAccounts = async (userId: string, token: string) => {
  const response = await api.get(`/user/${userId}/fiat-accounts`, {
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
    const [fiatWallets, cryptoWallets] = await Promise.all([
      getFiatAccounts(userId, token),
      getCryptoWallets(userId, token),
    ]);

    return [...(fiatWallets || []), ...(cryptoWallets || [])];
  } catch (error) {
    console.error("Failed to fetch wallets:", error);
    return [];
  }
};
