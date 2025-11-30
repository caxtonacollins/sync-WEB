"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface WalletVisibilityContextType {
  showBalance: boolean;
  toggleBalance: () => void;
}

const WalletVisibilityContext = createContext<
  WalletVisibilityContextType | undefined
>(undefined);

export function WalletVisibilityProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showBalance, setShowBalance] = useLocalStorage(
    "walletShowBalance",
    true
  );

  const toggleBalance = () => {
    setShowBalance(!showBalance);
  };

  return (
    <WalletVisibilityContext.Provider value={{ showBalance, toggleBalance }}>
      {children}
    </WalletVisibilityContext.Provider>
  );
}

export function useWalletVisibility() {
  const context = useContext(WalletVisibilityContext);
  if (!context) {
    throw new Error(
      "useWalletVisibility must be used within WalletVisibilityProvider"
    );
  }
  return context;
}
