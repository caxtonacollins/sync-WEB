'use client';

import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Card, CardContent } from '@/components/ui/card';
import Transfer from './Transfer';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TransferModal: React.FC<TransferModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <Card className="bg-gray-900 border-gray-700 w-full max-w-md">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Make Payment</h2>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-white transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <Transfer />
        </CardContent>
      </Card>
    </div>
  );
};

export default TransferModal;
