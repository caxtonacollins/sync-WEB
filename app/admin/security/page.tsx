"use client";

import { useState } from "react";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";
import { useToast } from "@/contexts/ToastContext";
import { ShieldCheckIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function SecurityPage() {
  const { addToast } = useToast();
  const [securitySettings, setSecuritySettings] = useState({
    enforceStrongPasswords: true,
    enableTwoFactor: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    lockoutDuration: 15,
    enableIPWhitelist: false,
    allowedIPs: "",
  });

  const handleSaveSettings = () => {
    addToast("Security settings updated successfully", "success");
  };

  const securityThreats = [
    {
      id: 1,
      type: "Multiple Failed Login Attempts",
      user: "user@example.com",
      severity: "high",
      timestamp: new Date().toISOString(),
    },
    {
      id: 2,
      type: "Unusual IP Address",
      user: "admin@example.com",
      severity: "medium",
      timestamp: new Date(Date.now() - 300000).toISOString(),
    },
  ];

  return (
    <AdminProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center">
                <ShieldCheckIcon className="h-8 w-8 mr-3 text-green-400" />
                Security Settings
              </h1>
              <p className="mt-2 text-gray-400">
                Manage system security and access controls
              </p>
            </div>
            <Badge className="bg-green-900 text-green-400 border border-green-700">
              Secure
            </Badge>
          </div>

          {/* Security Threats */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <ExclamationTriangleIcon className="h-5 w-5 mr-2 text-yellow-400" />
                Recent Security Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {securityThreats.map((threat) => (
                  <div
                    key={threat.id}
                    className="flex items-center justify-between p-3 bg-gray-900 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="text-sm font-medium text-white">
                        {threat.type}
                      </div>
                      <div className="text-xs text-gray-400">
                        {threat.user} · {new Date(threat.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <Badge
                      className={
                        threat.severity === "high"
                          ? "bg-red-900 text-red-400 border-red-700"
                          : "bg-yellow-900 text-yellow-400 border-yellow-700"
                      }
                    >
                      {threat.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Authentication Settings */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Authentication Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-white">
                    Enforce Strong Passwords
                  </div>
                  <div className="text-xs text-gray-400">
                    Require minimum 8 characters with special chars
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={securitySettings.enforceStrongPasswords}
                    onChange={(e) =>
                      setSecuritySettings({
                        ...securitySettings,
                        enforceStrongPasswords: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-white">
                    Enable Two-Factor Authentication
                  </div>
                  <div className="text-xs text-gray-400">
                    Require 2FA for all admin accounts
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={securitySettings.enableTwoFactor}
                    onChange={(e) =>
                      setSecuritySettings({
                        ...securitySettings,
                        enableTwoFactor: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Session Settings */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Session & Access Control</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Session Timeout (minutes)
                </label>
                <input
                  type="number"
                  value={securitySettings.sessionTimeout}
                  onChange={(e) =>
                    setSecuritySettings({
                      ...securitySettings,
                      sessionTimeout: Number(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Maximum Login Attempts
                </label>
                <input
                  type="number"
                  value={securitySettings.maxLoginAttempts}
                  onChange={(e) =>
                    setSecuritySettings({
                      ...securitySettings,
                      maxLoginAttempts: Number(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Account Lockout Duration (minutes)
                </label>
                <input
                  type="number"
                  value={securitySettings.lockoutDuration}
                  onChange={(e) =>
                    setSecuritySettings({
                      ...securitySettings,
                      lockoutDuration: Number(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleSaveSettings}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <ShieldCheckIcon className="h-4 w-4 mr-2" />
              Save Security Settings
            </Button>
          </div>
        </div>
      </AdminLayout>
    </AdminProtectedRoute>
  );
}
