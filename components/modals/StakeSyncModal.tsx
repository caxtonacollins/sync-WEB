'use client';

import React, { useState } from 'react';
import { XMarkIcon, ShieldCheckIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/contexts/ToastContext';

interface StakeSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance?: number;
}

const StakeSyncModal: React.FC<StakeSyncModalProps> = ({ 
  isOpen, 
  onClose, 
  availableBalance = 2500 
}) => {
  const { addToast } = useToast();
  const [amount, setAmount] = useState('');
  const [lockPeriod, setLockPeriod] = useState('30');
  const [step, setStep] = useState<'select' | 'confirm' | 'processing' | 'success'>('select');

  const lockPeriods = [
    { days: '30', apy: '10%', discount: '5%' },
    { days: '90', apy: '15%', discount: '10%' },
    { days: '180', apy: '20%', discount: '15%' },
    { days: '365', apy: '30%', discount: '25%' },
  ];

  const calculateRewards = () => {
    const stakeAmount = parseFloat(amount) || 0;
    const period = lockPeriods.find(p => p.days === lockPeriod);
    const apyRate = parseFloat(period?.apy || '0') / 100;
    const days = parseInt(lockPeriod);
    return (stakeAmount * apyRate * days / 365).toFixed(2);
  };

  const handleStake = () => {
    if (!amount || parseFloat(amount) <= 0) {
      addToast('Please enter a valid amount', 'error');
      return;
    }
    if (parseFloat(amount) > availableBalance) {
      addToast('Insufficient SYNC balance', 'error');
      return;
    }
    setStep('confirm');
  };

  const confirmStake = async () => {
    setStep('processing');
    
    // Simulate blockchain transaction
    setTimeout(() => {
      setStep('success');
      addToast('SYNC tokens staked successfully!', 'success');
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
              <ShieldCheckIcon className="h-6 w-6 text-green-400 mr-2" />
              <h2 className="text-2xl font-bold text-white">Stake SYNC</h2>
            </div>
            <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Select Amount & Period */}
          {step === 'select' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-700 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Available Balance</span>
                  <span className="text-2xl font-bold text-white">{availableBalance.toLocaleString()} SYNC</span>
                </div>
                <p className="text-sm text-gray-400">Stake your SYNC tokens to earn rewards and unlock fee discounts</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-400 mb-2 block">
                  Amount to Stake
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white text-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <div className="flex justify-between mt-2 text-sm">
                  <span className="text-gray-400">Min: 100 SYNC</span>
                  <button
                    onClick={() => setAmount(availableBalance.toString())}
                    className="text-green-400 hover:text-green-300"
                  >
                    Max
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-400 mb-2 block">
                  Lock Period
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {lockPeriods.map((period) => (
                    <div
                      key={period.days}
                      onClick={() => setLockPeriod(period.days)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        lockPeriod === period.days
                          ? 'border-green-500 bg-green-900/20'
                          : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                      }`}
                    >
                      <div className="text-center">
                        <p className="font-semibold text-white mb-1">{period.days} Days</p>
                        <Badge className="bg-green-900 text-green-400 mb-1">
                          APY: {period.apy}
                        </Badge>
                        <p className="text-xs text-gray-400">Fee Discount: {period.discount}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {amount && parseFloat(amount) > 0 && (
                <div className="bg-gray-800 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Estimated Rewards:</span>
                    <span className="text-green-400 font-semibold">{calculateRewards()} SYNC</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Fee Discount:</span>
                    <span className="text-white">
                      {lockPeriods.find(p => p.days === lockPeriod)?.discount}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Unlock Date:</span>
                    <span className="text-white">
                      {new Date(Date.now() + parseInt(lockPeriod) * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              )}

              <div className="bg-yellow-900/20 border border-yellow-700 p-3 rounded-lg">
                <p className="text-sm text-yellow-400">
                  ⚠️ Staked tokens will be locked for the selected period. Early withdrawal may incur penalties.
                </p>
              </div>

              <Button
                onClick={handleStake}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg"
              >
                Stake SYNC
              </Button>
            </div>
          )}

          {/* Confirm Transaction */}
          {step === 'confirm' && (
            <div className="space-y-6">
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheckIcon className="h-8 w-8 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Confirm Staking</h3>
                <p className="text-gray-400">Review your staking details</p>
              </div>

              <div className="bg-gray-800 p-4 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Staking Amount:</span>
                  <span className="text-white font-semibold">{amount} SYNC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Lock Period:</span>
                  <span className="text-white font-semibold">{lockPeriod} Days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">APY:</span>
                  <span className="text-green-400 font-semibold">
                    {lockPeriods.find(p => p.days === lockPeriod)?.apy}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Estimated Rewards:</span>
                  <span className="text-green-400 font-semibold">{calculateRewards()} SYNC</span>
                </div>
                <div className="border-t border-gray-700 pt-3 flex justify-between">
                  <span className="text-gray-400">Unlock Date:</span>
                  <span className="text-white font-bold">
                    {new Date(Date.now() + parseInt(lockPeriod) * 24 * 60 * 60 * 1000).toLocaleDateString()}
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
                  onClick={confirmStake}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  Confirm Stake
                </Button>
              </div>
            </div>
          )}

          {/* Processing */}
          {step === 'processing' && (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <h3 className="text-xl font-bold text-white mb-2">Processing Transaction</h3>
              <p className="text-gray-400">Staking your SYNC tokens...</p>
              <p className="text-sm text-gray-500 mt-4">This may take up to 30 seconds</p>
            </div>
          )}

          {/* Success */}
          {step === 'success' && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircleIcon className="h-10 w-10 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Staking Successful!</h3>
              <p className="text-gray-400 mb-6">
                Your SYNC tokens have been staked successfully
              </p>
              <div className="bg-gray-800 p-4 rounded-lg mb-6 space-y-2">
                <div className="text-3xl font-bold text-green-400 mb-1">{amount} SYNC</div>
                <div className="text-sm text-gray-400">Staked for {lockPeriod} days</div>
                <div className="text-sm text-green-400">Expected Rewards: {calculateRewards()} SYNC</div>
              </div>
              <Button
                onClick={handleClose}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
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

export default StakeSyncModal;
