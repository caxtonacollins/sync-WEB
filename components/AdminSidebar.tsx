"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ChartBarIcon,
  UsersIcon,
  CreditCardIcon,
  CubeIcon,
} from "@heroicons/react/24/outline"

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: ChartBarIcon,
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: UsersIcon,
  },
  {
    name: "Transactions",
    href: "/admin/transactions",
    icon: CreditCardIcon,
  },
  {
    name: "Contracts",
    href: "/admin/contracts",
    icon: CubeIcon,
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
      <div className="flex items-center justify-center h-16 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
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
          >
            <item.icon className="mr-3 h-6 w-6" />
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  )
}
