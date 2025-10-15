import { api } from "@/lib/api-client";
import { queryClient } from "@/lib/query-client";
import { useMutation, useQuery } from "@tanstack/react-query";

export interface ContractInfo {
  address: string;
  type: string;
  status: "active" | "inactive";
  owner: string;
  classHash?: string;
}

export interface EventListenerStatus {
  isConnected: boolean;
  activeSubscriptions: number;
  subscriptionIds: string[];
}

const ADMIN_CONTRACT_KEYS = {
  all: ["admin", "contracts"] as const,
  contracts: () => [...ADMIN_CONTRACT_KEYS.all, "list"] as const,
  eventListener: () => [...ADMIN_CONTRACT_KEYS.all, "eventListener"] as const,
};

export const useAdminContracts = () => {
  return useQuery({
    queryKey: ADMIN_CONTRACT_KEYS.contracts(),
    queryFn: async () => {
      const { data } = await api.get<ContractInfo[]>("/admin/contracts");
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - contracts change infrequently
  });
};

export function useUpgradeAccountFactory() {
  return useMutation({
    mutationFn: async (classHash: string) => {
      await api.post("/contract/upgrade-account-factory", { classHash });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_CONTRACT_KEYS.contracts(),
      });
    },
  });
}

export function useTransferFactoryOwnership() {
  return useMutation({
    mutationFn: async (newOwnerAddress: string) => {
      await api.post("/contract/transfer-ownership", { newOwnerAddress });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_CONTRACT_KEYS.contracts(),
      });
    },
  });
}

export function useAddSupportedToken() {
  return useMutation({
    mutationFn: async (params: { symbol: string; address: string }) => {
      await api.post("/contract/add-supported-token", params);
    },
  });
}

export function useUpgradeLiquidityContract() {
  return useMutation({
    mutationFn: async (classHash: string) => {
      await api.post("/contract/upgrade-liquidity-contract", { classHash });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_CONTRACT_KEYS.contracts(),
      });
    },
  });
}

export function useUpdateOracleAddress() {
  return useMutation({
    mutationFn: async (oracleAddress: string) => {
      await api.post("/contract/update-oracle", { oracleAddress });
    },
  });
}

export function useUnsubscribeAllEvents() {
  return useMutation({
    mutationFn: async () => {
      await api.post("/contract/event-listener/unsubscribe-all");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_CONTRACT_KEYS.eventListener(),
      });
    },
  });
}
