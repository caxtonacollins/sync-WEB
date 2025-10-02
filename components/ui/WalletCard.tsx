import React from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

interface WalletCardProps {
  currency: string;
  balance: number;
  showBalance: boolean;
  onToggleBalance: () => void;
}

export const WalletCard: React.FC<WalletCardProps> = ({
  currency,
  balance,
  showBalance,
  onToggleBalance,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-4 w-full max-w-md mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{currency}</span>
        </div>
        <button
          className="text-gray-500 hover:text-gray-700"
          onClick={onToggleBalance}
          aria-label="Toggle balance visibility"
        >
          {showBalance ? <FaRegEye /> : <FaRegEyeSlash />}
        </button>
      </div>
      <div className="text-4xl font-bold text-gray-900">
        {showBalance ? `$${balance.toFixed(2)}` : "••••••"}
      </div>
      <div className="flex gap-4 mt-2">
        <button className="flex-1 bg-blue-600 text-white rounded-lg py-2 font-semibold hover:bg-blue-700 transition">
          Add Money
        </button>
        <button className="flex-1 bg-gray-100 text-gray-800 rounded-lg py-2 font-semibold hover:bg-gray-200 transition">
          Send
        </button>
        <button className="flex-1 bg-gray-100 text-gray-800 rounded-lg py-2 font-semibold hover:bg-gray-200 transition">
          Convert
        </button>
      </div>
      <div className="mt-4">
        <button className="w-full flex items-center justify-center gap-2 bg-indigo-50 text-indigo-700 rounded-lg py-2 font-medium hover:bg-indigo-100 transition">
          <span role="img" aria-label="bank">
            🏦
          </span>{" "}
          Get your US Bank Account
        </button>
      </div>
      <div className="mt-4">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 text-white text-center font-semibold">
          Make your first deposit for free. Valid for 7 days!
        </div>
      </div>
    </div>
  );
};
