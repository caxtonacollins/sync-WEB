import { api } from "@/lib/api-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface AuditLog {
  id: string;
  userId?: string;
  action: string;
  entityType?: string;
  entityId?: string;
  metadata?: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export const AUDIT_LOGS_KEYS = {
  all: ["auditLogs"] as const,
  lists: () => [...AUDIT_LOGS_KEYS.all, "list"] as const,
  list: (filters: any) => [...AUDIT_LOGS_KEYS.lists(), filters] as const,
};

export const useAuditLogs = (filters?: any) => {
  return useQuery({
    queryKey: AUDIT_LOGS_KEYS.list(filters),
    queryFn: async () => {
      const { data } = await api.get<AuditLog[]>("/audit-logs", {
        params: filters,
      });
      return data;
    },
    staleTime: 30 * 1000, // 30 seconds - audit logs need to be fresh
  });
};
