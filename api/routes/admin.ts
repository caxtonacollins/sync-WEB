import axios from "axios";

export const setLiquidityContractAddress = async (data: any, token: string) => {
  const response = await axios.post(`${process.env.BACKEND_URL}/contract/set-liquidity-contract-address`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getAccountClasshash = async (token: string) => {
  const response = await axios.get(`${process.env.BACKEND_URL}/contract/account_classhash`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const postAccountClasshash = async (data: any, token: string) => {
  const response = await axios.post(`${process.env.BACKEND_URL}/contract/account_classhash`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const upgradeAccountFactory = async (data: any, token: string) => {
  const response = await axios.post(`${process.env.BACKEND_URL}/contract/upgrade-account-factory`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const transferOwnership = async (data: any, token: string) => {
  const response = await axios.post(`${process.env.BACKEND_URL}/contract/transfer-ownership`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const setAccountClasshash = async (data: any, token: string) => {
  const response = await axios.post(`${process.env.BACKEND_URL}/contract/liquidity/set-account-classhash`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const registerUserToLiquidity = async (data: any, token: string) => {
  const response = await axios.post(`${process.env.BACKEND_URL}/contract/register-user-to-liquidity`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const isUserRegistered = async (data: any, token: string) => {
  const response = await axios.post(`${process.env.BACKEND_URL}/contract/is-user-registered`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const addSupportedToken = async (data: any, token: string) => {
  const response = await axios.post(`${process.env.BACKEND_URL}/contract/add-supported-token`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const transferLiquidityOwnership = async (data: any, token: string) => {
  const response = await axios.post(`${process.env.BACKEND_URL}/contract/transfer-liquidity-ownership`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const upgradeLiquidityContract = async (data: any, token: string) => {
  const response = await axios.post(`${process.env.BACKEND_URL}/contract/upgrade-liquidity-contract`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const upgradePragmaOracleAddress = async (data: any, token: string) => {
  const response = await axios.post(`${process.env.BACKEND_URL}/contract/upgrade-pragma-oracle-address`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
