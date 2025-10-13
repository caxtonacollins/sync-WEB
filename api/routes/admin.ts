import api from "../index";

// Dashboard & Analytics
export const getAdminDashboardStats = async (token: string) => {
  const response = await api.get(`/admin/dashboard/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getSystemAnalytics = async (token: string, timeRange?: string) => {
  const response = await api.get(`/admin/analytics`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { timeRange },
  });
  return response.data;
};

// User Management
export const getAllUsers = async (token: string, params?: any) => {
  const response = await api.get(`/user`, {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });
  return response.data;
};

export const updateUserStatus = async (userId: string, status: string, token: string) => {
  const response = await api.patch(
    `/user/${userId}`,
    { status },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const updateUserRole = async (userId: string, role: string, token: string) => {
  const response = await api.patch(
    `/user/${userId}`,
    { role },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const verifyUserKYC = async (userId: string, status: string, notes: string, token: string) => {
  const response = await api.patch(
    `/user/${userId}/verify-kyc`,
    { status, notes },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// Transaction Management
export const getAllTransactions = async (token: string, params?: any) => {
  const response = await api.get(`/tx`, {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });
  return response.data;
};

export const updateTransactionStatus = async (txId: string, status: string, token: string) => {
  const response = await api.patch(
    `/tx/${txId}`,
    { status },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// Contract Management
export const setLiquidityContractAddress = async (data: any, token: string) => {
  const response = await api.post(`/contract/set-liquidity-contract-address`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getAccountClasshash = async (token: string) => {
  const response = await api.get(`/contract/account_classhash`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const postAccountClasshash = async (data: any, token: string) => {
  const response = await api.post(`/contract/account_classhash`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const upgradeAccountFactory = async (data: any, token: string) => {
  const response = await api.post(`/contract/upgrade-account-factory`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const transferOwnership = async (data: any, token: string) => {
  const response = await api.post(`/contract/transfer-ownership`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const setAccountClasshash = async (data: any, token: string) => {
  const response = await api.post(`/contract/liquidity/set-account-classhash`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const registerUserToLiquidity = async (data: any, token: string) => {
  const response = await api.post(`/contract/register-user-to-liquidity`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const isUserRegistered = async (data: any, token: string) => {
  const response = await api.post(`/contract/is-user-registered`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const addSupportedToken = async (data: any, token: string) => {
  const response = await api.post(`/contract/add-supported-token`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const transferLiquidityOwnership = async (data: any, token: string) => {
  const response = await api.post(`/contract/transfer-liquidity-ownership`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const upgradeLiquidityContract = async (data: any, token: string) => {
  const response = await api.post(`/contract/upgrade-liquidity-contract`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const upgradePragmaOracleAddress = async (data: any, token: string) => {
  const response = await api.post(`/contract/upgrade-pragma-oracle-address`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// System Settings
export const getSystemSettings = async (token: string) => {
  const response = await api.get(`/system-setting`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateSystemSetting = async (key: string, value: any, token: string) => {
  const response = await api.patch(
    `/system-setting/${key}`,
    { value },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};
