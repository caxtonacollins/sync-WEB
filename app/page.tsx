"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { WalletCard } from "@/components/ui/WalletCard";

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [showBalance, setShowBalance] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Demo wallet card for authenticated users
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <WalletCard
        currency="United States Dollar"
        balance={0.11}
        showBalance={showBalance}
        onToggleBalance={() => setShowBalance((prev) => !prev)}
      />
    </div>
  );
}
