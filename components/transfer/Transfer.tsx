"use client";

import React, { useRef, useState, useEffect } from "react";
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
import { resolveAccountNumber as resolveAccountNumberApi } from "@/api/routes/user";
import { verifyPin as verifyPaymentPinApi } from "../../api/routes/security";
import type { FiatAccount } from "@/contexts/AuthContext";

const Transfer = () => {
  const { getFiatAccounts, token } = useAuth();
  const [accounts] = useState<FiatAccount[]>(getFiatAccounts());
  const [step, setStep] = useState(1);
  const [recipientAccountNumber, setRecipientAccountNumber] = useState("");
  const [recipientDetails, setRecipientDetails] = useState<{
    name: string;
    bank: string;
  } | null>(null);
  const [availableBanks, setAvailableBanks] = useState<
    { name: string; code: string; isSyncPayment?: boolean }[]
  >([]);
  const [syncAccount, setSyncAccount] = useState<
    | {
        isSyncPayment: boolean;
        accountNumber: string;
        accountName: string;
        bankName: string;
        bankCode: string;
      }
    | null
  >(null);
  const [resolving, setResolving] = useState(false);
  const [resolveError, setResolveError] = useState<string | null>(null);
  const lastResolvedRef = useRef<string>("");
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

  // Auto-trigger resolve when account number reaches 10 digits
  useEffect(() => {
    const onlyDigits = recipientAccountNumber.replace(/\D/g, "");
    if (onlyDigits.length === 10 && token && onlyDigits !== lastResolvedRef.current) {
      (async () => {
        try {
          setResolving(true);
          setResolveError(null);
          setAvailableBanks([]);
          setSyncAccount(null);
          lastResolvedRef.current = onlyDigits;
          const data = await resolveAccountNumberApi(onlyDigits, token as string);
          const banks = Array.isArray(data?.banks) ? data.banks : [];
          // Ensure SyncPayment stays on top if present
          const orderedBanks = banks.sort((a: any, b: any) => {
            const ai = a?.isSyncPayment ? -1 : 0;
            const bi = b?.isSyncPayment ? -1 : 0;
            return ai - bi;
          });
          setAvailableBanks(orderedBanks);
          setSyncAccount(data?.syncAccount || null);
        } catch (e: any) {
          setResolveError("Failed to load banks. Try again.");
        } finally {
          setResolving(false);
        }
      })();
    }
  }, [recipientAccountNumber, token]);

  const handleBankSelect = (bank: { name: string; code: string; isSyncPayment?: boolean }) => {
    const name = bank?.isSyncPayment && syncAccount?.accountName
      ? syncAccount.accountName
      : "Recipient";
    setRecipientDetails({
      name,
      bank: bank.name,
    });
    setStep(2);
  };

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
              maxLength={10}
              onChange={(e) => {
                const digitsOnly = e.target.value.replace(/\D/g, "");
                setRecipientAccountNumber(digitsOnly);
                if (digitsOnly.length < 10) {
                  setAvailableBanks([]);
                  setSyncAccount(null);
                  setResolveError(null);
                  lastResolvedRef.current = "";
                }
              }}
              className="mt-2 w-full p-4 bg-gray-700 rounded-lg border border-gray-600 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          {/* Available Banks List (auto after 10 digits) */}
          {recipientAccountNumber.length === 10 && (
            <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
              {resolving && (
                <div className="flex items-center justify-center py-4">
                  <div className="loading-spinner h-6 w-6"></div>
                </div>
              )}
              {resolveError && (
                <div className="text-red-400 text-sm">{resolveError}</div>
              )}
              {!resolving && !resolveError && availableBanks.length > 0 && (
                <div className="flex flex-col space-y-2">
                  {availableBanks.map((bank) => (
                    <div
                      key={`${bank.code}-${bank.name}`}
                      className="flex items-center justify-between p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
                      onClick={() => handleBankSelect(bank)}
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center font-bold text-black">
                          {bank.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="ml-3">
                          <p className="font-semibold flex items-center gap-2">
                            {bank.name}
                            {bank.isSyncPayment && (
                              <span className="text-xs bg-yellow-500 text-black px-2 py-0.5 rounded">Preferred</span>
                            )}
                          </p>
                          {/* Removed bank code from UI per request */}
                        </div>
                      </div>
                      <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

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
            onClick={async () => {
              try {
                const ok = await verifyPaymentPinApi(selectedAccount.userId, pin, token as string);
                if (!ok) {
                  alert("Invalid PIN");
                  return;
                }
                alert("PIN verified. Proceeding...");
              } catch (err) {
                alert("Unable to verify PIN. Please try again.");
              }
            }}
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
