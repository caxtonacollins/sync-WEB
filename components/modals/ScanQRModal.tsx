'use client';

import React, { useState, useRef } from 'react';
import { XMarkIcon, QrCodeIcon, CameraIcon, CheckCircleIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/contexts/ToastContext';

interface ScanQRModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PaymentRequest {
  type: string;
  recipient: string;
  recipientName: string;
  amount: number;
  currency: string;
  description: string;
  timestamp: number;
  network: string;
}

const ScanQRModal: React.FC<ScanQRModalProps> = ({ isOpen, onClose }) => {
  const { addToast } = useToast();
  const [step, setStep] = useState<'scan' | 'confirm' | 'processing' | 'success'>('scan');
  const [paymentData, setPaymentData] = useState<PaymentRequest | null>(null);
  const [manualCode, setManualCode] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simulate QR code scanning
  const handleScan = () => {
    // Mock payment data (in production, this would come from actual QR scanning)
    const mockPaymentData: PaymentRequest = {
      type: 'sync_payment',
      recipient: 'merchant123',
      recipientName: 'Coffee Shop ABC',
      amount: 2500,
      currency: 'NGN',
      description: 'Coffee and pastries',
      timestamp: Date.now(),
      network: 'StarkNet'
    };

    setPaymentData(mockPaymentData);
    setStep('confirm');
    addToast('QR Code scanned successfully', 'success');
  };

  // Handle manual code entry
  const handleManualEntry = () => {
    if (!manualCode) {
      addToast('Please enter a payment code', 'error');
      return;
    }

    try {
      const decoded = JSON.parse(atob(manualCode));
      setPaymentData(decoded);
      setStep('confirm');
      addToast('Payment code validated', 'success');
    } catch (error) {
      addToast('Invalid payment code', 'error');
    }
  };

  // Handle file upload (QR image)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In production, use a QR code reader library to decode the image
      addToast('Processing QR code image...', 'info');
      setTimeout(() => {
        handleScan(); // Mock successful scan
      }, 1500);
    }
  };

  const confirmPayment = async () => {
    setStep('processing');
    
    // Simulate payment processing
    setTimeout(() => {
      setStep('success');
      addToast('Payment completed successfully!', 'success');
    }, 3000);
  };

  const handleClose = () => {
    setStep('scan');
    setPaymentData(null);
    setManualCode('');
    onClose();
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
              <h2 className="text-2xl font-bold text-white">Scan QR Code</h2>
            </div>
            <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Scan Step */}
          {step === 'scan' && (
            <div className="space-y-6">
              {/* Camera View (Simulated) */}
              <div className="relative bg-gray-800 rounded-lg overflow-hidden aspect-square">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-64 border-4 border-purple-500 rounded-lg relative">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-purple-400"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-purple-400"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-purple-400"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-purple-400"></div>
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <CameraIcon className="h-16 w-16 text-gray-600 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">Position QR code here</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Scanning line animation */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-1 bg-purple-500 animate-pulse"></div>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleScan}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg"
                >
                  <CameraIcon className="h-6 w-6 mr-2" />
                  Simulate Scan (Demo)
                </Button>

                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 py-6"
                >
                  <DocumentTextIcon className="h-6 w-6 mr-2" />
                  Upload QR Image
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {/* Manual Entry */}
              <div className="border-t border-gray-700 pt-6">
                <label className="text-sm font-medium text-gray-400 mb-2 block">
                  Or enter payment code manually
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Paste payment code"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    className="flex-1 p-3 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <Button
                    onClick={handleManualEntry}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Submit
                  </Button>
                </div>
              </div>

              <div className="bg-blue-900/20 border border-blue-700 p-3 rounded-lg">
                <p className="text-sm text-blue-400">
                  💡 Point your camera at a SYNC payment QR code to scan
                </p>
              </div>
            </div>
          )}

          {/* Confirm Payment */}
          {step === 'confirm' && paymentData && (
            <div className="space-y-6">
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <QrCodeIcon className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Confirm Payment</h3>
                <p className="text-gray-400">Review payment details</p>
              </div>

              <div className="bg-gray-800 p-6 rounded-lg space-y-4">
                <div className="text-center border-b border-gray-700 pb-4">
                  <div className="text-4xl font-bold text-white mb-2">
                    ₦{paymentData.amount.toLocaleString()}
                  </div>
                  <p className="text-gray-400">{paymentData.description}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Recipient:</span>
                    <span className="text-white font-semibold">{paymentData.recipientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Currency:</span>
                    <span className="text-white">{paymentData.currency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Network:</span>
                    <Badge className="bg-purple-900 text-purple-400">{paymentData.network}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Settlement:</span>
                    <span className="text-white">Instant (~1-2s)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Fee:</span>
                    <span className="text-white">₦0.00</span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-900/20 border border-yellow-700 p-3 rounded-lg">
                <p className="text-sm text-yellow-400">
                  ⚠️ Please verify the recipient details before confirming
                </p>
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={() => setStep('scan')}
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmPayment}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Confirm Payment
                </Button>
              </div>
            </div>
          )}

          {/* Processing */}
          {step === 'processing' && (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <h3 className="text-xl font-bold text-white mb-2">Processing Payment</h3>
              <p className="text-gray-400">Please wait while we process your payment...</p>
              <p className="text-sm text-gray-500 mt-4">This usually takes 1-2 seconds</p>
            </div>
          )}

          {/* Success */}
          {step === 'success' && paymentData && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircleIcon className="h-10 w-10 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Payment Successful!</h3>
              <p className="text-gray-400 mb-6">
                Your payment to {paymentData.recipientName} was successful
              </p>
              <div className="bg-gray-800 p-4 rounded-lg mb-6">
                <div className="text-3xl font-bold text-green-400 mb-1">
                  ₦{paymentData.amount.toLocaleString()}
                </div>
                <div className="text-sm text-gray-400">Paid via SYNC Instant</div>
                <div className="text-xs text-gray-500 mt-2">
                  Settled in 1.2 seconds
                </div>
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

export default ScanQRModal;
