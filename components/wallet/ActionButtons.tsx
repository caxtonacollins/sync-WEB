"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ArrowDownTrayIcon,
  ArrowPathIcon,
  EllipsisHorizontalIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWalletVisibility } from "@/contexts/WalletVisibilityContext";

interface ActionButtonsProps {
  onFund: () => void;
  onSwap: () => void;
  onTransfer: () => void;
  onMore: () => void;
  showBridge?: boolean;
}

interface MoreActionItem {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  color?: string;
}

export function ActionButtons({
  onFund,
  onSwap,
  onMore,
  onTransfer,
  showBridge = true,
}: ActionButtonsProps) {
  const { showBalance, toggleBalance } = useWalletVisibility();
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setShowMoreMenu(false);
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [moreMenuRef]);

  const handleMoreAction = (action: MoreActionItem) => {
    action.onClick();
    setShowMoreMenu(false);
  };

  const moreActions: MoreActionItem[] = [
    {
      label: "Airtime",
      icon: "📱",
      onClick: () => {
        onMore();
      },
    },
    ...(showBridge
      ? [
          {
            label: "Data",
            icon: "📡",
            onClick: () => {
              onMore();
            },
          },
        ]
      : []),
    {
      label: "Electricity",
      icon: "⚡",
      onClick: () => {
        onMore();
      },
    },
  ];

  return (
    <div className="space-y-3">
      {/* Primary Action Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Button
          onClick={onFund}
          className="w-full bg-gradient-to-br from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 transition-all duration-200 hover:shadow-lg hover:shadow-green-500/50 transform hover:scale-[1.02]"
          size="sm"
        >
          <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
          Fund
        </Button>

        <Button
          onClick={onSwap}
          className="w-full bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/50 transform hover:scale-[1.02]"
          size="sm"
        >
          <ArrowPathIcon className="h-4 w-4 mr-2" />
          Swap
        </Button>

        <Button
          onClick={onTransfer}
          className="w-full bg-gradient-to-br from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 transition-all duration-200 hover:shadow-lg hover:shadow-yellow-500/50 transform hover:scale-[1.02]"
          size="sm"
        >
          <ArrowPathIcon className="h-4 w-4 mr-2" />
          Transfer
        </Button>

        <div className="relative" ref={moreMenuRef}>
          <Button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className="w-full bg-gradient-to-br from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 transition-all duration-200 hover:shadow-lg hover:shadow-gray-500/50 transform hover:scale-[1.02]"
            size="sm"
          >
            <EllipsisHorizontalIcon className="h-4 w-4 mr-2" />
            More
          </Button>

          {/* More Menu Dropdown */}
          {showMoreMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 animate-in fade-in slide-in-from-top-2">
              {moreActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => handleMoreAction(action)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors flex items-center gap-3 border-b border-gray-700 last:border-0"
                >
                  <span className="text-xl">{action.icon}</span>
                  <span className="text-sm text-gray-200">{action.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Secondary Controls */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <Button
          onClick={toggleBalance}
          variant="outline"
          size="sm"
          className="border-gray-600 text-gray-300 hover:bg-gray-800 transition-all duration-200"
        >
          {showBalance ? (
            <>
              <EyeIcon className="h-4 w-4 mr-2" />
              Hide Balance
            </>
          ) : (
            <>
              <EyeSlashIcon className="h-4 w-4 mr-2" />
              Show Balance
            </>
          )}
        </Button>

        <Badge
          variant="outline"
          className={`${
            showBalance
              ? "border-green-500 text-green-400"
              : "border-yellow-500 text-yellow-400"
          } animate-pulse`}
        >
          {showBalance ? "👁️ Visible" : "🔒 Hidden"}
        </Badge>
      </div>
    </div>
  );
}
