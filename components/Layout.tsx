"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon} from "@heroicons/react/24/outline";
import { TransferProvider, useTransfer } from "@/contexts/TransferContext";
import TransferModal from "@/components/transfer/TransferModal";
import { getNavigationForRole, UserRole, type NavigationItem } from "@/config/navigation";

interface LayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: LayoutProps) => {
  const { user, logout } = useAuth();
  const { isTransferModalOpen, closeTransferModal } = useTransfer();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const pathname = usePathname();

  // Get navigation items with fallback
  const userRole = user?.role || 'USER';

  let navigation: NavigationItem[] = [];

  try {
    const navigationByRole = getNavigationForRole(userRole as UserRole);
    // Get navigation items
    navigation = navigationByRole;
  } catch (error) {
    console.error('Error getting navigation:', error);
  }

  // Handle scroll to hide/show header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 60) {
        // Scrolling down
        setIsScrolled(true);
      } else {
        // Scrolling up or at top
        setIsScrolled(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

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
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:hidden ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="bg-gray-900 border-r border-gray-800 h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent text-center">
              SyncPay
            </h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          <nav className="mt-6 px-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${pathname === item.href
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-500/50"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
              >
                <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                <span className="truncate">{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="bg-gray-900 border-r border-gray-800 flex min-h-0 flex-1 flex-col">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center px-4 mb-6">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent right-4">
                SyncPay
              </h1>
            </div>
            <nav className="mt-5 flex-1 space-y-1 px-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${pathname === item.href
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-500/50"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }`}
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  <span className="truncate">{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Header with scroll hide */}
        <div
          className={`sticky top-0 z-10 bg-gray-900/95 border-b border-gray-800 backdrop-blur-sm transition-transform duration-300 ${isScrolled ? '-translate-y-full' : 'translate-y-0 shadow-lg'
            }`}
        >
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <button
              type="button"
              className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>

            <div className="flex items-center space-x-4 ml-auto">
              <div className="text-sm text-gray-300">
                Welcome,{" "}
                <span className="font-medium text-white">
                  {user?.firstName} {user?.lastName}
                </span>
                {user?.role === "admin" && (
                  <span className="ml-2 px-2 py-0.5 text-xs bg-purple-600 text-white rounded-full">
                    Admin
                  </span>
                )}
              </div>
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 bg-gray-950">
          <div className="p-6 max-w-7xl mx-auto">{children}</div>
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
