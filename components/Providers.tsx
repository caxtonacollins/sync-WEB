"use client";

import { TransferProvider } from "@/contexts/TransferContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <TransferProvider>{children}</TransferProvider>;
}
