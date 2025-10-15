import { User } from "@/types/types";
import { AxiosError } from "axios";
import api from "../index";

export const createUser = async (userData: any) => {
  try {
    const response = await api.post(
      "/user",
      userData,
      { validateStatus: (status) => status < 500 } // Don't throw for 4xx errors
    );

    if (response.status >= 400) {
      throw new Error(response.data?.message || "Registration failed");
    }

    return response.data;
  } catch (error: any) {
    if (error.isAxiosError) {
      // Forward the error message from the backend
      throw new Error(error.response?.data?.message || error.message);
    }
    throw error;
  }
};

export const getAllUsers = async (token: string) => {
  const response = await api.get("/user", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getUserById = async (userId: string, token: string) => {
  const response = await api.get(
    `/user/${userId}`,
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
  const response = await api.get(
    `/user/getUserByCryptoAddress/${address}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const getUserByEmail = async (email: string, token: string) => {
  const response = await api.get(
    `/user/email/${email}`,
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
  const response = await api.patch(
    `/user/${userId}`,
    profileData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
};

export const changePassword = async (
  userId: string,
  passwordData: { password: string },
  token: string
) => {
  const response = await api.post(
    `/user/${userId}/change-password`,
    passwordData,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const deleteUser = async (userId: string, token: string) => {
  const response = await api.delete(
    `/user/${userId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const getDashboardData = async (userId: string, token: string) => {
  try {
    const { data } = await api.get(
      `/user/${userId}?fiatAccounts=true&cryptoWallets=true&transactions=true&swapOrders=true`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    throw error;
  }
};

export const resolveAccountNumber = async (accountNumber: string, token: string) => {
  try {
    const { data } = await api.get(
      `/user/resolve/account/${accountNumber}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return data;
  } catch (error) {
    console.error('Error resolving account number:', error);
    throw error;
  }
}