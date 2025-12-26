import { useQuery } from "@tanstack/react-query";
import WalletAPI from "@/api/routes/crypto-accounts";
import { useAuth } from "@/contexts/AuthContext";

export function useWalletBalances() {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["walletBalances"],
    queryFn: async () => {
      const data = await WalletAPI.getBalance(token!);
      if (!data || !data.cryptoBalances) {
        throw new Error("Invalid wallet data received");
      }
      return data;
    },
    refetchInterval: 15000, // Refetch every 15 seconds
    enabled: !!token,
  });
}
