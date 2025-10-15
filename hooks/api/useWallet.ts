import { api } from "@/lib/api-client";
import { CryptoWallet, WalletStats, WalletSummary } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const WALLET_KEYS = {
  all: ["wallets"] as const,
  lists: () => [...WALLET_KEYS.all, "list"] as const,
  list: (filters: any) => [...WALLET_KEYS.lists(), filters] as const,
  details: () => [...WALLET_KEYS.all, "detail"] as const,
  detail: (id: string) => [...WALLET_KEYS.details(), id] as const,
  summary: () => [...WALLET_KEYS.all, "summary"] as const,
};

export const useWalletSummary = () => {
  return useQuery({
    queryKey: WALLET_KEYS.summary(),
    queryFn: async () => {
      const { data } = await api.get<WalletSummary>("/wallet/summary");
      return data;
    },
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Stats endpoint for admin panel
export const useWalletStats = () => {
  return useQuery({
    queryKey: [...WALLET_KEYS.all, "stats"],
    queryFn: async () => {
      const { data } = await api.get<WalletStats>("/admin/wallets/stats");
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - stats change less frequently
  });
};

export const useCryptoWallets = (filters?: any) => {
  return useQuery({
    queryKey: WALLET_KEYS.list(filters),
    queryFn: async () => {
      const { data } = await api.get<CryptoWallet[]>("/crypto-wallets", {
        params: filters,
      });
      return data;
    },
    staleTime: 30 * 1000,
  });
};

export const useCryptoWallet = (id: string) => {
  return useQuery({
    queryKey: WALLET_KEYS.detail(id),
    queryFn: async () => {
      const { data } = await api.get<CryptoWallet>(`/crypto-wallets/${id}`);
      return data;
    },
    staleTime: 30 * 1000,
  });
};

export const useCreateCryptoWallet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newWallet: Partial<CryptoWallet>) => {
      const { data } = await api.post<CryptoWallet>(
        "/crypto-wallets",
        newWallet
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WALLET_KEYS.lists() });
    },
  });
};

export const useUpdateCryptoWallet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...data
    }: Partial<CryptoWallet> & { id: string }) => {
      const { data: responseData } = await api.put<CryptoWallet>(
        `/crypto-wallets/${id}`,
        data
      );
      return responseData;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: WALLET_KEYS.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: WALLET_KEYS.lists() });
      // Also invalidate summary as wallet updates might affect it
      queryClient.invalidateQueries({ queryKey: WALLET_KEYS.summary() });
    },
  });
};
