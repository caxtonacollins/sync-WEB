import { api } from "@/lib/api-client";
import { useMutation, useQuery } from "@tanstack/react-query";

export const CONTRACT_KEYS = {
  all: ["contract"] as const,
  dashboard: (userAddress: string) =>
    [...CONTRACT_KEYS.all, "dashboard", userAddress] as const,
  balance: (userAddress: string, symbol: string) =>
    [...CONTRACT_KEYS.all, "balance", userAddress, symbol] as const,
  amountInUsd: (params: any) =>
    [...CONTRACT_KEYS.all, "amountInUsd", params] as const,
  eventListener: ["eventListener"] as const,
};

export const useContractDashboard = (userAddress: string) => {
  return useQuery({
    queryKey: CONTRACT_KEYS.dashboard(userAddress),
    queryFn: async () => {
      const { data } = await api.get(`/contract/dashboard/${userAddress}`);
      return data;
    },
    staleTime: 30 * 1000,
  });
};

export const useContractBalance = (userAddress: string, symbol: string) => {
  return useQuery({
    queryKey: CONTRACT_KEYS.balance(userAddress, symbol),
    queryFn: async () => {
      const { data } = await api.get(
        `/contract/balance/${userAddress}/${symbol}`
      );
      return data;
    },
    staleTime: 30 * 1000,
  });
};

export const useAmountInUsd = (params: { amount: number; symbol: string }) => {
  return useQuery({
    queryKey: CONTRACT_KEYS.amountInUsd(params),
    queryFn: async () => {
      const { data } = await api.get("/contract/amount_in_usd", { params });
      return data;
    },
    staleTime: 30 * 1000,
  });
};

export const useTransferOwnership = () => {
  return useMutation({
    mutationFn: async (newOwnerAddress: string) => {
      const { data } = await api.post("/contract/transfer-ownership", {
        newOwnerAddress,
      });
      return data;
    },
  });
};

export const useUpgradePragmaOracle = () => {
  return useMutation({
    mutationFn: async (newOracleAddress: string) => {
      const { data } = await api.post(
        "/contract/upgrade-pragma-oracle-address",
        {
          newOracleAddress,
        }
      );
      return data;
    },
  });
};
