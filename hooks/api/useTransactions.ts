import { api } from "@/lib/api-client";
import { Transaction } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const TRANSACTIONS_KEYS = {
  all: ["transactions"] as const,
  lists: () => [...TRANSACTIONS_KEYS.all, "list"] as const,
  list: (filters: any) => [...TRANSACTIONS_KEYS.lists(), filters] as const,
  details: () => [...TRANSACTIONS_KEYS.all, "detail"] as const,
  detail: (id: string) => [...TRANSACTIONS_KEYS.details(), id] as const,
};

export const useTransactions = (filters?: any) => {
  return useQuery({
    queryKey: TRANSACTIONS_KEYS.list(filters),
    queryFn: async () => {
      const { data } = await api.get<Transaction[]>("/transactions", {
        params: filters,
      });
      return data;
    },
    staleTime: 30 * 1000, // 30 seconds - transactions need to be fresh
  });
};

export const useTransaction = (id: string) => {
  return useQuery({
    queryKey: TRANSACTIONS_KEYS.detail(id),
    queryFn: async () => {
      const { data } = await api.get<Transaction>(`/transactions/${id}`);
      return data;
    },
    staleTime: 30 * 1000,
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newTransaction: Partial<Transaction>) => {
      const { data } = await api.post<Transaction>(
        "/transactions",
        newTransaction
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_KEYS.lists() });
    },
  });
};
