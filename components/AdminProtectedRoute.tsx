"use client"

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user?.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  if (isLoading || user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loading-spinner h-12 w-12"></div>
      </div>
    );
  }

  return <>{children}</>;
}
