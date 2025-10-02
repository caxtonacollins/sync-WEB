"use client";

import type React from "react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  UserIcon,
  ShieldCheckIcon,
  UsersIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  BanknotesIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { BitcoinIcon, ArrowRightLeftIcon } from "lucide-react";
import { TransferProvider, useTransfer } from "@/contexts/TransferContext";
import TransferModal from "@/components/transfer/TransferModal";

interface LayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: LayoutProps) => {
  const { user, logout } = useAuth();
  const { isTransferModalOpen, closeTransferModal } = useTransfer();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
    { name: "Fiat Accounts", href: "/fiat-accounts", icon: BanknotesIcon },
    { name: "Crypto Wallets", href: "/crypto-wallets", icon: BitcoinIcon },
    { name: "Transactions", href: "/transactions", icon: ArrowRightLeftIcon },
    { name: "Swaps", href: "/swaps", icon: ArrowPathIcon },
    { name: "Profile", href: "/profile", icon: UserIcon },
    { name: "Security", href: "/security", icon: ShieldCheckIcon },
    ...(user?.role === "admin"
      ? [{ name: "User Management", href: "/admin/users", icon: UsersIcon }]
      : []),
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      <TransferModal isOpen={isTransferModalOpen} onClose={closeTransferModal} />
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="sidebar-dark h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <h1 className="text-xl font-bold text-white">FinanceApp</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          <nav className="mt-6 px-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`nav-item ${
                  pathname === item.href
                    ? "nav-item-active"
                    : "text-gray-300"
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="sidebar-dark flex min-h-0 flex-1 flex-col">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center px-4 mb-6">
              <h1 className="text-xl font-bold text-white">FinanceApp</h1>
            </div>
            <nav className="mt-5 flex-1 space-y-2 px-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`nav-item ${
                    pathname === item.href
                      ? "nav-item-active"
                      : "text-gray-300"
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gray-900 border-b border-gray-800 backdrop-blur-sm">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <button
              type="button"
              className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-300">
                Welcome,{" "}
                <span className="font-medium text-white">{`${user?.lastName} ${
                  user?.firstName
                }`}</span>
              </div>
              <button
                onClick={logout}
                className="btn-primary flex items-center space-x-2"
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 bg-gray-950">
          <div className="fade-in">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default function Layout({ children }: LayoutProps) {
  return (
    <TransferProvider>
      <AppLayout>{children}</AppLayout>
    </TransferProvider>
  );
}
