'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TransferContextType {
  isTransferModalOpen: boolean;
  openTransferModal: () => void;
  closeTransferModal: () => void;
}

const TransferContext = createContext<TransferContextType | undefined>(undefined);

export const useTransfer = () => {
  const context = useContext(TransferContext);
  if (!context) {
    throw new Error('useTransfer must be used within a TransferProvider');
  }
  return context;
};

interface TransferProviderProps {
  children: ReactNode;
}

export const TransferProvider: React.FC<TransferProviderProps> = ({ children }) => {
  const [isTransferModalOpen, setTransferModalOpen] = useState(false);

  const openTransferModal = () => setTransferModalOpen(true);
  const closeTransferModal = () => setTransferModalOpen(false);

  return (
    <TransferContext.Provider value={{ isTransferModalOpen, openTransferModal, closeTransferModal }}>
      {children}
    </TransferContext.Provider>
  );
};
