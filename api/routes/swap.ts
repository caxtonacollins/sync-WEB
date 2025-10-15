import api from "../index";

interface SwapExecuteParams {
  fromToken: string;
  toToken: string;
  amount: string;
  direction: "token-fiat" | "fiat-token";
  estimatedOutput: number;
}

export const executeSwap = async (params: SwapExecuteParams, token: string) => {
  const response = await api.post("/swap/execute", params, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
