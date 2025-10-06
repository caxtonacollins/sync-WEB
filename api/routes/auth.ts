import axios, { AxiosError } from "axios";
import type { LoginResponse } from "../server-calls";

export const loginApi = async (email: string, password: string): Promise<LoginResponse | { error: string }> => {
  try {
    const response = await axios.post<LoginResponse>(
      `${process.env.BACKEND_URL}/auth/login`,
      { email, password },
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    return { error: error.response?.data?.message || error.message || "Login failed" };
  }
};

export const generate2FA = async (token: string) => {
  const response = await axios.get(`${process.env.BACKEND_URL}/auth/2fa/generate`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const enable2FA = async (code: string, token: string) => {
  const response = await axios.post(
    `${process.env.BACKEND_URL}/auth/2fa/enable`,
    { code },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const verify2FA = async (code: string, token: string) => {
  const response = await axios.post(
    `${process.env.BACKEND_URL}/auth/2fa/verify`,
    { code },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const disable2FA = async (token: string) => {
  const response = await axios.post(
    `${process.env.BACKEND_URL}/auth/2fa/disable`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const refreshTokenApi = async (refreshToken: string) => {
  try {
    const response = await axios.post(
      `${process.env.BACKEND_URL}/auth/refresh`,
      { refresh_token: refreshToken },
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    throw new Error(error.response?.data?.message || error.message || "Token refresh failed");
  }
};
