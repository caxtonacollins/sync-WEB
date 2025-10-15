import { api } from "@/lib/api-client";
import { User } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const USER_KEYS = {
  all: ["users"] as const,
  lists: () => [...USER_KEYS.all, "list"] as const,
  list: (filters: any) => [...USER_KEYS.lists(), filters] as const,
  details: () => [...USER_KEYS.all, "detail"] as const,
  detail: (id: string) => [...USER_KEYS.details(), id] as const,
  me: () => [...USER_KEYS.all, "me"] as const,
};

export const useUsers = (filters?: any) => {
  return useQuery({
    queryKey: USER_KEYS.list(filters),
    queryFn: async () => {
      const { data } = await api.get<User[]>("/users", { params: filters });
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - user list changes less frequently
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: USER_KEYS.detail(id),
    queryFn: async () => {
      const { data } = await api.get<User>(`/users/${id}`);
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: USER_KEYS.me(),
    queryFn: async () => {
      const { data } = await api.get<User>("/users/me");
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<User> & { id: string }) => {
      const response = await api.put<User>(`/users/${id}`, data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: USER_KEYS.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: USER_KEYS.lists() });
    },
  });
};
