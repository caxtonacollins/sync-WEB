"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoginResponse } from "@/api/server-calls";
import { loginApi } from "@/api/routes/auth";
import { getUserById } from "@/api/routes/user";

interface FiatAccount {
  id: string;
  userId: string;
  provider: string;
  accountNumber: string;
  accountName: string;
  bankName: string;
  bankCode: string;
  currency: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  verifiedAt: string | null;
  contractCode: string;
  accountReference: string;
  reservationReference: string;
  reservedAccountType: string;
  collectionChannel: string;
  customerEmail: string;
  customerName: string;
  accounts: Array<{
    bankCode: string;
    bankName: string;
    accountName: string;
    accountNumber: string;
  }>;
}

interface CryptoWallet {
  id: string;
  userId: string;
  network: string;
  address: string;
  currency: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Transaction {
  // Add transaction fields when needed
  id: string;
}

interface SwapOrder {
  // Add swap order fields when needed
  id: string;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  role: "USER" | "ADMIN";
  status: "ACTIVE" | "SUSPENDED" | "CLOSED" | "RESTRICTED";
  verificationStatus: "UNVERIFIED" | "PENDING" | "VERIFIED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
  lastLogin: string;
  dateOfBirth: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postalCode: string | null;
  idType: string | null;
  idNumber: string | null;
  idFrontImage: string | null;
  idBackImage: string | null;
  selfieImage: string | null;
  twoFactorEnabled: boolean;
  twoFactorSecret: string | null;
  loginAttempts: number;
  lockedUntil: string | null;
  fiatAccounts: FiatAccount[];
  cryptoWallets: CryptoWallet[];
  transactions: Transaction[];
  swapOrders: SwapOrder[];
}

interface LoginResult {
  success: boolean;
  error?: string;
  access_token?: string;
  refresh_token?: string;
  user?: User;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<LoginResult>;
  loginWithToken: (token: string, refresh_token: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  fetchUser: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  fetchUserDetails: () => Promise<void>;
  getFiatAccounts: () => FiatAccount[];
  getCryptoWallets: () => CryptoWallet[];
  getTransactions: () => Transaction[];
  getSwapOrders: () => SwapOrder[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const clearAuthData = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    const init = async () => {
      const storedToken = localStorage.getItem("token");
      const storedRefreshToken = localStorage.getItem("refresh_token");
      const storedUser = localStorage.getItem("user");

      if (storedToken && storedRefreshToken && storedUser) {
        try {
          setToken(storedToken);
          const userData = JSON.parse(storedUser);
          setUser(userData);

          await fetchUser(storedToken);
        } catch (error) {
          console.error("Init error:", error);
          try {
            const refreshed = await refreshToken();
            if (!refreshed) {
              clearAuthData();
            }
          } catch (refreshError) {
            clearAuthData();
          }
        }
      }
      setIsLoading(false);
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshToken = async (): Promise<boolean> => {
    try {
      const storedRefreshToken = localStorage.getItem("refresh_token");
      if (!storedRefreshToken) {
        throw new Error("No refresh token found");
      }

      const response = await fetch(`${process.env.BACKEND_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh_token: storedRefreshToken }),
      });

      if (!response.ok) {
        throw new Error("Token refresh failed");
      }

      const data = await response.json();
      const { access_token: newToken, refresh_token: newRefreshToken } = data;

      localStorage.setItem("token", newToken);
      localStorage.setItem("refresh_token", newRefreshToken);
      setToken(newToken);

      return true;
    } catch (error) {
      console.error("Token refresh failed:", error);
      logout();
      return false;
    }
  };

  const loginWithToken = async (
    existingToken: string,
    refreshToken: string
  ) => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      if (!storedUser.id) throw new Error("No user data found");

      const userData = await getUserById(storedUser.id, existingToken);
      setToken(existingToken);
      setUser(userData);
      localStorage.setItem("token", existingToken);
      localStorage.setItem("refresh_token", refreshToken);
      router.push("/dashboard");
      return true;
    } catch (error) {
      console.error("Token login failed:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const data = await loginApi(email, password);

      if (!data) {
        throw new Error("No response from server");
      }

      if ("error" in data) {
        return {
          success: false,
          error: data.error || "Login failed",
        };
      }

      const {
        access_token: newToken,
        refresh_token: newRefreshToken,
        user: newUser,
      } = data;

      if (!newToken || !newRefreshToken || !newUser) {
        throw new Error("Invalid response from server");
      }

      localStorage.setItem("token", newToken);
      localStorage.setItem("refresh_token", newRefreshToken);
      localStorage.setItem("user", JSON.stringify(newUser));
      localStorage.setItem("lastEmail", email);

      setToken(newToken);
      setUser(newUser as User);

      if (newToken && newUser) {
        router.push("/dashboard");
      }

      return {
        success: true,
        user: newUser as User,
        access_token: newToken,
        refresh_token: newRefreshToken,
      };
    } catch (error) {
      console.error("Login failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Login failed",
      };
    }
  };

  const logout = () => {
    clearAuthData();
    router.push("/login");
  };

  const fetchUser = async (currentToken?: string) => {
    const tokenToUse = currentToken || token;
    if (!tokenToUse) {
      throw new Error("No token available");
    }

    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      if (!storedUser.id) {
        throw new Error("No user ID found");
      }

      const freshUser = await getUserById(storedUser.id, tokenToUse);
      localStorage.setItem("user", JSON.stringify(freshUser));
      setUser(freshUser);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      throw error;
    }
  };

  const fetchUserDetails = async () => {
    if (!user?.id || !token) {
      throw new Error("No user ID or token available");
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/${user.id}?fiatAccounts=true&cryptoWallets=true&transactions=true&swapOrders=true`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user details");
      }

      const data = await response.json();
      if (!data.user) {
        throw new Error("No user data received");
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
    } catch (error) {
      console.error("Failed to fetch user details:", error);
      throw error;
    }
  };

  const getFiatAccounts = () => {
    return user?.fiatAccounts || [];
  };

  const getCryptoWallets = () => {
    return user?.cryptoWallets || [];
  };

  const getTransactions = () => {
    return user?.transactions || [];
  };

  const getSwapOrders = () => {
    return user?.swapOrders || [];
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        loginWithToken,
        logout,
        isLoading,
        fetchUser,
        refreshToken,
        fetchUserDetails,
        getFiatAccounts,
        getCryptoWallets,
        getTransactions,
        getSwapOrders,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
