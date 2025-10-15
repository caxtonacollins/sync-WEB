import { api } from "@/lib/api-client";
import { FiatAccount } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const FIAT_ACCOUNTS_KEYS = {
  all: ["fiatAccounts"] as const,
  lists: () => [...FIAT_ACCOUNTS_KEYS.all, "list"] as const,
  list: (filters: any) => [...FIAT_ACCOUNTS_KEYS.lists(), filters] as const,
  details: () => [...FIAT_ACCOUNTS_KEYS.all, "detail"] as const,
  detail: (id: string) => [...FIAT_ACCOUNTS_KEYS.details(), id] as const,
};

export const useFiatAccounts = (filters?: any) => {
  return useQuery({
    queryKey: FIAT_ACCOUNTS_KEYS.list(filters),
    queryFn: async () => {
      const { data } = await api.get<FiatAccount[]>("/fiat-accounts", {
        params: filters,
      });
      return data;
    },
    staleTime: 30 * 1000, // 30 seconds - accounts can change frequently
  });
};

export const useFiatAccount = (id: string) => {
  return useQuery({
    queryKey: FIAT_ACCOUNTS_KEYS.detail(id),
    queryFn: async () => {
      const { data } = await api.get<FiatAccount>(`/fiat-accounts/${id}`);
      return data;
    },
    staleTime: 30 * 1000,
  });
};

export const useCreateFiatAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newAccount: Partial<FiatAccount>) => {
      const { data } = await api.post<FiatAccount>(
        "/fiat-accounts",
        newAccount
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FIAT_ACCOUNTS_KEYS.lists() });
    },
  });
};

export const useUpdateFiatAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...data
    }: Partial<FiatAccount> & { id: string }) => {
      const response = await api.put<FiatAccount>(`/fiat-accounts/${id}`, data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: FIAT_ACCOUNTS_KEYS.detail(data.id),
      });
      queryClient.invalidateQueries({ queryKey: FIAT_ACCOUNTS_KEYS.lists() });
    },
  });
};
