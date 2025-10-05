import axios from "axios";

// Dashboard & Analytics
export const getAdminDashboardStats = async (token: string) => {
  const response = await axios.get(`${process.env.BACKEND_URL}/admin/dashboard/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getSystemAnalytics = async (token: string, timeRange?: string) => {
  const response = await axios.get(`${process.env.BACKEND_URL}/admin/analytics`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { timeRange },
  });
  return response.data;
};

// User Management
export const getAllUsers = async (token: string, params?: any) => {
  const response = await axios.get(`${process.env.BACKEND_URL}/user`, {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });
  return response.data;
};

export const updateUserStatus = async (userId: string, status: string, token: string) => {
  const response = await axios.patch(
    `${process.env.BACKEND_URL}/user/${userId}`,
    { status },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const updateUserRole = async (userId: string, role: string, token: string) => {
  const response = await axios.patch(
    `${process.env.BACKEND_URL}/user/${userId}`,
    { role },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const verifyUserKYC = async (userId: string, status: string, notes: string, token: string) => {
  const response = await axios.patch(
    `${process.env.BACKEND_URL}/user/${userId}/verify-kyc`,
    { status, notes },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// Transaction Management
export const getAllTransactions = async (token: string, params?: any) => {
  const response = await axios.get(`${process.env.BACKEND_URL}/tx`, {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });
  return response.data;
};

export const updateTransactionStatus = async (txId: string, status: string, token: string) => {
  const response = await axios.patch(
    `${process.env.BACKEND_URL}/tx/${txId}`,
    { status },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// Contract Management
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
