'use client';

import React, { useMemo, useState } from 'react';
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
  const [mode, setMode] = useState<'swap' | 'bridge'>('swap');
  const [direction, setDirection] = useState<'tokenToFiat' | 'fiatToToken'>('tokenToFiat');
  const [amount, setAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState('USDC/USD');
  const [selectedFiat, setSelectedFiat] = useState('USD');
  const [step, setStep] = useState<'select' | 'confirm' | 'processing' | 'success'>('select');

  //user available tokens
  const availableToken = [
    { id: 'BTC/USD', name: 'BTC', balance: 1000, available: true },
    { id: 'USDC/USD', name: 'USDC', balance: 1000, available: true },
    { id: 'STRK/USD', name: 'STRK', balance: 1000, available: true },
    { id: 'ETH/USD', name: 'ETH', balance: 1000, available: true },
  ];

  //user available fiat
  const availableFiat = [
    { id: 'NGN', name: 'NGN', balance: 1000, available: true },
    { id: 'USD', name: 'USD', balance: 1000, available: true },
  ];

  // simple static rates for UI (replace by backend pricing later)
  const rates = useMemo(() => ({
    // token -> USD
    'BTC/USD': 124367,
    'ETH/USD': 4578,
    'USDC/USD': 1,
    'STRK/USD': 0.161,
    // USD -> NGN
    USD_NGN: 1600,
  }), []);

  const estimated = useMemo(() => {
    const amt = parseFloat(amount || '0');
    if (!amt || Number.isNaN(amt)) return '0';
    if (mode === 'swap') {
      if (direction === 'tokenToFiat') {
        const usd = amt * (rates[selectedToken as keyof typeof rates] || 0);
        return selectedFiat === 'USD' ? usd.toFixed(2) : (usd * rates.USD_NGN).toFixed(2);
      } else {
        // fiat -> token
        const usd = selectedFiat === 'USD' ? amt : amt / rates.USD_NGN;
        const price = rates[selectedToken as keyof typeof rates] || 1;
        const tokenOut = price ? usd / price : 0;
        return tokenOut.toFixed(6);
      }
    }
    // bridge mode: just echo amount
    return amt.toFixed(2);
  }, [amount, direction, mode, rates, selectedFiat, selectedToken]);

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
    setMode('swap');
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
              <h2 className="text-2xl font-bold text-white">Swap / Bridge</h2>
            </div>
            <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Mode & Direction */}
          {step === 'select' && (
            <div className="mb-4 grid grid-cols-2 gap-2">
              <button onClick={() => setMode('swap')} className={`py-2 rounded-lg border ${mode === 'swap' ? 'border-purple-500 text-white' : 'border-gray-700 text-gray-300'} bg-gray-800`}>Swap</button>
              <button onClick={() => setMode('bridge')} className={`py-2 rounded-lg border ${mode === 'bridge' ? 'border-purple-500 text-white' : 'border-gray-700 text-gray-300'} bg-gray-800`}>Bridge</button>
            </div>
          )}

          {/* Select Assets & Amount */}
          {step === 'select' && (
            <div className="space-y-6">
              {mode === 'swap' && (
                <>
                  <div>
                    <label className="text-sm font-medium text-gray-400 mb-2 block">Select Token</label>
                    <div className="space-y-2">
                      {availableToken.map((t) => (
                        <div key={t.id} onClick={() => setSelectedToken(t.id)} className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedToken === t.id ? 'border-purple-500 bg-purple-900/20' : 'border-gray-700 bg-gray-800 hover:border-gray-600'}`}>
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-semibold text-white">{t.name}</p>
                              <p className="text-xs text-gray-400">Balance: {t.balance}</p>
                            </div>
                            <Badge className="bg-purple-900 text-purple-400">Token</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Direction</span>
                    <div className="flex bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                      <button onClick={() => setDirection('tokenToFiat')} className={`px-3 py-1 text-sm ${direction === 'tokenToFiat' ? 'bg-purple-600 text-white' : 'text-gray-300'}`}>Token → Fiat</button>
                      <button onClick={() => setDirection('fiatToToken')} className={`px-3 py-1 text-sm ${direction === 'fiatToToken' ? 'bg-purple-600 text-white' : 'text-gray-300'}`}>Fiat → Token</button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400 mb-2 block">Select Fiat</label>
                    <div className="space-y-2">
                      {availableFiat.map((f) => (
                        <div key={f.id} onClick={() => setSelectedFiat(f.id)} className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${selectedFiat === f.id ? 'border-purple-500 bg-purple-900/20' : 'border-gray-700 bg-gray-800 hover:border-gray-600'}`}>
                          <div className="flex justify-between items-center">
                            <p className="font-semibold text-white">{f.name}</p>
                            <Badge className="bg-blue-900 text-blue-400">Fiat</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {mode === 'bridge' && (
                <div className="bg-gray-800 p-4 rounded-lg">
                  <p className="text-gray-300 text-sm">Bridge liquidity between supported pools. Select token above if needed and enter amount below.</p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-400 mb-2 block">
                  {mode === 'swap' ? (direction === 'tokenToFiat' ? 'Token amount' : `${selectedFiat} amount`) : 'Bridge amount'}
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white text-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <div className="flex justify-between mt-2 text-sm">
                  <span className="text-gray-400">Estimated: {estimated} {mode === 'swap' ? (direction === 'tokenToFiat' ? selectedFiat : availableToken.find(t => t.id === selectedToken)?.name) : selectedFiat}</span>
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
                <h3 className="text-xl font-bold text-white mb-2">Confirm {mode === 'swap' ? 'Swap' : 'Bridge'}</h3>
                <p className="text-gray-400">Review your transaction details</p>
              </div>

              <div className="bg-gray-800 p-4 rounded-lg space-y-3">
                {mode === 'swap' && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Token:</span>
                      <span className="text-white font-semibold">{availableToken.find(p => p.id === selectedToken)?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Fiat:</span>
                      <span className="text-white font-semibold">{selectedFiat}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Direction:</span>
                      <span className="text-white font-semibold">{direction === 'tokenToFiat' ? 'Token → Fiat' : 'Fiat → Token'}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-400">Amount:</span>
                  <span className="text-white font-semibold">{amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Network Fee:</span>
                  <span className="text-white">$0.50</span>
                </div>
                <div className="border-t border-gray-700 pt-3 flex justify-between">
                  <span className="text-gray-400">Total:</span>
                  <span className="text-white font-bold text-lg">
                    {(parseFloat(amount || '0') + 0.5).toFixed(2)}
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
                <Button onClick={confirmBridge} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white">
                  {mode === 'swap' ? 'Confirm Swap' : 'Confirm Bridge'}
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
              <h3 className="text-xl font-bold text-white mb-2">{mode === 'swap' ? 'Swap' : 'Bridge'} Successful!</h3>
              <p className="text-gray-400 mb-6">
                {mode === 'swap'
                  ? `Completed ${direction === 'tokenToFiat' ? 'Token → Fiat' : 'Fiat → Token'} using ${availableToken.find(p => p.id === selectedToken)?.name}/${selectedFiat}`
                  : `Your liquidity has been bridged`}
              </p>
              <div className="bg-gray-800 p-4 rounded-lg mb-6">
                <div className="text-3xl font-bold text-purple-400 mb-1">{amount}</div>
                <div className="text-sm text-gray-400">Successfully {mode === 'swap' ? 'Processed' : 'Bridged'}</div>
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
