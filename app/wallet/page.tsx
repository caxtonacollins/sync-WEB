'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import UnifiedWallet from '@/components/UnifiedWallet';

export default function WalletPage() {
  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Wallet</h1>
          </div>
          <UnifiedWallet />
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
