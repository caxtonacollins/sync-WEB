import { AxiosError } from "axios";
import { api } from "@/lib/api-client";
import type { LoginResponse } from "../server-calls";

export const loginApi = async (
  email: string,
  password: string
): Promise<LoginResponse | { error: string }> => {
  try {
    const response = await api.post<LoginResponse>(
      "/auth/login",
      { email, password },
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (err: any) {
   throw err.message;
  }
};

export const generate2FA = async (token: string) => {
  const response = await api.get("/auth/2fa/generate", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const enable2FA = async (code: string, token: string) => {
  const response = await api.post(
    "/auth/2fa/enable",
    { code },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const verify2FA = async (code: string, token: string) => {
  const response = await api.post(
    "/auth/2fa/verify",
    { code },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const disable2FA = async (token: string) => {
  const response = await api.post(
    "/auth/2fa/disable",
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const refreshTokenApi = async () => {
  try {
    const response = await api.post(
      "/auth/refresh",
      {},
      { headers: { "Content-Type": "application/json" } }
    );

    const { access_token, user } = response.data as {
      access_token: string;
      user?: any;
    };

    if (!access_token) {
      throw new Error("No access token returned");
    }

    return { access_token, user };
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error;
  }
};

export const getSecurityStatus = async (token: string) => {
  const response = await api.get("/auth/security-status", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const logoutApi = async () => {
  const response = await api.post("/auth/logout", {});
  return response.data;
};
