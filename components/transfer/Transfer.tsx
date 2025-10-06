"use client";

import React, { useState } from "react";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import type { FiatAccount } from "@/contexts/AuthContext";

const Transfer = () => {
  const { getFiatAccounts } = useAuth();
  const [accounts] = useState<FiatAccount[]>(getFiatAccounts());
  const [step, setStep] = useState(1);
  const [recipientAccountNumber, setRecipientAccountNumber] = useState("");
  const [recipientDetails, setRecipientDetails] = useState<{
    name: string;
    bank: string;
  } | null>(null);
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [selectedAccount, setSelectedAccount] = useState<FiatAccount | null>(
    null
  );
  const [showAccountSelector, setShowAccountSelector] = useState(false);

  // Set the first account as selected when accounts are loaded
  React.useEffect(() => {
    if (accounts && accounts.length > 0 && !selectedAccount) {
      setSelectedAccount(accounts[0]);
    }
  }, [accounts, selectedAccount]);

  const handleNext = () => {
    // I would fetch recipient details here.
    // For now, we'll use mock data.
    if (recipientAccountNumber === "9046144400") {
      setRecipientDetails({
        name: "COLLINS ADAMS CAXTON",
        bank: "OPay",
      });
      setStep(2);
    } else {
      // Handle error: recipient not found
      alert("Recipient not found");
    }
  };

  const handleAccountSelect = (account: FiatAccount) => {
    setSelectedAccount(account);
    setShowAccountSelector(false);
  };

  if (!selectedAccount) {
    return <div className="flex items-center justify-center h-64">
      <div className="loading-spinner h-12 w-12"></div>
    </div>;
  }

  return (
    <div className="text-white">
      {/* Step 1: Enter Recipient and Amount */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-400">
              Paying from
            </label>
            <div
              className="mt-2 flex items-center justify-between p-3 bg-gray-700 rounded-lg cursor-pointer"
              onClick={() => setShowAccountSelector(true)}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center font-bold text-black">
                  {selectedAccount.initials}
                </div>
                <div className="ml-3">
                  <p className="font-semibold">
                    {selectedAccount.name} • {selectedAccount.accountNumber}
                  </p>
                  <p className="text-sm text-gray-400">
                    {new Intl.NumberFormat("en-NG", {
                      style: "currency",
                      currency: selectedAccount.currency,
                    }).format(selectedAccount.balance)}
                  </p>
                  <p className="text-sm text-gray-400">
                    {selectedAccount.bankName}
                  </p>
                </div>
              </div>
              <ChevronRightIcon className="h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label
              htmlFor="accountNumber"
              className="text-sm font-medium text-gray-400"
            >
              Enter receiver's account number
            </label>
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
            <p className="text-sm text-gray-400">
              {recipientDetails.bank} • {recipientAccountNumber}
            </p>
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
            <label
              htmlFor="amount"
              className="text-sm font-medium text-gray-400"
            >
              Amount
            </label>
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
            <label htmlFor="pin" className="text-sm font-medium text-gray-400">
              Enter Payment PIN
            </label>
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

      {/* Account Selector Modal */}
      <Dialog open={showAccountSelector} onOpenChange={setShowAccountSelector}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change payment method</DialogTitle>
            <DialogDescription>
              Select the account you want to transfer from
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col space-y-3 max-h-[60vh] overflow-y-auto">
            {accounts.map((account: FiatAccount) => (
              <div
                key={account.id}
                className="flex items-center justify-between p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
                onClick={() => handleAccountSelect(account)}
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center font-bold text-black">
                    {account.initials}
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold">
                      {account.name} • {account.accountNumber}
                    </p>
                    <p className="text-sm text-gray-400">
                      {new Intl.NumberFormat("en-NG", {
                        style: "currency",
                        currency: account.currency,
                      }).format(account.balance)}
                    </p>
                    <p className="text-sm text-gray-400">
                      {selectedAccount.bankName}
                    </p>
                  </div>
                </div>
                <RadioGroup
                  value={selectedAccount.id}
                  onValueChange={(value) => {
                    const account = accounts.find(
                      (a: FiatAccount) => a.id === value
                    );
                    if (account) handleAccountSelect(account);
                  }}
                >
                  <RadioGroupItem value={account.id} />
                </RadioGroup>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button
              onClick={() => setShowAccountSelector(false)}
              className="w-full"
            >
              Proceed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Transfer;
