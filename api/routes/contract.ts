import axios from "axios";

export const createBlockchainAccount = async (data: any, token: string) => {
  const response = await axios.post(`${process.env.BACKEND_URL}/contract/create-account`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getContractDashboard = async (userAddress: string, token: string) => {
  const response = await axios.get(`${process.env.BACKEND_URL}/contract/dashboard/${userAddress}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getTokenBalance = async (userAddress: string, symbol: string, token: string) => {
  const response = await axios.get(`${process.env.BACKEND_URL}/contract/balance/${userAddress}/${symbol}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const convertTokenToUsd = async (params: any, token: string) => {
  const response = await axios.get(`${process.env.BACKEND_URL}/contract/amount_in_usd`, {
    params,
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};


export const swapFiatToToken = async (data: any, token: string) => {
  const response = await axios.post(
    `${process.env.BACKEND_URL}/contract/swap-fiat-to-token`,
    data,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const swapTokenToFiat = async (data: any, token: string) => {
  const response = await axios.post(
    `${process.env.BACKEND_URL}/contract/swap-token-to-fiat`,
    data,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const mintToken = async (data: any, token: string) => {
  const response = await axios.post(
    `${process.env.BACKEND_URL}/contract/mint-token`,
    data,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};