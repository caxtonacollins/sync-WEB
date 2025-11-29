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
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    return {
      error: error.response?.data?.message || error.message || "Login failed",
    };
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

export const refreshTokenApi = async (refreshToken: string) => {
  try {
    const response = await api.post(
      "/auth/refresh-token",
      { refreshToken },
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data as { accessToken: string; refreshToken: string };
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error;
  }
};
