"use client";

import React from 'react';
import { Button } from '@/components/ui/button';

interface ActionButtonProps {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ icon: Icon, label, onClick }) => {
  return (
    <Button
      onClick={onClick}
      className="w-full bg-slate-800 hover:bg-slate-700 text-white flex flex-col items-center justify-center h-24 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/20 transform hover:-translate-y-1"
    >
      <Icon className="h-6 w-6 mb-2 text-purple-400" />
      <span className="text-sm font-semibold">{label}</span>
    </Button>
  );
};
