'use client';

import React, { useState, useEffect } from 'react';
import { XMarkIcon, QrCodeIcon, DocumentDuplicateIcon, ShareIcon, CheckIcon } from '@heroicons/react/24/outline';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/contexts/AuthContext';
import { getTokenIcon } from '@/lib/tokenIcons';

interface GenerateQRModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GenerateQRModal: React.FC<GenerateQRModalProps> = ({ isOpen, onClose }) => {
  const { addToast } = useToast();
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [symbol, setSymbol] = useState('sNGN');
  const [description, setDescription] = useState('');
  const [qrGenerated, setQrGenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [qrData, setQrData] = useState('');

  // Generate QR code data
  const generateQR = () => {
    if (!amount || parseFloat(amount) <= 0) {
      addToast('Please enter a valid amount', 'error');
      return;
    }

    // Create payment request data
    const paymentData = {
      type: 'sync_payment',
      recipient: user?.id,
      recipientName: `${user?.firstName} ${user?.lastName}`,
      amount: parseFloat(amount),
      symbol: symbol,
      description: description || 'Payment request',
      timestamp: Date.now(),
      network: 'StarkNet'
    };

    // In a real app, this would be encoded and potentially encrypted
    const encodedData = btoa(JSON.stringify(paymentData));
    setQrData(encodedData);
    setQrGenerated(true);
    addToast('QR Code generated successfully', 'success');
  };

  const copyPaymentLink = () => {
    const paymentLink = `https://sync.app/pay/${qrData}`;
    navigator.clipboard.writeText(paymentLink);
    setCopied(true);
    addToast('Payment link copied to clipboard', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareQR = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'SYNC Payment Request',
          text: `Pay ${amount} ${symbol} via SYNC`,
          url: `https://sync.app/pay/${qrData}`
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      copyPaymentLink();
    }
  };

  const handleClose = () => {
    setAmount('');
    setDescription('');
    setQrGenerated(false);
    setQrData('');
    onClose();
  };

  // Simple QR code SVG generator (in production, use a proper QR library)
  const QRCodeDisplay = ({ data }: { data: string }) => {
    return (
      <div className="bg-white p-6 rounded-lg">
        <div className="w-64 h-64 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center relative overflow-hidden">
          {/* Simplified QR pattern - in production use qrcode.react or similar */}
          <div className="absolute inset-0 grid grid-cols-8 gap-1 p-4">
            {Array.from({ length: 64 }).map((_, i) => (
              <div
                key={i}
                className={`rounded-sm ${
                  Math.random() > 0.5 ? 'bg-gray-900' : 'bg-transparent'
                }`}
              />
            ))}
          </div>
          <div className="relative z-10 bg-white p-3 rounded-lg">
            <QrCodeIcon className="h-12 w-12 text-purple-600" />
          </div>
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 font-mono break-all">
            {data.substring(0, 20)}...
          </p>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <Card className="bg-gray-900 border-gray-700 w-full max-w-lg">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <QrCodeIcon className="h-6 w-6 text-purple-400 mr-2" />
              <h2 className="text-2xl font-bold text-white">Generate QR Code</h2>
            </div>
            <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {!qrGenerated ? (
            /* Input Form */
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-700 p-4 rounded-lg">
                <p className="text-sm text-gray-300">
                  Create a QR code for instant payments. Share it with customers or friends to receive payments quickly.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-400">
                    Amount
                  </label>
                  <div className="relative w-32">
                    <select
                      value={symbol}
                      onChange={(e) => setSymbol(e.target.value)}
                      className="block w-full p-2 text-sm bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
                    >
                      <option value="sNGN">sNGN</option>
                      <option value="USDC">USDC</option>
                      <option value="USDT">USDT</option>
                      <option value="DAI">DAI</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white text-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-400 mb-2 block">
                  Description (Optional)
                </label>
                <textarea
                  placeholder="e.g., Payment for services"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="bg-gray-800 p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Payment Method:</span>
                  <Badge className="bg-purple-900 text-purple-400">SYNC Instant</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Network:</span>
                  <span className="text-white">StarkNet</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Settlement Time:</span>
                  <span className="text-white">~1-2 seconds</span>
                </div>
              </div>

              <Button
                onClick={generateQR}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg"
              >
                Generate QR Code
              </Button>
            </div>
          ) : (
            /* QR Code Display */
            <div className="space-y-6">
              <div className="flex flex-col items-center">
                <QRCodeDisplay data={qrData} />
                
                <div className="mt-6 w-full bg-gray-800 p-4 rounded-lg">
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-white mb-1">
                      {getTokenIcon(symbol)} {parseFloat(amount).toLocaleString()} {symbol}
                    </div>
                    {description && (
                      <p className="text-sm text-gray-400">{description}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Recipient:</span>
                      <span className="text-white">
                        {user?.firstName} {user?.lastName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Valid for:</span>
                      <span className="text-white">24 hours</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={copyPaymentLink}
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  {copied ? (
                    <>
                      <CheckIcon className="h-5 w-5 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <DocumentDuplicateIcon className="h-5 w-5 mr-2" />
                      Copy Link
                    </>
                  )}
                </Button>
                <Button
                  onClick={shareQR}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <ShareIcon className="h-5 w-5 mr-2" />
                  Share
                </Button>
              </div>

              <Button
                onClick={() => setQrGenerated(false)}
                variant="outline"
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Generate New QR
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GenerateQRModal;
