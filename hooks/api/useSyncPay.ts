import { api } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";

export interface SyncPayStats {
  balance: number;
  stakedAmount: number;
  stakingRewards: number;
  totalEarned: number;
  feeDiscount: number;
  tier: string;
}

export const SYNCPAY_KEYS = {
  all: ["syncpay"] as const,
  stats: () => [...SYNCPAY_KEYS.all, "stats"] as const,
  balance: (address: string) =>
    [...SYNCPAY_KEYS.all, "balance", address] as const,
  rewards: (address: string) =>
    [...SYNCPAY_KEYS.all, "rewards", address] as const,
};

export const useSyncPayStats = () => {
  return useQuery({
    queryKey: SYNCPAY_KEYS.stats(),
    queryFn: async () => {
      const { data } = await api.get<SyncPayStats>("/syncpay/stats");
      return data;
    },
    staleTime: 60 * 1000, // 1 minute
  });
};
