import { api } from "@/lib/api-client";

export const createExchangeRate = async (rateData: any, token: string) => {
  const response = await api.post(`/exchange-rate`, rateData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getAllExchangeRates = async (token: string) => {
  const response = await api.get(`/exchange-rate`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getExchangeRateById = async (rateId: string, token: string) => {
  const response = await api.get(`/exchange-rate/${rateId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
