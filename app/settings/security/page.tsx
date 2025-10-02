"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import { SecuritySettings } from "@/components/auth/SecuritySettings";

export default function SecuritySettingsPage() {
  const { addToast } = useToast();

  const handleSecurityUpdate = (settings: any) => {
    addToast("Security settings updated successfully", "success");
  };

  const handleError = (error: Error) => {
    addToast(error.message || "An error occurred", "error");
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Security Settings</h1>
            <p className="text-gray-400">
              Manage your account security and authentication methods
            </p>
          </div>

          <SecuritySettings onUpdate={handleSecurityUpdate} onError={handleError} />
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
