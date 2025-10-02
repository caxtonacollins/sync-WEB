"use client";

import { useTransfer } from "@/contexts/TransferContext";

import Link from "next/link";
import { useSidebar } from "@/hooks/use-sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePathname } from "next/navigation";
import {
  ChartBarIcon,
  CreditCardIcon,
  ArrowsRightLeftIcon,
  BanknotesIcon,
  Cog6ToothIcon,
  ArrowUpRightIcon, // Added for Transfer button
} from "@heroicons/react/24/outline";
import { BitcoinIcon } from "lucide-react";

const navigation = [
  {
    name: "Overview",
    href: "/dashboard",
    icon: ChartBarIcon,
  },
  {
    name: "Transactions",
    href: "/dashboard/transactions",
    icon: CreditCardIcon,
  },
  {
    name: "Swap Orders",
    href: "/dashboard/swaps",
    icon: ArrowsRightLeftIcon,
  },
  {
    name: "Fiat Accounts",
    href: "/dashboard/fiat-accounts",
    icon: BanknotesIcon,
  },
  {
    name: "Crypto Wallets",
    href: "/dashboard/crypto-wallets",
    icon: BitcoinIcon,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Cog6ToothIcon,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { openTransferModal } = useTransfer();
  const { isOpen, toggle, close } = useSidebar();
  const isMobile = useIsMobile();

  // Sidebar classes for responsiveness
  const sidebarClass = `bg-gray-800 border-r border-gray-700 flex flex-col fixed z-40 top-0 left-0 h-full transition-transform duration-300 ${
    isOpen ? "translate-x-0" : "-translate-x-full"
  } w-64`;

  return (
    <>
      {/* Mobile hamburger button */}
      {isMobile && (
        <button
          className="fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-800 text-white shadow-lg"
          onClick={toggle}
          aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isOpen ? (
            <span>&#x2715;</span> // X icon
          ) : (
            <span>&#9776;</span> // Hamburger icon
          )}
        </button>
      )}
      {/* Sidebar */}
      <div
        className={
          isMobile
            ? sidebarClass
            : "w-64 bg-gray-800 border-r border-gray-700 flex flex-col"
        }
      >
        <div className="flex items-center justify-between h-16 border-b border-gray-700 px-4">
          <h1 className="text-2xl font-bold text-white truncate ml-12 md:ml-0">
            SyncPay
          </h1>
   
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                pathname === item.href
                  ? "bg-purple-600 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
              onClick={isMobile ? close : undefined}
            >
              <item.icon className="mr-3 h-6 w-6" />
              {item.name}
            </Link>
          ))}
       
        </nav>
      </div>
      {/* Overlay for mobile when sidebar is open */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30"
          onClick={close}
          aria-label="Close sidebar overlay"
        />
      )}
    </>
  );
}
