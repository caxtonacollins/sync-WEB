'use client';

import React, { useEffect, useState } from 'react';
import { CryptoAsset } from '@/data/types';
import { cryptoAssets } from '@/data/cryptoAssets';
import { MoreHorizontal, TrendingDown } from 'lucide-react';
import Link from 'next/link';

const CryptoWallet = () => {
  const [assets, setAssets] = useState<CryptoAsset[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const ownedAssets = cryptoAssets.filter(asset => asset.balance && asset.balance > 0);
      setAssets(ownedAssets);
      const total = ownedAssets.reduce((sum, asset) => sum + (asset.value || 0), 0);
      setTotalValue(total);
    } catch (error) {
      console.error('Error loading crypto assets:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg animate-pulse">
        <div className="h-8 bg-gray-700 rounded w-1/3"></div>
        <div className="mt-4 space-y-2">
          <div className="h-12 bg-gray-700 rounded"></div>
          <div className="h-12 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1a1f2b] p-6 rounded-2xl text-white font-sans">
      {/* Tokens Section */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-300">
          Tokens
          <span className="ml-2 text-white font-bold">
            ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </h2>
        <button className="text-gray-400 hover:text-white">
          <MoreHorizontal size={20} />
        </button>
      </div>

      <div className="space-y-3 mb-6">
        {assets.map((asset) => (
          <div key={asset.id} className="flex items-center justify-between p-3 bg-[#2d3344] rounded-lg">
            <div className="flex items-center">
              <img src={asset.image} alt={asset.name} className="h-10 w-10 rounded-full mr-3" />
              <div>
                <p className="font-bold text-md">{asset.symbol}</p>
                <div className="flex items-center text-xs text-gray-400">
                  <span>${asset.price.toLocaleString()}</span>
                  <span className={`ml-2 flex items-center ${asset.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {asset.change24h.toFixed(2)}%
                    <TrendingDown size={14} className="ml-1" />
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-md">{asset.balance?.toLocaleString()}</p>
              <p className="text-xs text-gray-400">
                ${asset.value?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* DeFi Section */}
      <div>
        <h2 className="text-lg font-semibold text-gray-300 mb-4">DeFi</h2>
        <div className="text-center bg-[#2d3344] p-8 rounded-lg">
          <div className="flex justify-center items-center mb-4">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            </div>
          </div>
          <p className="text-gray-400 mb-4">To begin investing, please make your first deposit.</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center mx-auto">
            {assets.length > 0 && <img src={assets[0].image} alt="" className="h-5 w-5 rounded-full mr-2" />}
            Deposit
          </button>
        </div>
      </div>
    </div>
  );
};

export default CryptoWallet;

