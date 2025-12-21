"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/contexts/ToastContext';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: string;
}

export default function DepositModal({ isOpen, onClose, currency }: DepositModalProps) {
  const [amount, setAmount] = useState('');
  const { addToast } = useToast();

  const handleDeposit = () => {
    addToast(`Deposit of ${amount} ${currency} initiated.`, 'success');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deposit {currency}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount
            </Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="col-span-3"
              placeholder="0.00"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleDeposit}>Confirm Deposit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
