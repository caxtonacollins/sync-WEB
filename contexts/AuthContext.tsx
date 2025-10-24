"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useRouter } from "next/navigation";
import { LoginResponse } from "@/api/server-calls";
import { loginApi, refreshTokenApi } from "@/api/routes/auth";
import { getDashboardData, getUserById, provisionAccounts as provisionAccountsApi } from "@/api/routes/user";

export interface FiatAccount {
  id: string;
  userId: string;
  provider: string;
  accountNumber: string;
  accountName: string;
  name: string; // For UI display
  initials: string; // Computed from accountName
  balance: number; // Current balance
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
  id: string;
}

interface SwapOrder {
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
  lastEmail: string | null;
  clearAuthData: () => void;
  clearLastEmail: () => void;
  fetchUser: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  fetchUserDetails: () => Promise<void>;
  getFiatAccounts: () => FiatAccount[];
  getCryptoWallets: () => CryptoWallet[];
  getTransactions: () => Transaction[];
  getSwapOrders: () => SwapOrder[];
  isProvisioning: boolean;
  loadingStatus: string;
  setLoadingStatus: (status: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshTokenValue, setRefreshTokenValue] = useState<string | null>(null);
  const [lastEmail, setLastEmail] = useLocalStorage<string | null>("lastEmail", null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("");
  const router = useRouter();

  // Prevent multiple simultaneous refresh attempts
  const isRefreshing = useRef(false);
  const refreshPromise = useRef<Promise<boolean> | null>(null);

  const clearAuthData = useCallback(() => {
    // Clear in-memory state
    setToken(null);
    setRefreshTokenValue(null);
    setUser(null);

    isRefreshing.current = false;
    refreshPromise.current = null;
  }, []);

  const clearLastEmail = useCallback(() => {
    setLastEmail(null);
  }, [setLastEmail]);

  // Fetch complete user data with all relations (fiatAccounts, cryptoWallets, transactions, etc.)
  const fetchCompleteUserData = useCallback(async (userId: string, currentToken?: string): Promise<User> => {
    const tokenToUse = currentToken || token;
    if (!tokenToUse) {
      throw new Error("No token available");
    }

    if (!userId) {
      throw new Error("No user ID provided");
    }

    try {
      // Fetch user with all relations using getDashboardData
      const data = await getDashboardData(userId, tokenToUse);

      if (!data?.user) {
        throw new Error("No user data received from backend");
      }

      // Set complete user data (includes fiatAccounts, cryptoWallets, transactions, etc.)
      setUser(data.user);
      return data.user;

    } catch (error) {
      console.error("[AuthContext] Failed to fetch user data:", error);
      throw error;
    }
  }, [token]);

  // Initialize auth state on mount
  useEffect(() => {
    const init = async () => {
      try {

        // Set in-memory state
        setToken(token);
        setRefreshTokenValue(refreshTokenValue);

        // Fetch complete user data with relations from backend
        if (user && token) {
          await fetchCompleteUserData(user.id, token);
        }

        console.log("[AuthContext] Migration complete - using secure in-memory storage");
      } catch (error) {
        console.error("[AuthContext] Init error:", error);
        clearAuthData();
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, [clearAuthData, fetchCompleteUserData]);

  const refreshToken = useCallback(async (): Promise<boolean> => {
    // Prevent multiple simultaneous refresh attempts
    if (isRefreshing.current && refreshPromise.current) {
      return refreshPromise.current;
    }

    isRefreshing.current = true;

    refreshPromise.current = (async () => {
      try {
        if (!refreshTokenValue) {
          throw new Error("No refresh token available");
        }

        console.log("[AuthContext] Refreshing access token...");
        const data = await refreshTokenApi(refreshTokenValue);
        const { accessToken: newToken, refreshToken: newRefreshToken } = data;

        // Update in-memory state only
        setToken(newToken);
        setRefreshTokenValue(newRefreshToken);

        console.log("[AuthContext] Token refresh successful");
        return true;
      } catch (error) {
        console.error("[AuthContext] Token refresh failed:", error);
        clearAuthData();
        router.push("/login");
        return false;
      } finally {
        isRefreshing.current = false;
        refreshPromise.current = null;
      }
    })();

    return refreshPromise.current;
  }, [refreshTokenValue, clearAuthData, router]);

  const loginWithToken = useCallback(async (
    existingToken: string,
    existingRefreshToken: string
  ): Promise<boolean> => {
    try {
      // Set tokens in memory
      setToken(existingToken);
      setRefreshTokenValue(existingRefreshToken);

      // Fetch complete user data
      const userData = await getUserById(user?.id || "", existingToken);

      if (!userData?.id) {
        throw new Error("Invalid user data received");
      }

      // Fetch complete data with all relations
      await fetchCompleteUserData(userData.id, existingToken);

      // Redirect based on user role
      if (userData.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }

      return true;
    } catch (error) {
      console.error("[AuthContext] Token login failed:", error);
      clearAuthData();
      throw error;
    }
  }, [user?.id, clearAuthData, router]);

  const login = useCallback(async (email: string, password: string): Promise<LoginResult> => {
    setLoadingStatus("Authenticating...");
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

      setToken(newToken);
      setRefreshTokenValue(newRefreshToken);
      setLastEmail(newUser.email);

      // Fetch complete user data with all relations (fiatAccounts, cryptoWallets, etc.)
      if (newUser.id) {
        setLoadingStatus("Fetching user data...");
        const fullUser = await fetchCompleteUserData(newUser.id, newToken);

        if (fullUser && (fullUser.fiatAccounts.length === 0 || fullUser.cryptoWallets.length === 0)) {
          try {
            setIsProvisioning(true);
            setLoadingStatus("Provisioning accounts...");
            await provisionAccountsApi(newToken);
            await fetchCompleteUserData(newUser.id, newToken);
          } catch (error) {
            console.error("[AuthContext] Failed to provision accounts:", error);
          } finally {
            setIsProvisioning(false);
          }
        }
      }

      // Redirect based on user role
      if (newUser.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }

      return {
        success: true,
        user: newUser as User,
        access_token: newToken,
        refresh_token: newRefreshToken,
      };
    } catch (error) {
      console.error("[AuthContext] Login failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Login failed",
      };
    }
  }, [router]);

  const logout = useCallback(() => {
    console.log("[AuthContext] Logging out...");
    clearAuthData();
    router.push("/login");
  }, [clearAuthData, router]);

  // Legacy method - now just an alias for fetchCompleteUserData
  const fetchUser = useCallback(async () => {
    if (!user?.id || !token) {
      console.warn("[AuthContext] Cannot fetch user: missing user ID or token");
      return;
    }
    await fetchCompleteUserData(user.id, token);
  }, [user?.id, token, fetchCompleteUserData]);

  // Refresh user data (same as fetchUser, kept for API compatibility)
  const fetchUserDetails = useCallback(async () => {
    if (!user?.id || !token) {
      console.warn("[AuthContext] Cannot fetch user details: missing user ID or token");
      return;
    }
    await fetchCompleteUserData(user.id, token);
  }, [user?.id, token, fetchCompleteUserData]);

  const getFiatAccounts = useCallback(() => {
    if (!user?.fiatAccounts) {
      console.warn("[AuthContext] No fiat accounts available");
      return [];
    }

    return user.fiatAccounts.map((account) => ({
      ...account,
      name: account.accountName,
      balance: account.balance,
      bank: account.bankName,
      initials: account.accountName
        .split(" ")
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase(),
    }));
  }, [user?.fiatAccounts]);

  const getCryptoWallets = useCallback(() => {
    return user?.cryptoWallets || [];
  }, [user?.cryptoWallets]);

  const getTransactions = useCallback(() => {
    return user?.transactions || [];
  }, [user?.transactions]);

  const getSwapOrders = useCallback(() => {
    return user?.swapOrders || [];
  }, [user?.swapOrders]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        lastEmail,
        login,
        loginWithToken,
        logout,
        isLoading,
        clearAuthData,
        clearLastEmail,
        fetchUser,
        refreshToken,
        fetchUserDetails,
        getFiatAccounts,
        getCryptoWallets,
        getTransactions,
        getSwapOrders,
        isProvisioning,
        loadingStatus,
        setLoadingStatus
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
