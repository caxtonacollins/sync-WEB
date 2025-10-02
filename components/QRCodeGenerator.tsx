'use client';

import React, { useState, useEffect } from 'react';
import { QrCodeIcon, CameraIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { merchantPaymentSystem } from '@/lib/merchant-payment';

interface QRCodeData {
  id: string;
  merchantId: string;
  amount: number;
  currency: string;
  description: string;
  expiresAt: string;
  qrCodeData: string;
  isActive: boolean;
  createdAt: string;
}

interface QRCodeGeneratorProps {
  merchantId: string;
  onQRGenerated?: (qrData: QRCodeData) => void;
}

export default function QRCodeGenerator({ merchantId, onQRGenerated }: QRCodeGeneratorProps) {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('NGN');
  const [description, setDescription] = useState('');
  const [expiresIn, setExpiresIn] = useState(30);
  const [generatedQR, setGeneratedQR] = useState<QRCodeData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const currencyOptions = ['NGN', 'USD', 'EUR', 'GBP', 'STRK', 'USDC'];

  const handleGenerateQR = async () => {
    if (!amount || !description) {
      setError('Please fill in all required fields');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const qrData = await merchantPaymentSystem.generatePaymentQR(
        merchantId,
        parseFloat(amount),
        currency,
        description,
        expiresIn
      );

      setGeneratedQR(qrData);
      onQRGenerated?.(qrData);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to generate QR code');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleScanQR = () => {
    // In a real implementation, this would open the camera for QR scanning
    alert('QR Scanner would open here. This is a demo.');
  };

  const copyQRData = () => {
    if (generatedQR) {
      navigator.clipboard.writeText(generatedQR.qrCodeData);
      alert('QR Code data copied to clipboard!');
    }
  };

  const formatExpiryTime = (expiresAt: string) => {
    const expiry = new Date(expiresAt);
    const now = new Date();
    const diffMs = expiry.getTime() - now.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins <= 0) return 'Expired';
    if (diffMins < 60) return `${diffMins} minutes`;
    
    const diffHours = Math.floor(diffMins / 60);
    return `${diffHours} hours`;
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <QrCodeIcon className="h-6 w-6 mr-2 text-purple-400" />
            Generate Payment QR Code
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount" className="text-gray-300">Amount</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>
            <div>
              <Label htmlFor="currency" className="text-gray-300">Currency</Label>
              <select
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              >
                {currencyOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="description" className="text-gray-300">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Payment description"
              className="bg-gray-700 border-gray-600 text-white"
              required
            />
          </div>

          <div>
            <Label htmlFor="expiresIn" className="text-gray-300">Expires in (minutes)</Label>
            <Input
              id="expiresIn"
              type="number"
              value={expiresIn}
              onChange={(e) => setExpiresIn(parseInt(e.target.value))}
              min="1"
              max="1440"
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm">{error}</div>
          )}

          <Button
            onClick={handleGenerateQR}
            disabled={isGenerating}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {isGenerating ? 'Generating...' : 'Generate QR Code'}
          </Button>
        </CardContent>
      </Card>

      {generatedQR && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Generated QR Code</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white p-4 rounded-lg flex justify-center">
              <div className="text-center">
                <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                  <QrCodeIcon className="h-24 w-24 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600">QR Code would be displayed here</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Amount:</span>
                <span className="text-white font-semibold">
                  {amount} {currency}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Description:</span>
                <span className="text-white">{description}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  generatedQR.isActive 
                    ? 'bg-green-900 text-green-400' 
                    : 'bg-red-900 text-red-400'
                }`}>
                  {generatedQR.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Expires:</span>
                <span className="text-white">
                  {formatExpiryTime(generatedQR.expiresAt)}
                </span>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                onClick={copyQRData}
                variant="outline"
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Copy QR Data
              </Button>
              <Button
                onClick={handleScanQR}
                variant="outline"
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <CameraIcon className="h-4 w-4 mr-2" />
                Scan QR
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
