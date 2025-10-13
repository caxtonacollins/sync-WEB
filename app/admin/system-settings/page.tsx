"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";
import { CogIcon } from "@heroicons/react/24/outline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getSystemSettings, updateSystemSetting } from "@/api/routes/admin";
import { Input } from "@/components/ui/input";

export default function SystemSettingsPage() {
  const { token } = useAuth();
  const { addToast } = useToast();
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchSettings();
    }
  }, [token]);

  const fetchSettings = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const response = await getSystemSettings(token);
      setSettings(response);
    } catch (error) {
      addToast("Failed to fetch system settings", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSetting = async (key: string, value: any) => {
    if (!token) return;
    try {
      await updateSystemSetting(key, value, token);
      addToast("Setting updated successfully", "success");
      fetchSettings();
    } catch (error) {
      addToast("Failed to update setting", "error");
    }
  };

  return (
    <AdminProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center">
                <CogIcon className="h-8 w-8 mr-3 text-gray-400" />
                System Settings
              </h1>
              <p className="mt-2 text-gray-400">Manage system-wide settings</p>
            </div>
          </div>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <div className="space-y-4">
                  {settings.map((setting) => (
                    <div key={setting.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-semibold">{setting.key}</p>
                        <p className="text-gray-400 text-sm">{setting.description}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Input
                          defaultValue={JSON.stringify(setting.value)}
                          onBlur={(e) => handleUpdateSetting(setting.key, JSON.parse(e.target.value))}
                          className="bg-gray-900 border-gray-700 text-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </AdminProtectedRoute>
  );
}
