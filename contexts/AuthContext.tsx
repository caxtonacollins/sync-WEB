"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoginResponse } from "@/api/server-calls";
import { loginApi } from "@/api/routes/auth";
import { getUserById } from "@/api/routes/user";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "user" | "admin";
  status: "ACTIVE" | "SUSPENDED" | "CLOSED" | "RESTRICTED";
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  idType?: string;
  idNumber?: string;
  verificationStatus: "UNVERIFIED" | "PENDING" | "VERIFIED" | "REJECTED";
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithToken: (token: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  fetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      fetchUser(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const loginWithToken = async (existingToken: string) => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      if (!storedUser.id) throw new Error("No user data found");

      const userData = await getUserById(storedUser.id, existingToken);
      setToken(existingToken);
      setUser(userData);
      router.push("/dashboard");
      return true;
    } catch (error) {
      console.error("Token login failed:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const data = await loginApi(email, password);

      if (!data) {
        throw new Error("Login failed");
      }

      const { access_token: newToken, user: newUser } = data as LoginResponse;

      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify(newUser));

      setToken(newToken);
      setUser(newUser as User);

      router.push("/dashboard");
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    router.push("/login");
  };

  const fetchUser = async (currentToken?: string) => {
    const tokenToUse = currentToken || token;
    if (!tokenToUse) {
      setIsLoading(false);
      return;
    }

    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      if (storedUser.id) {
        const freshUser = await getUserById(storedUser.id, tokenToUse);
        localStorage.setItem("user", JSON.stringify(freshUser));
        setUser(freshUser);
      } else {
        throw new Error("No user ID found");
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      logout(); // Log out if user data can't be fetched
    } finally {
      setIsLoading(false);
    }
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
