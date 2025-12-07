import { User } from "@/types";
import { AxiosError } from "axios";
import { api } from "@/lib/api-client";
import type { UserRegistrationFormData } from "@/lib/validations/validations";

export const createUser = async (userData: UserRegistrationFormData) => {
  try {
    const response = await api.post("/user", userData, {
      validateStatus: (status) => status < 500,
    });

    if (response.status >= 400) {
      throw {
        response: {
          data: response.data,
          status: response.status,
        },
      };
    }

    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      throw error;
    }
    throw new Error(
      "Registration failed. Please check your connection and try again."
    );
  }
};

export const getAllUsers = async (token: string) => {
  const response = await api.get("/user", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getUserById = async (userId: string, token: string) => {
  const response = await api.get(`/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.user || response.data;
};

export const getUserByCryptoAddress = async (
  address: string,
  token: string
) => {
  const response = await api.get(`/user/getUserByCryptoAddress/${address}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// export const initializeCryptoBalance = async (userId: string, token: string) => {
//   const response = await api.post(`/user/${userId}/initialize`, {}, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   return response.data;
// };

export const getUserByEmail = async (email: string, token: string) => {
  const response = await api.get(`/user/email/${email}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
export const updateUserProfile = async (
  userId: string,
  profileData: Partial<User>,
  token: string
) => {
  const response = await api.patch(`/user/${userId}`, profileData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const changePassword = async (
  userId: string,
  passwordData: { currentPassword: string; newPassword: string },
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
  const response = await api.delete(`/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
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

export const resolveAccountNumber = async (
  accountNumber: string,
  token: string
) => {
  try {
    const { data } = await api.get(`/user/resolve/account/${accountNumber}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    console.error("Error resolving account number:", error);
    throw error;
  }
};

export const createCryptoAccountsApi = async (token: string) => {
  try {
    const response = await api.post(
      "/user/provision-crypto-accounts",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error provisioning accounts:", error);
    throw error;
  }
};
