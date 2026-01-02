import { api } from '@/lib/api-client';

export async function initiateSell(payload: any, token: string) {
  try {
    const result = await api.post(`/sell/initiate`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return { success: true, data: result.data };
  } catch (error: any) {
    console.error('Sell initiation error:', error);
    return { success: false, message: error.message || 'Failed to initiate sell' };
  }
}
