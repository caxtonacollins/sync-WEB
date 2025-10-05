"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  HomeIcon,
  UsersIcon,
  CreditCardIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  BanknotesIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: any;
  description?: string;
}

const adminNavigation: NavigationItem[] = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: HomeIcon,
    description: "System overview and analytics",
  },
  {
    name: "User Management",
    href: "/admin/users",
    icon: UsersIcon,
    description: "Manage users and permissions",
  },
  {
    name: "Transactions",
    href: "/admin/transactions",
    icon: CreditCardIcon,
    description: "Monitor all transactions",
  },
  {
    name: "Wallets",
    href: "/admin/wallets",
    icon: BanknotesIcon,
    description: "View all wallets",
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: ChartBarIcon,
    description: "System analytics",
  },
  {
    name: "Audit Logs",
    href: "/admin/audit-logs",
    icon: ClockIcon,
    description: "System activity logs",
  },
  {
    name: "Security",
    href: "/admin/security",
    icon: ShieldCheckIcon,
    description: "Security settings",
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Cog6ToothIcon,
    description: "System configuration",
  },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 60) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div className="min-h-screen bg-gray-950">
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
        <div className="bg-gray-900 border-r border-gray-800 h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                SyncPay Admin
              </h1>
              <p className="text-xs text-gray-500">Control Panel</p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          <nav className="mt-6 px-3 space-y-1">
            {adminNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${
                  pathname === item.href
                    ? "bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg shadow-red-500/50"
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
            <div className="flex flex-shrink-0 flex-col items-start px-4 mb-6">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                SyncPay Admin
              </h1>
              <p className="text-sm text-gray-500 mt-1">Control Panel</p>
            </div>
            <nav className="mt-5 flex-1 space-y-1 px-3">
              {adminNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${
                    pathname === item.href
                      ? "bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg shadow-red-500/50"
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
        {/* Header */}
        <div
          className={`sticky top-0 z-10 bg-gray-900/95 border-b border-gray-800 backdrop-blur-sm transition-transform duration-300 ${
            isScrolled ? "-translate-y-full" : "translate-y-0 shadow-lg"
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
                <span className="font-medium text-white">
                  {user?.firstName} {user?.lastName}
                </span>
                <span className="ml-2 px-2 py-0.5 text-xs bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-full">
                  Admin
                </span>
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
}
