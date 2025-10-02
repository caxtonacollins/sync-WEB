'use client';

import React, { useState } from 'react';
import { ChevronRightIcon } from '@heroicons/react/24/solid';

// Mock data for user accounts - we will replace this with real data later
const userAccounts = [
  {
    id: 1,
    name: 'Collins Coxton',
    accountNumber: '9046144400',
    balance: 25.56,
    currency: 'NGN',
    initials: 'CC',
  },
  {
    id: 2,
    name: 'Collins Coxton',
    accountNumber: '8166029808',
    balance: 42025.18,
    currency: 'NGN',
    initials: 'CC',
  },
  {
    id: 3,
    name: 'COXTONENTERPRISES',
    accountNumber: '8127143469',
    balance: 207338.07,
    currency: 'NGN',
    initials: 'CO',
  },
];

const Transfer = () => {
  const [step, setStep] = useState(1);
  const [recipientAccountNumber, setRecipientAccountNumber] = useState('');
  const [recipientDetails, setRecipientDetails] = useState<{ name: string; bank: string } | null>(null);
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');
  const [selectedAccount, setSelectedAccount] = useState(userAccounts[0]);
  const [showAccountSelector, setShowAccountSelector] = useState(false);

    const handleNext = () => {
    // In a real app, you would fetch recipient details here.
    // For now, we'll use mock data.
    if (recipientAccountNumber === '9046144400') {
      setRecipientDetails({
        name: 'COLLINS ADAMS CAXTON',
        bank: 'OPay',
      });
      setStep(2);
    } else {
      // Handle error: recipient not found
      alert('Recipient not found');
    }
  };

  const handleAccountSelect = (account: typeof userAccounts[0]) => {
    setSelectedAccount(account);
    setShowAccountSelector(false);
  };

  return (
    <div className="text-white">
      {/* Step 1: Enter Recipient and Amount */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-400">Paying from</label>
            <div 
              className="mt-2 flex items-center justify-between p-3 bg-gray-700 rounded-lg cursor-pointer"
              onClick={() => setShowAccountSelector(true)}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center font-bold text-black">
                  {selectedAccount.initials}
                </div>
                <div className="ml-3">
                  <p className="font-semibold">{selectedAccount.name} • {selectedAccount.accountNumber}</p>
                  <p className="text-sm text-gray-400">
                    {new Intl.NumberFormat('en-NG', { style: 'currency', currency: selectedAccount.currency }).format(selectedAccount.balance)}
                  </p>
                </div>
              </div>
              <ChevronRightIcon className="h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label htmlFor="accountNumber" className="text-sm font-medium text-gray-400">Enter receiver's account number</label>
            <input
              type="text"
              id="accountNumber"
              placeholder="0000000000"
              value={recipientAccountNumber}
              onChange={(e) => setRecipientAccountNumber(e.target.value)}
              className="mt-2 w-full p-4 bg-gray-700 rounded-lg border border-gray-600 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          
          {/* We will add the recent/saved accounts list here in a future step */}

          <button 
            onClick={handleNext} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
          >
            Next
          </button>
        </div>
      )}

            {/* Step 2: Confirm Recipient */}
      {step === 2 && recipientDetails && (
        <div className="text-center space-y-6">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center font-bold text-black text-xl">
              {recipientDetails.name.substring(0, 2)}
            </div>
            <p className="mt-4 text-sm text-gray-400">Sending money to</p>
            <p className="text-xl font-bold">{recipientDetails.name}</p>
            <p className="text-sm text-gray-400">{recipientDetails.bank} • {recipientAccountNumber}</p>
          </div>
          <button 
            onClick={() => setStep(3)} 
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-4 rounded-lg transition duration-300"
          >
            Confirm Recipient
          </button>
          <button 
            onClick={() => setStep(1)} 
            className="w-full text-gray-400 hover:text-white transition duration-300"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Step 3: Enter Amount and PIN */}
      {step === 3 && (
        <div className="space-y-6">
          <div>
            <label htmlFor="amount" className="text-sm font-medium text-gray-400">Amount</label>
            <input
              type="number"
              id="amount"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-2 w-full p-4 bg-gray-700 rounded-lg border border-gray-600 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <div>
            <label htmlFor="pin" className="text-sm font-medium text-gray-400">Enter Payment PIN</label>
            <input
              type="password"
              id="pin"
              maxLength={4}
              placeholder="****"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="mt-2 w-full p-4 bg-gray-700 rounded-lg border border-gray-600 focus:ring-purple-500 focus:border-purple-500 text-center tracking-[1em]"
            />
          </div>
          <button 
            // onClick={handleTransfer} // We will implement this later
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
          >
            Send Money
          </button>
        </div>
      )}


      {/* Account Selector Modal/Overlay */}
      {showAccountSelector && (
        <div className="absolute inset-0 bg-gray-900 bg-opacity-95 p-6 rounded-lg flex flex-col">
          <h3 className="text-xl font-bold mb-4">Change payment method</h3>
          <div className="flex-grow space-y-3 overflow-y-auto">
            {userAccounts.map((account) => (
              <div 
                key={account.id} 
                className="flex items-center justify-between p-3 bg-gray-800 rounded-lg cursor-pointer"
                onClick={() => handleAccountSelect(account)}
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center font-bold text-black">
                    {account.initials}
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold">{account.name} • {account.accountNumber}</p>
                    <p className="text-sm text-gray-400">
                      {new Intl.NumberFormat('en-NG', { style: 'currency', currency: account.currency }).format(account.balance)}
                    </p>
                  </div>
                </div>
                <input 
                  type="radio" 
                  name="account" 
                  checked={selectedAccount.id === account.id}
                  readOnly
                  className="form-radio h-5 w-5 text-yellow-500 bg-gray-700 border-gray-600 focus:ring-yellow-600"
                />
              </div>
            ))}
          </div>
          <button 
            onClick={() => setShowAccountSelector(false)} 
            className="mt-4 w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-4 rounded-lg transition duration-300"
          >
            Proceed
          </button>
        </div>
      )}
    </div>
  );
};

export default Transfer;
