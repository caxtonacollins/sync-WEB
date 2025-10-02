import axios, { AxiosError } from "axios";

export const createUser = async (userData: any) => {
  const response = await axios.post(
    `${process.env.BACKEND_URL}/user`,
    userData
  );
  return response.data;
};

export const getAllUsers = async (token: string) => {
  const response = await axios.get(`${process.env.BACKEND_URL}/user`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getUserById = async (userId: string, token: string) => {
  const response = await axios.get(`${process.env.BACKEND_URL}/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getUserByCryptoAddress = async (
  address: string,
  token: string
) => {
  const response = await axios.get(
    `${process.env.BACKEND_URL}/user/getUserByCryptoAddress/${address}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const getUserByEmail = async (email: string, token: string) => {
  const response = await axios.get(`${process.env.BACKEND_URL}/user/email/${email}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateUserProfile = async (userId: string, profileData: any, token: string) => {
  const response = await axios.patch(`${process.env.BACKEND_URL}/user/${userId}`, profileData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const changePassword = async (userId: string, passwordData: any, token: string) => {
  const response = await axios.patch(
    `${process.env.BACKEND_URL}/user/${userId}/password`,
    passwordData,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const verifyKyc = async (userId: string, token: string) => {
  const response = await axios.patch(
    `${process.env.BACKEND_URL}/user/${userId}/verify-kyc`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const deleteUser = async (userId: string, token: string) => {
  const response = await axios.delete(`${process.env.BACKEND_URL}/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getDashboardData = async (userId: string, token: string) => {
  try {
    const { data } = await axios.get(
      `${process.env.BACKEND_URL}/user/${userId}?fiatAccounts=true&cryptoWallets=true&transactions=true&swapOrders=true`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Dashboard data:", data);
    return data;
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    throw new Error("Failed to fetch dashboard data");
  }
};

