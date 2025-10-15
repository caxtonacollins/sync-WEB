import api from "..";

export interface WalletSummaryResponse {
  fiatBalanceNGN: number;
  cryptoValueUSD: number;
  syncTokenBalance: number;
  stakedSyncTokens: number;
  totalPortfolioValueNGN: number;
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
