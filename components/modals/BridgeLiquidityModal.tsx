'use client';

import React, { useState } from 'react';
import { XMarkIcon, ArrowPathIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/contexts/ToastContext';

interface BridgeLiquidityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BridgeLiquidityModal: React.FC<BridgeLiquidityModalProps> = ({ isOpen, onClose }) => {
  const { addToast } = useToast();
  const [amount, setAmount] = useState('');
  const [selectedPool, setSelectedPool] = useState('USDC-NGN');
  const [step, setStep] = useState<'select' | 'confirm' | 'processing' | 'success'>('select');

  const liquidityPools = [
    { id: 'USDC-NGN', name: 'USDC/NGN', apy: '12.5%', tvl: '$2.4M', available: true },
    { id: 'STRK-USDC', name: 'STRK/USDC', apy: '18.2%', tvl: '$1.8M', available: true },
    { id: 'ETH-USDC', name: 'ETH/USDC', apy: '8.7%', tvl: '$5.2M', available: true },
  ];

  const handleBridge = () => {
    if (!amount || parseFloat(amount) <= 0) {
      addToast('Please enter a valid amount', 'error');
      return;
    }
    setStep('confirm');
  };

  const confirmBridge = async () => {
    setStep('processing');
    
    // Simulate blockchain transaction
    setTimeout(() => {
      setStep('success');
      addToast('Liquidity bridged successfully!', 'success');
    }, 3000);
  };

  const handleClose = () => {
    setStep('select');
    setAmount('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <Card className="bg-gray-900 border-gray-700 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <ArrowPathIcon className="h-6 w-6 text-purple-400 mr-2" />
              <h2 className="text-2xl font-bold text-white">Bridge Liquidity</h2>
            </div>
            <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Select Pool & Amount */}
          {step === 'select' && (
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-400 mb-2 block">
                  Select Liquidity Pool
                </label>
                <div className="space-y-2">
                  {liquidityPools.map((pool) => (
                    <div
                      key={pool.id}
                      onClick={() => setSelectedPool(pool.id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedPool === pool.id
                          ? 'border-purple-500 bg-purple-900/20'
                          : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-white">{pool.name}</p>
                          <p className="text-sm text-gray-400">TVL: {pool.tvl}</p>
                        </div>
                        <Badge className="bg-green-900 text-green-400">
                          APY: {pool.apy}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-400 mb-2 block">
                  Amount to Bridge (USD)
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white text-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <div className="flex justify-between mt-2 text-sm">
                  <span className="text-gray-400">Available: $450.00</span>
                  <button
                    onClick={() => setAmount('450')}
                    className="text-purple-400 hover:text-purple-300"
                  >
                    Max
                  </button>
                </div>
              </div>

              <div className="bg-gray-800 p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Network Fee:</span>
                  <span className="text-white">~$0.50</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Estimated Time:</span>
                  <span className="text-white">~30 seconds</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Network:</span>
                  <Badge className="bg-purple-900 text-purple-400">StarkNet</Badge>
                </div>
              </div>

              <Button
                onClick={handleBridge}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg"
              >
                Continue
              </Button>
            </div>
          )}

          {/* Confirm Transaction */}
          {step === 'confirm' && (
            <div className="space-y-6">
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ArrowPathIcon className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Confirm Bridge</h3>
                <p className="text-gray-400">Review your transaction details</p>
              </div>

              <div className="bg-gray-800 p-4 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Pool:</span>
                  <span className="text-white font-semibold">
                    {liquidityPools.find(p => p.id === selectedPool)?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Amount:</span>
                  <span className="text-white font-semibold">${amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Network Fee:</span>
                  <span className="text-white">$0.50</span>
                </div>
                <div className="border-t border-gray-700 pt-3 flex justify-between">
                  <span className="text-gray-400">Total:</span>
                  <span className="text-white font-bold text-lg">
                    ${(parseFloat(amount) + 0.5).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={() => setStep('select')}
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  Back
                </Button>
                <Button
                  onClick={confirmBridge}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Confirm Bridge
                </Button>
              </div>
            </div>
          )}

          {/* Processing */}
          {step === 'processing' && (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <h3 className="text-xl font-bold text-white mb-2">Processing Transaction</h3>
              <p className="text-gray-400">Please wait while we bridge your liquidity...</p>
              <p className="text-sm text-gray-500 mt-4">This may take up to 30 seconds</p>
            </div>
          )}

          {/* Success */}
          {step === 'success' && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircleIcon className="h-10 w-10 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Bridge Successful!</h3>
              <p className="text-gray-400 mb-6">
                Your liquidity has been bridged to {liquidityPools.find(p => p.id === selectedPool)?.name}
              </p>
              <div className="bg-gray-800 p-4 rounded-lg mb-6">
                <div className="text-3xl font-bold text-purple-400 mb-1">${amount}</div>
                <div className="text-sm text-gray-400">Successfully Bridged</div>
              </div>
              <Button
                onClick={handleClose}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
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

export default BridgeLiquidityModal;
