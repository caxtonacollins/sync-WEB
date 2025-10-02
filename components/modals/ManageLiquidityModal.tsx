'use client';

import React, { useState } from 'react';
import { XMarkIcon, ArrowPathIcon, PlusIcon, MinusIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/contexts/ToastContext';

interface ManageLiquidityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ManageLiquidityModal: React.FC<ManageLiquidityModalProps> = ({ isOpen, onClose }) => {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'add' | 'remove'>('add');
  const [selectedPool, setSelectedPool] = useState('USDC-NGN');
  const [amount1, setAmount1] = useState('');
  const [amount2, setAmount2] = useState('');
  const [step, setStep] = useState<'input' | 'confirm' | 'processing' | 'success'>('input');

  const liquidityPools = [
    { 
      id: 'USDC-NGN', 
      name: 'USDC/NGN', 
      token1: 'USDC', 
      token2: 'NGN',
      apy: '12.5%', 
      tvl: '$2.4M', 
      yourLiquidity: '$450',
      yourShare: '0.018%'
    },
    { 
      id: 'STRK-USDC', 
      name: 'STRK/USDC', 
      token1: 'STRK', 
      token2: 'USDC',
      apy: '18.2%', 
      tvl: '$1.8M', 
      yourLiquidity: '$0',
      yourShare: '0%'
    },
    { 
      id: 'ETH-USDC', 
      name: 'ETH/USDC', 
      token1: 'ETH', 
      token2: 'USDC',
      apy: '8.7%', 
      tvl: '$5.2M', 
      yourLiquidity: '$0',
      yourShare: '0%'
    },
  ];

  const selectedPoolData = liquidityPools.find(p => p.id === selectedPool);

  const handleManage = () => {
    if (!amount1 || parseFloat(amount1) <= 0) {
      addToast('Please enter a valid amount', 'error');
      return;
    }
    setStep('confirm');
  };

  const confirmManage = async () => {
    setStep('processing');
    
    // Simulate blockchain transaction
    setTimeout(() => {
      setStep('success');
      addToast(`Liquidity ${activeTab === 'add' ? 'added' : 'removed'} successfully!`, 'success');
    }, 3000);
  };

  const handleClose = () => {
    setStep('input');
    setAmount1('');
    setAmount2('');
    onClose();
  };

  // Auto-calculate second token amount based on pool ratio (simplified)
  const handleAmount1Change = (value: string) => {
    setAmount1(value);
    if (value && parseFloat(value) > 0) {
      // Simplified calculation - in real app, fetch actual pool ratio
      const ratio = selectedPool === 'USDC-NGN' ? 1500 : 1;
      setAmount2((parseFloat(value) * ratio).toFixed(2));
    } else {
      setAmount2('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <Card className="bg-gray-900 border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <ArrowPathIcon className="h-6 w-6 text-blue-400 mr-2" />
              <h2 className="text-2xl font-bold text-white">Manage Liquidity</h2>
            </div>
            <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-2 mb-6 bg-gray-800 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('add')}
              className={`flex-1 py-2 px-4 rounded-md transition-all ${
                activeTab === 'add'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <PlusIcon className="h-5 w-5 inline mr-2" />
              Add Liquidity
            </button>
            <button
              onClick={() => setActiveTab('remove')}
              className={`flex-1 py-2 px-4 rounded-md transition-all ${
                activeTab === 'remove'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <MinusIcon className="h-5 w-5 inline mr-2" />
              Remove Liquidity
            </button>
          </div>

          {/* Input Form */}
          {step === 'input' && (
            <div className="space-y-6">
              {/* Pool Selection */}
              <div>
                <label className="text-sm font-medium text-gray-400 mb-2 block">
                  Select Pool
                </label>
                <div className="space-y-2">
                  {liquidityPools.map((pool) => (
                    <div
                      key={pool.id}
                      onClick={() => setSelectedPool(pool.id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedPool === pool.id
                          ? 'border-blue-500 bg-blue-900/20'
                          : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-semibold text-white mb-1">{pool.name}</p>
                          <div className="flex space-x-4 text-sm">
                            <span className="text-gray-400">TVL: {pool.tvl}</span>
                            <span className="text-gray-400">Your Liquidity: {pool.yourLiquidity}</span>
                          </div>
                        </div>
                        <Badge className="bg-green-900 text-green-400">
                          APY: {pool.apy}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Amount Inputs */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-400 mb-2 block">
                    {selectedPoolData?.token1} Amount
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="0.00"
                      value={amount1}
                      onChange={(e) => handleAmount1Change(e.target.value)}
                      className="w-full p-4 pr-20 bg-gray-800 border border-gray-700 rounded-lg text-white text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">
                      {selectedPoolData?.token1}
                    </div>
                  </div>
                  <div className="flex justify-between mt-2 text-sm">
                    <span className="text-gray-400">Available: 450.00</span>
                    <button
                      onClick={() => handleAmount1Change('450')}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      Max
                    </button>
                  </div>
                </div>

                <div className="flex justify-center">
                  <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                    <PlusIcon className="h-5 w-5 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-400 mb-2 block">
                    {selectedPoolData?.token2} Amount
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="0.00"
                      value={amount2}
                      readOnly
                      className="w-full p-4 pr-20 bg-gray-800 border border-gray-700 rounded-lg text-white text-lg"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">
                      {selectedPoolData?.token2}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Amount calculated based on current pool ratio
                  </p>
                </div>
              </div>

              {/* Pool Info */}
              {amount1 && parseFloat(amount1) > 0 && (
                <div className="bg-gray-800 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Pool Share:</span>
                    <span className="text-white">~0.025%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">LP Tokens:</span>
                    <span className="text-white">~{(parseFloat(amount1) * 0.99).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Network Fee:</span>
                    <span className="text-white">~$0.50</span>
                  </div>
                </div>
              )}

              <Button
                onClick={handleManage}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg"
              >
                {activeTab === 'add' ? 'Add Liquidity' : 'Remove Liquidity'}
              </Button>
            </div>
          )}

          {/* Confirm Transaction */}
          {step === 'confirm' && (
            <div className="space-y-6">
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  {activeTab === 'add' ? (
                    <PlusIcon className="h-8 w-8 text-blue-400" />
                  ) : (
                    <MinusIcon className="h-8 w-8 text-blue-400" />
                  )}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Confirm {activeTab === 'add' ? 'Add' : 'Remove'} Liquidity
                </h3>
                <p className="text-gray-400">Review your transaction details</p>
              </div>

              <div className="bg-gray-800 p-4 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Pool:</span>
                  <span className="text-white font-semibold">{selectedPoolData?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">{selectedPoolData?.token1}:</span>
                  <span className="text-white font-semibold">{amount1}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">{selectedPoolData?.token2}:</span>
                  <span className="text-white font-semibold">{amount2}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Network Fee:</span>
                  <span className="text-white">$0.50</span>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={() => setStep('input')}
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  Back
                </Button>
                <Button
                  onClick={confirmManage}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Confirm
                </Button>
              </div>
            </div>
          )}

          {/* Processing */}
          {step === 'processing' && (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <h3 className="text-xl font-bold text-white mb-2">Processing Transaction</h3>
              <p className="text-gray-400">
                {activeTab === 'add' ? 'Adding' : 'Removing'} liquidity...
              </p>
              <p className="text-sm text-gray-500 mt-4">This may take up to 30 seconds</p>
            </div>
          )}

          {/* Success */}
          {step === 'success' && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircleIcon className="h-10 w-10 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Transaction Successful!</h3>
              <p className="text-gray-400 mb-6">
                Liquidity {activeTab === 'add' ? 'added to' : 'removed from'} {selectedPoolData?.name}
              </p>
              <div className="bg-gray-800 p-4 rounded-lg mb-6">
                <div className="text-2xl font-bold text-blue-400 mb-2">
                  {amount1} {selectedPoolData?.token1} + {amount2} {selectedPoolData?.token2}
                </div>
                <div className="text-sm text-gray-400">
                  {activeTab === 'add' ? 'Added to pool' : 'Removed from pool'}
                </div>
              </div>
              <Button
                onClick={handleClose}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Done
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageLiquidityModal;
