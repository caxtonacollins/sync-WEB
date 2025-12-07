"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import HybridPaymentDashboard from '@/components/HybridPaymentDashboard';

export default function DashboardOverviewPage() {

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-8">
       

          {/* Hybrid Payment System Overview */}
          <HybridPaymentDashboard />

        </div>
      </Layout>
    </ProtectedRoute>
  );
}


