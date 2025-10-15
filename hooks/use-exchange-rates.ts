import { useQuery } from "@tanstack/react-query";
import api from "@/api/index";
import { useAuth } from "@/contexts/AuthContext";

interface ExchangeRate {
  fiatSymbol: string;
  tokenSymbol: string;
  rate: number;
  lastUpdated: string;
}

export function useExchangeRates() {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["exchangeRates"],
    queryFn: async () => {
      const response = await api.get("/exchange-rate", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data as ExchangeRate[];
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    enabled: !!token,
  });
}

export function useTokenUsdRate(tokenSymbol: string) {
  const { data: rates } = useExchangeRates();

  if (!rates) return null;

  const rate = rates.find(
    (r) => r.tokenSymbol === tokenSymbol && r.fiatSymbol === "USD"
  );

  return rate?.rate || null;
}

export function useFiatRate(from: string, to: string) {
  const { data: rates } = useExchangeRates();

  if (!rates) return null;

  const rate = rates.find((r) => r.fiatSymbol === to && r.tokenSymbol === from);

  return rate?.rate || null;
}
