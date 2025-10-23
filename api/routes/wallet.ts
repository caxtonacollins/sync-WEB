import api from "..";

export interface WalletSummaryResponse {
  totalBalanceNGN: number;
  totalBalanceUSD: number;
  syncTokenBalance: number;
  stakedSyncTokens: number;
  transactionFeeDiscount: number;
  activeLiquidityPools: number;
  dailySettlementCount: number;
}

export const getWalletSummary = async (token: string): Promise<WalletSummaryResponse> => {
  try {
    const response = await api.get('/wallet/summary', {
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching wallet summary:", error);
    throw error;
  }
};
