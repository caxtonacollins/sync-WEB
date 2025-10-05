"use client";

import { useState, useEffect } from "react";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { ClockIcon, MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/24/outline";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils/formatters";

interface AuditLog {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  resource: string;
  ipAddress: string;
  userAgent: string;
  status: "success" | "failed";
  timestamp: string;
  metadata?: Record<string, any>;
}

const getActionBadge = (action: string) => {
  const actionMap: Record<string, string> = {
    create: "bg-green-900 text-green-400 border-green-700",
    update: "bg-blue-900 text-blue-400 border-blue-700",
    delete: "bg-red-900 text-red-400 border-red-700",
    login: "bg-purple-900 text-purple-400 border-purple-700",
    logout: "bg-gray-900 text-gray-400 border-gray-700",
  };
  return actionMap[action.toLowerCase()] || "bg-gray-900 text-gray-400 border-gray-700";
};

export default function AuditLogsPage() {
  const { token } = useAuth();
  const { addToast } = useToast();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAction, setFilterAction] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    loadAuditLogs();
  }, []);

  const loadAuditLogs = async () => {
    try {
      setLoading(true);
      
      // Mock data - replace with actual API call
      const mockLogs: AuditLog[] = [
        {
          id: "1",
          userId: "user-123",
          userEmail: "admin@syncpay.com",
          action: "login",
          resource: "auth",
          ipAddress: "192.168.1.1",
          userAgent: "Mozilla/5.0...",
          status: "success",
          timestamp: new Date().toISOString(),
        },
        {
          id: "2",
          userId: "user-456",
          userEmail: "user@example.com",
          action: "update",
          resource: "user_profile",
          ipAddress: "192.168.1.2",
          userAgent: "Mozilla/5.0...",
          status: "success",
          timestamp: new Date(Date.now() - 300000).toISOString(),
        },
        {
          id: "3",
          userId: "user-789",
          userEmail: "test@example.com",
          action: "create",
          resource: "transaction",
          ipAddress: "192.168.1.3",
          userAgent: "Mozilla/5.0...",
          status: "failed",
          timestamp: new Date(Date.now() - 600000).toISOString(),
        },
      ];
      
      setLogs(mockLogs);
    } catch (error) {
      addToast("Failed to load audit logs", "error");
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAction = filterAction === "all" || log.action === filterAction;
    const matchesStatus = filterStatus === "all" || log.status === filterStatus;

    return matchesSearch && matchesAction && matchesStatus;
  });

  if (loading) {
    return (
      <AdminProtectedRoute>
        <AdminLayout>
          <div className="flex items-center justify-center h-64">
            <div className="loading-spinner h-12 w-12"></div>
          </div>
        </AdminLayout>
      </AdminProtectedRoute>
    );
  }

  return (
    <AdminProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center">
                <ClockIcon className="h-8 w-8 mr-3 text-orange-400" />
                Audit Logs
              </h1>
              <p className="mt-2 text-gray-400">
                System activity and security audit trail
              </p>
            </div>
            <Badge className="bg-orange-900 text-orange-400 border border-orange-700">
              {filteredLogs.length} Logs
            </Badge>
          </div>

          {/* Filters & Search */}
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative md:col-span-2">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search logs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <select
                  value={filterAction}
                  onChange={(e) => setFilterAction(e.target.value)}
                  className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="all">All Actions</option>
                  <option value="login">Login</option>
                  <option value="logout">Logout</option>
                  <option value="create">Create</option>
                  <option value="update">Update</option>
                  <option value="delete">Delete</option>
                </select>

                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setFilterAction("all");
                    setFilterStatus("all");
                  }}
                  variant="outline"
                  className="border-gray-700 text-gray-300 hover:bg-gray-700"
                >
                  <FunnelIcon className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Logs Table */}
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-700 bg-gray-900">
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Timestamp
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Action
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Resource
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        IP Address
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {filteredLogs.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                          No audit logs found
                        </td>
                      </tr>
                    ) : (
                      filteredLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-gray-700 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {formatDateTime(log.timestamp)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-white">{log.userEmail}</div>
                            <div className="text-xs text-gray-500 font-mono">
                              {log.userId.substring(0, 8)}...
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className={getActionBadge(log.action)}>
                              {log.action}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {log.resource}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-mono">
                            {log.ipAddress}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge
                              className={
                                log.status === "success"
                                  ? "bg-green-900 text-green-400 border-green-700"
                                  : "bg-red-900 text-red-400 border-red-700"
                              }
                            >
                              {log.status}
                            </Badge>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </AdminProtectedRoute>
  );
}
