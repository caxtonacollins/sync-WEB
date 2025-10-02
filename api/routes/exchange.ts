import axios from "axios";

export const createExchangeRate = async (rateData: any, token: string) => {
  const response = await axios.post(`${process.env.BACKEND_URL}/exchange-rate`, rateData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getAllExchangeRates = async (token: string) => {
  const response = await axios.get(`${process.env.BACKEND_URL}/exchange-rate`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getExchangeRateById = async (rateId: string, token: string) => {
  const response = await axios.get(`${process.env.BACKEND_URL}/exchange-rate/${rateId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
