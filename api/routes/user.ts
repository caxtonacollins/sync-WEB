import { User } from "@/types/types";
import axios, { AxiosError } from "axios";

export const createUser = async (userData: any) => {
  try {
    const response = await axios.post(
      `${process.env.BACKEND_URL}/user`,
      userData,
      { validateStatus: (status) => status < 500 } // Don't throw for 4xx errors
    );

    if (response.status >= 400) {
      throw new Error(response.data?.message || "Registration failed");
    }

    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      // Forward the error message from the backend
      throw new Error(error.response?.data?.message || error.message);
    }
    throw error;
  }
};

export const getAllUsers = async (token: string) => {
  const response = await axios.get(`${process.env.BACKEND_URL}/user`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getUserById = async (userId: string, token: string) => {
  const response = await axios.get(
    `${process.env.BACKEND_URL}/user/${userId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  // Backend returns { user: {...} }, extract the user object
  return response.data.user || response.data;
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
  const response = await axios.get(
    `${process.env.BACKEND_URL}/user/email/${email}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const updateUserProfile = async (
  userId: string,
  profileData: Partial<User>,
  token: string
) => {
  const response = await axios.patch(
    `${process.env.BACKEND_URL}/user/${userId}`,
    profileData,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const changePassword = async (
  userId: string,
  passwordData: { password: string },
  token: string
) => {
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
  const response = await axios.delete(
    `${process.env.BACKEND_URL}/user/${userId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
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
    return data;
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    throw new Error("Failed to fetch dashboard data");
  }
};

export const resolveAccountNumber = async (accountNumber: string, token: string) => {
  try {
    const { data } = await axios.get(
      `${process.env.BACKEND_URL}/user/resolve/account/${accountNumber}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    console.error("Failed to resolve account number:", error);
    throw new Error("Failed to resolve account number");
  }
};
