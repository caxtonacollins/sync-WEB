import { api } from "@/lib/api-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface SystemSetting {
  id: string;
  key: string;
  value: any;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export const SYSTEM_SETTINGS_KEYS = {
  all: ["systemSettings"] as const,
  lists: () => [...SYSTEM_SETTINGS_KEYS.all, "list"] as const,
  list: (filters: any) => [...SYSTEM_SETTINGS_KEYS.lists(), filters] as const,
  details: () => [...SYSTEM_SETTINGS_KEYS.all, "detail"] as const,
  detail: (key: string) => [...SYSTEM_SETTINGS_KEYS.details(), key] as const,
};

export const useSystemSettings = (filters?: any) => {
  return useQuery({
    queryKey: SYSTEM_SETTINGS_KEYS.list(filters),
    queryFn: async () => {
      const { data } = await api.get<SystemSetting[]>("/system-settings", {
        params: filters,
      });
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - system settings change infrequently
  });
};

export const useSystemSetting = (key: string) => {
  return useQuery({
    queryKey: SYSTEM_SETTINGS_KEYS.detail(key),
    queryFn: async () => {
      const { data } = await api.get<SystemSetting>(`/system-settings/${key}`);
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateSystemSetting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      key,
      value,
      description,
    }: Partial<SystemSetting> & { key: string }) => {
      const { data } = await api.put<SystemSetting>(`/system-settings/${key}`, {
        value,
        description,
      });
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: SYSTEM_SETTINGS_KEYS.detail(data.key),
      });
      queryClient.invalidateQueries({ queryKey: SYSTEM_SETTINGS_KEYS.lists() });
    },
  });
};
