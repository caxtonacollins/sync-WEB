'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeftIcon, QrCodeIcon, DocumentDuplicateIcon, CheckIcon } from '@heroicons/react/24/outline';

export default function CryptoReceivePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('ethereum');
  
  // This would come from your API in a real app
  const walletAddresses = {
    ethereum: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    bitcoin: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    solana: 'HNxF8tgdF5YGaCXXEhqH9bK3LP1EVkqW7RxFfuaEK6m9'
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddresses[activeTab as keyof typeof walletAddresses]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => router.back()} 
          className="mr-4 p-1 hover:bg-gray-700 rounded-full"
          aria-label="Go back"
        >
          <ArrowLeftIcon className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-bold text-white">Receive Crypto</h1>
      </div>
      
      <div className="bg-gray-800 rounded-xl p-6 shadow-lg mb-6">
        <div className="text-center">
          <div className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-purple-100 text-purple-800 mb-4">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Network
          </div>
          
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white rounded-lg">
              <QrCodeIcon className="h-40 w-40 text-gray-800" />
            </div>
          </div>
          
          <p className="text-gray-300 text-sm mb-2">Your {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Address</p>
          
          <div className="flex items-center justify-between bg-gray-700 rounded-lg p-3 mb-6">
            <code className="text-sm font-mono text-gray-300 truncate">
              {walletAddresses[activeTab as keyof typeof walletAddresses]}
            </code>
            <button 
              onClick={copyToClipboard}
              className="ml-2 p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-gray-600"
              title="Copy to clipboard"
            >
              {copied ? (
                <CheckIcon className="h-5 w-5 text-green-400" />
              ) : (
                <DocumentDuplicateIcon className="h-5 w-5" />
              )}
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-2 mb-6">
            <button
              onClick={() => setActiveTab('ethereum')}
              className={`py-2 px-3 rounded-md text-sm font-medium ${
                activeTab === 'ethereum' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              ETH
            </button>
            <button
              onClick={() => setActiveTab('bitcoin')}
              disabled
              className="py-2 px-3 rounded-md text-sm font-medium bg-gray-800 text-gray-500 cursor-not-allowed"
              title="Coming soon"
            >
              BTC
            </button>
            <button
              onClick={() => setActiveTab('solana')}
              disabled
              className="py-2 px-3 rounded-md text-sm font-medium bg-gray-800 text-gray-500 cursor-not-allowed"
              title="Coming soon"
            >
              SOL
            </button>
          </div>
          
          <div className="bg-yellow-900/30 border border-yellow-800 rounded-lg p-4 text-left">
            <h4 className="text-yellow-400 text-sm font-medium mb-1">Important</h4>
            <p className="text-yellow-300 text-xs">
              Only send {activeTab.toUpperCase()} to this address. Sending any other digital asset will result in permanent loss.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-medium text-white mb-4">How to receive</h3>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm mr-3">
              1
            </div>
            <div>
              <h4 className="text-sm font-medium text-white">Copy your wallet address</h4>
              <p className="text-sm text-gray-400">Click the copy button above to copy your address to clipboard</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm mr-3">
              2
            </div>
            <div>
              <h4 className="text-sm font-medium text-white">Paste it in the sender's wallet</h4>
              <p className="text-sm text-gray-400">Go to the wallet you're sending from and paste the address</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm mr-3">
              3
            </div>
            <div>
              <h4 className="text-sm font-medium text-white">Confirm the transaction</h4>
              <p className="text-sm text-gray-400">Double check the address and network before confirming</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
