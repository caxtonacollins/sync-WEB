// pages/api/buy/initiate.ts
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { api } from '@/lib/api-client';

export async function initiateBuy(payload: any, token: string) {
    try {
        const result = await api.post(`/buy/initiate`, payload, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return { success: true, data: result.data.data };
    } catch (error: any) {
        console.error('Buy initiation error:', error);
        return { success: false, message: error.message || 'Failed to initiate buy' };
    }
}

export async function verifyBuy(payload: any, token: string) {
    try {
        const result = await api.post(`/flutterwave/verify`, payload, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return { success: true, data: result.data };
    } catch (error: any) {
        console.error('Buy verification error:', error);
        return { success: false, message: error.message || 'Failed to verify buy' };
    }
}

export async function webhookHandler(payload: any) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return { success: false, message: 'Unauthorized' };
        }

        // Read the raw body
        const rawBody = await new Promise<Buffer>((resolve) => {
            const chunks: Buffer[] = [];
            payload.on('data', (chunk: any) => chunks.push(chunk));
            payload.on('end', () => resolve(Buffer.concat(chunks)));
        });

        const data = JSON.parse(rawBody.toString());

        await api.post(`/webhook/flutterwave`, data, {
            headers: { Authorization: `Bearer ${session.accessToken}` },
        });

        return { success: true };
    } catch (error: any) {
        console.error('Webhook error:', error);
        return { success: false, message: error.message || 'Webhook handler failed' };
    }
}