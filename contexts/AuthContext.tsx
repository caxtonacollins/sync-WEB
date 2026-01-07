"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useRouter } from "next/navigation";
import { loginApi, logoutApi, refreshTokenApi } from "@/api/routes/auth";
import { createCryptoAccountsApi, getDashboardData, getUserById } from "@/api/routes/user";
import { api } from "@/lib/api-client";

interface CryptoWallet {
  id: string;
  userId: string;
  network: string;
  address: string;
  tokenSymbol: string;
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
  starknetAccountAddress: string | null;
  idNumber: string | null;
  idFrontImage: string | null;
  idBackImage: string | null;
  selfieImage: string | null;
  twoFactorEnabled: boolean;
  twoFactorSecret: string | null;
  loginAttempts: number;
  lockedUntil: string | null;
  cryptoWallets: CryptoWallet[];
  transactions: Transaction[];
  swapOrders: SwapOrder[];
}

interface LoginResult {
  success: boolean;
  error?: string;
  access_token?: string;
  user?: User;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<LoginResult>;
  handlePasskeyLogin: (data: any) => void;
  loginWithToken: (token: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
  lastEmail: string | null;
  clearAuthData: () => void;
  clearLastEmail: () => void;
  fetchUser: () => Promise<void>;
  refreshToken: (
    redirectOnFail?: boolean
  ) => Promise<{ success: boolean; accessToken?: string; user?: User }>;
  fetchUserDetails: () => Promise<void>;
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
  const [lastEmail, setLastEmail] = useLocalStorage<string | null>("lastEmail", null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("");
  const router = useRouter();

  // Prevent multiple simultaneous refresh attempts
  const isRefreshing = useRef(false);
  const refreshPromise = useRef<
    Promise<{ success: boolean; accessToken?: string; user?: User }> | null
  >(null);

  const clearAuthData = useCallback(() => {
    // Clear in-memory state
    setToken(null);
    setUser(null);
    api.clearAuthTokens();
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

  const refreshToken = useCallback(
    async (
      redirectOnFail = true
    ): Promise<{ success: boolean; accessToken?: string; user?: User }> => {
      // Prevent multiple simultaneous refresh attempts
      if (isRefreshing.current && refreshPromise.current) {
        return refreshPromise.current;
      }

      isRefreshing.current = true;

      refreshPromise.current = (async () => {
        try {
          const data = await refreshTokenApi();
          const { access_token: newToken, user: refreshedUser } = data;

          setToken(newToken);
          api.setAccessToken(newToken);
          if (refreshedUser) {
            setUser(refreshedUser);
          }

          return { success: true, accessToken: newToken, user: refreshedUser };
        } catch (error) {
          console.error("[AuthContext] Token refresh failed:", error);
          clearAuthData();
          if (redirectOnFail) {
            router.push("/login");
          }
          return { success: false };
        } finally {
          isRefreshing.current = false;
          refreshPromise.current = null;
        }
      })();

      return refreshPromise.current;
    },
    [clearAuthData, router]
  );

  // Initialize auth state on mount (silent refresh using HttpOnly cookie)
  useEffect(() => {
    const init = async () => {
      try {
        const refreshed = await refreshToken(false);
        if (refreshed.success && refreshed.accessToken) {
          const refreshedUserId = refreshed.user?.id;
          if (refreshedUserId) {
            await fetchCompleteUserData(refreshedUserId, refreshed.accessToken);
          }
        }
      } catch (error) {
        console.error("[AuthContext] Init error:", error);
        clearAuthData();
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, [clearAuthData, fetchCompleteUserData, refreshToken]);

  const loginWithToken = useCallback(async (
    existingToken: string,
  ): Promise<boolean> => {
    try {
      // Set tokens in memory
      setToken(existingToken);
      api.setAccessToken(existingToken);

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

  const handlePasskeyLogin = useCallback(async (data: any) => {
    setLoadingStatus("Finalizing login...");
    try {
      const {
        access_token: newToken,
        user: newUser,
      } = data;

      if (!newToken || !newUser) {
        throw new Error("Invalid response from server");
      }

      setToken(newToken);
      api.setAccessToken(newToken);
      setLastEmail(newUser.email);

      if (newUser.id) {
        setLoadingStatus("Fetching user data...");
        const fullUser = await fetchCompleteUserData(newUser.id, newToken);
        
        // Use the fetched user data for redirect decision
        if (fullUser.role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      } else {
        // Fallback to newUser if fetch fails (shouldn't happen)
        if (newUser.role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      }
    } catch (error) {
      console.error("[AuthContext] Passkey login failed:", error);
      clearAuthData();
      router.push("/login");
    }
  }, [router, fetchCompleteUserData, setLastEmail, clearAuthData]);

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
          error: data.error,
        };
      }

      const {
        access_token: newToken,
        user: newUser,
      } = data;


      if (!newToken || !newUser) {
        throw new Error("Invalid response from server");
      }

      setToken(newToken);
      api.setAccessToken(newToken);
      setLastEmail(newUser.email);

      // Fetch complete user data with all relations (fiatAccounts, cryptoWallets, etc.)
      if (newUser.id) {
        setLoadingStatus("Fetching user data...");
        const fullUser = await fetchCompleteUserData(newUser.id, newToken);

        if (fullUser && (fullUser.cryptoWallets.length === 0)) {
          try {
            setIsProvisioning(true);
            setLoadingStatus("Provisioning accounts...");
            await createCryptoAccountsApi(newToken);
            // await initializeCryptoBalance(newUser.id, newToken);
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
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Invalid Credentials",
      };
    }
  }, [router]);

  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.error("[AuthContext] Logout API failed:", error);
    }
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
        handlePasskeyLogin,
        loginWithToken,
        logout,
        isLoading,
        clearAuthData,
        clearLastEmail,
        fetchUser,
        refreshToken,
        fetchUserDetails,
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
