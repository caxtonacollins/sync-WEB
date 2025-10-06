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

// Admin Contract Management APIs
export const upgradeAccountFactory = async (data: { classHash: string }, token: string) => {
  const response = await axios.post(
    `${process.env.BACKEND_URL}/contract/upgrade-account-factory`,
    data,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const transferFactoryOwnership = async (data: { newOwnerAddress: string }, token: string) => {
  const response = await axios.post(
    `${process.env.BACKEND_URL}/contract/transfer-ownership`,
    data,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const setAccountClassHash = async (data: { classHash: string }, token: string) => {
  const response = await axios.post(
    `${process.env.BACKEND_URL}/contract/account_classhash`,
    data,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const getAccountClassHash = async (token: string) => {
  const response = await axios.get(
    `${process.env.BACKEND_URL}/contract/account_classhash`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const addSupportedToken = async (data: { symbol: string; address: string }, token: string) => {
  const response = await axios.post(
    `${process.env.BACKEND_URL}/contract/add-supported-token`,
    data,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const upgradeLiquidityContract = async (data: { classHash: string }, token: string) => {
  const response = await axios.post(
    `${process.env.BACKEND_URL}/contract/upgrade-liquidity-contract`,
    data,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const transferLiquidityOwnership = async (data: { newOwnerAddress: string }, token: string) => {
  const response = await axios.post(
    `${process.env.BACKEND_URL}/contract/transfer-liquidity-ownership`,
    data,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const updatePragmaOracleAddress = async (data: { contractAddress: string }, token: string) => {
  const response = await axios.post(
    `${process.env.BACKEND_URL}/contract/upgrade-pragma-oracle-address`,
    data,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

// Event Listener APIs
export const getEventListenerStatus = async (token: string) => {
  const response = await axios.get(
    `${process.env.BACKEND_URL}/contract/event-listener/status`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const getActiveSubscriptions = async (token: string) => {
  const response = await axios.get(
    `${process.env.BACKEND_URL}/contract/event-listener/subscriptions`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const subscribeToTransaction = async (transactionHash: string, token: string) => {
  const response = await axios.post(
    `${process.env.BACKEND_URL}/contract/event-listener/subscribe-transaction/${transactionHash}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const unsubscribeFromEvent = async (subscriptionId: string, token: string) => {
  const response = await axios.post(
    `${process.env.BACKEND_URL}/contract/event-listener/unsubscribe/${subscriptionId}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const unsubscribeFromAllEvents = async (token: string) => {
  const response = await axios.post(
    `${process.env.BACKEND_URL}/contract/event-listener/unsubscribe-all`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};